import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'src', 'data', 'aboutus.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const raw = await fs.promises.readFile(FILE, 'utf-8');
      const json = JSON.parse(raw || '{}');
      return res.status(200).json({ data: json });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
      // Basic validation
      const out = {
        title: String(body.title || ''),
        description: String(body.description || ''),
        // optional main image for the about page
        mainImage: String(body.mainImage || ''),
        cards: Array.isArray(body.cards)
          ? body.cards.map((c: any) => ({
              heading: String(c.heading || ''),
              text: String(c.text || ''),
              // preserve optional fields like icon and image if provided
              ...(c.icon ? { icon: String(c.icon) } : {}),
              ...(c.image ? { image: String(c.image) } : {}),
            }))
          : [],
      };
      await fs.promises.writeFile(FILE, JSON.stringify(out, null, 2), 'utf-8');
      return res.status(200).json({ data: out });
    }

    res.setHeader('Allow', 'GET,PUT,POST');
    return res.status(405).end();
  } catch (err:any) {
    console.error('aboutus api error', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err?.message });
  }
}
