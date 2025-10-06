import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface HealthcareItem {
  id: number;
  name: string;
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
  const [form, setForm] = useState({ name: '', description: '', icon: '' });
  const [saving, setSaving] = useState(false);
  // Pagination & sorting
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1); // 1-based
  const [sort, setSort] = useState<{ key: 'name' | 'is_hidden'; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });

  const toggleSort = (key: 'name' | 'is_hidden') => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const sortedItems = React.useMemo(() => {
    const arr = [...items];
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
  }, [items, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
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
    setForm({ name: '', description: '', icon: '' });
    setFormOpen(true);
  };
  const openEdit = (it: HealthcareItem) => {
    setEditing(it);
    setForm({ name: it.name, description: it.description || '', icon: it.icon || '' });
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
          body: JSON.stringify({ name: form.name, description: form.description, icon: form.icon || null })
        });
        setItems(prev => prev.map(p => p.id === editing.id ? res.data : p));
      } else {
        const res = await fetcher<{ data: HealthcareItem }>(`/api/healthcare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
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
                        <Link href="/admin" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Be_Vietnam_Pro'] hover:bg-neutral-50">
                          <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Dashboard
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="px-4 text-slate-400 text-xs font-medium font-['Be_Vietnam_Pro'] tracking-wide">PAGES</div>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/admin/healthcare" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Be_Vietnam_Pro'] bg-neutral-50 rounded-sm">
                        <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Healthcare
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/about-us" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Be_Vietnam_Pro'] hover:bg-neutral-50">
                        <span className="inline-block size-3 bg-orange-500 rounded-sm" /> About Us
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
                            <tr className="text-slate-500 text-[10px] font-bold tracking-wide select-none">
                              <th className="py-3 pl-4 pr-4 w-56">
                                <button onClick={() => toggleSort('name')} className="group inline-flex items-center gap-1 uppercase tracking-wide">
                                  <span>NAME</span>
                                  <SortIcon active={sort.key==='name'} dir={sort.dir} />
                                </button>
                              </th>
                              <th className="py-3 pr-4 w-72">DESCRIPTION</th>
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
                              <tr key={it.id} className="text-slate-700 hover:bg-slate-50 transition-colors">
                                <td className="py-3 pl-4 pr-4 align-top font-medium">{it.name}</td>
                                <td className="py-3 pr-4 align-top text-[11px] leading-snug text-slate-500 max-w-xs">{it.description?.slice(0,120) || '-'}{(it.description||'').length>120 && '…'}</td>
                                <td className="py-3 pr-4 align-top">
                                  <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-semibold border ${it.is_hidden ? 'bg-red-2ç00 text-gray-600 border-red-300' : 'bg-green-50 text-green-700 border-green-200'}`}>{it.is_hidden ? 'YA' : 'TIDAK'}</span>
                                </td>
                                <td className="py-3 pr-4 align-top">
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => openEdit(it)}
                                      className="inline-flex items-center rounded-md border border-indigo-300 bg-white px-2.5 py-1 text-[11px] font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >Edit</button>
                                    <button
                                      onClick={() => toggleHide(it.id)}
                                      className="inline-flex items-center rounded-md border border-orange-300 bg-white px-2.5 py-1 text-[11px] font-medium text-orange-600 shadow-sm hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >{it.is_hidden ? 'Unhide' : 'Hide'}</button>
                                    <button
                                      onClick={() => remove(it.id)}
                                      className="inline-flex items-center rounded-md border border-red-300 bg-white px-2.5 py-1 text-[11px] font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <label className="text-slate-600">Show</label>
                          <select
                            className="rounded-md border px-2 py-1 bg-white text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            <label className="block text-xs font-semibold mb-1">Deskripsi</label>
                            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Icon (nama file)</label>
                            <input value={form.icon} onChange={e=>setForm(f=>({...f,icon:e.target.value}))} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="contoh: cardiology.svg" />
                            <p className="text-[10px] text-slate-400 mt-1">Pastikan file icon ada di folder publik / assets anda.</p>
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

  const btn = (active?: boolean) => `inline-flex items-center justify-center rounded-full border text-[11px] w-7 h-7 ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} transition-colors disabled:opacity-40 disabled:cursor-not-allowed`;
  return (
    <div className="flex items-center gap-2 self-end">
      <button className={btn()} disabled={page===1} onClick={()=>onChange(page-1)} aria-label="Previous">‹</button>
      {numbers.map(n => <button key={n} className={btn(n===page)} onClick={()=>onChange(n)}>{n}</button>)}
      <button className={btn()} disabled={page===totalPages} onClick={()=>onChange(page+1)} aria-label="Next">›</button>
    </div>
  );
}
