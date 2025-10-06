import type { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '../../../lib/database';

async function ensureColumn() {
  // Try selecting; if fails because of unknown column, add it.
  try {
    await executeQuery('SELECT is_hidden FROM specializations LIMIT 1');
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (/unknown column/i.test(msg) && msg.includes('is_hidden')) {
      console.warn('[auto-migrate] Adding is_hidden column to specializations');
      await executeQuery('ALTER TABLE specializations ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE');
    } else {
      // swallow only if unknown column; otherwise rethrow
      throw err;
    }
  }
}

// We treat 'specializations' as healthcare services list.
// Columns used: id, name, slug, description, icon, is_hidden

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await ensureColumn();

    if (req.method === 'GET') {
      const rows = await executeQuery('SELECT id, name, slug, description, icon, is_hidden, created_at, updated_at FROM specializations ORDER BY id DESC');
      return res.status(200).json({ data: rows });
    }

    if (req.method === 'POST') {
      const { name, description, icon } = req.body || {};
      if (!name) return res.status(400).json({ error: 'Name required' });
      const slug = (name as string)
        .toLowerCase()
        .replace(/[()]/g, '')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const result: any = await executeQuery(
        'INSERT INTO specializations (name, slug, description, icon) VALUES (?, ?, ?, ?)',
        [name, slug, description || '', icon || null]
      );
      const inserted = await executeQuery('SELECT id, name, slug, description, icon, is_hidden, created_at, updated_at FROM specializations WHERE id = ?', [result.insertId]);
      return res.status(201).json({ data: inserted[0] });
    }

    res.setHeader('Allow', 'GET,POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error('Healthcare API error', e);
    return res.status(500).json({ error: 'Internal Server Error', detail: e?.message || e, hint: e?.hint });
  }
}
