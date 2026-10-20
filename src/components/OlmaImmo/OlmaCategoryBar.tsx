import React from "react";
import {
  Compass,
  Palmtree,
  Building2,
  Home,
  BedDouble,
  Trees,
  Store,
  Building,
  Briefcase,
  LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { PropertyType } from "../../types/realEstate";

interface CategoryItem {
  id: PropertyType | "all";
  translationKey: string;
  defaultLabel: string;
  icon: LucideIcon;
  emoji: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  { id: "all", translationKey: "immo_cat_all", defaultLabel: "Tout voir", icon: Compass, emoji: "🌍" },
  { id: "villa", translationKey: "immo_cat_villa", defaultLabel: "Villas & Piscine", icon: Palmtree, emoji: "🏡" },
  { id: "apartment", translationKey: "immo_cat_apartment", defaultLabel: "Appartements", icon: Building2, emoji: "🏢" },
  { id: "house", translationKey: "immo_cat_house", defaultLabel: "Maisons & Riad", icon: Home, emoji: "🏠" },
  { id: "studio", translationKey: "immo_cat_studio", defaultLabel: "Studios & Lofts", icon: BedDouble, emoji: "🛏️" },
  { id: "land", translationKey: "immo_cat_land", defaultLabel: "Terrains & Nature", icon: Trees, emoji: "🌳" },
  { id: "commercial", translationKey: "immo_cat_commercial", defaultLabel: "Commerces", icon: Store, emoji: "🏬" },
  { id: "building", translationKey: "immo_cat_building", defaultLabel: "Immeubles", icon: Building, emoji: "🏙️" },
  { id: "office", translationKey: "immo_cat_office", defaultLabel: "Bureaux", icon: Briefcase, emoji: "🏢" },
];

interface OlmaCategoryBarProps {
  activeCategory: PropertyType | "all";
  onCategorySelect: (cat: PropertyType | "all") => void;
}

export const OlmaCategoryBar: React.FC<OlmaCategoryBarProps> = ({ activeCategory, onCategorySelect }) => {
  const { t } = useTranslation();

  return (
    <section
      className="w-full py-3 sm:py-5 mb-1 border-b border-[var(--olma-border-subtle)]"
      aria-labelledby="immo-category-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="hidden sm:flex items-center justify-between gap-3 mb-3 px-0.5">
          <h2
            id="immo-category-heading"
            className="text-xs sm:text-sm font-semibold tracking-wide text-[var(--olma-text-secondary)]"
          >
            Explorer par type de bien
          </h2>
          <span className="hidden sm:inline text-[11px] text-[var(--olma-text-muted)]">Choisissez une catégorie</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none touch-pan-x overscroll-x-contain scroll-smooth">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                type="button"
                onClick={() => onCategorySelect(cat.id)}
                className={`rounded-full h-10 sm:h-11 px-4 sm:px-5 border flex items-center gap-2 font-medium text-xs sm:text-sm transition-all cursor-pointer shrink-0 select-none whitespace-nowrap ${
                  isSelected
                    ? "bg-[var(--olma-brand-primary)] text-white border-[var(--olma-brand-primary)] shadow-md shadow-[var(--olma-brand-primary)]/15 font-semibold"
                    : "border-[var(--olma-border-default)] bg-white text-[var(--olma-text-secondary)] hover:border-[var(--olma-border-accent)] hover:bg-[var(--olma-brand-primary-soft)] hover:text-[var(--olma-brand-primary)] shadow-sm"
                }`}
              >
                <span aria-hidden="true" className="sm:hidden text-[17px] leading-none">
                  {cat.emoji}
                </span>
                <Icon
                  aria-hidden="true"
                  className={`hidden sm:block w-4 h-4 shrink-0 transition-colors ${
                    isSelected ? "text-[var(--olma-brand-accent)] stroke-[2.2]" : "text-[var(--olma-text-muted)]"
                  }`}
                />
                <span className="tracking-tight">{t(cat.translationKey, cat.defaultLabel)}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
