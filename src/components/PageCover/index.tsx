import React from "react";
import Navbar from "../Navbar";
import SearchIcon from "./source/search.svg";
import Promo from "./source/promo.jpg";
import MobileCover from "./source/cover mobile.png";
import DonorDarah from "./source/donor darah.png";
import Asuransi from "./source/asuransi.png";
import PMI from "./source/PMI.png";

const PageCover = () => {
  const slides = React.useMemo(
    () => [
      typeof DonorDarah === 'string' ? DonorDarah : DonorDarah.src,
      typeof Asuransi === 'string' ? Asuransi : Asuransi.src,
      typeof PMI === 'string' ? PMI : PMI.src,
    ],
    []
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIndex(null);
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  };
  const prevModal = React.useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null) return 0;
      const total = slides.length;
      return (i - 1 + total) % total;
    });
  }, [slides.length]);
  const nextModal = React.useCallback(() => {
    setSelectedIndex((i) => {
      if (i === null) return 0;
      const total = slides.length;
      return (i + 1) % total;
    });
  }, [slides.length]);

  React.useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevModal();
      if (e.key === 'ArrowRight') nextModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen, prevModal, nextModal]);

  
  // For mobile infinite loop: use triple track to avoid edge jumps entirely
  const repeatedSlides = React.useMemo(() => {
    return [...slides, ...slides, ...slides];
  }, [slides]);
  // Desktop: seamless infinite with clones [last, ...slides, first]
  const desktopSlides = React.useMemo(() => {
    const total = slides.length;
    if (total === 0) return [] as string[];
    if (total === 1) return [slides[0], slides[0], slides[0]]; // minimal structure
    return [slides[total - 1], ...slides, slides[0]];
  }, [slides]);
  const [desktopIndex, setDesktopIndex] = React.useState(1); // start at first real slide
  const [desktopTransition, setDesktopTransition] = React.useState(true);
  const goNextDesktop = React.useCallback(() => setDesktopIndex((i) => i + 1), []);
  const goPrevDesktop = React.useCallback(() => setDesktopIndex((i) => i - 1), []);
  const onDesktopTransitionEnd = React.useCallback(() => {
    const last = desktopSlides.length - 1;
    if (desktopSlides.length <= 1) return;
    if (desktopIndex === last) {
      // moved to left clone (first); jump to first real
      setDesktopTransition(false);
      setDesktopIndex(1);
      requestAnimationFrame(() => setDesktopTransition(true));
    } else if (desktopIndex === 0) {
      // moved to right clone (last); jump to last real
      setDesktopTransition(false);
      setDesktopIndex(last - 1);
      requestAnimationFrame(() => setDesktopTransition(true));
    }
  }, [desktopIndex, desktopSlides.length]);

  // mobile swipeable row state/refs
  const mobileRowRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0); // real index 0..slides.length-1
  const [rawIdx, setRawIdx] = React.useState(slides.length); // index in repeatedSlides, start from middle group
  const [snapEnabled, setSnapEnabled] = React.useState(true); // control scroll-snap to avoid visible jump
  const isRebasingRef = React.useRef(false);
  const dragStartX = React.useRef<number | null>(null); // desktop carousel drag

  // Ensure initial position is first real slide
  React.useEffect(() => {
    const el = mobileRowRef.current;
    if (!el) return;
    const to = el.children[slides.length] as HTMLElement | undefined; // first slide of middle group
    if (to) el.scrollTo({ left: to.offsetLeft, behavior: 'auto' });
    setRawIdx(slides.length);
    setActiveIdx(0);
  }, []);

  const onMobileScroll = React.useCallback(() => {
    if (isRebasingRef.current) return; // ignore scroll events during silent rebase
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
    setRawIdx(nearestIdx);
    // map to real index using modulo of slides.length
    const real = ((nearestIdx % slides.length) + slides.length) % slides.length;
    setActiveIdx(real);
  }, []);

  const scrollToIndex = React.useCallback((i: number) => {
    const el = mobileRowRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    // Update state accordingly
    setRawIdx(i);
    const real = ((i % slides.length) + slides.length) % slides.length;
    setActiveIdx(real);
  }, []);

  const scrollToRawIndex = React.useCallback((i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = mobileRowRef.current;
    if (!el) return;
    const max = repeatedSlides.length - 1;
    const target = Math.max(0, Math.min(i, max));
    const child = el.children[target] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft, behavior });
    setRawIdx(target);
    const real = ((target % slides.length) + slides.length) % slides.length;
    setActiveIdx(real);
  }, [repeatedSlides.length, slides.length]);

  // Auto-swipe every 30s on mobile row
  // Auto-advance every 30s on mobile using looped index
  React.useEffect(() => {
    const id = setInterval(() => {
      scrollToRawIndex(rawIdx - 1, 'smooth');
    }, 30000);
    return () => clearInterval(id);
  }, [rawIdx, scrollToRawIndex]);

  // When hitting clones, jump to the equivalent real slide without animation to keep loop seamless.
  // Disable scroll-snap temporarily during the silent jump to avoid any visible "jump".
  React.useEffect(() => {
    const total = slides.length;
    if (total === 0) return;
    let raf1: number | null = null;
    let raf2: number | null = null;
    if (rawIdx < total || rawIdx >= total * 2) {
      const target = rawIdx < total ? rawIdx + total : rawIdx - total;
      isRebasingRef.current = true;
      setSnapEnabled(false);
      // perform instant jump without smooth and without snap
      scrollToRawIndex(target, 'auto');
      // restore snap in the next frame to ensure no visual shift
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setSnapEnabled(true);
          isRebasingRef.current = false;
        });
      });
    }
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [rawIdx, slides.length, scrollToRawIndex]);

  // Touch controls for modal viewer (mobile swipe)
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!isModalOpen) return;
    if (touchStartX.current === null || touchEndX.current === null) return;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (dx > threshold) nextModal();
    else if (dx < -threshold) prevModal();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Pointer drag for modal (desktop support)
  const modalPointerStartX = React.useRef<number | null>(null);
  const onModalPointerDown = (e: React.PointerEvent) => {
    modalPointerStartX.current = e.clientX;
  };
  const onModalPointerUp = (e: React.PointerEvent) => {
    if (modalPointerStartX.current === null) return;
    const dx = e.clientX - modalPointerStartX.current;
    modalPointerStartX.current = null;
    const threshold = 50;
    if (dx > threshold) prevModal();
    else if (dx < -threshold) nextModal();
  };

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
                <div className="relative">
                  <div
                    className={`flex gap-4 overflow-x-auto no-scrollbar ${snapEnabled ? 'snap-x snap-mandatory' : 'snap-none'} scroll-smooth`}
                    ref={mobileRowRef}
                    onScroll={onMobileScroll}
                  >
                    {repeatedSlides.map((src, idx) => {
                      const originalIdx = ((idx % slides.length) + slides.length) % slides.length;
                      return (
                        <div
                          key={idx}
                          className="snap-start shrink-0 w-[60vw] sm:w-36 aspect-[4/3] rounded-[8px] overflow-hidden border border-zinc-300 bg-white cursor-pointer"
                          onClick={() => openModal(originalIdx)}
                        >
                          <img
                            className="w-full h-full object-cover object-center bg-white"
                            src={src}
                            alt={originalIdx === 0 ? 'donor darah' : originalIdx === 1 ? 'asuransi' : 'PMI'}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* next button removed as requested */}
                </div>
              </div>

              {/* Dots indicator */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Ke slide ${idx + 1}`}
                    onClick={() => scrollToRawIndex(idx + slides.length)}
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
                className={`absolute inset-0 flex will-change-transform ${desktopTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ width: `${desktopSlides.length * 700}px`, transform: `translateX(-${desktopIndex * 700}px)` }}
                onTransitionEnd={onDesktopTransitionEnd}
                onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); dragStartX.current = e.clientX; }}
                onPointerUp={(e) => { if (dragStartX.current !== null) { const dx = e.clientX - dragStartX.current; const threshold = 60; if (dx > threshold) goPrevDesktop(); else if (dx < -threshold) goNextDesktop(); } dragStartX.current = null; }}
              >
                {desktopSlides.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-[700px] h-[700px] flex-shrink-0 overflow-hidden p-2"
                  >
                    <img
                      className="w-full h-full object-contain object-center transform-gpu scale-100 transition-none"
                      src={src}
                      alt={(() => {
                        if (slides.length === 0) return 'slide';
                        const last = desktopSlides.length - 1;
                        const realIdx = idx === 0 ? slides.length - 1 : idx === last ? 0 : idx - 1;
                        return realIdx === 0 ? 'donor darah' : realIdx === 1 ? 'asuransi' : 'PMI';
                      })()}
                    />
                  </div>
                ))}
              </div>
              <button
                aria-label="Sebelumnya"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white grid place-items-center select-none"
                onClick={goPrevDesktop}
                type="button"
              >
                ‹
              </button>
              <button
                aria-label="Berikutnya"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white grid place-items-center select-none"
                onClick={goNextDesktop}
                type="button"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.currentTarget === e.target) closeModal();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-[92vw] max-h-[86vh] w-full h-full flex items-center justify-center">
            <button
              aria-label="Close"
              className="absolute top-3 right-3 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>

            {/* Prev/Next overlay buttons in front of image */}
            <button
              aria-label="Sebelumnya"
              onClick={prevModal}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 md:p-4"
            >
              ‹
            </button>
            <button
              aria-label="Berikutnya"
              onClick={nextModal}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 md:p-4"
            >
              ›
            </button>

            <div
              className="relative w-[92vw] h-[70vh] md:w-[80vw] md:h-[80vh]"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onPointerDown={onModalPointerDown}
              onPointerUp={onModalPointerUp}
            >
              <img
                src={slides[selectedIndex]}
                alt={selectedIndex === 0 ? 'donor darah' : selectedIndex === 1 ? 'asuransi' : 'PMI'}
                className="w-auto h-auto max-w-[92vw] max-h-[86vh] object-contain rounded-md shadow-2xl"
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ke gambar ${i + 1}`}
                  onClick={() => setSelectedIndex(i)}
                  className={`${i === selectedIndex ? 'w-3.5' : 'w-2.5'} h-2.5 rounded-full ${i === selectedIndex ? 'bg-orange-500' : 'bg-white/70'}`}
                />
              ))}
            </div>
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