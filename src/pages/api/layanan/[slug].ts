import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.join(process.cwd(), 'src', 'data', 'layanan');

const ensureSlug = (s: string) => s.replace(/[^a-z0-9-]/g, '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const slugParam = String(req.query.slug || '').toLowerCase();
    const slug = ensureSlug(slugParam);
    if (!slug) return res.status(400).json({ error: 'Invalid slug' });
    const file = path.join(BASE_DIR, `${slug}.json`);

    if (req.method === 'GET') {
      const raw = await fs.promises.readFile(file, 'utf-8').catch(()=>'');
      if (!raw) {
          // default skeleton (rooms only for rawat-inap)
          const out = { slug, title: '', description: '', heroImage: '', rooms: slug==='rawat-inap'?[]:undefined, sections: [] as any[] };
        return res.status(200).json({ data: out });
      }
      const json = JSON.parse(raw || '{}');
      return res.status(200).json({ data: json });
    }

    if (req.method === 'PUT') {
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
      const title = String(body.title || '');
      const description = String(body.description || '');
      const heroImage = String(body.heroImage || '');
      const sections = Array.isArray(body.sections) ? body.sections.map((sec:any, idx:number)=>({
        id: String(sec.id || `sec-${idx+1}`),
        title: String(sec.title || ''),
        bodyHtml: String(sec.bodyHtml || ''),
      })) : [];
        const rooms = Array.isArray(body.rooms) ? body.rooms.map((r:any, idx:number)=>({
          id: String(r.id || `room-${idx+1}`),
          title: String(r.title || ''),
          summary: String(r.summary || ''),
          full: String(r.full || ''),
          image: String(r.image || ''),
        })) : undefined;
        const out = { slug, title, description, heroImage, rooms, sections };
      await fs.promises.writeFile(file, JSON.stringify(out, null, 2), 'utf-8');
      return res.status(200).json({ data: out });
    }

    res.setHeader('Allow', 'GET,PUT');
    return res.status(405).end();
  } catch (err:any) {
    console.error('layanan detail api error', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}
