import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

type Resp = { url: string; filename: string } | { error: string };

// Disable Next's default body parser for this route so formidable can handle multipart
export const config = { api: { bodyParser: false } };

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

function parseForm(req: NextApiRequest, maxFileSize = 50 * 1024 * 1024) {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    const form = new formidable.IncomingForm({ multiples: false, keepExtensions: true, maxFileSize });
    form.parse(req as any, (err: any, fields: formidable.Fields, files: formidable.Files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

async function readJsonBody(req: NextApiRequest) {
  return new Promise<any>((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => {
      data += chunk.toString('utf8');
      // simple guard against huge bodies
      if (data.length > 50 * 1024 * 1024) {
        req.socket.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const contentType = (req.headers['content-type'] || '').toLowerCase();

    // If client sent JSON (data URL), parse and save
    if (contentType.includes('application/json')) {
      const body = await readJsonBody(req);
      const filenameIn = body?.filename || `upload-${Date.now()}`;
      const dataUrl: string | undefined = body?.data;
      if (!dataUrl) return res.status(400).json({ error: 'No data provided' });

      const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!matches) return res.status(400).json({ error: 'Invalid data URL' });
      const base64 = matches[2];
      const buffer = Buffer.from(base64, 'base64');

      const safeBase = path.basename(filenameIn).replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filename = `${Date.now()}-${safeBase}`;
      const dest = path.join(uploadDir, filename);
      await fs.promises.writeFile(dest, buffer);

      const url = `/uploads/${path.basename(dest)}`;
      return res.status(200).json({ url, filename: path.basename(dest) });
    }

    // Otherwise try multipart form parsing (file upload via FormData)
    const { files } = await parseForm(req);

    // Accept common field names: 'file' or 'upload', or fallback to the first file found.
    let file: any = (files && (files.file || files.upload)) as any;
    if (!file && files) {
      const firstKey = Object.keys(files)[0];
      file = firstKey ? (files as any)[firstKey] : undefined;
    }

    if (!file) return res.status(400).json({ error: 'No file uploaded (expected form field `file`)' });

    const tempPath = file.filepath || file.path || file.file;
    if (!tempPath) return res.status(500).json({ error: 'Uploaded file missing temporary path' });

    const originalName = file.originalFilename || file.name || `upload-${Date.now()}`;
    const safeBase = path.basename(originalName).replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${Date.now()}-${safeBase}`;
    const dest = path.join(uploadDir, filename);

    // Move (rename) if possible, otherwise copy and unlink the temp file.
    try {
      await fs.promises.rename(tempPath, dest);
    } catch (e) {
      // fallback to copy
      await fs.promises.copyFile(tempPath, dest);
      try {
        await fs.promises.unlink(tempPath);
      } catch {
        // ignore
      }
    }

    const url = `/uploads/${path.basename(dest)}`;
    return res.status(200).json({ url, filename: path.basename(dest) });
  } catch (err: any) {
    console.error('upload handler error:', err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
