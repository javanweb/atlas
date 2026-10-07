import React, { useState, useEffect, useRef } from 'react';
import { clientService, ClientLogo } from '../../services/clientService';

// Helper to ensure any legacy SVG logo with dark rect background is rendered transparently on white
const cleanTransparentLogo = (logoUrl: string): string => {
  if (!logoUrl.startsWith('data:image/svg+xml')) return logoUrl;
  return logoUrl
    .replace(/<rect[^>]*fill="%230F172A"[^>]*\/>/gi, '')
    .replace(/fill="%23FFFFFF"/gi, 'fill="%231E293B"');
};

export const OurClientsSection: React.FC = () => {
  const [clients, setClients] = useState<ClientLogo[]>(() => clientService.getActiveClients());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [disableTransition, setDisableTransition] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const prevScrollY = useRef(0);
  const crossedTrigger1 = useRef(false);
  const crossedTrigger2 = useRef(false);
  const isShiftAnimating = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(3);
      else if (width < 1024) setItemsPerView(4);
      else setItemsPerView(6);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateClients = () => {
      setClients(clientService.getActiveClients());
    };
    const unsubscribe = clientService.subscribe(updateClients);
    return () => unsubscribe();
  }, []);

  // Trigger point scroll detection:
  // When scrolling down past the trigger point -> Shift 2 logos forward in normal direction
  // When scrolling up and crossing back over that same point -> Shift 2 logos in reverse/opposite direction
  useEffect(() => {
    prevScrollY.current = window.scrollY;

    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = prevScrollY.current;

      // Define primary checkpoint (e.g. 160px from top / around the hero bottom)
      const triggerPoint1 = 160;
      // Secondary checkpoint when scrolling deeper (e.g. 480px)
      const triggerPoint2 = 480;

      // --- CHECKPOINT 1: Crossing moving DOWN ---
      if (previousScrollY < triggerPoint1 && currentScrollY >= triggerPoint1) {
        if (!crossedTrigger1.current && !isShiftAnimating.current) {
          crossedTrigger1.current = true;
          isShiftAnimating.current = true;
          // 2 logos shift forward
          setCurrentIndex((prev) => prev + 2);
          setTimeout(() => {
            isShiftAnimating.current = false;
          }, 600);
        }
      }
      // --- CHECKPOINT 1: Crossing moving UP ---
      else if (previousScrollY > triggerPoint1 && currentScrollY <= triggerPoint1) {
        if (crossedTrigger1.current && !isShiftAnimating.current) {
          crossedTrigger1.current = false;
          isShiftAnimating.current = true;
          // 2 logos shift in opposite / reverse direction
          setCurrentIndex((prev) => (prev >= 2 ? prev - 2 : clients.length > 0 ? clients.length * 2 - 2 : 0));
          setTimeout(() => {
            isShiftAnimating.current = false;
          }, 600);
        }
      }

      // --- CHECKPOINT 2: Crossing moving DOWN ---
      if (previousScrollY < triggerPoint2 && currentScrollY >= triggerPoint2) {
        if (!crossedTrigger2.current && !isShiftAnimating.current) {
          crossedTrigger2.current = true;
          isShiftAnimating.current = true;
          setCurrentIndex((prev) => prev + 2);
          setTimeout(() => {
            isShiftAnimating.current = false;
          }, 600);
        }
      }
      // --- CHECKPOINT 2: Crossing moving UP ---
      else if (previousScrollY > triggerPoint2 && currentScrollY <= triggerPoint2) {
        if (crossedTrigger2.current && !isShiftAnimating.current) {
          crossedTrigger2.current = false;
          isShiftAnimating.current = true;
          setCurrentIndex((prev) => (prev >= 2 ? prev - 2 : clients.length > 0 ? clients.length * 2 - 2 : 0));
          setTimeout(() => {
            isShiftAnimating.current = false;
          }, 600);
        }
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [clients.length]);

  // Autonomous slow gentle movement when stationary
  useEffect(() => {
    if (clients.length <= 1) return;

    const interval = setInterval(() => {
      if (!isShiftAnimating.current) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 3600);

    return () => clearInterval(interval);
  }, [clients.length]);

  // Seamless infinite loop wrapping
  useEffect(() => {
    if (clients.length === 0) return;
    if (currentIndex >= clients.length * 2) {
      const timeout = setTimeout(() => {
        setDisableTransition(true);
        setCurrentIndex(currentIndex % clients.length);
        setTimeout(() => {
          setDisableTransition(false);
        }, 40);
      }, 650);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, clients.length]);

  if (clients.length === 0) return null;

  const extendedClients = [...clients, ...clients, ...clients, ...clients, ...clients];

  return (
    <section
      ref={sectionRef}
      id="our-clients-section"
      className="w-full bg-white text-slate-900 pt-6 sm:pt-8 pb-5 sm:pb-7 select-none"
      dir="rtl"
    >
      {/* Top Centered Heading & Subtitle */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
          کسب‌وکارهایی که به صنعت‌پیش اعتماد کرده‌اند
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
          بیش از ۴۵۰ کارخانه و مجتمع صنعتی بزرگ کشور تجربه تأمین قطعات خط تولید خود را با صنعت‌پیش بهبود بخشیده‌اند
        </p>
      </div>

      {/* Subtle Full-Width Horizontal Divider Line */}
      <div className="w-full border-t border-slate-100 my-4 sm:my-6" />

      {/* Moving Logos Viewport */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 overflow-hidden bg-white">
        {/* Soft White Edge Fade Masks (Left & Right) */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/85 to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/85 to-transparent z-10 pointer-events-none" />

        <div
          dir="ltr"
          className={`flex items-center ${
            disableTransition
              ? ''
              : 'transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]'
          }`}
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {extendedClients.map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className="w-1/3 sm:w-1/4 lg:w-1/6 shrink-0 px-3 sm:px-5 flex items-center justify-center"
            >
              <img
                src={cleanTransparentLogo(client.logo)}
                alt={client.name}
                title={client.name}
                className="h-12 sm:h-16 w-auto max-w-[165px] object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


