import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Banner } from "../../domains/home/homepage.types";
import { BentoHeroSlide } from "./BentoHeroSlide";

export const BentoHero: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language || "fr";
  const isRTL = lang === "ar";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeBanners = (banners || []).filter(
    (b) => b.is_active !== false && b.isActive !== false
  );

  // Auto-advance banner every 6.5s
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const width = containerRef.current?.offsetWidth || window.innerWidth;
    const threshold = width * 0.15;

    if (dragOffset > threshold) {
      if (isRTL) handleNext();
      else handlePrev();
    } else if (dragOffset < -threshold) {
      if (isRTL) handlePrev();
      else handleNext();
    }
    setTouchStartX(null);
    setDragOffset(0);
  };

  const handleBannerClick = (b: Banner) => {
    if (b.ctaLink) {
      navigate(b.ctaLink);
    } else {
      navigate("/shop");
    }
  };

  const width = containerRef.current?.offsetWidth || window.innerWidth;
  const dragPercent = width > 0 ? (dragOffset / width) * 100 : 0;
  const basePercent = isRTL ? currentIndex * 100 : -currentIndex * 100;
  const totalPercent = (basePercent + dragPercent) / activeBanners.length;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="group relative h-[460px] w-full select-none touch-pan-y overflow-hidden rounded-[1.5rem] border border-white/80 bg-[#302638] shadow-[0_20px_55px_-35px_rgba(49,38,56,0.42)] sm:h-[430px] lg:h-[390px] 2xl:h-[410px]"
    >
      {/* Sliding Strip */}
      <motion.div
        animate={{ x: `${totalPercent}%` }}
        transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.8 }}
        className="absolute inset-0 h-full flex flex-row"
        style={{ width: `${activeBanners.length * 100}%` }}
      >
        {activeBanners.map((banner, index) => (
          <BentoHeroSlide
            key={banner.id || index}
            banner={banner}
            index={index}
            totalBanners={activeBanners.length}
            onBannerClick={handleBannerClick}
            lang={lang}
          />
        ))}
      </motion.div>

      {/* Nav Chevrons */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={isRTL ? handleNext : handlePrev}
            aria-label="Previous Slide"
            className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-900 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62] sm:opacity-0 sm:group-hover:opacity-100 ${
              isRTL ? "right-4 sm:right-6" : "left-4 sm:left-6"
            }`}
          >
            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={isRTL ? handlePrev : handleNext}
            aria-label="Next Slide"
            className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-900 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62] sm:opacity-0 sm:group-hover:opacity-100 ${
              isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6"
            }`}
          >
            {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </>
      )}

      {/* Slide Indicators with Active Progress Pill */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-2 shadow-lg backdrop-blur-md sm:bottom-6">
          {activeBanners.map((_, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer border-none p-0 ${
                  isActive
                    ? "w-7 h-2 bg-amber-400 shadow-xs"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
