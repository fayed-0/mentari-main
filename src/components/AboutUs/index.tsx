import React from "react";
import Image from "next/image";

// Import assets
import Img24Hour from "./source/24-hour.svg";
import ImgLocation from "./source/location-on.svg";
import RsImg from "./source/rsimg.png";
import DocImg from "./source/doc.jpg";
import RS from "./source/rs.jpg";
import ArrowIcon from "../HealthCare/source/arrow.svg";
// Reusable ViewMore button
const ViewMore = ({ size = "sm", className = "" }) => {
  // Normalisasi: gunakan skala Tailwind standar untuk mobile.
  // sm variant pada komponen ini jarang dipakai; fokus mobile: text-xs (12px) atau text-sm (14px)
  const sizeClass =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  return (
    <div
      className={`inline-flex items-center gap-2 text-orange-500 font-semibold hover:underline cursor-pointer ${sizeClass} ${className}`}
    >
    </div>
  );
};

const AboutUs = () => {
  return (
    <section className="relative w-full bg-white flex justify-center py-8 sm:py-20">
      <div className="w-full max-w-[1272px] flex flex-col md:flex-row gap-12 px-6 md:px-0">
        {/* tampil di desktop */}
        <div className="flex-1 hidden md:block">
          <div className="w-full h-[200px] sm:h-[583px] rounded-md overflow-hidden bg-zinc-300">
            <Image
              src={RsImg}
              alt="About Us Hospital"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col justify-start">
          {/* Title */}
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex flex-col items-start gap-[5px]">
              <div className="text-black font-semibold tracking-wide text-xs sm:text-sm">
                ABOUT US
              </div>
              <div className="w-20 h-0.5 bg-orange-500"></div>
            </div>
          </div>

          {/* Heading */}
          {/* Mobile heading dinaikkan ke text-2xl untuk hierarchy lebih jelas */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-snug mb-6">
            Mengutamakan kenyamanan dan kualitas layanan pasien
          </h2>

          {/* Description */}
          <div className="flex items-center justify-between mb-10">
            <p className="text-neutral-600 text-sm sm:text-lg font-medium">
              Pelayanan bermutu didukung tenaga profesional. Kami terus meningkatkan mutu dengan teknologi modern.
            </p>
          </div>

          {/* Gambar besar di bawah deskripsi untuk mobile */}
          <div className="block md:hidden mb-10">
            <div className="w-full h-[200px] rounded-md overflow-hidden bg-zinc-300">
              <Image
                src={RsImg}
                alt="About Us Hospital"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Feature cards */}
          <div className="max-w-[1272px] mx-auto grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="group relative rounded-md border border-zinc-300 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[220px]">
              <Image src={DocImg} alt="Doctor" fill className="object-cover absolute inset-0 w-full h-full z-0" />
              <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
              <div className="relative z-20 p-4 sm:p-6 flex flex-col justify-between h-full">
                <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-md border border-zinc-300 bg-white mb-4 sm:mb-6">
                  <Image src={Img24Hour} alt="24 Hour Service" width={24} height={24} />
                </div>
                <h3 className="text-sm sm:text-xl font-semibold text-white mb-2 sm:mb-3">24/7</h3>
                <p className="text-xs sm:text-base font-medium text-white flex-grow">
                  Pelayanan kesehatan tersedia setiap saat dengan tim medis yang siap mendengar, melayani, dan mengasihi pasien.
                </p>
              </div>
            </div>

            {/* Card 2 - Location with RS image background and dark overlay */}
            <div className="group relative rounded-md border border-zinc-300 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[220px]">
              {/* Background image */}
              <Image src={RS} alt="RS" fill className="object-cover absolute inset-0 w-full h-full z-0" />
              <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
              <div className="relative z-20 p-4 sm:p-6 flex flex-col justify-between h-full">
                <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-md border border-zinc-300 bg-white mb-4 sm:mb-6">
                  <Image src={ImgLocation} alt="Location" width={24} height={24} />
                </div>
                <h3 className="text-sm sm:text-xl font-semibold text-white mb-2 sm:mb-3">Location</h3>
                <p className="text-xs sm:text-base font-medium text-white flex-grow">
                  Jl. Raya Legok - Karawaci No.KM.04, Bojong Nangka, Kec. Klp.
                  Dua, Kabupaten Tangerang, Banten 15810
                </p>
                <div className="mt-4 sm:mt-6">
                  <ViewMore size="sm" className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
