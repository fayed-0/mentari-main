import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'src', 'data', 'header.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idxRaw = req.query.index as string;
    const idx = parseInt(idxRaw || '', 10);
    if (Number.isNaN(idx)) return res.status(400).json({ error: 'Invalid index' });

    const raw = await fs.promises.readFile(FILE, 'utf-8');
    const json = JSON.parse(raw || '{}');
    const slides = Array.isArray(json.slides) ? json.slides : [];
    const settings = json.settings || {};
    const headerTitle = typeof json.headerTitle === 'string' ? json.headerTitle : 'Kesehatan Anda Prioritas Utama Kami';
    const headerDescription = typeof json.headerDescription === 'string' ? json.headerDescription : 'Layanan kesehatan terpadu dengan dokter profesional & fasilitas modern untuk memberikan yang terbaik bagi Anda dan keluarga';
    if (idx < 0 || idx >= slides.length) return res.status(404).json({ error: 'Slide not found' });

    if (req.method === 'PATCH') {
      const body = req.body || {};
      const slide = slides[idx];
      const updated = {
        src: typeof body.src === 'string' ? String(body.src) : slide.src,
        visible: typeof body.visible === 'boolean' ? body.visible : (typeof slide.visible === 'boolean' ? slide.visible : true),
      };
      slides[idx] = updated;
      const out = { slides, settings, headerTitle, headerDescription };
      await fs.promises.writeFile(FILE, JSON.stringify(out, null, 2), 'utf-8');
      return res.status(200).json({ data: out });
    }

    if (req.method === 'DELETE') {
      const removed = slides.splice(idx, 1)[0];
      // try to delete file if it's inside public/uploads
      try {
        if (removed && typeof removed.src === 'string' && removed.src.startsWith('/uploads/')) {
          const filePath = path.join(PUBLIC_DIR, removed.src.replace(/^[\/]+/, ''));
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
          }
        }
      } catch (e) {
        // ignore unlink errors
      }
      const out = { slides, settings, headerTitle, headerDescription };
      await fs.promises.writeFile(FILE, JSON.stringify(out, null, 2), 'utf-8');
      return res.status(200).json({ data: out });
    }

    if (req.method === 'PUT') {
      // replace a single slide at index
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
      const updated = {
        src: String(body.src || slides[idx].src || ''),
        visible: typeof body.visible === 'boolean' ? body.visible : (typeof slides[idx].visible === 'boolean' ? slides[idx].visible : true),
      };
      slides[idx] = updated;
      const out = { slides, settings, headerTitle, headerDescription };
      await fs.promises.writeFile(FILE, JSON.stringify(out, null, 2), 'utf-8');
      return res.status(200).json({ data: out });
    }

    res.setHeader('Allow', 'PATCH,DELETE,PUT');
    return res.status(405).end();
  } catch (err:any) {
    console.error('header/[index] api error', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}
