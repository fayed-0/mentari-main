import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getSpecializationBySlug } from "../../data/specializations";
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
      <span className="relative inline-flex items-center justify-center w-12 h-12">
        <span className="relative inline-flex items-center justify-center w-full h-full rounded-[5px] border border-zinc-300 bg-white shadow-sm z-10">
          {icon ? (
            <Image src={icon} alt={text} width={24} height={24} />
          ) : (
            <span className="text-orange-500 font-bold text-base">{text.charAt(0)}</span>
          )}
        </span>
      </span>
      <span className="relative inline-flex items-center h-12 -ml-2 px-3 rounded-[5px] bg-white/70 shadow-sm z-0">
  <span className="text-orange-500 font-bold text-xl sm:text-xl leading-none">{text}</span>
      </span>
    </div>
  );
}

function DoctorCard({ specTitle, specIcon }: { specTitle: string; specIcon?: any }) {
  return (
    <div className="bg-white rounded-[5px] border border-zinc-300 overflow-hidden shadow-sm">
      <div className="p-5">
        <div className="relative rounded-[5px] border border-zinc-300 overflow-hidden">
          <div className="relative w-full h-[312px] sm:h-[340px]">
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
        <h3 className="mt-5 text-xl font-semibold text-black">dr. Budi Sutomo, Sp.N</h3>
        <p className="mt-2 text-neutral-600 text-base">Perawatan gangguan otak, saraf & tulang belakang.</p>
        <div className="mt-6 flex items-center justify-between">
          <Link href="/menu/jadwal-dokter/profiledokter" className="inline-flex items-center gap-2 text-orange-500 text-sm font-semibold">
            <Image src={ProfileIcon} alt="Profile" width={20} height={20} />
            <span>Lihat Profile</span>
          </Link>
          <Link href="/menu/jadwal-dokter" className="inline-flex items-center gap-2 px-3 py-2 rounded-[5px] border border-zinc-300 text-neutral-700 text-sm font-semibold bg-white hover:border-orange-400 hover:text-orange-600 transition">
            <Image src={CalendarIcon} alt="Buat Janji" width={24} height={24} />
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
  const spec = slug ? getSpecializationBySlug(slug) : null;

  if (!spec) return null;

  const longDesc = extendedDescriptions[spec.title] ?? spec.desc;

  return (
    <div className="bg-stone-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1272px] mx-auto">
          {/* Header card */}
          <div className="bg-white rounded-[5px] border border-stone-300 shadow-[0_4px_8px_rgba(0,0,0,0.06)] p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-[256px,1fr] gap-6 items-start">
              <div className="size-48 sm:size-64 rounded-[5px] outline outline outline-offset-[-2px] outline-stone-300 bg-white flex items-center justify-center overflow-hidden">
                <div className="size-44 sm:size-56 bg-white rounded-[5px] flex items-center justify-center">
                  {spec.icon ? (
                    <Image src={spec.icon} alt={spec.title} width={120} height={120} />
                  ) : (
                    <span className="text-white text-4xl font-bold">{spec.title.charAt(0)}</span>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">{spec.title}</h1>
                <p className="text-neutral-600 text-lg sm:text-xl leading-relaxed whitespace-pre-line">{longDesc}</p>
              </div>
            </div>
          </div>

          {/* Doctors grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
