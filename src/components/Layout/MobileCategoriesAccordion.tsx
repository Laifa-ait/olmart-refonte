import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, Box, LayoutGrid } from "lucide-react";
import { CATEGORY_ICONS } from "../../constants";
import { getCategoryTranslation } from "../../utils/translations";
import { CategoryIcons8Logo } from "../common/CategoryIcons8Logo";

interface CategoryLink {
  name: string;
}

interface CategorySection {
  name: string;
  links?: CategoryLink[];
}

interface CategoryItem {
  id: string;
  name: string;
  sections?: CategorySection[];
}

interface MobileCategoriesAccordionProps {
  categories: CategoryItem[];
  onNavigate: (path: string) => void;
  onClose: () => void;
}

export const MobileCategoriesAccordion: React.FC<MobileCategoriesAccordionProps> = ({
  categories,
  onNavigate,
  onClose,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  const toggleSub = (subKey: string) => {
    setExpandedSub((prev) => (prev === subKey ? null : subKey));
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-categories-list"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-zinc-50 rtl:text-right"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
          <LayoutGrid className="h-4.5 w-4.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-zinc-900">
            {t("nav.sections.categories")}
          </span>
        </span>
        <span className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-500">
          {categories.length}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="mobile-menu-categories-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-100"
          >
            <div className="max-h-[44vh] overflow-y-auto p-2.5">
              <div className="overflow-hidden rounded-xl border border-zinc-100 bg-white divide-y divide-zinc-100">
        {categories.map((cat, i) => {
          const IconComponent = CATEGORY_ICONS[cat.name] || Box;
          const isExpanded = expandedCat === cat.id;

          return (
            <div key={cat.id || i} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-transparent border-none cursor-pointer hover:bg-zinc-50 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-[#F5F2F5] group-hover:bg-white transition-colors flex items-center justify-center">
                    <CategoryIcons8Logo
                      categoryName={cat.name}
                      categoryId={cat.id}
                      className="w-5 h-5 object-contain"
                      fallbackIcon={IconComponent}
                    />
                  </div>
                  <span className="font-semibold text-sm text-[#3D3045] group-hover:text-[#5B4865] transition-colors">
                    {getCategoryTranslation(cat.name, t)}
                  </span>
                </div>
                {cat.sections && cat.sections.length > 0 && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 text-[#8D8193] ${
                      isExpanded ? "rotate-90 text-[#B79A62]" : ""
                    }`}
                  />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && cat.sections && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-zinc-50/80 border-t border-zinc-100"
                  >
                    <div className="px-3 py-2 space-y-1">
                      {cat.sections.map((sec, j) => {
                        const subKey = `${cat.id}-${sec.name}`;
                        const isSubExpanded = expandedSub === subKey;
                        const hasLinks = Array.isArray(sec.links) && sec.links.length > 0;

                        return (
                          <div key={j} className="rounded-xl overflow-hidden bg-white/60">
                            <div className="flex items-center justify-between p-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onNavigate(
                                    `/shop?category=${encodeURIComponent(
                                      cat.name
                                    )}&subcategory=${encodeURIComponent(sec.name)}`
                                  );
                                  onClose();
                                }}
                                className="flex-1 text-start text-xs text-[#3D3045] font-semibold border-none bg-transparent cursor-pointer hover:text-[#5B4865] transition-colors p-1"
                              >
                                {getCategoryTranslation(sec.name, t)}
                              </button>
                              {hasLinks && (
                                <button
                                  type="button"
                                  onClick={() => toggleSub(subKey)}
                                  className="p-1 text-[#8D8193] hover:text-[#5B4865] border-none bg-transparent cursor-pointer"
                                  aria-label={`Ouvrir les rayons de ${sec.name}`}
                                >
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                      isSubExpanded ? "rotate-90 text-[#B79A62]" : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {hasLinks && isSubExpanded && (
                              <div className="px-2.5 pb-2 pt-0.5 flex flex-wrap gap-1 border-t border-[#EEE8EF]">
                                {sec.links!.map((link, k) => (
                                  <button
                                    key={k}
                                    type="button"
                                    onClick={() => {
                                      onNavigate(
                                        `/shop?category=${encodeURIComponent(
                                          cat.name
                                        )}&subcategory=${encodeURIComponent(
                                          sec.name
                                        )}&subsubcategory=${encodeURIComponent(link.name)}`
                                      );
                                      onClose();
                                    }}
                                    className="text-[10px] px-2 py-1 rounded-md bg-[#F5F2F5] hover:bg-[#ECE6EF] text-[#51445A] font-medium transition-colors border border-[#E7DFE9]"
                                  >
                                    {getCategoryTranslation(link.name, t)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
              );
            })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
