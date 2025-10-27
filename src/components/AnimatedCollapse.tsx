import React from 'react';

export function AnimatedCollapse({
  isOpen,
  children,
  duration = 500,
  disableInnerFade = false,
  className = '',
}: {
  isOpen: boolean;
  children: React.ReactNode;
  duration?: number;
  disableInnerFade?: boolean;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = React.useState<number>(0);

  // Update max-height tiap buka/tutup
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Set max-height = tinggi konten
    if (isOpen) {
      setMaxHeight(el.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isOpen]);

  // Jika isi di dalam berubah saat sedang open → update otomatis
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;

    const resizeObserver = new ResizeObserver(() => {
      setMaxHeight(el.scrollHeight);
    });
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [isOpen]);

  // Animasi stagger untuk item di dalam
  React.useEffect(() => {
    if (isOpen) {
      const el = containerRef.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>('.stagger-item');
      items.forEach((item, idx) => {
        item.style.transition = 'opacity 500ms ease, transform 500ms ease';
        item.style.transitionDelay = `${idx * 60}ms`;
        item.classList.add('opacity-100', 'translate-y-0');
        item.classList.remove('opacity-0', 'translate-y-3');
      });
    } else {
      const el = containerRef.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>('.stagger-item');
      items.forEach((item) => {
        item.classList.remove('opacity-100', 'translate-y-0');
        item.classList.add('opacity-0', 'translate-y-3');
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: `${maxHeight}px`,
        transition: `max-height ${duration}ms ease`,
      }}
      className={`overflow-hidden ${className}`}
      aria-hidden={!isOpen}
    >
      <div
        className={
          disableInnerFade
            ? ''
            : `transition-all duration-500 ease-out ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`
        }
      >
        {children}
      </div>
    </div>
  );
}

export default AnimatedCollapse;
