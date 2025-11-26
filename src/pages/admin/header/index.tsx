import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Slide = { src: string; visible?: boolean };

export default function AdminHeaderPage(){
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<{ autoplay?: boolean; interval?: number; showDots?: boolean }>({ autoplay: true, interval: 10000, showDots: true });
  const [headerTitle, setHeaderTitle] = useState('Kesehatan Anda Prioritas Utama Kami');
  const [headerDescription, setHeaderDescription] = useState('Layanan kesehatan terpadu dengan dokter profesional & fasilitas modern untuk memberikan yang terbaik bagi Anda dan keluarga');
  const [toasts, setToasts] = useState<{id:number, type:'success'|'error', message:string}[]>([]);

  const pushToast = (type:'success'|'error', message:string, ttl=4000)=>{
    const t = { id: Date.now()+Math.floor(Math.random()*1000), type, message };
    setToasts(s=>[...s,t]);
    setTimeout(()=>setToasts(s=>s.filter(x=>x.id!==t.id)), ttl);
  };

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        const res = await fetch('/api/header');
        if(!res.ok) throw new Error('Failed to load');
        const j = await res.json();
        if(!mounted) return;
        setSlides(Array.isArray(j.data?.slides) ? j.data.slides : []);
        setSettings(j.data?.settings ? j.data.settings : { autoplay: true, interval: 10000, showDots: true });
        if(typeof j.data?.headerTitle === 'string') setHeaderTitle(j.data.headerTitle);
        if(typeof j.data?.headerDescription === 'string') setHeaderDescription(j.data.headerDescription);
      }catch(e:any){
        pushToast('error','Gagal memuat header: '+(e?.message||e));
      }finally{ if(mounted) setLoading(false); }
    })();
    return ()=>{ mounted=false };
  },[]);

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
      if(!r.ok) throw new Error(await r.text());
      const j = await r.json();
      return j.url || j.location || j.path || '';
    } finally { setUploading(false); }
  };

  const addSlideFromFile = async (f: File)=>{
    try{
      const url = await uploadFile(f);
      // Append via API to get persisted index
      const r = await fetch('/api/header', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ slide: { src: url, visible: true } }) });
      if(!r.ok) throw new Error(await r.text());
      const j = await r.json();
      setSlides(Array.isArray(j.data?.slides) ? j.data.slides : []);
      if (j.data?.settings) setSettings(j.data.settings);
      if(typeof j.data?.headerTitle === 'string') setHeaderTitle(j.data.headerTitle);
      if(typeof j.data?.headerDescription === 'string') setHeaderDescription(j.data.headerDescription);
      pushToast('success','Gambar berhasil diunggah');
    }catch(e:any){ pushToast('error','Upload gagal: '+(e?.message||e)); }
  };

  const removeSlide = async (idx:number)=>{
    if(!confirm('Hapus slide ini?')) return;
    try{
      const r = await fetch(`/api/header/${idx}`, { method: 'DELETE' });
      if(!r.ok) throw new Error(await r.text());
      const j = await r.json();
      setSlides(Array.isArray(j.data?.slides) ? j.data.slides : []);
      if (j.data?.settings) setSettings(j.data.settings);
      if(typeof j.data?.headerTitle === 'string') setHeaderTitle(j.data.headerTitle);
      if(typeof j.data?.headerDescription === 'string') setHeaderDescription(j.data.headerDescription);
      pushToast('success','Slide dihapus');
    }catch(e:any){ pushToast('error','Gagal hapus: '+(e?.message||e)); }
  };

  const move = async (from:number, to:number)=>{
    setSlides(s=>{
      const arr = [...s];
      const item = arr.splice(from,1)[0];
      arr.splice(to,0,item);
      return arr;
    });
    // persist order
    try{
      const current = await fetch('/api/header');
      const jcur = await current.json();
      const updated = Array.isArray(jcur.data?.slides) ? [...jcur.data.slides] : [];
      const item = updated.splice(from,1)[0];
      updated.splice(to,0,item);
      const r = await fetch('/api/header', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ slides: updated, settings, headerTitle, headerDescription }) });
      if(!r.ok) throw new Error(await r.text());
      const j = await r.json();
      setSlides(Array.isArray(j.data?.slides) ? j.data.slides : updated);
      if (j.data?.settings) setSettings(j.data.settings);
      if(typeof j.data?.headerTitle === 'string') setHeaderTitle(j.data.headerTitle);
      if(typeof j.data?.headerDescription === 'string') setHeaderDescription(j.data.headerDescription);
      pushToast('success','Urutan disimpan');
    }catch(e:any){ pushToast('error','Gagal menyimpan urutan: '+(e?.message||e)); }
  };

  const save = async ()=>{
    setSaving(true);
    try{
      const res = await fetch('/api/header', { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slides, settings, headerTitle, headerDescription }) });
      if(!res.ok) throw new Error(await res.text());
      const j = await res.json();
      setSlides(Array.isArray(j.data?.slides) ? j.data.slides : slides);
      if (j.data?.settings) setSettings(j.data.settings);
      if(typeof j.data?.headerTitle === 'string') setHeaderTitle(j.data.headerTitle);
      if(typeof j.data?.headerDescription === 'string') setHeaderDescription(j.data.headerDescription);
      pushToast('success','Perubahan disimpan');
    }catch(e:any){ pushToast('error','Gagal menyimpan: '+(e?.message||e)); }
    finally{ setSaving(false); }
  };

  // auto-persist settings changes (autoplay/showDots/interval) with debounce, excluding title/description typing
  useEffect(()=>{
    const handle = setTimeout(async ()=>{
      try {
        const res = await fetch('/api/header', { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slides, settings, headerTitle, headerDescription }) });
        if(!res.ok) return; // silent
      } catch {}
    }, 600); // debounce 600ms
    return ()=> clearTimeout(handle);
  }, [settings.autoplay, settings.interval, settings.showDots]);

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
                <Link href="/admin/aboutus" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] hover:bg-neutral-50">
                  <span className="inline-block size-3 bg-orange-500 rounded-sm" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/admin/header" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium font-['Open_Sans'] bg-neutral-50 rounded-sm">
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
                    <li><Link href={{ pathname: '/admin/layanan', query: { slug: 'gawat-darurat' } }} className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Gawat Darurat</Link></li>
                    <li><Link href={{ pathname: '/admin/layanan', query: { slug: 'rawat-jalan' } }} className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Rawat Jalan</Link></li>
                    <li><Link href={{ pathname: '/admin/layanan', query: { slug: 'rawat-inap' } }} className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Rawat Inap</Link></li>
                    <li><Link href={{ pathname: '/admin/layanan', query: { slug: 'radiologi' } }} className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Radiologi</Link></li>
                    <li><Link href={{ pathname: '/admin/layanan', query: { slug: 'ivf' } }} className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">IVF Morulla</Link></li>
                    <li><Link href={{ pathname: '/admin/layanan', query: { slug: 'trauma-center' } }} className="block px-3 py-1.5 rounded hover:bg-neutral-50 text-sm">Trauma Center</Link></li>
                  </ul>
                </details>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="mt-24 flex-1 pr-4 pb-8">
          <div className="bg-white rounded-2xl w-full min-h-[480px] shadow-sm relative p-6">
            <header className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-blue-950 text-xl font-semibold leading-7">Header Carousel</h1>
                <p className="text-blue-950/70 text-sm">Kelola gambar header utama (carousel). Upload, urutkan, hapus, simpan.</p>
              </div>
              <div>
                <button onClick={save} disabled={saving} className="rounded-md bg-green-600 px-4 py-2 text-white">{saving? 'Menyimpan...':'Simpan Semua'}</button>
              </div>
            </header>

            <div className="mb-4 space-y-4">
              <div className="bg-zinc-50 p-4 rounded space-y-3">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600">Judul Header</label>
                  <input value={headerTitle} onChange={e=>setHeaderTitle(e.target.value)} className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600">Deskripsi Header</label>
                  <textarea value={headerDescription} onChange={e=>setHeaderDescription(e.target.value)} className="w-full px-3 py-2 border rounded min-h-[80px]" />
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!settings.autoplay} onChange={(e)=>setSettings(s=>({ ...s, autoplay: e.target.checked }))} />
                    <span className="text-sm">Autoplay</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <span className="text-sm">Interval (ms)</span>
                    <input type="number" value={settings.interval||10000} onChange={(e)=>setSettings(s=>({ ...s, interval: Number(e.target.value) || 1000 }))} className="ml-2 w-28 px-2 py-1 border rounded" />
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!settings.showDots} onChange={(e)=>setSettings(s=>({ ...s, showDots: e.target.checked }))} />
                    <span className="text-sm">Show Dots</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="block text-sm font-medium">Tambahkan Gambar</label>
                <input type="file" accept="image/*" onChange={async (e)=>{ const f = e.target.files?.[0]; if(!f) return; await addSlideFromFile(f); }} />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50">
                  <tr className="text-slate-500 text-xs font-bold tracking-wide select-none">
                    <th className="py-3 pl-4 pr-4 w-36">Preview</th>
                    <th className="py-3 pr-4 w-28">Visible</th>
                    <th className="py-3 pr-4 w-44">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((s, idx) => (
                    <tr key={idx} className="border-t last:border-b">
                      <td className="py-3 pl-4 pr-4 align-top">
                        <div className="w-28 h-16 rounded overflow-hidden bg-zinc-100">
                          <img src={s.src} alt={`slide-${idx}`} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 pr-4 align-top">
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={!!s.visible} onChange={async (e)=>{
                            const v = e.target.checked;
                            setSlides(prev=>prev.map((x,i)=>i===idx?{...x,visible:v}:x));
                            try{ const r = await fetch(`/api/header/${idx}`, { method: 'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ visible: v }) }); if(!r.ok) throw new Error(await r.text()); const j = await r.json(); if (j.data?.settings) setSettings(j.data.settings); }catch(err:any){ pushToast('error','Gagal update visible'); }
                          }} />
                        </label>
                      </td>
                      <td className="py-3 pr-4 align-top">
                        <div className="flex gap-2">
                          <label className="inline-flex items-center gap-2 cursor-pointer px-2 py-1 border rounded bg-white">
                            <input type="file" accept="image/*" className="hidden" onChange={async (e)=>{
                              const f = e.target.files?.[0]; if(!f) return;
                              try{
                                const url = await uploadFile(f);
                                const r = await fetch(`/api/header/${idx}`, { method: 'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ src: url }) });
                                if(!r.ok) throw new Error(await r.text());
                                  const j = await r.json(); setSlides(Array.isArray(j.data?.slides)? j.data.slides : slides);
                                  if (j.data?.settings) setSettings(j.data.settings);
                                pushToast('success','Gambar slide diganti');
                              }catch(err:any){ pushToast('error','Gagal ganti gambar'); }
                            }}>
                            </input>
                            <span className="text-xs text-slate-600">Ganti</span>
                          </label>
                          <button onClick={()=>idx>0 && move(idx, idx-1)} className="px-3 py-1 border rounded bg-white">▲</button>
                          <button onClick={()=>idx<slides.length-1 && move(idx, idx+1)} className="px-3 py-1 border rounded bg-white">▼</button>
                          <button onClick={()=>removeSlide(idx)} className="px-3 py-1 border rounded bg-red-50 text-red-600">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map(t=> (
          <div key={t.id} className={`max-w-xs w-full text-white px-4 py-3 rounded-lg ${t.type==='success'?'bg-green-600':'bg-red-600'}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
