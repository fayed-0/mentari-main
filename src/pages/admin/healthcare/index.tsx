import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface HealthcareItem {
  id: number;
  name: string;
  subtitle?: string | null;
  slug: string;
  description: string | null;
  icon: string | null;
  is_hidden: 0 | 1 | boolean;
  created_at?: string;
  updated_at?: string;
}

const fetcher = async <T,>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as any;
};

export default function AdminHealthcarePage() {
  const [items, setItems] = useState<HealthcareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HealthcareItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<HealthcareItem | null>(null);
  const [form, setForm] = useState({ name: '', subtitle: '', description: '', icon: '' });
  const [uploading, setUploading] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Pagination & sorting
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1); // 1-based
  const [sort, setSort] = useState<{ key: 'name' | 'is_hidden'; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSort = (key: 'name' | 'is_hidden') => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const filteredItems = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(it => {
      return [it.name, it.subtitle || '', it.description || ''].some(f => (f || '').toLowerCase().includes(q));
    });
  }, [items, searchQuery]);

  const sortedItems = React.useMemo(() => {
    const arr = [...filteredItems];
    arr.sort((a,b) => {
      let av: any = (a as any)[sort.key];
      let bv: any = (b as any)[sort.key];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      return 0;
    });
    return arr;
  }, [filteredItems, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  useEffect(() => { setPage(1); }, [searchQuery]);
  const startIdx = (page - 1) * pageSize;
  const paginated = sortedItems.slice(startIdx, startIdx + pageSize);
  const showingFrom = sortedItems.length === 0 ? 0 : startIdx + 1;
  const showingTo = startIdx + paginated.length;

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetcher<{ data: HealthcareItem[] }>('/api/healthcare');
      setItems(data.data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', subtitle: '', description: '', icon: '' });
    setFormOpen(true);
  };
  const openEdit = (it: HealthcareItem) => {
    setEditing(it);
    setForm({ name: it.name, subtitle: (it.subtitle as any) || '', description: it.description || '', icon: it.icon || '' });
    setIconPreview(it.icon || null);
    setFormOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await fetcher<{ data: HealthcareItem }>(`/api/healthcare/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, subtitle: form.subtitle, description: form.description, icon: form.icon || null })
        });
        setItems(prev => prev.map(p => p.id === editing.id ? res.data : p));
      } else {
        const res = await fetcher<{ data: HealthcareItem }>(`/api/healthcare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, subtitle: form.subtitle, description: form.description, icon: form.icon || null })
        });
        setItems(prev => [res.data, ...prev]);
      }
      setFormOpen(false);
    } catch (e: any) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Hapus item ini?')) return;
    try {
      await fetch(`/api/healthcare/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert('Gagal menghapus');
    }
  };

  const toggleHide = async (id: number) => {
    try {
      const res = await fetcher<{ data: HealthcareItem }>(`/api/healthcare/${id}`, { method: 'POST' });
      setItems(prev => prev.map(p => p.id === id ? res.data : p));
    } catch (e: any) {
      alert('Gagal toggle hide');
    }
  };

  return (
          <div className="min-h-screen w-full bg-neutral-100 overflow-hidden font-['Open_Sans']">
            <div className="fixed top-0 left-0 w-full h-24 bg-indigo-500 z-10" />
            <div className="flex pt-4 px-4 gap-4">
              {/* Sidebar */}
              <aside className="mt-4 w-72 h-[calc(100vh-2rem)] bg-white rounded-xl flex flex-col gap-4 py-4 shadow-sm relative z-20">
                <div className="px-8 pt-2 pb-2 text-blue-950 text-xl font-bold">Rs Mentari</div>
                  <nav className="flex-1 px-2 flex flex-col gap-4 overflow-y-auto">
                  <div>
                    <ul className="space-y-1">
                      <li>
                        <Link href="/admin" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] hover:bg-neutral-50">
                          <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Dashboard
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="px-4 text-slate-400 text-xs font-medium font-['Open_Sans'] tracking-wide">PAGES</div>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/admin/healthcare" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] bg-neutral-50 rounded-sm">
                        <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Healthcare
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/aboutus" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] hover:bg-neutral-50">
                        <span className="inline-block size-3 bg-orange-500 rounded-sm" /> About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/header" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] hover:bg-neutral-50">
                        <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Header
                      </Link>
                    </li>
                    {/* Layanan dropdown */}
                    <li>
                      <details className="group">
                        <summary className="px-4 py-2.5 rounded-sm flex items-center justify-between gap-2 text-black text-sm font-medium font-['Open_Sans'] cursor-pointer hover:bg-neutral-50 list-none">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block size-3 bg-orange-500 rounded-sm" />
                            Layanan
                          </span>
                          <span className="text-slate-400 group-open:rotate-180 transition">▾</span>
                        </summary>
                        <ul className="mt-1 ml-8 mb-2 space-y-1">
                          <li><Link href="/admin/layanan/gawat-darurat" className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Gawat Darurat</Link></li>
                          <li><Link href="/admin/layanan/rawat-jalan" className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Rawat Jalan</Link></li>
                          <li><Link href="/admin/layanan/rawat-inap" className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Rawat Inap</Link></li>
                          <li><Link href="/admin/layanan/radiologi" className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Radiologi</Link></li>
                          <li><Link href="/admin/layanan/ivf" className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">IVF Morulla</Link></li>
                          <li><Link href="/admin/layanan/trauma-center" className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Trauma Center</Link></li>
                        </ul>
                      </details>
                    </li>
                    <li>
                      <Link href="/admin/layanan" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] hover:bg-neutral-50">
                        <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Layanan
                      </Link>
                    </li>
                  </ul>
                </nav>
              </aside>
              <main className="mt-24 flex-1 pr-4 pb-8">
                <div className="bg-white rounded-2xl w-full min-h-[780px] shadow-sm relative p-6">
                  <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h1 className="text-blue-950 text-xl font-semibold leading-7">Healthcare Services</h1>
                      <p className="text-blue-950/70 text-sm leading-tight">Kelola layanan/spesialisasi. Tambah, edit, hapus, sembunyikan.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Cari layanan..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm w-40 sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-md border border-indigo-500 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                      >
                        <span className="text-base leading-none">＋</span>
                        <span>Tambah</span>
                      </button>
                    </div>
                  </header>

                  {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
                  {loading ? (
                    <div className="text-sm text-slate-500">Memuat...</div>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-lg border border-zinc-200">
                        <table className="w-full text-left border-separate border-spacing-0 text-sm">
                          <thead className="bg-zinc-50">
                            <tr className="text-slate-500 text-xs font-bold tracking-wide select-none">
                              <th className="py-3 pl-4 pr-4 w-56">
                                <button onClick={() => toggleSort('name')} className="group inline-flex items-center gap-1 uppercase tracking-wide">
                                  <span>NAME</span>
                                  <SortIcon active={sort.key==='name'} dir={sort.dir} />
                                </button>
                              </th>
                              <th className="py-3 pr-4 w-72">SUB-JUDUL</th>
                              <th className="py-3 pr-4 w-96">DESCRIPTION</th>
                              <th className="py-3 pr-4 w-24">
                                <button onClick={() => toggleSort('is_hidden')} className="group inline-flex items-center gap-1 uppercase tracking-wide">
                                  <span>HIDDEN</span>
                                  <SortIcon active={sort.key==='is_hidden'} dir={sort.dir} />
                                </button>
                              </th>
                              <th className="py-3 pr-4 w-48">ACTIONS</th>
                            </tr>
                            <tr><td colSpan={4} className="p-0"><div className="h-px bg-zinc-200" /></td></tr>
                          </thead>
                          <tbody>
                            {paginated.map(it => (
                              <tr key={it.id} className="text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setSelected(it); setDetailOpen(true); }}>
                                <td className="py-3 pl-4 pr-4 align-top font-medium">{it.name}</td>
                                <td className="py-3 pr-4 align-top text-sm text-slate-600">{(it.subtitle || '-')}</td>
                                <td className="py-3 pr-4 align-top text-xs leading-snug text-slate-500 max-w-2xl">{it.description?.slice(0,160) || '-'}{(it.description||'').length>160 && '…'}</td>
                                <td className="py-3 pr-4 align-top">
                                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold border ${it.is_hidden ? 'bg-red-200 text-gray-600 border-red-300' : 'bg-green-50 text-green-700 border-green-200'}`}>{it.is_hidden ? 'YA' : 'TIDAK'}</span>
                                </td>
                                <td className="py-3 pr-4 align-top">
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); openEdit(it); }}
                                      className="inline-flex items-center rounded-md border border-indigo-300 bg-white px-2.5 py-1 text-xs font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >Edit</button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleHide(it.id); }}
                                      className="inline-flex items-center rounded-md border border-orange-300 bg-white px-2.5 py-1 text-xs font-medium text-orange-600 shadow-sm hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >{it.is_hidden ? 'Unhide' : 'Hide'}</button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); remove(it.id); }}
                                      className="inline-flex items-center rounded-md border border-red-300 bg-white px-2.5 py-1 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {paginated.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-10 text-center text-xs text-slate-400">Tidak ada data.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <label className="text-slate-600">Show</label>
                          <select
                            className="rounded-md border px-2 py-1 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={pageSize}
                            onChange={e=>{setPageSize(Number(e.target.value)); setPage(1);}}
                          >
                            {[5,10,20,50].map(size => <option key={size} value={size}>{size}</option>)}
                          </select>
                          <span>entries per page</span>
                        </div>
                        <div className="text-slate-600">Showing {showingFrom} to {showingTo} of {sortedItems.length} entries</div>
                        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                      </div>
                    </>
                  )}

                  {detailOpen && selected && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={() => { setDetailOpen(false); setSelected(null); }}>
                      <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-semibold mb-1">{selected.name}</h2>
                            <div className="text-sm text-slate-500 mb-3">{selected.slug}</div>
                          </div>
                          <div>
                            <button onClick={() => { setDetailOpen(false); setSelected(null); }} className="rounded-md border px-3 py-1 text-sm">Tutup</button>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-slate-700 whitespace-pre-line leading-relaxed">{selected.description || '-'}</div>
                      </div>
                    </div>
                  )}

                  {formOpen && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
                        <form onSubmit={submit} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold mb-1">Nama</label>
                            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Sub-judul</label>
                            <input value={form.subtitle} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Gangguan otak, saraf & neuromuskular" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Deskripsi</label>
                            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={6} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Icon (upload file)</label>
                            <p className="text-xs text-slate-400 mt-1">Pilih file untuk mengganti icon. Tidak perlu masukkan nama file manual.</p>
                            <div className="mt-2 flex items-center gap-3">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  setUploading(true);
                                  try {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(f);
                                    await new Promise<void>((resolve, reject) => {
                                      reader.onload = () => resolve();
                                      reader.onerror = () => reject(new Error('Failed to read file'));
                                    });
                                    const dataUrl = reader.result as string;
                                    // POST to upload API
                                    const resp = await fetch('/api/upload', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ filename: f.name, data: dataUrl }),
                                    });
                                    const json = await resp.json();
                                    if (!resp.ok) throw new Error(json?.error || 'Upload failed');
                                    setForm(frm => ({ ...frm, icon: json.url }));
                                    setIconPreview(json.url);
                                  } catch (err: any) {
                                    alert(err?.message || 'Upload failed');
                                  } finally {
                                    setUploading(false);
                                  }
                                }}
                              />
                              {uploading ? (
                                <div className="text-xs text-slate-500">Uploading...</div>
                              ) : iconPreview || form.icon ? (
                                <div className="flex items-center gap-2">
                                  <img src={iconPreview || form.icon} alt="preview" className="w-10 h-10 object-contain border rounded" />
                                  <button type="button" onClick={() => { setForm(f=>({...f, icon: ''})); setIconPreview(null); }} className="text-xs text-red-600">Remove</button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button type="button" onClick={()=>setFormOpen(false)} className="px-4 py-2 rounded-md text-sm border">Batal</button>
                            <button disabled={saving} className="px-4 py-2 rounded-md text-sm bg-indigo-600 text-white disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  return (
    <span className={'relative inline-flex h-3 w-2 transition-opacity ' + (active ? 'opacity-100' : 'opacity-30')}>
      <span className={'absolute inset-x-0 top-0 h-0 w-0 border-x-[4px] border-x-transparent border-b-[5px] ' + (active && dir==='asc' ? 'border-b-indigo-600' : 'border-b-slate-400')} />
      <span className={'absolute inset-x-0 bottom-0 h-0 w-0 border-x-[4px] border-x-transparent border-t-[5px] ' + (active && dir==='desc' ? 'border-t-indigo-600' : 'border-t-slate-400')} />
    </span>
  );
}

interface PaginationProps { page: number; totalPages: number; onChange: (p:number)=>void }
function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const numbers = React.useMemo(() => {
    const res: number[] = [];
    const max = 6;
    let start = Math.max(1, page - 2);
    let end = start + max - 1;
    if (end > totalPages) { end = totalPages; start = Math.max(1, end - max + 1); }
    for (let i = start; i <= end; i++) res.push(i);
    return res;
  }, [page, totalPages]);

  const btn = (active?: boolean) => `inline-flex items-center justify-center rounded-full border text-xs w-7 h-7 ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} transition-colors disabled:opacity-40 disabled:cursor-not-allowed`;
  return (
    <div className="flex items-center gap-2 self-end">
      <button className={btn()} disabled={page===1} onClick={()=>onChange(page-1)} aria-label="Previous">‹</button>
      {numbers.map(n => <button key={n} className={btn(n===page)} onClick={()=>onChange(n)}>{n}</button>)}
      <button className={btn()} disabled={page===totalPages} onClick={()=>onChange(page+1)} aria-label="Next">›</button>
    </div>
  );
}
