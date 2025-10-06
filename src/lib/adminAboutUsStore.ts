// Simple localStorage based store for About Us admin management.
// This will be replaced later by real API calls when backend/database is ready.

export interface AboutUsItem {
  id: string; // uuid
  title: string;
  description: string;
  isHidden: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

const STORAGE_KEY = 'admin_about_us_items_v1';

function readRaw(): AboutUsItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as AboutUsItem[];
  } catch (e) {
    console.warn('Failed to parse about us items', e);
    return [];
  }
}

function writeRaw(items: AboutUsItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listAboutUs(): AboutUsItem[] {
  return readRaw().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createAboutUs(data: Pick<AboutUsItem, 'title' | 'description'>): AboutUsItem {
  const now = new Date().toISOString();
  const item: AboutUsItem = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    isHidden: false,
    createdAt: now,
    updatedAt: now,
  };
  const items = readRaw();
  items.push(item);
  writeRaw(items);
  return item;
}

export function updateAboutUs(id: string, data: Partial<Pick<AboutUsItem, 'title' | 'description' | 'isHidden'>>): AboutUsItem | null {
  const items = readRaw();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  writeRaw(items);
  return items[idx];
}

export function deleteAboutUs(id: string): boolean {
  const items = readRaw();
  const next = items.filter(i => i.id !== id);
  const changed = next.length !== items.length;
  if (changed) writeRaw(next);
  return changed;
}

export function toggleHide(id: string): AboutUsItem | null {
  const items = readRaw();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx].isHidden = !items[idx].isHidden;
  items[idx].updatedAt = new Date().toISOString();
  writeRaw(items);
  return items[idx];
}

// Seed with a default item if empty (only runs client-side)
export function ensureSeed() {
  if (typeof window === 'undefined') return;
  const items = readRaw();
  if (items.length === 0) {
    createAboutUs({
      title: 'Tentang Kami (Contoh)',
      description: 'Ini adalah contoh konten About Us. Anda dapat mengedit atau menghapusnya.',
    });
  }
}
