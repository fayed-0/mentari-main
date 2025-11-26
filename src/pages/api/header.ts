import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'src', 'data', 'header.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const raw = await fs.promises.readFile(FILE, 'utf-8');
      const json = JSON.parse(raw || '{}');
      // ensure structure
      return res.status(200).json({ data: json });
    }

    if (req.method === 'POST') {
      // Append a single slide when body.slide is provided, otherwise treat like PUT
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
      const raw = await fs.promises.readFile(FILE, 'utf-8');
      const json = JSON.parse(raw || '{}');
      const slides = Array.isArray(json.slides) ? json.slides : [];
      const settings = json.settings || {};
      const headerTitle = typeof json.headerTitle === 'string' ? json.headerTitle : 'Kesehatan Anda Prioritas Utama Kami';
      const headerDescription = typeof json.headerDescription === 'string' ? json.headerDescription : 'Layanan kesehatan terpadu dengan dokter profesional & fasilitas modern untuk memberikan yang terbaik bagi Anda dan keluarga';

      if (body.slide && typeof body.slide === 'object') {
        const s = {
          src: String(body.slide.src || ''),
          title: String(body.slide.title || ''),
          description: String(body.slide.description || ''),
          visible: typeof body.slide.visible === 'boolean' ? body.slide.visible : true,
        };
        slides.push(s);
        const out = { slides, settings, headerTitle, headerDescription };
        await fs.promises.writeFile(FILE, JSON.stringify(out, null, 2), 'utf-8');
        return res.status(200).json({ data: out });
      }

      // fallback: replace all slides if slides provided
      if (Array.isArray(body.slides)) {
        const out = {
          slides: body.slides.map((s: any) => ({
            src: String(s.src || ''),
            visible: typeof s.visible === 'boolean' ? s.visible : true,
          })),
          settings: body.settings || settings,
          headerTitle: typeof body.headerTitle === 'string' ? body.headerTitle : headerTitle,
          headerDescription: typeof body.headerDescription === 'string' ? body.headerDescription : headerDescription,
        };
        await fs.promises.writeFile(FILE, JSON.stringify(out, null, 2), 'utf-8');
        return res.status(200).json({ data: out });
      }

      return res.status(400).json({ error: 'Invalid POST body' });
    }

    if (req.method === 'PUT') {
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });

      // Read current file to get existing values (fix undefined json/settings bug)
      const rawExisting = await fs.promises.readFile(FILE, 'utf-8').catch(()=>'{ }');
      const jsonExisting = JSON.parse(rawExisting || '{}');
      const existingSlides = Array.isArray(jsonExisting.slides) ? jsonExisting.slides : [];
      const existingSettings = jsonExisting.settings || {};
      const existingHeaderTitle = typeof jsonExisting.headerTitle === 'string' ? jsonExisting.headerTitle : 'Kesehatan Anda Prioritas Utama Kami';
      const existingHeaderDescription = typeof jsonExisting.headerDescription === 'string' ? jsonExisting.headerDescription : 'Layanan kesehatan terpadu dengan dokter profesional & fasilitas modern untuk memberikan yang terbaik bagi Anda dan keluarga';

      const slidesInput = Array.isArray(body.slides) ? body.slides : existingSlides;
      const out = {
        slides: slidesInput.map((s: any) => ({
          src: String(s.src || ''),
          visible: typeof s.visible === 'boolean' ? s.visible : true,
        })),
        settings: body.settings || existingSettings,
        headerTitle: typeof body.headerTitle === 'string' ? body.headerTitle : existingHeaderTitle,
        headerDescription: typeof body.headerDescription === 'string' ? body.headerDescription : existingHeaderDescription,
      };
      await fs.promises.writeFile(FILE, JSON.stringify(out, null, 2), 'utf-8');
      return res.status(200).json({ data: out });
    }

    res.setHeader('Allow', 'GET,PUT,POST');
    return res.status(405).end();
  } catch (err:any) {
    console.error('header api error', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}
