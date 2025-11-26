import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getSpecializationBySlug, toSlug } from "../../data/specializations";
import DoctorImg from "../../components/OurDoctor/source/doctor.png";
import ProfileIcon from "../../components/HealthCare/source/profile.svg";
import CalendarIcon from "../../components/HealthCare/source/calender.svg";

const extendedDescriptions: Record<string, string> = {
  Neurologi:
    "Sistem saraf berperan penting dalam mengatur gerakan, pikiran, hingga fungsi tubuh sehari-hari. Jika Anda merasakan keluhan seperti sakit kepala yang sering muncul, sulit tidur, gangguan memori, atau kelemahan otot, berkonsultasi dengan dokter spesialis saraf bisa membantu menemukan penyebab dan solusinya.\n\nDokter yang kami rekomendasikan siap mendampingi Anda dengan pemeriksaan menyeluruh dan perawatan yang sesuai kebutuhan.",
};

function PillTag({ icon, text }: { icon?: any; text: string }) {
  return (
    <div className="relative inline-flex items-center gap-0">
      <span className="relative inline-flex items-center justify-center w-6 h-6 sm:w-12 sm:h-12">
        <span className="relative inline-flex items-center justify-center w-full h-full rounded-[5px] border border-zinc-300 bg-white shadow-sm z-10">
          {icon ? (
            <Image src={icon} alt={text} width={12} height={12} className="sm:w-6 sm:h-6" />
          ) : (
            <span className="text-orange-500 font-bold text-[10px] sm:text-base">{text.charAt(0)}</span>
          )}
        </span>
      </span>
      {/* Keep fused background like before, but add internal left padding so text isn't cramped */}
      <span className="relative inline-flex items-center h-6 sm:h-12 -ml-2 pl-3 pr-2 sm:pl-4 sm:pr-3 rounded-[5px] bg-white/70 shadow-sm z-0">
        <span className="text-orange-500 font-bold text-[10px] sm:text-xl leading-none">{text}</span>
      </span>
    </div>
  );
}

function DoctorCard({ specTitle, specIcon }: { specTitle: string; specIcon?: any }) {
  return (
    <div className="bg-white rounded-[5px] border border-zinc-300 overflow-hidden shadow-sm">
      <div className="p-2 sm:p-5">
        <div className="relative rounded-[5px] border border-zinc-300 overflow-hidden">
          <div className="relative w-full h-44 sm:h-[340px]">
            <Image
              src={DoctorImg}
              alt="Dokter"
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 356px, 100vw"
              priority={false}
            />
          </div>
          <div className="absolute left-2 bottom-2">
            <PillTag text={specTitle} icon={specIcon} />
          </div>
        </div>
        <h3 className="mt-1 sm:mt-5 text-sm sm:text-xl font-semibold text-black">dr. Budi Sutomo, Sp.N</h3>
        <p className="mt-1 sm:mt-2 text-neutral-600 text-xs sm:text-base">Perawatan gangguan otak, saraf & tulang belakang.</p>
        <div className="mt-4 sm:mt-6 flex items-center gap-2 justify-between">
<Link href="/menu/jadwal-dokter/profiledokter" className="inline-flex items-center gap-2 text-orange-500 text-xs sm:text-sm font-semibold">
  <Image src={ProfileIcon} alt="Profile" width={20} height={20} className="hidden sm:inline-block" />
  <span className="sm:hidden">Profile</span>
  <span className="hidden sm:inline-block">Lihat Profile</span>
</Link>
          <Link href="/menu/jadwal-dokter" className="inline-flex items-center gap-2 px-3 py-2 rounded-[5px] border border-zinc-300 text-neutral-700 text-xs sm:text-sm font-semibold bg-white hover:border-orange-400 hover:text-orange-600 transition">
            <Image src={CalendarIcon} alt="Buat Janji" width={24} height={24} className="hidden sm:inline-block" />
            <span>Appointment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SpecializationDetail() {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const [spec, setSpec] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (!slug) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/healthcare');
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        const items: any[] = json.data || [];
        const raw = items.find(i => i.slug === slug);
        let found: any = null;
        if (raw) {
          // If the DB row is hidden, treat as not found (redirect to 404)
          if (raw.is_hidden) {
            if (mounted) {
              // client-side redirect to 404
              try { router.replace('/404'); } catch {};
              setSpec(null);
            }
            return;
          }
          // normalize DB row to the shape expected by this page
          found = {
            title: raw.name ?? raw.title,
            description: raw.description ?? raw.desc ?? '',
            desc: raw.description ?? raw.desc ?? '',
            icon: raw.icon ?? null,
            slug: raw.slug ?? toSlug(raw.name ?? raw.title ?? ''),
            subtitle: raw.subtitle ?? ''
          };
        } else {
          const staticFound = getSpecializationBySlug(slug);
          if (staticFound) {
            found = { ...staticFound };
          }
        }
  if (mounted) setSpec(found || null);
      } catch (e) {
        // fallback to static
        const staticFound = getSpecializationBySlug(slug);
        if (mounted) setSpec(staticFound || null);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  if (!spec) return null;

  const longDesc = spec.description ?? extendedDescriptions[spec.title] ?? spec.desc;

  return (
    <div className="bg-stone-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1272px] mx-auto">
          {/* Header card */}
          <div className="bg-white rounded-[10px] border border-stone-300 shadow-[0_4px_8px_rgba(0,0,0,0.06)] p-5 sm:p-8">
            <div className="grid grid-cols-[96px,1fr] sm:grid-cols-[256px,1fr] gap-5 sm:gap-6 items-center">
              <div className="w-24 h-24 sm:size-64 rounded-[10px] outline outline-1 outline-offset-[-2px] outline-stone-300 bg-white flex items-center justify-center overflow-hidden">
                {spec.icon ? (
                  <Image src={spec.icon} alt={spec.title} width={56} height={56} className="sm:w-24 sm:h-24" />
                ) : (
                  <span className="text-orange-500 text-3xl sm:text-6xl font-bold">{spec.title.charAt(0)}</span>
                )}
              </div>
              <div className="flex items-center">
                <div>
                  {/* Make heading more responsive: smaller on mobile, larger on sm+ */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black leading-tight break-words">{spec.title}</h1>
                  {spec.subtitle && <div className="text-sm sm:text-base text-slate-600 mt-1">{spec.subtitle}</div>}
                </div>
              </div>
            </div>
            {/* Reduce paragraph size on mobile to avoid oversized text */}
            <p className="mt-6 text-neutral-600 text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line">{longDesc}</p>
          </div>

          {/* Doctors grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <DoctorCard specTitle={spec.title} specIcon={spec.icon} />
            <DoctorCard specTitle={spec.title} specIcon={spec.icon} />
            <DoctorCard specTitle={spec.title} specIcon={spec.icon} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
