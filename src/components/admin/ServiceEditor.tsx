import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

type ServiceListItem = { slug: string; title: string; image: string; visible: boolean; order: number };
type ServiceListData = { headerTitle: string; services: ServiceListItem[] };
type Section = { id: string; title: string; bodyHtml: string };
type Room = { id: string; title: string; summary: string; full: string; image: string };
type ServiceDetail = { slug: string; title: string; description: string; heroImage: string; sections: Section[]; rooms?: Room[] };

const fetcher = async <T,>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as any;
};

export default function ServiceEditor({ slug, label }: { slug: string; label: string }) {
  const [list, setList] = useState<ServiceListData>({ headerTitle: '', services: [] });
  const [loadingList, setLoadingList] = useState(true);
  const [savingList, setSavingList] = useState(false);
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [savingDetail, setSavingDetail] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, string>>({});

  // --- Simple formatting helpers (hoisted as function declarations) ---
  function applyInline(s: string) {
    return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function toHtml(text: string) {
    if (!text) return '';
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const out: string[] = [];
    let i = 0;
    const bulletRe = /^\s*-\s+/; // require a space after dash to form a bullet
    const orderedRe = /^\s*\d+[\.)]\s+/;
    while (i < lines.length) {
      // skip consecutive blank lines
      if (lines[i].trim() === '') { i++; continue; }
      // ordered list block
      if (orderedRe.test(lines[i])) {
        const items: string[] = [];
        while (i < lines.length && orderedRe.test(lines[i])) {
          items.push(lines[i].replace(orderedRe, '').trim());
          i++;
        }
        const htmlItems = items.map(li => `<li>${applyInline(escapeHtml(li))}</li>`).join('');
        out.push(`<ol>${htmlItems}</ol>`);
        continue;
      }
      // unordered list block
      if (bulletRe.test(lines[i])) {
        const items: string[] = [];
        while (i < lines.length && bulletRe.test(lines[i])) {
          items.push(lines[i].replace(bulletRe, '').trim());
          i++;
        }
        const htmlItems = items.map(li => `<li>${applyInline(escapeHtml(li))}</li>`).join('');
        out.push(`<ul>${htmlItems}</ul>`);
        continue;
      }
      // paragraph block: collect until blank line or list start
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !bulletRe.test(lines[i]) && !orderedRe.test(lines[i])) {
        paraLines.push(lines[i]);
        i++;
      }
      const safeLines = paraLines.map(l => applyInline(escapeHtml(l)));
      const paragraph = safeLines.join('<br/>');
      if (paragraph.trim()) out.push(`<p>${paragraph}</p>`);
    }
    return out.join('');
  }

  function htmlToPlain(html: string) {
    if (!html) return '';
    let t = html;
    // Inline bold
    t = t.replace(/<\s*strong\s*>/gi, '**');
    t = t.replace(/<\s*\/\s*strong\s*>/gi, '**');
    // Convert <br/> to newline
    t = t.replace(/<\s*br\s*\/?>/gi, '\n');

    // Tokenize lists to preserve numbering
    t = t.replace(/<\s*ol[^>]*>/gi, '[OL]');
    t = t.replace(/<\s*\/\s*ol\s*>/gi, '[/OL]');
    t = t.replace(/<\s*ul[^>]*>/gi, '[UL]');
    t = t.replace(/<\s*\/\s*ul\s*>/gi, '[/UL]');
    t = t.replace(/<\s*li\s*>/gi, '[LI]');
    t = t.replace(/<\s*\/\s*li\s*>/gi, '[/LI]');

    const tokens = t.split(/(\[OL\]|\[\/OL\]|\[UL\]|\[\/UL\]|\[LI\]|\[\/LI\])/);
    let inOl = false;
    let inUl = false;
    let counter = 1;
    let out = '';
    for (let tok of tokens) {
      if (tok === '[OL]') { inOl = true; inUl = false; counter = 1; continue; }
      if (tok === '[/OL]') { inOl = false; out += '\n'; continue; }
      if (tok === '[UL]') { inUl = true; inOl = false; continue; }
      if (tok === '[/UL]') { inUl = false; out += '\n'; continue; }
      if (tok === '[LI]') { out += inOl ? `${counter++}. ` : '- '; continue; }
      if (tok === '[/LI]') { out += '\n'; continue; }
      out += tok;
    }

    // Strip remaining paragraph tags while keeping spacing
    out = out.replace(/<\s*p\s*>/gi, '');
    out = out.replace(/<\s*\/\s*p\s*>/gi, '\n\n');
    // Remove any other tags
    out = out.replace(/<[^>]+>/g, '');
    const entities: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
    Object.entries(entities).forEach(([k, v]) => { out = out.split(k).join(v); });
    return out.trim();
  }
  type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushToast = (type: Toast['type'], message: string, ttl = 3500) => {
    const t: Toast = { id: Date.now() + Math.floor(Math.random() * 1000), type, message };
    setToasts(s => [...s, t]);
    setTimeout(() => setToasts(s => s.filter(x => x.id !== t.id)), ttl);
  };
  const removeToast = (id: number) => setToasts(s => s.filter(t => t.id !== id));

  const current = useMemo(() => list.services.find(s => s.slug === slug) || null, [list.services, slug]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingList(true);
        const j = await fetcher<{ data: ServiceListData }>(`/api/layanan`);
        const d = j.data || { headerTitle: '', services: [] };
        d.services.sort((a,b)=>a.order-b.order);
        setList(d);
      } catch (e:any) {
        pushToast('error', e?.message || 'Gagal memuat daftar layanan');
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingDetail(true);
        const j = await fetcher<{ data: ServiceDetail }>(`/api/layanan/${slug}`);
        setDetail(j.data);
        // initialize plain-text drafts from existing HTML
        const drafts: Record<string,string> = {};
        (j.data.sections || []).forEach(sec => { drafts[sec.id] = htmlToPlain(sec.bodyHtml || ''); });
        setSectionDrafts(drafts);
      } catch (e:any) {
        pushToast('error', e?.message || 'Gagal memuat konten layanan');
      } finally {
        setLoadingDetail(false);
      }
    })();
  }, [slug]);

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
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, data: dataUrl })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Upload failed');
      return j.url || j.data?.url || j.location || j.path || '';
    } finally { setUploading(false); }
  };

  const saveListItem = async () => {
    if (!current) return;
    setSavingList(true);
    try {
      // Update one service and persist entire list
      const updated = { ...list, services: list.services.map(s => s.slug===slug ? current : s) };
      await fetcher(`/api/layanan`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      pushToast('success', 'Info layanan disimpan');
    } catch (e:any) { pushToast('error', e?.message || 'Gagal menyimpan info layanan'); } finally { setSavingList(false); }
  };

  const saveDetail = async () => {
    if (!detail) return;
    setSavingDetail(true);
    try {
      await fetcher(`/api/layanan/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(detail) });
      pushToast('success', 'Konten layanan disimpan');
    } catch (e:any) { pushToast('error', e?.message || 'Gagal menyimpan konten'); } finally { setSavingDetail(false); }
  };


  const saveAll = async () => {
    // gabungkan kedua operasi simpan; tampilkan status tunggal
    if (!current || !detail) {
      pushToast('error', 'Data belum lengkap untuk disimpan');
      return;
    }
    setSavingList(true); setSavingDetail(true);
    try {
      const updated = { ...list, services: list.services.map(s => s.slug===slug ? current : s) };
      await fetcher(`/api/layanan`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      await fetcher(`/api/layanan/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(detail) });
      pushToast('success', 'Konten berhasil disimpan');
    } catch (e:any) {
      pushToast('error', e?.message || 'Gagal menyimpan sebagian konten');
    } finally {
      setSavingList(false); setSavingDetail(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 overflow-hidden font-['Open_Sans']">
      <div className="fixed top-0 left-0 w-full h-24 bg-indigo-500 z-10" />
      <div className="flex pt-4 px-4 gap-4">
        <aside className="mt-4 w-72 h-[calc(100vh-2rem)] bg-white rounded-xl flex flex-col gap-4 py-4 shadow-sm relative z-20">
          <div className="px-8 pt-2 pb-2 text-blue-950 text-xl font-bold">Rs Mentari</div>
          <nav className="flex-1 px-2 flex flex-col gap-4 overflow-y-auto">
            <div>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium hover:bg-neutral-50">
                    <span className="inline-block size-3 bg-orange-500 rounded-sm" /> Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="px-4 text-slate-400 text-xs font-medium tracking-wide">PAGES</div>
            <ul className="space-y-1">
              <li><Link href="/admin/healthcare" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium hover:bg-neutral-50"><span className="inline-block size-3 bg-orange-500 rounded-sm" /> Healthcare</Link></li>
              <li><Link href="/admin/aboutus" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium hover:bg-neutral-50"><span className="inline-block size-3 bg-orange-500 rounded-sm" /> About Us</Link></li>
              <li><Link href="/admin/header" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium hover:bg-neutral-50"><span className="inline-block size-3 bg-orange-500 rounded-sm" /> Header</Link></li>
              <li>
                <details open className="group">
                  <summary className="px-4 py-2.5 rounded-sm flex items-center justify-between gap-2 text-black text-sm font-medium cursor-pointer hover:bg-neutral-50 list-none">
                    <span className="inline-flex items-center gap-2"><span className="inline-block size-3 bg-orange-500 rounded-sm" /> Layanan</span>
                    <span className="text-slate-400 group-open:rotate-180 transition">▾</span>
                  </summary>
                  <ul className="mt-1 ml-8 mb-2 space-y-1">
                    <li><Link href="/admin/layanan/gawat-darurat" className={`block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm ${slug==='gawat-darurat'?'bg-neutral-50 font-semibold':''}`}>Gawat Darurat</Link></li>
                    <li><Link href="/admin/layanan/rawat-jalan" className={`block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm ${slug==='rawat-jalan'?'bg-neutral-50 font-semibold':''}`}>Rawat Jalan</Link></li>
                    <li><Link href="/admin/layanan/rawat-inap" className={`block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm ${slug==='rawat-inap'?'bg-neutral-50 font-semibold':''}`}>Rawat Inap</Link></li>
                    <li><Link href="/admin/layanan/radiologi" className={`block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm ${slug==='radiologi'?'bg-neutral-50 font-semibold':''}`}>Radiologi</Link></li>
                    <li><Link href="/admin/layanan/ivf" className={`block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm ${slug==='ivf'?'bg-neutral-50 font-semibold':''}`}>IVF Morulla</Link></li>
                    <li><Link href="/admin/layanan/trauma-center" className={`block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm ${slug==='trauma-center'?'bg-neutral-50 font-semibold':''}`}>Trauma Center</Link></li>
                  </ul>
                </details>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="mt-24 flex-1 pr-4 pb-8">
          <div className="bg-white rounded-2xl w-full min-h-[720px] shadow-sm relative p-6">
            <header className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-blue-950 text-xl font-semibold leading-7">{label}</h1>
                <p className="text-blue-950/70 text-sm leading-tight">Tambah, edit, hapus, dan hide konten layanan ini saja.</p>
              </div>
              <div>
                <button onClick={saveAll} disabled={savingList || savingDetail || !current || !detail} className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-60">
                  {(savingList || savingDetail) ? 'Menyimpan...' : 'Simpan Konten'}
                </button>
              </div>
            </header>

            {/* List item controls: title, image, visible */}
            <section className="mb-8">
              <h2 className="text-base font-semibold mb-2">Informasi di daftar layanan</h2>
              {loadingList ? (
                <div className="text-sm text-slate-500">Memuat...</div>
              ) : current ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Judul (di grid Layanan)</label>
                    <input value={current.title} onChange={e=>setList(s=>({ ...s, services: s.services.map(x=>x.slug===slug?{ ...x, title: e.target.value }: x) }))} className="w-full border rounded px-3 py-2" />
                    <div className="mt-3 inline-flex items-center gap-2">
                      <input type="checkbox" checked={!!current.visible} onChange={e=>setList(s=>({ ...s, services: s.services.map(x=>x.slug===slug?{ ...x, visible: e.target.checked }: x) }))} />
                      <span className="text-sm">Tampilkan di halaman Layanan</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gambar (opsional)</label>
                    <div className="flex items-start gap-2">
                      <input type="file" accept="image/*" onChange={async (e)=>{
                        const f = e.target.files?.[0]; if(!f) return;
                        try { const url = await uploadFile(f); setList(s=>({ ...s, services: s.services.map(x=>x.slug===slug?{ ...x, image: url }: x) })); pushToast('success','Gambar diperbarui'); } catch (err:any) { pushToast('error', err?.message || 'Upload gagal'); }
                      }} />
                      <div className="flex-shrink-0">
                        {current.image ? <img src={current.image} alt={current.title} className="h-12 w-20 object-cover rounded" /> : <div className="h-12 w-20 bg-zinc-100 rounded flex items-center justify-center text-xs text-slate-400">no image</div>}
                      </div>
                    </div>
                  </div>
                  {/* Tombol simpan informasi dihapus; gunakan tombol utama di header */}
                </div>
              ) : (
                <div className="text-sm text-red-600">Layanan tidak ditemukan di daftar.</div>
              )}
            </section>

            {/* Per-service content */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold">Konten {label}</h2>
                {/* Tombol simpan konten dipindah ke header (saveAll) */}
              </div>
              {loadingDetail ? (
                <div className="text-sm text-slate-500">Memuat...</div>
              ) : detail ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Judul</label>
                    <input value={detail.title} onChange={e=>setDetail(d=> d ? ({ ...d, title: e.target.value }) : d)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                    <textarea value={detail.description} onChange={e=>setDetail(d=> d ? ({ ...d, description: e.target.value }) : d)} rows={4} className="w-full border rounded px-3 py-2" />
                  </div>
                  {slug!=='rawat-inap' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Hero Image</label>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <input type="file" accept="image/*" onChange={async (e)=>{
                            const f = e.target.files?.[0]; if(!f) return;
                            try { const url = await uploadFile(f); setDetail(d=> d ? ({ ...d, heroImage: url }) : d); pushToast('success','Hero image diperbarui'); } catch (err:any) { pushToast('error', err?.message || 'Upload gagal'); }
                          }} />
                        </div>
                        <div className="flex-shrink-0">
                          {detail.heroImage ? <img src={detail.heroImage} alt="hero preview" className="h-28 w-40 object-cover rounded" /> : <div className="h-28 w-40 bg-zinc-100 rounded flex items-center justify-center text-xs text-slate-400">no image</div>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rooms editor khusus rawat-inap */}
                  {slug==='rawat-inap' && (
                    <div>
                      <div className="flex items-center justify-between mb-2 mt-6">
                        <label className="block text-sm font-medium">Kamar (Rooms)</label>
                        <button className="px-3 py-1.5 rounded-md border" onClick={()=>setDetail(d=> d ? ({ ...d, rooms: [...(d.rooms||[]), { id: `room-${Date.now()}`, title: 'Nama / Harga', summary: '', full: '', image: '' }] }) : d)}>+ Tambah Kamar</button>
                      </div>
                      <div className="rounded-lg border border-zinc-200">
                        {(!detail.rooms || detail.rooms.length===0) && (<div className="py-10 text-center text-xs text-slate-400">Belum ada kamar.</div>)}
                        {detail.rooms && detail.rooms.map((room, idx) => (
                          <div key={room.id} className="p-4 border-b last:border-b-0 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <input value={room.title} onChange={e=>setDetail(d=> d ? ({ ...d, rooms: d.rooms?.map((r,i)=> i===idx ? ({ ...r, title: e.target.value }) : r) }) : d)} className="w-full border rounded px-2 py-1 mr-2" placeholder="Suite | Rp. ..." />
                              <div className="flex items-center gap-2">
                                <button className="px-2 py-1 border rounded" onClick={()=>setDetail(d=>{ if(!d||!d.rooms) return d; const arr=[...d.rooms]; if(idx<=0) return d; const tmp=arr[idx-1]; arr[idx-1]=arr[idx]; arr[idx]=tmp; return { ...d, rooms: arr }; })}>↑</button>
                                <button className="px-2 py-1 border rounded" onClick={()=>setDetail(d=>{ if(!d||!d.rooms) return d; const arr=[...d.rooms]; if(idx>=arr.length-1) return d; const tmp=arr[idx+1]; arr[idx+1]=arr[idx]; arr[idx]=tmp; return { ...d, rooms: arr }; })}>↓</button>
                                <button className="px-2 py-1 border rounded text-red-600" onClick={()=>setDetail(d=> d ? ({ ...d, rooms: d.rooms?.filter((_,i)=>i!==idx) }) : d)}>Hapus</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium mb-1">Ringkas (summary)</label>
                                <textarea value={room.summary} onChange={e=>setDetail(d=> d ? ({ ...d, rooms: d.rooms?.map((r,i)=> i===idx ? ({ ...r, summary: e.target.value }) : r) }) : d)} rows={2} className="w-full border rounded px-2 py-1 text-sm" />
                                <label className="block text-xs font-medium mb-1 mt-3">Detail (full)</label>
                                <textarea value={room.full} onChange={e=>setDetail(d=> d ? ({ ...d, rooms: d.rooms?.map((r,i)=> i===idx ? ({ ...r, full: e.target.value }) : r) }) : d)} rows={3} className="w-full border rounded px-2 py-1 text-sm" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Gambar</label>
                                <input type="file" accept="image/*" onChange={async (e)=>{
                                  const f=e.target.files?.[0]; if(!f) return; try { const url=await uploadFile(f); setDetail(d=> d ? ({ ...d, rooms: d.rooms?.map((r,i)=> i===idx ? ({ ...r, image: url }) : r) }) : d); pushToast('success','Gambar kamar diupload'); } catch(err:any){ pushToast('error', err?.message || 'Upload gagal'); }
                                }} />
                                <div className="mt-2">
                                  {room.image ? <img src={room.image} alt={room.title} className="h-24 w-full object-cover rounded" /> : <div className="h-24 w-full bg-zinc-100 rounded flex items-center justify-center text-xs text-slate-400">no image</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {slug!=='rawat-inap' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Sections</label>
                        <button className="px-3 py-1.5 rounded-md border" onClick={()=>setDetail(d=> d ? ({ ...d, sections: [...d.sections, { id: `sec-${Date.now()}` , title: 'Section Baru', bodyHtml: '' }] }) : d)}>+ Tambah Section</button>
                      </div>
                      <div className="rounded-lg border border-zinc-200">
                        {detail.sections.length === 0 && (<div className="py-10 text-center text-xs text-slate-400">Belum ada section.</div>)}
                        {detail.sections.map((sec, idx) => (
                          <div key={sec.id} className="p-4 border-b last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <input value={sec.title} onChange={e=>setDetail(d=> d ? ({ ...d, sections: d.sections.map((s,i)=> i===idx ? ({ ...s, title: e.target.value }) : s) }) : d)} className="w-full border rounded px-2 py-1 mr-2" />
                              <div className="flex items-center gap-2">
                                <button className="px-2 py-1 border rounded" onClick={()=>setDetail(d=>{ if(!d) return d; const arr=[...d.sections]; if(idx<=0) return d; const tmp=arr[idx-1]; arr[idx-1]=arr[idx]; arr[idx]=tmp; return { ...d, sections: arr }; })}>↑</button>
                                <button className="px-2 py-1 border rounded" onClick={()=>setDetail(d=>{ if(!d) return d; const arr=[...d.sections]; if(idx>=arr.length-1) return d; const tmp=arr[idx+1]; arr[idx+1]=arr[idx]; arr[idx]=tmp; return { ...d, sections: arr }; })}>↓</button>
                                <button className="px-2 py-1 border rounded text-red-600" onClick={()=>{ setDetail(d=> d ? ({ ...d, sections: d.sections.filter((_,i)=>i!==idx) }) : d); setSectionDrafts(prev=>{ const cp={...prev}; delete cp[sec.id]; return cp; }); }}>Hapus</button>
                              </div>
                            </div>
                            <textarea value={sectionDrafts[sec.id] ?? ''} onChange={e=>{ const val=e.target.value; setSectionDrafts(s=>({ ...s, [sec.id]: val })); setDetail(d=> d ? ({ ...d, sections: d.sections.map((s,i)=> i===idx ? ({ ...s, bodyHtml: toHtml(val) }) : s) }) : d); }} rows={6} className="w-full border rounded px-3 py-2 text-sm" placeholder="Tulis seperti WhatsApp. Gunakan **teks** untuk bold, awali baris dengan - untuk bullet."></textarea>
                            <div className="mt-2 text-xs text-slate-500">Tips: Gunakan **teks** untuk tebal. Awali baris dengan tanda - untuk membuat bullet. Enter untuk baris baru.</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-500">Konten belum tersedia.</div>
              )}
            </section>
          </div>
        </main>
      </div>

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
