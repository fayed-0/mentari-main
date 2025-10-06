import type { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '../../../lib/database';

async function ensureColumn() {
  try {
    await executeQuery('SELECT is_hidden FROM specializations LIMIT 1');
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (/unknown column/i.test(msg) && msg.includes('is_hidden')) {
      console.warn('[auto-migrate] Adding is_hidden column to specializations');
      await executeQuery('ALTER TABLE specializations ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE');
    } else {
      throw err;
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    await ensureColumn();

    if (req.method === 'GET') {
      const rows = await executeQuery('SELECT id, name, slug, description, icon, is_hidden, created_at, updated_at FROM specializations WHERE id = ?', [id]);
      if (!rows || (rows as any[]).length === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ data: (rows as any[])[0] });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { name, description, icon, is_hidden } = req.body || {};
      // Build dynamic update
      const fields: string[] = [];
      const values: any[] = [];
      if (name) { fields.push('name = ?'); values.push(name); fields.push('slug = ?'); values.push((name as string).toLowerCase().replace(/[()]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')); }
      if (description !== undefined) { fields.push('description = ?'); values.push(description); }
      if (icon !== undefined) { fields.push('icon = ?'); values.push(icon); }
      if (is_hidden !== undefined) { fields.push('is_hidden = ?'); values.push(!!is_hidden); }
      if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
      values.push(id);
      await executeQuery(`UPDATE specializations SET ${fields.join(', ')} WHERE id = ?`, values);
      const rows = await executeQuery('SELECT id, name, slug, description, icon, is_hidden, created_at, updated_at FROM specializations WHERE id = ?', [id]);
      return res.status(200).json({ data: (rows as any[])[0] });
    }

    if (req.method === 'DELETE') {
      await executeQuery('DELETE FROM specializations WHERE id = ?', [id]);
      return res.status(204).end();
    }

    if (req.method === 'POST') {
      // toggle hide (action endpoint) - simpler for UI
      const rows = await executeQuery('SELECT is_hidden FROM specializations WHERE id = ?', [id]);
      if (!(rows as any[]).length) return res.status(404).json({ error: 'Not found' });
      const curr = (rows as any[])[0].is_hidden ? 1 : 0;
      const next = curr ? 0 : 1;
      await executeQuery('UPDATE specializations SET is_hidden = ? WHERE id = ?', [next, id]);
      const updated = await executeQuery('SELECT id, name, slug, description, icon, is_hidden, created_at, updated_at FROM specializations WHERE id = ?', [id]);
      return res.status(200).json({ data: (updated as any[])[0] });
    }

    res.setHeader('Allow', 'GET,PUT,PATCH,DELETE,POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error('Healthcare item API error', e);
    return res.status(500).json({ error: 'Internal Server Error', detail: e?.message || e, hint: e?.hint });
  }
}
