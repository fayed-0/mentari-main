import React, { useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { searchAll, SearchItem } from "../data/searchIndex";

const typeLabel: Record<SearchItem["type"], string> = {
  page: "Halaman",
  specialization: "Spesialisasi",
  doctor: "Dokter",
};

export default function SearchPage() {
  const router = useRouter();
  const qParam = (router.query.q as string) || "";
  const [q, setQ] = useState(qParam);

  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  const results = useMemo(() => searchAll(q), [q]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <Head>
        <title>Cari: {q || ""} | RS Mentari</title>
        <meta name="description" content="Pencarian konten di RS Mentari" />
      </Head>
      <Navbar />
      <main className="pt-24 pb-16 px-6 md:px-10 max-w-6xl mx-auto min-h-[60vh]">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">Pencarian</h1>

        <form onSubmit={onSubmit} className="flex items-center gap-3 mb-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ketik kata kunci..."
            className="flex-1 h-11 px-3 border border-stone-300 rounded-md focus:outline-none focus:border-orange-500"
            aria-label="Ketik kata kunci"
          />
          <button type="submit" className="h-11 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600">Cari</button>
        </form>

        {q && results.length === 0 && (
          <p className="text-stone-500">Tidak ada hasil untuk "{q}".</p>
        )}

        <ul className="space-y-5">
          {results.map((item: SearchItem, idx: number) => (
            <li key={`${item.path}-${idx}`} className="p-4 border border-stone-200 rounded-lg hover:shadow-sm transition">
              <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">{typeLabel[item.type]}</div>
              <Link href={item.path} className="text-lg md:text-xl font-medium text-orange-600 hover:underline">
                {item.title}
              </Link>
              {item.description && (
                <p className="text-sm md:text-base text-stone-600 mt-1 line-clamp-3">{item.description}</p>
              )}
              <div className="text-[11px] text-stone-400 mt-2">{item.path}</div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
