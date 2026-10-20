import React from "react";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Banner } from "../../domains/home/homepage.types";
import { getOptimizedImageUrl } from "../../utils/imageUtils";

interface BentoHeroSlideProps {
  banner: Banner;
  index: number;
  totalBanners: number;
  onBannerClick: (banner: Banner) => void;
  lang: string;
}

const DEFAULT_CAMPAIGN_IMAGES = {
  first: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=1600",
  second: "https://images.unsplash.com/photo-1528255671579-01b9e182ed1d?auto=format&fit=crop&q=85&w=1600",
};

export const BentoHeroSlide: React.FC<BentoHeroSlideProps> = ({
  banner,
  index,
  totalBanners,
  onBannerClick,
  lang,
}) => {
  const { t } = useTranslation();
  const isDefault1 = banner.id === "default-1" || banner.id === "1";
  const isDefault2 = banner.id === "default-2" || banner.id === "2";

  const getTranslatedValue = (b: Banner, key: "title" | "subtitle" | "button_text") => {
    if (b.translations?.[lang]?.[key]) return b.translations[lang][key];

    const flatVal = b[`${key}_${lang}` as keyof Banner];
    if (typeof flatVal === "string" && flatVal) return flatVal;

    const rawVal = (key === "title"
      ? b.title || b.name
      : key === "subtitle"
        ? b.subtitle
        : b.button_text || b.ctaText || b.buttonText) || "";
    return rawVal ? t(rawVal, rawVal) : "";
  };

  const title = getTranslatedValue(banner, "title");
  const subtitle = getTranslatedValue(banner, "subtitle");
  const buttonText = getTranslatedValue(banner, "button_text");
  const defaultImage = isDefault1 ? DEFAULT_CAMPAIGN_IMAGES.first : isDefault2 ? DEFAULT_CAMPAIGN_IMAGES.second : "";
  const rawDesktop = defaultImage || banner.desktop_image || banner.desktopImage || banner.imageUrl || "/images/placeholders/product.svg";
  const rawMobile = banner.mobile_image || banner.mobileImageUrl || rawDesktop;
  const desktopImageUrl = getOptimizedImageUrl(rawDesktop, 1600);
  const mobileImageUrl = getOptimizedImageUrl(rawMobile, 1000);

  const displayTitle = isDefault1
    ? t("home.hero.headline_1", "Grandes promos, belles découvertes")
    : isDefault2
      ? t("home.hero.headline_2", "Le meilleur du shopping algérien")
      : title || t("home.hero.default_title", "Votre prochain coup de cœur vous attend");
  const displaySubtitle = isDefault1
    ? t("home.hero.sub_1", "Les nouveautés et les bonnes affaires de vos boutiques préférées, réunies au même endroit.")
    : isDefault2
      ? t("home.hero.sub_2", "Découvrez des produits sélectionnés auprès de vendeurs algériens et faites-vous livrer partout.")
      : subtitle;

  return (
    <article
      className="relative flex h-full min-h-0 w-full flex-shrink-0 overflow-hidden bg-[#302638]"
      style={{ width: `${100 / totalBanners}%` }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${totalBanners}`}
    >
      <div className="absolute inset-0 sm:start-[42%] sm:w-[58%]">
        <picture className="absolute inset-0 block h-full w-full">
          {(banner.mobile_image || banner.mobileImageUrl) && (
            <source media="(max-width: 640px)" srcSet={mobileImageUrl} />
          )}
          <img
            loading={index === 0 ? "eager" : "lazy"}
            src={desktopImageUrl}
            alt={displayTitle}
            className="h-full w-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#302638] via-[#302638]/55 to-[#302638]/10 sm:bg-gradient-to-l sm:from-[#302638] sm:via-[#302638]/25 sm:to-transparent rtl:sm:bg-gradient-to-r" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#33283A]/10 mix-blend-multiply" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-28 hidden h-80 w-80 rounded-full border border-white/10 sm:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-14 hidden h-52 w-52 rounded-full border border-white/[0.07] sm:block" />

      <div className="relative z-10 mt-auto flex w-full flex-col items-start justify-end px-6 pb-12 text-start sm:my-auto sm:w-[61%] sm:justify-center sm:px-9 sm:py-6 md:px-12 lg:w-[59%]">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D7B76C] shadow-[0_0_12px_rgba(215,183,108,0.65)]" />
          {t("home.hero.eyebrow", "OLMART · LE SHOPPING ALGÉRIEN")}
        </span>

        <h2 className="max-w-[17ch] text-[clamp(2rem,3.6vw,3.5rem)] font-black leading-[0.98] tracking-[-0.055em] text-white [text-wrap:balance]">
          {displayTitle}
        </h2>
        {displaySubtitle && (
          <p className="mt-3 max-w-[20rem] text-sm leading-6 text-white/75 sm:mt-4 sm:text-[15px] sm:leading-6">
            {displaySubtitle}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onBannerClick(banner);
            }}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#E3CB8D] px-5 py-3 text-sm font-extrabold text-[#35283F] shadow-[0_8px_26px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-[#F2E5C2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#302638]"
          >
            <span>{isDefault1 ? t("home.hero.shop_now", "Explorer les offres") : buttonText || t("cat_explore", "Découvrir")}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#35283F]/10 transition group-hover:bg-[#35283F]/15">
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
            </span>
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75 sm:text-sm">
            <ShieldCheck className="h-4 w-4 text-[#E3CB8D]" />
            {t("home.hero.trust", "Protection de vos achats")}
          </span>
        </div>
      </div>

      <div className="absolute bottom-5 end-5 z-10 hidden items-center gap-2 rounded-full border border-white/15 bg-[#302638]/55 px-3 py-2 text-[11px] font-semibold text-white/90 backdrop-blur-md sm:inline-flex md:bottom-7 md:end-7">
        <MapPin className="h-3.5 w-3.5 text-[#E3CB8D]" />
        {t("home.hero.delivery", "Livraison dans les 69 wilayas")}
      </div>
    </article>
  );
};
