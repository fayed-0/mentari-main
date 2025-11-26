import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const LIST_FILE = path.join(process.cwd(), 'src', 'data', 'services.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const raw = await fs.promises.readFile(LIST_FILE, 'utf-8');
      const json = JSON.parse(raw || '{}');
      return res.status(200).json({ data: json });
    }

    if (req.method === 'PUT') {
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
      const raw = await fs.promises.readFile(LIST_FILE, 'utf-8').catch(()=>'{ }');
      const current = JSON.parse(raw || '{}');
      const headerTitle = typeof body.headerTitle === 'string' ? body.headerTitle : (current.headerTitle || 'Menyediakan layanan kesehatan terpercaya dengan tenaga medis berpengalaman');
      const services = Array.isArray(body.services) ? body.services.map((s:any, idx:number) => ({
        slug: String(s.slug || ''),
        title: String(s.title || ''),
        image: String(s.image || ''),
        visible: typeof s.visible === 'boolean' ? s.visible : true,
        order: typeof s.order === 'number' ? s.order : idx,
      })) : (current.services || []);
      const out = { headerTitle, services };
      await fs.promises.writeFile(LIST_FILE, JSON.stringify(out, null, 2), 'utf-8');
      return res.status(200).json({ data: out });
    }

    res.setHeader('Allow', 'GET,PUT');
    return res.status(405).end();
  } catch (err:any) {
    console.error('layanan list api error', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}
