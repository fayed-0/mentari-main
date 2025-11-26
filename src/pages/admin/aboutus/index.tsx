import React, { useEffect, useState } from 'react';
import Link from 'next/link';
// Using admin template layout (no Navbar/Footer here)

type Card = { heading: string; text: string; icon?: string; image?: string };

export default function AdminAboutUsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [uploading, setUploading] = useState(false);
  // lightweight toast notifications
  type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushToast = (type: Toast['type'], message: string, ttl = 4000) => {
    const t: Toast = { id: Date.now() + Math.floor(Math.random() * 1000), type, message };
    setToasts(s => [...s, t]);
    setTimeout(() => setToasts(s => s.filter(x => x.id !== t.id)), ttl);
  };
  const removeToast = (id: number) => setToasts(s => s.filter(t => t.id !== id));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/aboutus');
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        if (!mounted) return;
        const d = json.data || {};
          setTitle(d.title || '');
          setDescription(d.description || '');
          setMainImage(d.mainImage || '');
          setCards(Array.isArray(d.cards) ? d.cards : []);
      } catch (e: any) {
        setError(e?.message || 'Load failed');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/aboutus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, mainImage, cards }),
      });
      if (!res.ok) throw new Error(await res.text());
      pushToast('success', 'Perubahan berhasil disimpan');
    } catch (e: any) {
      const msg = e?.message || 'Save failed';
      setError(msg);
      pushToast('error', 'Gagal menyimpan: ' + msg);
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (idx: number, key: keyof Card, val: string) => {
    setCards(prev => prev.map((c,i) => i===idx ? { ...c, [key]: val } : c));
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(String(reader.result));
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const r = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // API expects { filename, data }
        body: JSON.stringify({ filename: file.name, data: dataUrl }),
      });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error('Upload failed: ' + txt);
      }
      const j = await r.json();
      return j.url || j.data?.url || j.location || j.path || '';
    } finally {
      setUploading(false);
    }
  };

  const [tablePage, setTablePage] = useState(1);
  const [pageSize] = useState(20);
  const [editOpen, setEditOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<Card>({ heading: '', text: '', icon: '', image: '' });

  const openEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditingCard(cards[idx]);
    setEditOpen(true);
  };

  const saveCard = () => {
    if (editingIdx === null) {
      // adding new cards is disabled in this admin view; just close.
      setEditOpen(false);
      return;
    }
    setCards(prev => prev.map((c,i) => i===editingIdx ? editingCard : c));
    setEditOpen(false);
    pushToast('success', 'Card berhasil disimpan');
  };

  const removeCard = (idx: number) => {
    if (!confirm('Hapus card ini?')) return;
    setCards(prev => prev.filter((_,i) => i!==idx));
  };

  const paginated = cards.slice((tablePage-1)*pageSize, (tablePage)*pageSize);

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
                <Link href="/admin/healthcare" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] hover:bg-neutral-50">
                  <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Healthcare
                </Link>
              </li>
              <li>
                <Link href="/admin/aboutus" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] bg-neutral-50 rounded-sm">
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
            </ul>
          </nav>
        </aside>

        <main className="mt-24 flex-1 pr-4 pb-8">
          <div className="bg-white rounded-2xl w-full min-h-[780px] shadow-sm relative p-6">
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-blue-950 text-xl font-semibold leading-7">About Us</h1>
                <p className="text-blue-950/70 text-sm leading-tight">Kelola konten About Us. Edit judul, deskripsi, dan cards.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Semua'}</button>
              </div>
            </header>

            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Main Image (besar)</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={async (e)=>{
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      setUploading(true);
                      const url = await uploadFile(f);
                      setMainImage(url);
                      pushToast('success', 'Main image berhasil diunggah');
                    } catch (err: any) {
                      pushToast('error', 'Upload main image gagal: ' + (err?.message || err));
                    } finally {
                      setUploading(false);
                    }
                  }} />
                </div>
                <div className="flex-shrink-0">
                  {mainImage ? (
                    <img src={mainImage} alt="main preview" className="h-28 w-40 object-cover rounded" />
                  ) : (
                    <div className="h-28 w-40 bg-zinc-100 rounded flex items-center justify-center text-xs text-slate-400">no image</div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left border-separate border-spacing-0 text-sm">
                <thead className="bg-zinc-50">
                  <tr className="text-slate-500 text-xs font-bold tracking-wide select-none">
                    <th className="py-3 pl-4 pr-4 w-48">Heading</th>
                    <th className="py-3 pr-4 w-24">Icon</th>
                    <th className="py-3 pr-4 w-32">Image</th>
                    <th className="py-3 pr-4">Text</th>
                    <th className="py-3 pr-4 w-44">Actions</th>
                  </tr>
                  <tr><td colSpan={3} className="p-0"><div className="h-px bg-zinc-200" /></td></tr>
                </thead>
                <tbody>
                  {paginated.map((c, idx) => (
                    <tr key={idx} className="text-slate-700 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-4 pr-4 align-top font-medium">{c.heading || '-'}</td>
                      <td className="py-3 pr-4 align-top text-sm">{c.icon ? <span className="text-sm">{c.icon}</span> : <span className="text-slate-400">-</span>}</td>
                      <td className="py-3 pr-4 align-top">
                        {c.image ? <img src={c.image} alt={c.heading} className="h-12 w-20 object-cover rounded" /> : <span className="text-slate-400 text-xs">no image</span>}
                      </td>
                      <td className="py-3 pr-4 align-top text-xs leading-snug text-slate-500">{(c.text || '').slice(0,200)}{(c.text||'').length>200 && '…'}</td>
                      <td className="py-3 pr-4 align-top">
                        <div className="flex gap-2">
                          <button onClick={()=>openEdit((tablePage-1)*pageSize + idx)} className="inline-flex items-center rounded-md border border-indigo-300 bg-white px-2.5 py-1 text-xs font-medium text-indigo-600">Edit</button>
                          <button onClick={()=>removeCard((tablePage-1)*pageSize + idx)} className="inline-flex items-center rounded-md border border-red-300 bg-white px-2.5 py-1 text-xs font-medium text-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cards.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-xs text-slate-400">Tidak ada card.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 text-xs text-slate-500">
              <div className="text-slate-600">Showing {(tablePage-1)*pageSize+1} to {Math.min(cards.length, tablePage*pageSize)} of {cards.length} entries</div>
            </div>

            {/* Modal: edit/create card */}
            {editOpen && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={() => setEditOpen(false)}>
                <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl" onClick={(e)=>e.stopPropagation()}>
                  <h2 className="text-lg font-semibold mb-3">Edit Card</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Heading</label>
                      <input value={editingCard.heading} onChange={e=>setEditingCard(s=>({...s, heading: e.target.value}))} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Icon (file or short text)</label>
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <input type="file" accept="image/*" onChange={async (e)=>{
                            const f = e.target.files?.[0];
                            if (!f) return;
                            try {
                              const url = await uploadFile(f);
                              setEditingCard(s=>({...s, icon: url}));
                              // notify user of success
                              pushToast('success', 'Icon berhasil diunggah');
                            } catch (err: any) {
                              pushToast('error', 'Upload icon gagal: ' + (err?.message || err));
                            }
                          }} />
                        </div>
                        <div className="flex-shrink-0">
                          {editingCard.icon && (editingCard.icon.startsWith('http') || editingCard.icon.startsWith('/') || editingCard.icon.startsWith('data:')) ? (
                            <img src={editingCard.icon} alt="icon preview" className="h-12 w-12 object-cover rounded" />
                          ) : (
                            <div className="h-12 w-12 bg-zinc-100 rounded flex items-center justify-center text-sm text-slate-500">{editingCard.icon || '-'}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Image</label>
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <input type="file" accept="image/*" onChange={async (e)=>{
                            const f = e.target.files?.[0];
                            if (!f) return;
                            try {
                              const url = await uploadFile(f);
                              setEditingCard(s=>({...s, image: url}));
                              // notify user of success
                              pushToast('success', 'Gambar berhasil diunggah');
                            } catch (err: any) {
                              pushToast('error', 'Upload gambar gagal: ' + (err?.message || err));
                            }
                          }} />
                        </div>
                        <div>
                          {editingCard.image ? (
                            <img src={editingCard.image} alt="preview" className="h-20 w-28 object-cover rounded" />
                          ) : (
                            <div className="h-20 w-28 bg-zinc-100 rounded flex items-center justify-center text-xs text-slate-400">no image</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Text</label>
                      <textarea value={editingCard.text} onChange={e=>setEditingCard(s=>({...s, text: e.target.value}))} rows={6} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button onClick={()=>setEditOpen(false)} className="px-4 py-2 rounded-md border">Batal</button>
                      <button onClick={saveCard} className="px-4 py-2 rounded-md bg-indigo-600 text-white">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
      {/* Toast container (bottom-right) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`max-w-xs w-full text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 ring-1 ring-black/10 ${t.type==='success' ? 'bg-green-600' : t.type==='error' ? 'bg-red-600' : 'bg-blue-600'}`}>
            <div className="flex-1 text-sm leading-tight">{t.message}</div>
            <button onClick={()=>removeToast(t.id)} className="text-white/80 hover:text-white text-sm">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
