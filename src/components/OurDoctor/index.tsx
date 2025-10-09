import React from "react";
import Link from "next/link";
import ArrowIcon from "./source/arrow.svg";

import Doc1 from "./source/doc1.jpg";
import Doc2 from "./source/doc2.jpg";
import Doc3 from "./source/doc3.jpg";
import Doc4 from "./source/doc4.jpg";

const doctors = [
  {
    id: 1,
    name: "dr. Andini Pratama, Sp.A",
    role: "Spesialis Anak",
    image: Doc1,
  },
  {
    id: 2,
    name: "dr. Julieta Vianty, Sp.OG",
    role: "Spesialis Kandungan & Kebidanan",
    image: Doc2,
  },
  {
    id: 3,
    name: "dr. Michael Santoso, Sp.JP",
    role: "Spesialis Jantung & Pembuluh Darah",
    image: Doc3,
  },
  {
    id: 4,
    name: "dr. Samuel Akbar, Sp.KG",
    role: "Spesialis Gigi & Mulut",
    image: Doc4,
  },
];

type ViewMoreProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  boxed?: boolean;
};

const ViewMore = ({ size = "md", className = "", boxed = false }: ViewMoreProps) => {
  const sizeClass = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  return (
    <Link
      href="/menu/Dokter"
      className={`inline-flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition ${sizeClass} ${className} ${
        boxed ? "bg-white border border-zinc-300 rounded-md px-3 py-1.5 shadow-sm hover:shadow md:px-4 md:py-2" : ""
      }`}
      aria-label="Lihat lebih banyak dokter"
    >
      <span className={`font-semibold ${boxed ? "text-orange-500" : "text-orange-500 hover:underline"}`}>View More</span>
      <img src={ArrowIcon.src} alt="arrow" className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
    </Link>
  );
};

const OurDoctor = () => {
  return (
  <div className="w-full bg-stone-50 py-8 sm:py-16">
      <div className="max-w-[1272px] mx-auto px-4">
        {/* Section Title + View More (Mobile) */}
        <div className="flex flex-row items-center justify-between mb-6 md:mb-6">
          <div className="inline-flex flex-col items-start gap-1">
            <div className="text-black text-xs sm:text-sm font-semibold tracking-wide">
              OUR DOCTOR
            </div>
            <div className="w-20 h-0.5 bg-orange-500"></div>
          </div>
          <div className="block md:hidden ml-2">
            <ViewMore size="md" boxed />
          </div>
        </div>

        {/* Heading + View More (Desktop) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="text-black text-2xl sm:text-2xl md:text-[32px] leading-snug font-semibold w-full md:w-[900px]">
            Dokter profesional yang siap memberikan pelayanan terbaik untuk kesehatan Anda.
          </div>
          <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0 ml-auto cursor-pointer">
            <ViewMore size="md" boxed />
          </div>
        </div>

        {/* Doctor Cards */}
        {/* Mobile 2x2 grid (4 cards) */}
        <div className="grid grid-cols-2 gap-4 sm:hidden">
          {doctors.map((doc) => {
            const imageSrc = doc.image;
            return (
              <div
                key={doc.id + '-mobile'}
                className="bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden"
              >
                <img
                  src={imageSrc.src}
                  alt={doc.name}
                  className="w-full h-50 object-top object-cover border-b border-zinc-300"
                />
                <div className="px-3 py-2">
                  <div className="text-black text-xs font-semibold leading-snug line-clamp-2">{doc.name}</div>
                  <div className="text-neutral-600 text-[10px] font-medium mt-1 leading-tight line-clamp-2">{doc.role}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet layout */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {doctors.map((doc) => {
            const imageSrc = doc.image;
            return (
              <div
                key={doc.id + '-desktop'}
                className="bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden"
              >
                <img
                  src={imageSrc.src}
                  alt={doc.name}
                  className="w-full object-top sm:h-72 md:h-80 object-cover border-b border-zinc-300"
                />
                <div className="px-4 py-3">
                  <div className="text-black sm:text-xl font-semibold">
                    {doc.name}
                  </div>
                  <div className="text-neutral-600 sm:text-lg font-medium mt-1">
                    {doc.role}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurDoctor;
