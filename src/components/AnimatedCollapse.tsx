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
  const [height, setHeight] = React.useState<string>(isOpen ? 'auto' : '0px');
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const latestIsOpen = React.useRef(isOpen);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isOpen && !latestIsOpen.current) {
      // Opening animation
      const scrollHeight = el.scrollHeight;
      
      // Start from 0
      setHeight('0px');
      setIsTransitioning(true);
      
      // Small delay to ensure render then animate to full height
      timeoutRef.current = setTimeout(() => {
        setHeight(`${scrollHeight}px`);
      }, 10);
    }
    
    if (!isOpen && latestIsOpen.current) {
      // Closing animation
      const scrollHeight = el.scrollHeight;
      
      // Set to current height first
      setHeight(`${scrollHeight}px`);
      setIsTransitioning(true);
      
      // Small delay to ensure render then animate to 0
      timeoutRef.current = setTimeout(() => {
        setHeight('0px');
      }, 10);
    }
    
    latestIsOpen.current = isOpen;
  }, [isOpen]);

  const onTransitionEnd = React.useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'height') {
      setIsTransitioning(false);
      if (isOpen) {
        setHeight('auto');
      }
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Trigger stagger for children with class 'stagger-item'
  React.useEffect(() => {
    if (isOpen) {
      const el = containerRef.current;
      if (!el) return;
      const timer = setTimeout(() => {
        const items = el.querySelectorAll<HTMLElement>('.stagger-item');
        items.forEach((item, idx) => {
          item.style.transitionDelay = `${idx * 60}ms`;
          item.classList.add('opacity-100', 'translate-y-0');
          item.classList.remove('opacity-0', 'translate-y-3');
          item.style.transition = 'opacity 500ms ease, transform 500ms ease';
        });
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      style={{ 
        height, 
        transition: isTransitioning ? `height ${duration}ms ease` : 'none'
      }}
      onTransitionEnd={onTransitionEnd}
      className={`overflow-hidden ${className}`}
      aria-hidden={!isOpen}
    >
      <div className={disableInnerFade ? '' : `transition-all duration-500 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        {children}
      </div>
    </div>
  );
}

export default AnimatedCollapse;