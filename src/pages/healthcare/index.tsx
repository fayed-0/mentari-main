import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import DownIcon from "../../components/HealthCare/source/down.svg";
import AnimatedCollapse from "../../components/AnimatedCollapse";

// Reuse a few existing icons (import from components/HealthCare/source)
// Centralized data
import { specializations as staticSpecializations, toSlug } from "../../data/specializations";
import { executeQuery } from '../../lib/database';

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

export default function FullHealthCare({ initialSpecs }: { initialSpecs?: any[] | null }) {
  return (
    <div className="bg-stone-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1272px] mx-auto">
            <div className="inline-flex flex-col items-start gap-[5px] mb-6">
						<div className="inline-block text-black text-xs sm:text-sm font-semibold tracking-wide">
						LAYANAN MEDIS
						</div>
            <div className="h-0.5 bg-orange-500 w-full"></div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-black leading-snug max-w-5xl mb-10">
            Layanan Spesialis Lengkap untuk Kebutuhan Medis Anda
          </h1>

          {/* Search (client-side filter) */}
          <HealthCareSearch initialSpecs={initialSpecs} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // reuse same query as API
    const rows: any[] = await executeQuery('SELECT id, name, slug, subtitle, description, icon, is_hidden, created_at, updated_at FROM specializations ORDER BY id DESC');
    // filter hidden for public page
    const data = (rows || [])
      .filter(r => !r.is_hidden)
      .map(r => ({
        id: r.id,
        name: r.name,
        title: r.name,
        slug: r.slug,
        desc: r.description,
        subtitle: r.subtitle || r.sub_title || '',
        icon: r.icon || null,
        is_hidden: !!r.is_hidden,
        created_at: r.created_at ? new Date(r.created_at).toISOString() : null,
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : null,
      }));
    return { props: { initialSpecs: data } };
  } catch (e) {
    return { props: { initialSpecs: null } };
  }
}

function HealthCareSearch({ initialSpecs }: { initialSpecs?: any[] | null }) {
  // Pencarian dan Filter
  const [query, setQuery] = React.useState("");
  const [specs, setSpecs] = React.useState<any[] | null>(initialSpecs ?? null);

  React.useEffect(() => {
    if (initialSpecs != null) return; // already provided by server
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/healthcare');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        // Exclude hidden items from public listing
        const data = (json.data || [])
          .filter((d: any) => !d.is_hidden)
          .map((d: any) => ({
            ...d,
            title: d.name,
            desc: d.description,
            subtitle: d.subtitle || d.sub_title || '',
          }));
        if (mounted) setSpecs(data);
      } catch (e) {
        if (mounted) setSpecs(staticSpecializations as any);
      }
    })();
    return () => { mounted = false; };
  }, [initialSpecs]);

  // Build categories exactly like the user's requested grouping.
  // We'll map specializations to categories by matching the specialization title (or slug)
  // against the provided list. Unmatched items go into 'Lainnya'.
  const categories = React.useMemo(() => {
    const defs: { id: string; title: string; labels: string[] }[] = [
      {
        id: 'penyakit-dalam',
        title: 'Spesialis Penyakit Dalam & Sistem Organ',
        labels: [
          'Endokrinologi',
          'Gastroenterologi',
          'Geriatri',
          'Hematologi',
          'Imunologi & Alergi',
          'Kardiologi',
          'Kardiovaskular',
          'Nefrologi',
          'Neurologi',
          'Onkologi',
          'Penyakit Infeksi',
          'Pulmonologi',
          'Reumatologi',
        ],
      },
      {
        id: 'bedah',
        title: 'Bedah',
        labels: [
          'Anestesi',
          'Bedah Anak',
          'Bedah Ortopedi',
          'Bedah Plastik',
          'Bedah Saraf',
          'Bedah Umum',
          'Urologi',
        ],
      },
      {
        id: 'wanita-ibu-anak',
        title: 'Kesehatan Wanita, Ibu & Anak',
        labels: [
          'Ginekologi',
          'Obstetri & Ginekologi',
          'Pediatri',
          'Perinatologi',
          'Laktasi',
        ],
      },
      {
        id: 'indera-kulit-mulut',
        title: 'Indera, Kulit & Mulut',
        labels: ['Dermatologi', 'Mata', 'Mata (Oftalmologi)', 'THT', 'Gigi', 'Kedokteran Gigi'],
      },
      {
        id: 'rehab-lanjutan',
        title: 'Rehabilitasi, Tulang & Perawatan Lanjutan',
        labels: ['Kesehatan Tulang', 'Fisioterapi', 'Rehabilitasi Klinik', 'Perawatan Luka', 'Perawatan Paliatif', 'Luka & Wound Care', 'Paliatif'],
      },
      {
        id: 'kesehatan-mental',
        title: 'Kesehatan Mental',
        labels: ['Psikiatri', 'Psikologi Klinis'],
      },
      {
        id: 'diagnostik-penunjang',
        title: 'Diagnostik & Penunjang Medis',
        labels: ['Radiologi', 'Patologi Klinik', 'Farmasi Klinik'],
      },
      { id: 'lainnya', title: 'Lainnya', labels: [] },
    ];

    const base = specs ?? staticSpecializations;
    const result = defs.map(d => ({ id: d.id, title: d.title, specializationIds: [] as number[], labels: d.labels }));

    const assigned = new Set<number>();

    const normalize = (str: string) => (str || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();

    base.forEach((s: any) => {
      const title = normalize(s.title || s.name || '');
      const slug = (s.slug || toSlug(s.title || '')).toLowerCase();
      const iconFile = (s.icon || '').toString().toLowerCase();
      let placed = false;

      for (const cat of result) {
        if (!cat.labels || cat.labels.length === 0) continue;
        for (const lab of cat.labels) {
          const l = normalize(lab);
          // match if title contains label, or slug equals label-slug, or icon filename contains label
          if (title.includes(l) || slug === toSlug(lab) || iconFile.includes(l.replace(/\s+/g, '-'))) {
            cat.specializationIds.push(s.id);
            assigned.add(s.id);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    });

    // any not assigned goes to 'lainnya'
    const otherCat = result.find(r => r.id === 'lainnya');
    if (otherCat) {
      base.forEach((s: any) => {
        if (!assigned.has(s.id)) otherCat.specializationIds.push(s.id);
      });
    }

    return result.map(({ id, title, specializationIds }) => ({ id, title, specializationIds }));
  }, [specs]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    const base = specs ?? staticSpecializations;
    return base.filter((s: any) => [s.title, s.desc || '', s.subtitle || ''].some((t: string) => (t || '').toLowerCase().includes(q)));
  }, [query, specs]);

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
          const base = specs ?? staticSpecializations;
          const catSpecs = base.filter((s: any) => cat.specializationIds.includes(s.id));
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
                <div className="pl-2 sm:pl-4 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {catSpecs.map((s, i) => {
                    return (
                      <Link
                        key={s.id}
                        href={`/healthcare/${toSlug(s.title)}`}
                        className="stagger-item opacity-0 translate-y-3 group w-full rounded-xl border p-3 sm:p-4 flex flex-col items-center text-center transition shadow-sm hover:shadow-md focus:outline-none bg-white border-zinc-200 text-neutral-700 hover:bg-orange-500 hover:border-orange-500 hover:text-white"
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
                        <p className="text-xs sm:text-sm font-semibold leading-snug mb-1 transition-colors group-hover:text-white">
                          {s.title}
                        </p>
                        <span className="block text-xs sm:text-sm leading-snug font-medium transition-colors text-neutral-500 group-hover:text-white/90">
                          {s.subtitle || s.desc}
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
            <h3 className="text-sm sm:text-lg font-semibold mb-2 text-black group-hover:text-white">
              {s.title}
            </h3>
            <p className="text-xs sm:text-sm font-medium flex-grow text-neutral-600 group-hover:text-white/90">
              {s.subtitle || s.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
