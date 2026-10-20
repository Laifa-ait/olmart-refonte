import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useMegaMenu, FeaturedProduct } from "../context/MegaMenuContext";
import { useShop } from "../context/ShopContext";
import { useTranslation } from "react-i18next";
import { CATEGORY_ICONS } from "../constants";
import { Box } from "lucide-react";
import { Product } from "../domains/product/product.types";
import { MegaMenuDropdown } from "./MegaMenuDropdown";
import { CategoryIcons8Logo } from "./common/CategoryIcons8Logo";

export interface MegaMenuProps {
  isVisible?: boolean;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isVisible = true }) => {
  const { categoriesData } = useMegaMenu();
  const { fetchProductsByIds } = useShop();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSectionName, setActiveSectionName] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<FeaturedProduct | null>(null);
  const [productCache, setProductCache] = useState<Record<string, Product>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  // Close active category when menu is hidden on scroll
  useEffect(() => {
    if (!isVisible) setActiveCategory(null);
  }, [isVisible]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCategoryData = categoriesData.find((c) => c.id === activeCategory);

  // Pre-fetch related products
  useEffect(() => {
    if (!activeCategoryData) return;
    const idsToFetch = new Set<string>();
    if (activeCategoryData.featuredProduct?.productId) {
      idsToFetch.add(activeCategoryData.featuredProduct.productId);
    }
    activeCategoryData.sections.forEach((sec) => {
      sec.links.forEach((link: { featuredProduct?: { productId?: string } }) => {
        if (link.featuredProduct?.productId) {
          idsToFetch.add(link.featuredProduct.productId);
        }
      });
    });

    const neededIds = Array.from(idsToFetch).filter((id) => !productCache[id]);
    if (neededIds.length > 0) {
      fetchProductsByIds(neededIds).then((prods) => {
        setProductCache((prev) => {
          const next = { ...prev };
          prods.forEach((p) => {
            next[p.id] = p;
          });
          return next;
        });
      });
    }
  }, [activeCategoryData, fetchProductsByIds, productCache]);

  useEffect(() => {
    if (activeCategoryData && activeCategoryData.sections.length > 0) {
      setActiveSectionName(activeCategoryData.sections[0].name);
    } else {
      setActiveSectionName(null);
    }
    setHoveredProduct(null);
  }, [activeCategory, activeCategoryData]);

  const toggleCategory = (id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div
      ref={menuRef}
      initial={false}
      animate={{
        height: isVisible ? "auto" : 0,
        opacity: isVisible ? 1 : 0,
        borderTopWidth: isVisible ? "1px" : "0px",
        borderBottomWidth: isVisible ? "1px" : "0px",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
        className={`relative w-full z-40 bg-[#FBFAF8]/95 backdrop-blur-md border-b border-[#E8E2E8] text-slate-800 font-sans block shadow-2xs ${
        activeCategory ? "overflow-visible" : "overflow-hidden"
      }`}
    >
      {/* Category Pills Bar */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8">
        <ul className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-2 sm:py-2.5">
          {categoriesData.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.name] || Box;
            const isActive = activeCategory === category.id;
            const displayLabel = category.name === "Électroménager" ? "Home Appliances" : (t(category.name) || category.name);

            return (
              <li key={category.id} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`py-1.5 px-3.5 sm:px-4 rounded-full transition-all duration-200 cursor-pointer border flex items-center gap-2 text-[13px] font-semibold min-h-[36px] shrink-0 active:scale-95 ${
                    isActive
                      ? "bg-[#5B4865] text-white border-[#5B4865] shadow-sm ring-2 ring-[#B79A62]/20 font-bold"
                      : "bg-white hover:bg-[#F5F1F4] text-slate-700 hover:text-[#3D3045] border-[#E7E1E8] shadow-2xs"
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    <CategoryIcons8Logo
                      categoryName={category.name}
                      categoryId={category.id}
                      isActive={isActive}
                      className="w-[18px] h-[18px] object-contain select-none"
                      fallbackIcon={IconComponent}
                    />
                  </span>
                  <span className="tracking-tight whitespace-nowrap">
                    {displayLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Dropdown Panel */}
      <MegaMenuDropdown
        activeCategoryData={activeCategoryData}
        activeSectionName={activeSectionName}
        setActiveSectionName={setActiveSectionName}
        hoveredProduct={hoveredProduct}
        setHoveredProduct={setHoveredProduct}
        productCache={productCache}
        onClose={() => setActiveCategory(null)}
      />
    </motion.div>
  );
};
