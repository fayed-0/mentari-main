import React from "react";
import Navbar from "../Navbar";
import SearchIcon from "./source/search.svg";
import DonorDarah from "./source/donor darah.png";
import Asuransi from "./source/asuransi.png";
import PMI from "./source/PMI.png";

const PageCover = () => {
  const slides = React.useMemo(
    () => [
      {
        src: typeof DonorDarah === 'string' ? DonorDarah : DonorDarah.src,
        title: "Donor Darah",
        description: "Berkontribusi untuk sesama dengan mendonorkan darah"
      },
      {
        src: typeof Asuransi === 'string' ? Asuransi : Asuransi.src,
        title: "Asuransi Kesehatan",
        description: "Perlindungan lengkap untuk kesehatan Anda dan keluarga"
      },
      {
        src: typeof PMI === 'string' ? PMI : PMI.src,
        title: "PMI",
        description: "Palang Merah Indonesia - Melayani dengan hati"
      }
    ],
    []
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // durasi slide (10 detik)
    return () => clearInterval(interval);
  }, [slides.length]);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIndex(null);
    document.body.style.overflow = '';
  };

  const nextModal = () => {
    setSelectedIndex((i) => (i === null ? 0 : (i + 1) % slides.length));
  };

  const prevModal = () => {
    setSelectedIndex((i) => (i === null ? 0 : (i - 1 + slides.length) % slides.length));
  };

  // Keyboard navigation for modal
  React.useEffect(() => {
    if (!isModalOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevModal();
      if (e.key === 'ArrowRight') nextModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
  <section className="relative w-full min-h-0 md:min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <Navbar />

  {/* Main Content */}
<div className="relative z-10 container mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-16">
          
          {/* Left Content - Text & Search */}
          <div className="hidden md:block flex-1 w-full max-w-2xl">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 sm:gap-4 md:gap-5 bg-white/80 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full shadow-lg border border-orange-100">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-[12px] sm:text-base md:text-sm font-medium text-orange-600">
                  Layanan Kesehatan Terpercaya
                </span>
              </div>

              {/* Title - Centered for desktop and tablet, left for mobile */}
              <div className="text-left  w-full">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Kesehatan Anda
                  <span className="block text-orange-600 mt-2">Prioritas Utama Kami</span>
                </h1>
              </div>

              {/* Description - Hidden on mobile */}
              <p className="hidden md:block text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl ">
                Layanan kesehatan terpadu dengan dokter profesional & fasilitas modern 
                untuk memberikan yang terbaik bagi Anda dan keluarga
              </p>

              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:block max-w-xl">
                <form 
                  className="flex items-center bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all duration-300"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="pl-4 pr-2 text-gray-400">
                    <img src={SearchIcon.src} alt="Search" className="w-5 h-5" />
                  </div>
                  
                  <input
                    type="search"
                    placeholder="Cari layanan kesehatan..."
                    className="flex-1 bg-transparent border-none outline-none px-3 py-4 text-gray-700 placeholder-gray-500 text-base"
                    aria-label="Cari layanan kesehatan"
                  />
                  
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-4 hover:bg-orange-600 transition-all duration-300 font-medium"
                  >
                    Cari
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Content - Image Carousel */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl">
            <div className="relative">
              
              {/* Main Carousel - Rounded 10px */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl bg-white">
                <div className="aspect-square md:aspect-[4/3] lg:aspect-[5/4] xl:aspect-[6/5] relative">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
                  aria-label="Slide sebelumnya"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
                  aria-label="Slide berikutnya"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'w-3 h-3 bg-orange-500'   // ukuran aktif
                          : 'w-2 h-2 bg-white/70 hover:bg-white' // ukuran non aktif
                      }`}
                      aria-label={`Pergi ke slide ${index + 1}`}
                    />
                  ))}
                </div>

              </div>

              {/* Thumbnail Gallery - Rounded 10px */}
              <div className="flex gap-4 mt-4 md:mt-6 justify-center">
                {slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`flex-1 max-w-32 lg:max-w-40 xl:max-w-48 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      index === currentSlide 
                        ? 'border-orange-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={slide.src}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Image View - Rounded 10px */}
      {isModalOpen && selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors duration-200 z-10"
              aria-label="Tutup modal"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={prevModal}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              aria-label="Gambar sebelumnya"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextModal}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              aria-label="Gambar berikutnya"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image - Rounded 10px */}
            <div className="relative rounded-lg overflow-hidden bg-white">
              <img
                src={slides[selectedIndex].src}
                alt={slides[selectedIndex].title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Thumbnails - Rounded 10px */}
            <div className="flex gap-3 justify-center mt-4">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedIndex 
                      ? 'border-orange-500 scale-110' 
                      : 'border-gray-400 hover:border-orange-300'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default PageCover;