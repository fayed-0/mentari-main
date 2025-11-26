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
  const [data, setData] = React.useState<any | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/aboutus');
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        if (mounted) setData(json.data || null);
      } catch (e) {
        // ignore, keep defaults
      }
    })();
    return () => { mounted = false; };
  }, []);

  const title = data?.title ?? 'Mengutamakan kenyamanan dan kualitas layanan pasien';
  const description = data?.description ?? 'Pelayanan bermutu didukung tenaga profesional. Kami terus meningkatkan mutu dengan teknologi modern.';
  const cards = data?.cards ?? [
    { heading: '24/7', text: 'Pelayanan kesehatan tersedia setiap saat dengan tim medis yang siap mendengar, melayani, dan mengasihi pasien.' },
    { heading: 'Location', text: 'Jl. Raya Legok - Karawaci No.KM.04, Bojong Nangka, Kec. Klp. Dua, Kabupaten Tangerang, Banten 15810' },
  ];
  // allow overriding the large about image from API data
  const mainImage: any = data?.mainImage ? data.mainImage : (RsImg?.src ?? RsImg);

  return (
    <section className="relative w-full bg-white flex justify-center py-8 sm:py-20">
  <div className="w-full max-w-[1272px] flex flex-col md:flex-row gap-12 md:gap-20 px-6 md:px-0">
        {/* tampil di desktop */}
        <div className="flex-1 hidden md:block">
            <div className="w-full h-[200px] sm:h-[583px] rounded-md overflow-hidden bg-zinc-300">
              {typeof mainImage === 'string' ? (
                // dynamic string URLs (uploads or absolute) — use regular img to avoid required width/height
                // keep same styling so it behaves like next/image
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainImage} alt="About Us Hospital" className="w-full h-full object-cover" />
              ) : (
                <Image src={mainImage} alt="About Us Hospital" className="w-full h-full object-cover" />
              )}
            </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col justify-start">
          {/* Title */}
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex flex-col items-start gap-1">
                <div className="inline-block text-black text-xs sm:text-sm font-semibold tracking-wide">
                  TENTANG KAMI
                </div>
                <div className="h-0.5 bg-orange-500 w-full"></div>
              </div>
          </div>

          {/* Heading */}
          {/* Mobile heading dinaikkan ke text-2xl untuk hierarchy lebih jelas */}
          <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-black leading-snug mb-6">
            {title}
          </h2>

          {/* Description */}
          <div className="flex items-center justify-between mb-10">
            <p className="text-neutral-600 text-sm sm:text-lg font-medium">
              {description}
            </p>
          </div>

          {/* Gambar besar di bawah deskripsi untuk mobile */}
          <div className="block md:hidden mb-10">
            <div className="w-full h-[200px] rounded-md overflow-hidden bg-zinc-300">
              {typeof mainImage === 'string' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainImage} alt="About Us Hospital" className="w-full h-full object-cover" />
              ) : (
                <Image src={mainImage} alt="About Us Hospital" className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          {/* Feature cards */}
          <div className="max-w-[1272px] mx-auto grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-8 mt-4 md:mt-4">
            {cards.map((c:any, idx:number) => {
              // card background image from data (c.image) or fallback
              const bg = c.image ? c.image : RS.src || '';
              return (
                <div
                  key={idx}
                  className="relative rounded-md overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl h-56 sm:h-80"
                  style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {/* dark overlay */}
                  <div className="absolute inset-0 bg-black/55"></div>

                  <div className="relative z-20 p-4 sm:p-6 flex flex-col justify-between h-full">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-md bg-white mb-4 sm:mb-6">
                      {c.icon ? (
                        // dynamic icon uploaded to /public/uploads (absolute path from root)
                        <img
                          src={c.icon}
                          alt={`${c.heading} icon`}
                          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        />
                      ) : (
                        // fallback to bundled svg imports if available (map by heading)
                        <img
                          src={(c.heading && c.heading.toLowerCase().includes('loc')) ? (ImgLocation?.src ?? ImgLocation) : (Img24Hour?.src ?? Img24Hour)}
                          alt="icon"
                          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        />
                      )}
                    </div>
                    <h3 className="text-sm sm:text-xl font-semibold text-white mb-2 sm:mb-3">{c.heading}</h3>
                    <p className="text-xs sm:text-base font-medium text-white line-clamp-4">
                      {c.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
