import React, { useState, useEffect } from "react";
import { CustomPageSection, PromoCarouselSettings, CustomPageTheme } from "../../../domains/seller/customPage.types";
import { safeNavigationHref } from "./safeNavigationHref";

interface SectionPromoCarouselProps {
  section: CustomPageSection<"promo_carousel">;
  theme: CustomPageTheme;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const SectionPromoCarousel: React.FC<SectionPromoCarouselProps> = ({
  section,
  theme,
  isEditable,
  isSelected,
  onSelect,
}) => {
  const settings: PromoCarouselSettings = section.settings;
  const styles = section.styles || {};
  const slides = settings.slides || [];
  const paddingY = typeof styles.paddingY === "number"
    ? styles.paddingY
    : ({ sm: 16, md: 32, lg: 48, xl: 64 }[styles.paddingY || "md"]);
  const paddingX = styles.paddingX ?? 16;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!settings.autoplay || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, (settings.intervalSec || 5) * 1000);
    return () => clearInterval(interval);
  }, [slides.length, settings.autoplay, settings.intervalSec]);

  if (slides.length === 0) {
    return (
      <div
        onClick={isEditable ? onSelect : undefined}
        className="p-8 text-center bg-gray-100 text-gray-500"
        style={{ paddingBlock: `${paddingY}px`, paddingInline: `${paddingX}px`, borderRadius: styles.borderRadius ? `${({ none: 0, sm: 8, md: 16, lg: 24 })[styles.borderRadius]}px` : undefined }}
      >
        Carrousel promo vide (veuillez ajouter au moins une diapositive).
      </div>
    );
  }

  const currentSlide = slides[currentIndex] || slides[0];
  const slideHref = safeNavigationHref(currentSlide.link);
  const slideContent = (
    <>
      <img src={currentSlide.imageUrl} alt={currentSlide.title || "Offre de la boutique"} className="h-full w-full object-cover" />
      {currentSlide.title && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-lg font-bold text-white md:text-2xl">
          {currentSlide.title}
        </div>
      )}
    </>
  );

  return (
    <div
      onClick={isEditable ? onSelect : undefined}
      className={`relative overflow-hidden shadow-md transition-all cursor-pointer ${isEditable && isSelected ? "ring-2 ring-inset ring-[#F97316]" : ""}`}
      style={{ paddingBlock: `${paddingY}px`, paddingInline: `${paddingX}px`, backgroundColor: styles.backgroundColor || "transparent", borderRadius: styles.borderRadius ? `${({ none: 0, sm: 8, md: 16, lg: 24 })[styles.borderRadius]}px` : `${theme.borderRadiusPx ?? 16}px` }}
    >
      <div className="relative h-48 md:h-80 w-full bg-gray-900">
        {slideHref ? <a href={slideHref} onClick={(event) => { if (isEditable) event.preventDefault(); }} className="relative block h-full w-full">{slideContent}</a> : <div className="relative h-full w-full">{slideContent}</div>}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 right-4 flex space-x-1.5 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex ? "w-6 bg-white" : "bg-white/50"
              }`}
              style={{ backgroundColor: idx === currentIndex ? theme.primaryColor : undefined }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
