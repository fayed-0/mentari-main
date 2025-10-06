import React from "react";
import Navbar from "../Navbar";
import SearchIcon from "./source/search.svg";
import Promo from "./source/promo.jpg";
import MobileCover from "./source/cover mobile.png";
import DonorDarah from "./source/donor darah.png";
import Asuransi from "./source/asuransi.png";
import PMI from "./source/PMI.png";

const PageCover = () => {

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const openModal = (img: string) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  React.useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  const slides = React.useMemo(
    () => [
      typeof DonorDarah === 'string' ? DonorDarah : DonorDarah.src,
      typeof Asuransi === 'string' ? Asuransi : Asuransi.src,
      typeof PMI === 'string' ? PMI : PMI.src,
    ],
    []
  );
  const [slideIndex, setSlideIndex] = React.useState(0);
  const nextSlide = React.useCallback(() => setSlideIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prevSlide = React.useCallback(() => setSlideIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);
  React.useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 10000);
    return () => clearInterval(id);
  }, [slides.length]);

  // mobile swipeable row state/refs
  const mobileRowRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const onMobileScroll = React.useCallback(() => {
    const el = mobileRowRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    let nearestIdx = 0;
    let minDist = Infinity;
    Array.from(el.children).forEach((child, idx) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });
    setActiveIdx(nearestIdx);
  }, []);

  const scrollToIndex = React.useCallback((i: number) => {
    const el = mobileRowRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    setActiveIdx(i);
  }, []);

  // Auto-swipe every 30s on mobile row
  React.useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % slides.length;
        const el = mobileRowRef.current;
        if (el) {
          const child = el.children[next] as HTMLElement | undefined;
          if (child) el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
        }
        return next;
      });
    }, 30000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative w-full lg:min-h-screen bg-white lg:bg-stone-50 overflow-hidden font-sans">
  <div className="absolute inset-0 z-0 pointer-events-none select-none block md:hidden">
        <img
          src={typeof MobileCover === 'string' ? MobileCover : MobileCover.src}
          alt="mobile cover background"
          className="w-full h-full object-cover"
        />
      </div>

      <Navbar />

  <div className="relative z-10 mx-auto max-w-[1272px] px-4 pt-20 pb-4 md:hidden">
    <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-[700px] relative bg-white/0 overflow-visible">
            <div className="w-full max-w-[700px] mx-auto mt-4 relative">
              {/* Swipeable row: 3 kartu berderet dan bisa di-swipe */}
              <div className="-mx-4 px-4">
                <div
                  className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
                  ref={mobileRowRef}
                  onScroll={onMobileScroll}
                >
                  {slides.map((src, idx) => (
                    <div key={idx} className="snap-start shrink-0 w-[60vw] sm:w-36 aspect-[4/3] rounded-[8px] overflow-hidden border border-zinc-300 bg-white">
                      <img
                        className="w-full h-full object-cover object-center bg-white"
                        src={src}
                        alt={idx === 0 ? 'donor darah' : idx === 1 ? 'asuransi' : 'PMI'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots indicator */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Ke slide ${idx + 1}`}
                    onClick={() => scrollToIndex(idx)}
                    className={`${idx === activeIdx ? 'w-4 bg-orange-500' : 'w-2 bg-neutral-300'} h-2 rounded-full transition-all duration-300`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

  <div className="block md:hidden pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white z-20" />

      <div className="hidden md:block lg:hidden relative z-10">
        <div className="mx-auto w-[1024px] h-[516px] relative bg-white overflow-hidden">
          <img
            className="w-[511px] h-[511px] left-[453px] top-[81px] absolute rounded-[5px] object-contain object-center bg-white"
            src={typeof DonorDarah === 'string' ? DonorDarah : DonorDarah.src}
            alt="donor darah"
          />
          {/* Judul */}
          <div className="w-96 left-[60px] top-[123px] absolute text-black text-[40px] leading-tight font-bold">
            Kesehatan Anda Adalah Prioritas Kami
          </div>
          {/* Deskripsi */}
          <div className="w-96 left-[60px] top-[298px] absolute text-neutral-600 text-[13px] font-medium">
            Layanan kesehatan terpadu dengan dokter profesional & fasilitas modern untuk Anda dan keluarga
          </div>
          {/* Pencarian (Tablet) */}
          <form className="absolute left-[59px] top-[352px] flex items-stretch w-96 h-10" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              placeholder="Cari..."
              className="flex-1 h-full rounded-l-[5px] border border-neutral-600 border-r-0 px-3 text-[13px] text-neutral-700 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
              aria-label="Cari"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-orange-500 rounded-r-[5px] grid place-items-center text-white"
              aria-label="Cari"
            >
              <img src={SearchIcon.src} alt="search" className="w-5 h-5 invert-0" />
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block relative z-10">
        <div className="relative w-full min-h-screen bg-white overflow-hidden">
          <div className="mx-auto w-[1512px] h-[933px] relative">
            <div className="w-[1007px] h-[915px] left-[-363px] top-[-194px] absolute bg-orange-500/10 rounded-full blur-[50.05px]" />
            <div className="w-[1020px] h-[991px] left-[776px] top-[-116px] absolute bg-orange-500/10 rounded-full blur-[50.05px]" />

            <div className="w-[477px] left-[120px] top-[241px] absolute text-black text-6xl font-bold">
              Kesehatan Anda Adalah Prioritas Kami
            </div>
            <div className="w-[477px] left-[120px] top-[476px] absolute text-neutral-600 text-xl font-medium">
              Layanan kesehatan terpadu dengan dokter profesional & fasilitas modern untuk Anda dan keluarga
            </div>
            {/* Search bar (Desktop) */}
            <form className="absolute left-[120px] top-[576px] flex items-stretch w-[477px] h-12" role="search" onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                placeholder="Cari..."
                className="flex-1 h-full rounded-l-[5px] border border-neutral-600 border-r-0 px-4 text-lg text-neutral-700 placeholder-neutral-500 outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                aria-label="Cari"
              />
              <button
                type="submit"
                className="size-12 bg-orange-500 rounded-r-[5px] grid place-items-center text-white"
                aria-label="Cari"
              >
                <img src={SearchIcon.src} alt="search" className="w-5 h-5 invert-0" />
              </button>
            </form>

            <div className="group w-[700px] h-[700px] left-[677px] top-[120px] absolute rounded-[5px] overflow-hidden bg-white/0 transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl box-border">
              <div
                className="absolute inset-0 flex will-change-transform transition-transform duration-700 ease-in-out"
                style={{ width: `${slides.length * 700}px`, transform: `translateX(-${slideIndex * 700}px)` }}
              >
                {slides.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-[700px] h-[700px] flex-shrink-0 overflow-hidden p-2"
                  >
                    <img
                      className="w-full h-full object-contain object-center transform-gpu scale-100 transition-none"
                      src={src}
                      alt={idx === 0 ? 'donor darah' : idx === 1 ? 'asuransi' : 'PMI'}
                    />
                  </div>
                ))}
              </div>
              <button
                aria-label="Sebelumnya"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white grid place-items-center select-none"
                onClick={prevSlide}
                type="button"
              >
                ‹
              </button>
              <button
                aria-label="Berikutnya"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white grid place-items-center select-none"
                onClick={nextSlide}
                type="button"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.currentTarget === e.target) closeModal();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-[92vw] max-h-[86vh]">
            <button
              aria-label="Close"
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-3xl"
              onClick={closeModal}
            >
              ×
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="promo detail"
                className="w-auto h-auto max-w-[92vw] max-h-[86vh] object-contain rounded-md shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* default (mobile): no animation */
        .animate-scroll-up,
        .animate-scroll-down,
        .animate-scroll-left { animation: none; }
        /* enable animation only on md and above */
        @media (min-width: 768px) {
          .animate-scroll-up { animation: scrollUp 30s linear infinite; }
          .animate-scroll-down { animation: scrollDown 30s linear infinite; }
        }
  /* horizontal continuous animation removed; now discrete via React */
      /* Hide scrollbar on mobile swipe container */
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default PageCover;