import React, { useRef } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShop } from "../../context/ShopContext";
import { CATEGORY_ICONS } from "../../constants";
import { getOptimizedImageUrl } from "../../utils/imageUtils";
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, Sparkles } from "lucide-react";
import { MobileSwipeIndicator } from "../ui/MobileSwipeIndicator";

interface NeoCategoryItem {
  key: string;
  image: string;
  title: string;
  subtitle?: string;
}

const fallbackStyles = [
  { background: "from-[#e9f2e9] to-[#dceadf]", orb: "bg-[#bbd6c2]", icon: "text-[#1d5b42]", number: "text-[#2c674f]" },
  { background: "from-[#eaf0f8] to-[#dbe6f4]", orb: "bg-[#c6d6ee]", icon: "text-[#315d91]", number: "text-[#456c9c]" },
  { background: "from-[#f4eddf] to-[#f1e4ca]", orb: "bg-[#e8d3ac]", icon: "text-[#8b5f25]", number: "text-[#98703a]" },
  { background: "from-[#f3e9ef] to-[#eadce6]", orb: "bg-[#e0c8d8]", icon: "text-[#7b4968]", number: "text-[#8c5b78]" },
];

export const NeoCategoryGrid: React.FC<{
  categories: NeoCategoryItem[];
  favoriteCategory: string | null;
}> = ({ categories, favoriteCategory }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setActiveCategory } = useShop();
  const isRTL = i18n.dir() === "rtl";
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const actualDirection = isRTL ? (direction === "left" ? "right" : "left") : direction;
    scrollContainerRef.current.scrollBy({
      left: actualDirection === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  const openCategory = (key: string) => {
    setActiveCategory(key);
    navigate(`/shop?category=${encodeURIComponent(key)}`);
  };

  return (
    <section className="relative z-20 mx-auto mb-9 w-full max-w-[96rem] px-4 pt-1 sm:mb-12 sm:px-6 md:px-8">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-800 sm:text-[11px]">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <LayoutGrid className="h-3.5 w-3.5" />
            </span>
            {t("home.categories.badge", "Le catalogue Olmart")}
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.035em] text-[#15271f] sm:text-3xl md:text-[2.15rem]">
            {t("home.categories.explore_by", "Un univers pour chaque envie")}
          </h2>
          <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
            {t("home.categories.swipe_hint", "Parcourez les catégories et trouvez ce qu’il vous faut.")}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            aria-label={t("home.categories.previous", "Previous categories")}
          >
            <ChevronLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            aria-label={t("home.categories.next", "Next categories")}
          >
            <ChevronRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 pt-1 scrollbar-hide sm:gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((card, index) => {
            const isFavorite = card.key === favoriteCategory;
            const hasImage = Boolean(card.image && card.image !== "/images/placeholders/product.svg");
            const categoryName = t(card.title, card.title);
            const Icon = CATEGORY_ICONS[categoryName] || CATEGORY_ICONS[card.key] || LayoutGrid;
            const style = fallbackStyles[index % fallbackStyles.length];

            return (
              <motion.button
                key={card.key}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.035, 0.2) }}
                onClick={() => openCategory(card.key)}
                className={`group relative flex h-[228px] w-[78vw] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.35rem] border text-start shadow-[0_8px_28px_-20px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_38px_-24px_rgba(15,23,42,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 sm:h-[250px] sm:w-[286px] md:w-[310px] ${
                  hasImage ? "border-white/70 bg-slate-900 text-white" : `border-white/90 bg-gradient-to-br ${style.background} text-[#1b3228]`
                }`}
                aria-label={`${t("home.category.discover", "Découvrir")} ${categoryName}`}
              >
                {hasImage ? (
                  <img
                    src={getOptimizedImageUrl(card.image, 900)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div aria-hidden="true" className={`absolute -right-10 -top-12 h-44 w-44 rounded-full ${style.orb}`} />
                    <div aria-hidden="true" className="absolute -right-2 top-9 h-24 w-24 rounded-full border border-current/10" />
                    <Icon className={`absolute right-5 top-5 h-20 w-20 stroke-[1.15] opacity-80 transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 ${style.icon}`} />
                    <span className={`absolute right-6 top-[6.4rem] font-display text-[11px] font-semibold tracking-[0.2em] ${style.number}`}>
                      0{(index % 9) + 1}
                    </span>
                  </>
                )}

                {hasImage && <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" />}
                {!hasImage && <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/45 to-transparent" />}

                <div className="relative z-10 mt-auto flex items-end justify-between gap-3 p-5 sm:p-6">
                  <div className="min-w-0">
                    {isFavorite && (
                      <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${hasImage ? "border-amber-200/30 bg-amber-300/20 text-amber-100 backdrop-blur" : "border-amber-300/70 bg-amber-100/80 text-amber-900"}`}>
                        <Sparkles className="h-3 w-3" />
                        {t("home.category.recommended_star", "Pour vous")}
                      </span>
                    )}
                    <h3 className={`truncate font-display text-lg font-bold tracking-[-0.025em] sm:text-xl ${hasImage ? "text-white" : "text-[#172d23]"}`}>
                      {categoryName}
                    </h3>
                    {card.subtitle && (
                      <p className={`mt-1 line-clamp-1 text-xs ${hasImage ? "text-white/75" : "text-[#53675c]"}`}>
                        {t(card.subtitle, card.subtitle)}
                      </p>
                    )}
                  </div>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${hasImage ? "bg-white text-slate-900" : "bg-[#173d2f] text-white"}`}>
                    <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
        <MobileSwipeIndicator className="-mt-1" />
      </div>
    </section>
  );
};
