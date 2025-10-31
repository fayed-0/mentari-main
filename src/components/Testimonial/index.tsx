import React, { useEffect, useRef, useState } from "react";
import Img1 from "./source/img1.png";
import Img2 from "./source/img2.png";
import LArrow from "./source/L_arrow.svg";
import RArrow from "./source/r_arrow.svg";
import Star from "./source/si_star.svg";
import Arrow from "./source/arrow.svg";

/**
 * Testimonial carousel with:
 * - smooth slide (translateX)
 * - infinite loop using clones (head & tail)
 * - dots + arrow controls
 * - swipe support
 *
 * Transition duration = 400ms (used consistently)
 */

const TRANSITION_MS = 400;

const srcOf = (img: any): string => (typeof img === "string" ? img : img?.src ?? "");

type TestimonialItem = {
  id: number;
  name: string;
  message: string;
  img: any;
  rating: number;
};

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Lorem Ipsum",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: Img1,
    rating: 5,
  },
  {
    id: 2,
    name: "Lorem Ipsum",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: Img2,
    rating: 5,
  },
  // you can add more testimonials here
];

export default function Testimonial(): JSX.Element {
  const slides = [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]];
  const [index, setIndex] = useState<number>(1); // current translated slide index (in slides array)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true); // whether transform has transition
  const containerRef = useRef<HTMLDivElement | null>(null);

  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (index === slides.length - 1) {
      const t = setTimeout(() => {
        if (!containerRef.current) return;
        setIsTransitioning(false); 
        setIndex(1);
        setTimeout(() => setIsTransitioning(true), 20);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }

    if (index === 0) {
      const t = setTimeout(() => {
        if (!containerRef.current) return;
        setIsTransitioning(false);
        setIndex(slides.length - 2);
        setTimeout(() => setIsTransitioning(true), 20);
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }

  }, [index, slides.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startX.current === null) return;
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX.current;
      if (delta < -50) {
        setIndex((prev) => prev + 1);
      } else if (delta > 50) {
        setIndex((prev) => prev - 1);
      }
      startX.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);
  const goTo = (i: number) => {

    setIndex(i + 1);
    setIsTransitioning(true);
  };

  const transformStyle = { transform: `translateX(-${index * 100}%)` };
  const transitionStyle = isTransitioning ? `transform ${TRANSITION_MS}ms cubic-bezier(.22,.9,.31,1)` : "none";

  return (
    <div className="w-full bg-white overflow-hidden py-12">
      <div className="max-w-[1272px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="inline-flex flex-col items-start gap-1">
            <div className="text-black text-xs sm:text-sm font-semibold tracking-wide">TESTIMONIAL</div>
            <div className="h-0.5 bg-orange-500 w-full" />
          </div>
          <div className="block md:hidden ml-2">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 bg-white border border-zinc-300 rounded-md px-3 py-1.5 shadow-sm hover:shadow md:px-4 md:py-2">
              <span>View More</span>
              <img src={srcOf(Arrow)} alt="arrow" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <h2 className="text-xl sm:text-[16px] md:text-[32px] font-semibold text-black max-w-4xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </h2>
          <div className="hidden md:inline-flex ml-6 mt-2 md:mt-0">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 bg-white border border-zinc-300 rounded-md px-3 py-1.5 shadow-sm hover:shadow md:px-4 md:py-2">
              <span>View More</span>
              <img src={srcOf(Arrow)} alt="arrow" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MOBILE / TABLET SLIDER */}
        <div className="block md:hidden select-none">
          <div className="overflow-hidden w-full">
            <div
              ref={containerRef}
              className="flex"
              style={{ ...transformStyle, transition: transitionStyle }}
            >
              {slides.map((s, i) => (
                <div key={i} className="min-w-full px-1">
                  <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 flex flex-col gap-6 max-w-[600px] mx-auto">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
                        <img src={srcOf(s.img)} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black">{s.name}</div>
                        <div className="flex gap-1">
                          {Array.from({ length: s.rating }).map((_, x) => (
                            <img key={x} src={srcOf(Star)} className="w-4 h-4" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">{s.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {testimonials.map((_, i) => {
              const logicalIndex = (index - 1 + testimonials.length) % testimonials.length;
              const active = logicalIndex === i;

              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`go to ${i}`}
                  className={`rounded-full transition-all duration-200 ${
                    active 
                      ? "w-3 h-3 bg-orange-500"
                      : "w-2 h-2 bg-zinc-300"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* DESKTOP GRID (kept simple) */}
        <div className="hidden md:grid grid-cols-2 gap-6 mt-10">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 flex gap-6 hover:-translate-y-[3px] hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0">
                <img src={srcOf(t.img)} alt={t.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col">
                <div className="text-lg font-semibold text-black mb-1">{t.name}</div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, x) => (
                    <img key={x} src={srcOf(Star)} className="w-5 h-5" />
                  ))}
                </div>
                <p className="text-neutral-600 text-base leading-relaxed">{t.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
