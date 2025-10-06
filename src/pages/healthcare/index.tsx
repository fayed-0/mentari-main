import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import DownIcon from "../../components/HealthCare/source/down.svg";
import AnimatedCollapse from "../../components/AnimatedCollapse";

// Reuse a few existing icons (import from components/HealthCare/source)
// Centralized data
import { specializations } from "../../data/specializations";
import { toSlug } from "../../data/specializations";

// Full specialization list. If you have images later, replace `icon: null` with import.
// id, title, desc, optional icon (null => placeholder)
// Data now imported from src/data/specializations

function PlaceholderIcon({ label, size = 40 }: { label: string; size?: number }) {
  const initial = label.charAt(0).toUpperCase();
  const base = `flex items-center justify-center rounded-md border border-zinc-300 bg-white text-orange-500 font-semibold`;
  const dimension = size < 48
    ? "w-10 h-10 sm:w-16 sm:h-16 text-sm sm:text-2xl"
    : "w-16 h-16 text-2xl";
  return <div className={`${base} ${dimension}`}>{initial}</div>;
}

export default function FullHealthCare() {
  return (
    <div className="bg-stone-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1272px] mx-auto">
          <div className="inline-flex flex-col items-start gap-[5px] mb-6">
            <div className="text-black font-semibold tracking-wide text-[14px] sm:text-sm">HEALTH CARE</div>
            <div className="w-24 h-0.5 bg-orange-500" />
          </div>
          <h1 className="text-[20px] sm:text-3xl md:text-5xl font-semibold text-black leading-snug max-w-5xl mb-10">
            Layanan Spesialis Lengkap untuk Kebutuhan Medis Anda
          </h1>

          {/* Search (client-side filter) */}
          <HealthCareSearch />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HealthCareSearch() {
  // Pencarian dan Filter
  const [query, setQuery] = React.useState("");

  // Kategori (accordion & filter) contoh: mapping nama kategori ke list specialization id
  const categories: { id: string; title: string; specializationIds: number[] }[] = [
    { id: "anak", title: "Anak", specializationIds: [1, 23] },
    { id: "anestesi", title: "Anestesi", specializationIds: [24] },
    { id: "bedah-ortopedi", title: "Bedah Ortopedi", specializationIds: [2, 21] },
    { id: "bedah-urologi", title: "Bedah Urologi", specializationIds: [12] },
    { id: "jantung", title: "Jantung & Pembuluh Darah", specializationIds: [3, 38] },
    { id: "kebidanan", title: "Kebidanan & Kandungan", specializationIds: [6, 33] },
    { id: "paru", title: "Paru & Pernapasan", specializationIds: [8] },
    { id: "penyakit-dalam", title: "Penyakit Dalam", specializationIds: [9, 10, 11, 15, 36] },
    { id: "saraf", title: "Saraf", specializationIds: [7, 20] },
    { id: "tht", title: "THT", specializationIds: [25] },
  ];

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return specializations.filter((s) =>
      [s.title, s.desc].some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const [openCategory, setOpenCategory] = React.useState<string | null>(null);
  const toggleCategory = (id: string) => {
    setOpenCategory((prev) => (prev === id ? null : id)); // buka satu; tutup sebelumnya
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center w-full gap-4">
          <input
            type="text"
            placeholder="Cari spesialisasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:max-w-sm px-4 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="text-sm text-neutral-500 whitespace-nowrap">{filtered.length} ditemukan</div>
        </div>
      </div>

      {/* Accordion Kategori */}
      <div className="mb-10 rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm">
        {categories.map((cat, idx) => {
          const isOpen = openCategory === cat.id;
          const catSpecs = specializations.filter((s) => cat.specializationIds.includes(s.id));
          return (
            <div key={cat.id}>
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between py-4 text-left transition-colors duration-500 ${
                  isOpen ? "text-orange-500" : "text-neutral-800"
                }`}
              >
                <span className="font-semibold text-sm sm:text-base">{cat.title}</span>
                <span
                  className={`inline-flex items-center justify-center transition-transform duration-500  ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <Image src={DownIcon} alt="toggle" width={24} height={24} />
                </span>
              </button>
              <AnimatedCollapse isOpen={isOpen}>
                <div className="pl-2 sm:pl-4 pb-6 flex flex-wrap gap-4">
                  {catSpecs.map((s, i) => {
                    return (
                      <Link
                        key={s.id}
                        href={`/healthcare/${toSlug(s.title)}`}
                        className="stagger-item opacity-0 translate-y-3 group w-40 sm:w-52 rounded-xl border p-4 flex flex-col items-center text-center transition shadow-sm hover:shadow-md focus:outline-none bg-white border-zinc-200 text-neutral-700 hover:bg-orange-500 hover:border-orange-500 hover:text-white"
                        style={{ transition: 'opacity 500ms ease, transform 500ms ease' }}
                      >
                        {s.icon ? (
                          <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-md mb-3 border border-zinc-300 bg-white group-hover:bg-white group-hover:border-white">
                            <Image src={s.icon} alt={s.title} width={24} height={24} />
                          </div>
                        ) : (
                          <div className="mb-3">
                            <PlaceholderIcon label={s.title} size={40} />
                          </div>
                        )}
                        <p className="text-[11px] sm:text-xs font-semibold leading-snug mb-1 transition-colors group-hover:text-white">
                          {s.title}
                        </p>
                        <span className="block text-[9px] sm:text-[11px] leading-snug font-medium transition-colors text-neutral-500 group-hover:text-white/90">
                          {s.desc}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </AnimatedCollapse>
              {idx < categories.length - 1 && <div className="h-px bg-zinc-200" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((s) => (
          <Link
            key={s.id}
            href={`/healthcare/${toSlug(s.title)}`}
            className="group rounded-xl border p-4 sm:p-6 flex flex-col text-left transition-all duration-300 bg-white border-zinc-300 hover:bg-orange-500 hover:border-orange-500 hover:shadow-xl hover:scale-[1.02]"
          >
           
            {/* Icon */}
            {s.icon ? (
              <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-md mb-4 sm:mb-6 border border-zinc-300 bg-white group-hover:bg-white group-hover:border-white">
                <Image src={s.icon} alt={s.title} width={24} height={24} />
              </div>
            ) : (
              <div className="mb-4 sm:mb-6">
                <PlaceholderIcon label={s.title} size={40} />
              </div>
            )}
            <h3 className="text-[12px] sm:text-lg font-semibold mb-2 text-black group-hover:text-white">
              {s.title}
            </h3>
            <p className="text-[9px] sm:text-sm font-medium flex-grow text-neutral-600 group-hover:text-white/90">
              {s.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
