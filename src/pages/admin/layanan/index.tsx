import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type ServiceListItem = { slug: string; title: string; image: string; visible: boolean; order: number };
type ServiceListData = { headerTitle: string; services: ServiceListItem[] };

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as any;
};

export default function AdminLayananSelectorPage() {
  const [list, setList] = useState<ServiceListData>({ headerTitle: '', services: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const j = await fetcher<{ data: ServiceListData }>(`/api/layanan`);
        const d = j.data || { headerTitle: '', services: [] };
        d.services.sort((a,b)=>a.order-b.order);
        setList(d);
        setError(null);
      } catch (e:any) {
        setError(e?.message || 'Gagal memuat daftar layanan');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
              <li><Link href="/admin/layanan" className="px-4 py-2.5 flex items-center gap-2 text-black text-sm font-medium bg-neutral-50 rounded-sm"><span className="inline-block size-3 bg-orange-500 rounded-sm" /> Layanan</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="mt-24 flex-1 pr-4 pb-8">
          <div className="bg-white rounded-2xl w-full min-h-[720px] shadow-sm relative p-6">
            <header className="mb-6">
              <h1 className="text-blue-950 text-xl font-semibold leading-7">Layanan – Pilih Halaman</h1>
              <p className="text-blue-950/70 text-sm leading-tight">Silakan pilih satu layanan untuk diedit. Setiap halaman hanya mengelola kontennya sendiri.</p>
            </header>

            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
            {loading ? (
              <div className="text-sm text-slate-500">Memuat daftar...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.services.map(s => (
                  <Link key={s.slug} href={`/admin/layanan/${s.slug}`} className="border rounded-xl p-4 hover:shadow transition bg-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-20 rounded bg-zinc-100 overflow-hidden flex items-center justify-center">
                        {s.image ? <img src={s.image} alt={s.title} className="h-12 w-20 object-cover" /> : <span className="text-xs text-slate-400">no image</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-blue-950 truncate">{s.title}</div>
                        <div className="text-xs text-slate-500">/{s.slug}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${s.visible ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{s.visible ? 'Visible' : 'Hidden'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
