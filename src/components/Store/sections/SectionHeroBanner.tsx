import React from "react";
import { CustomPageSection, HeroBannerSettings, CustomPageTheme } from "../../../domains/seller/customPage.types";
import { safeNavigationHref } from "./safeNavigationHref";

interface SectionHeroBannerProps {
  section: CustomPageSection<"hero_banner">;
  theme: CustomPageTheme;
  isEditable?: boolean;
  isSelected?: boolean;
  previewViewport?: "mobile" | "tablet" | "desktop";
  onSelect?: () => void;
}

export const SectionHeroBanner: React.FC<SectionHeroBannerProps> = ({
  section,
  theme,
  isEditable,
  isSelected,
  previewViewport,
  onSelect,
}) => {
  const settings: HeroBannerSettings = section.settings;
  const previewImageUrl = isEditable && previewViewport === "mobile"
    ? settings.mobileImageUrl || settings.imageUrl
    : settings.imageUrl;
  const styles = section.styles;
  const paddingY = typeof styles.paddingY === "number"
    ? styles.paddingY
    : ({ sm: 16, md: 32, lg: 48, xl: 64 }[styles.paddingY || "md"]);
  const paddingX = styles.paddingX ?? 24;

  const bgStyle: React.CSSProperties = {
    backgroundColor: styles.backgroundColor || theme.primaryColor || "#5B3765",
    color: styles.textColor || "#FFFFFF",
  };

  const overlayOpacity = typeof settings.overlayOpacity === "number" ? settings.overlayOpacity / 100 : 0.3;

  return (
    <div
      onClick={isEditable ? onSelect : undefined}
      style={bgStyle}
      className={`relative overflow-hidden transition-all cursor-pointer ${
        styles.borderRadius === "none"
          ? "rounded-none"
          : styles.borderRadius === "lg"
          ? "rounded-3xl"
          : styles.borderRadius === "md"
          ? "rounded-2xl"
          : styles.borderRadius === "sm"
          ? "rounded-lg"
          : ""
      } ${
        isEditable && isSelected
          ? "ring-4 ring-emerald-500 shadow-2xl z-10"
          : isEditable
          ? "hover:ring-2 hover:ring-[#F97316]"
          : ""
      }`}
    >
      {previewImageUrl && (
        <div className="absolute inset-0 z-0">
          <picture className="block h-full w-full">
            {!isEditable && settings.mobileImageUrl && <source media="(max-width: 767px)" srcSet={settings.mobileImageUrl} />}
            <img src={previewImageUrl} alt={settings.title} className="h-full w-full object-cover" />
          </picture>
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </div>
      )}

      <div
        className={`relative z-10 mx-auto ${
          styles.containerWidth === "contained" ? "max-w-6xl" : "w-full"
        } ${
          settings.textAlignment === "left"
            ? "text-left"
            : settings.textAlignment === "right"
            ? "text-right"
            : "text-center"
        }`}
        style={{ paddingBlock: `${paddingY}px`, paddingInline: `${paddingX}px` }}
      >
        {settings.badgeText && (
          <span
            className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-sm"
            style={{
              backgroundColor: theme.accentBadgeColor || theme.accentColor || "#059669",
              color: "#FFFFFF",
            }}
          >
            {settings.badgeText}
          </span>
        )}

        <h1 className="mb-4 text-2xl font-extrabold tracking-tight drop-shadow-md md:text-5xl" style={{ fontSize: `clamp(1.5rem, 4vw, ${theme.titleFontSizePx ?? 48}px)` }}>
          {settings.title}
        </h1>

        {settings.subtitle && (
          <p className="mx-auto mb-8 max-w-2xl text-base font-medium leading-relaxed opacity-90 md:text-xl" style={{ fontSize: `${theme.bodyFontSizePx ?? 18}px` }}>
            {settings.subtitle}
          </p>
        )}

        {settings.ctaText && (
          <a
            href={safeNavigationHref(settings.ctaLink) || "#"}
            onClick={(e) => isEditable && e.preventDefault()}
            className="inline-flex items-center px-6 py-3.5 rounded-xl text-sm md:text-base font-bold transition-transform active:scale-95 shadow-lg"
            style={{
              backgroundColor: theme.primaryColor || "#F97316",
              color: "#FFFFFF",
              borderRadius: `${theme.borderRadiusPx ?? 12}px`,
            }}
          >
            {settings.ctaText}
          </a>
        )}
      </div>
    </div>
  );
};
