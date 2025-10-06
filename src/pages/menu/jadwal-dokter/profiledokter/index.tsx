import React from "react";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import Image from "next/image";
import AkademisIcon from "./source/akademis.svg";
import MedicIcon from "./source/medic.svg";

export default function ProfileDokter() {
  return (
    <div className="bg-stone-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-24 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1272px] mx-auto grid grid-cols-1 md:grid-cols-[480px_1fr] gap-10">
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full aspect-[4/5] rounded-md overflow-hidden border border-zinc-300 bg-white">
              <img src="https://placehold.co/400x520" alt="dr. Budi Sutomo, Sp.N" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border border-zinc-300 rounded-md p-5">
              <h1 className="text-2xl font-semibold mb-1">dr. Budi Sutomo, Sp.N</h1>
              <p className="text-orange-600 font-medium mb-3">Spesialis Neurologi</p>
              <p className="text-sm text-neutral-600 leading-relaxed">Dokter spesialis neurologi berpengalaman dalam penanganan gangguan saraf.</p>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
