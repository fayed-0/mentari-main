import React from "react";
import { useRouter } from "next/router";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import CalenderIcon from "../../../../components/HealthCare/source/calender.svg";
import AkademisIcon from "./source/akademis.svg";
import MedicIcon from "./source/medic.svg";
import { getDoctorById, getDoctorSpecialization } from "../../../../data/doctors";

export default function ProfileDokter() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const doctorId = id ? Number(id) : undefined;
  const doctor = doctorId ? getDoctorById(doctorId) : undefined;
  const spec = doctor ? getDoctorSpecialization(doctor) : undefined;

  const name = doctor?.name ?? "dr. Budi Sutomo, Sp.N";
  const specTitle = spec?.title ?? "Spesialis Neurologi";
  const photo = doctor?.photo ?? "https://placehold.co/400x520";
  const summary = doctor?.summary ?? "Dokter spesialis neurologi berpengalaman dalam penanganan gangguan saraf.";

  return (
    <div className="bg-stone-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1272px] mx-auto grid grid-cols-1 md:grid-cols-[480px_1fr] gap-10">
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full aspect-[4/5] rounded-md overflow-hidden border border-zinc-300 bg-white relative">
              <img src={photo} alt={name} className="w-full h-full object-cover" />
              {spec && (
                // show specialization icon + label overlay (visible on all sizes)
                <div className="absolute left-3 bottom-3">
                  <div className="relative inline-flex items-center gap-0">
                    <span className="relative inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12">
                      <span className="relative inline-flex items-center justify-center w-full h-full rounded-[6px] border border-zinc-300 bg-white shadow-sm z-10">
                        <Image src={spec.icon} alt={spec.title} width={20} height={20} className="sm:w-6 sm:h-6" />
                      </span>
                    </span>
                    <span className="relative inline-flex items-center h-8 sm:h-12 -ml-2 pl-3 pr-2 sm:pl-4 sm:pr-3 rounded-[6px] bg-white/90 shadow-sm z-0">
                      <span className="text-orange-500 font-bold text-sm sm:text-base leading-none">{spec.title}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white border border-zinc-300 rounded-md p-5">
              <h1 className="text-2xl font-semibold mb-1">{name}</h1>
              {/* header specialization label hidden (we show icon overlay on mobile instead) */}
              <p className="text-sm text-neutral-600 leading-relaxed">{summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 content-start">
            {/* Card 1 - Akademik */}
            <div className="min-h-[220px] bg-white rounded-lg border border-zinc-300 p-6 flex flex-col">
              <div className="w-20 h-20 flex items-center justify-center bg-white rounded-md border border-zinc-300 mb-6">
                <Image src={AkademisIcon} alt="Ikon Akademik" className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Akademik</h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
              <div className="mt-auto" />
            </div>

            {/* Card 2 - Tindakan Medis */}
            <div className="min-h-[220px] bg-white rounded-lg border border-zinc-300 p-6 flex flex-col">
              <div className="w-20 h-20 flex items-center justify-center bg-white rounded-md border border-zinc-300 mb-6">
                <Image src={MedicIcon} alt="Ikon Tindakan Medis" className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tindakan Medis</h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
              <div className="mt-auto" />
            </div>

            {/* Appointment CTA placed below the two info cards (full width on mobile) */}
            <div className="col-span-full mt-4">
              <Link
                href="/menu/jadwal-dokter"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-3 bg-orange-500 text-white font-semibold rounded-md shadow-sm hover:bg-orange-600 transition"
              >
                <Image src={CalenderIcon} alt="Appointment" width={20} height={20} className="hidden sm:inline-block invert" />

                Buat Janji
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
