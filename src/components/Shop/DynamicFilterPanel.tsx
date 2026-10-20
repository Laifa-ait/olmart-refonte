import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Tag,
  Palette,
  CheckCircle2,
  Star,
  PackageCheck,
  BadgePercent,
  Truck,
  Banknote,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCategoryTranslation } from "../../utils/translations";
import type { AvailableFacets, ArrayFacetKey, SelectedFacets } from "../../hooks/useFacetedFilters";

interface FilterCheckProps {
  checked: boolean;
  label: string;
  detail: string;
  icon: React.ReactNode;
  onChange: (checked: boolean) => void;
}

const FilterCheck: React.FC<FilterCheckProps> = ({ checked, label, detail, icon, onChange }) => (
  <label
    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors ${checked ? "border-[#b9a6bd] bg-[#f7f3f7]" : "border-[#eee7df] bg-white hover:border-[#d8cbd9]"}`}
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fbf7ed] text-[#9b7531]">
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-xs font-bold text-[#352b3b]">{label}</span>
      <span className="mt-0.5 block text-[10px] text-slate-500">{detail}</span>
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 accent-[#5b4865]"
    />
  </label>
);

interface DynamicFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  selectedFacets: SelectedFacets;
  availableFacets: AvailableFacets;
  toggleFacet: (facetKey: ArrayFacetKey, value: string) => void;
  setBooleanFacet: (facetKey: "inStock" | "onSale" | "freeShipping" | "acceptsCod", value: boolean) => void;
  setMinRating: (value: number) => void;
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
  totalCount: number;
  onApply: () => void;
}

export const DynamicFilterPanel: React.FC<DynamicFilterPanelProps> = ({
  isOpen,
  onClose,
  activeCategory,
  selectedFacets,
  availableFacets,
  toggleFacet,
  setBooleanFacet,
  setMinRating,
  setPriceRange,
  resetFilters,
  totalCount,
  onApply,
}) => {
  const { t } = useTranslation();
  const activeFilterCount =
    selectedFacets.sizes.length +
    selectedFacets.colors.length +
    selectedFacets.materials.length +
    selectedFacets.brands.length +
    selectedFacets.wilayas.length +
    selectedFacets.conditions.length +
    Number(selectedFacets.minRating > 0) +
    Number(selectedFacets.inStock) +
    Number(selectedFacets.onSale) +
    Number(selectedFacets.freeShipping) +
    Number(selectedFacets.acceptsCod) +
    Number(
      selectedFacets.priceRange[0] !== availableFacets.minPrice ||
        selectedFacets.priceRange[1] !== availableFacets.maxPrice
    );
  // Determine which facets are relevant to show based on the active category
  const activeFacetsConfig = useMemo(() => {
    const showSize =
      activeCategory === "Mode" ||
      activeCategory === "Bébé & Puériculture" ||
      activeCategory === "Sport & Loisirs" ||
      activeCategory === "Tous";
    const showColor =
      activeCategory === "Mode" ||
      activeCategory === "Maison & Déco" ||
      activeCategory === "Bébé & Puériculture" ||
      activeCategory === "Auto & Moto" ||
      activeCategory === "Artisanat & Tradition" ||
      activeCategory === "Tous";
    const showMaterial =
      activeCategory === "Mode" ||
      activeCategory === "Maison & Déco" ||
      activeCategory === "Artisanat & Tradition" ||
      activeCategory === "Supermarché" ||
      activeCategory === "Beauté & Santé" ||
      activeCategory === "Bébé & Puériculture" ||
      activeCategory === "Tous";
    const showBrand =
      activeCategory === "Électronique" ||
      activeCategory === "Électroménager" ||
      activeCategory === "Auto & Moto" ||
      activeCategory === "Bricolage & Outillage" ||
      activeCategory === "Beauté & Santé" ||
      activeCategory === "Sport & Loisirs" ||
      activeCategory === "Scolaire & Bureau" ||
      activeCategory === "Tous";

    return {
      showSize,
      showColor,
      showMaterial,
      showBrand,
    };
  }, [activeCategory]);

  // Handle manual price change inputs safely
  const handlePriceChange = (index: 0 | 1, val: string) => {
    const num = parseInt(val.replace(/\D/g, "")) || 0;
    const currentPriceRange = selectedFacets.priceRange;
    const newRange: [number, number] = index === 0 ? [num, currentPriceRange[1]] : [currentPriceRange[0], num];
    setPriceRange(newRange);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 z-[190] backdrop-blur-xs"
          />

          {/* Bottom Sheet for Mobile & Side Sheet for Tablet/Desktop */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 h-[88vh] md:h-full md:left-auto md:right-0 md:w-[460px] bg-[#fbf9f6] md:rounded-l-[2rem] rounded-t-[2rem] shadow-2xl z-[200] flex flex-col overflow-hidden border-t md:border-t-0 md:border-l border-[#e9e1d9]"
          >
            {/* Grab handle for mobile gesture recognition */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 shrink-0 md:hidden animate-pulse" />

            {/* Header section with Sandstone off-white and teracotta themes */}
            <div className="px-6 py-4 border-b border-[#eee7df] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#f2ebf3] rounded-xl text-[#5b4865]">
                  <SlidersHorizontal className="w-5 h-5 text-[#5b4865]" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm tracking-tight rtl:tracking-normal text-[#302536]">
                    {t("facet_filtering", "Affiner les résultats")}
                  </h3>
                  <p className="text-[10px] rtl:text-[12px] text-slate-500 font-medium">
                    {activeFilterCount} {activeFilterCount === 1 ? "filtre actif" : "filtres actifs"} ·{" "}
                    {getCategoryTranslation(activeCategory, t)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  title={t("reset_all_filters", "Réinitialiser tous les filtres")}
                  className="p-2 text-slate-500 hover:text-[#5b4865] hover:bg-[#f7f3f7] rounded-xl transition-all cursor-pointer border-none bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-700 hover:bg-[#f7f3f7] rounded-xl transition-all cursor-pointer border-none bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main scrollable body with faceted filters sections */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-7 custom-scrollbar">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white border border-[#eee7df] p-3 text-[10px] font-semibold text-[#67596b]">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#b58c45]" />
                  Achat sécurisé
                </span>
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#b58c45]" />
                  Livraison 69 wilayas
                </span>
              </div>

              {/* SECTION: Price Budget limits */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] rtl:text-[12px] font-sans font-bold uppercase text-[#514459] tracking-[0.12em] ms-0.5">
                    {t("desired_budget_dzd", "Budget souhaité (DZD)")}
                  </h4>
                  <button
                    onClick={() =>
                      setPriceRange([
                        availableFacets.minPrice,
                        Math.min(availableFacets.maxPrice, Math.max(availableFacets.minPrice + 1000, 45000)),
                      ])
                    }
                    className="text-[9px] rtl:text-[11px] font-sans font-bold uppercase text-[#5b4865] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    {t("under_45k_da", "Moins de 45K DA")}
                  </button>
                </div>

                <div className="space-y-4 bg-white p-4 rounded-2xl border border-[#eee7df]">
                  <div className="relative pt-2">
                    <input
                      type="range"
                      min={availableFacets.minPrice}
                      max={availableFacets.maxPrice}
                      step={Math.max(100, Math.round((availableFacets.maxPrice - availableFacets.minPrice) / 100))}
                      value={selectedFacets.priceRange[1]}
                      onChange={(e) => setPriceRange([selectedFacets.priceRange[0], Number(e.target.value)])}
                      className="w-full h-1.5 bg-[#eadfea] rounded-lg appearance-none cursor-pointer accent-[#5b4865]"
                    />
                    <div className="flex justify-between text-[10px] rtl:text-[12px] text-slate-600 font-bold mt-2">
                      <span>{new Intl.NumberFormat("en-US").format(availableFacets.minPrice)}</span>
                      <span>
                        {t("max_orderable", "Max commandable")}:{" "}
                        {new Intl.NumberFormat("en-US").format(selectedFacets.priceRange[1])}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-widest rtl:tracking-normal mb-1">
                        {t("medium_min", "MÉDIUM MIN")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={new Intl.NumberFormat("en-US").format(selectedFacets.priceRange[0])}
                          onChange={(e) => handlePriceChange(0, e.target.value)}
                          className="w-full ps-3.5 pe-12 py-2.5 rounded-xl border border-[#e8e1e8] font-sans font-bold text-xs rtl:text-sm text-slate-900 focus:border-[#9a849f] outline-none bg-white"
                        />
                        <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[9px] rtl:text-[11px] font-sans font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
                          {t("da", "DA")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-widest rtl:tracking-normal mb-1">
                        {t("plafond_max", "PLAFOND MAX")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={new Intl.NumberFormat("en-US").format(selectedFacets.priceRange[1])}
                          onChange={(e) => handlePriceChange(1, e.target.value)}
                          className="w-full ps-3.5 pe-12 py-2.5 rounded-xl border border-[#e8e1e8] font-sans font-bold text-xs rtl:text-sm text-slate-900 focus:border-[#9a849f] outline-none bg-white"
                        />
                        <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[9px] rtl:text-[11px] font-sans font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
                          {t("da", "DA")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#514459]">
                    Disponibilité & services
                  </h4>
                  <PackageCheck className="h-4 w-4 text-[#b58c45]" />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <FilterCheck
                    checked={selectedFacets.inStock}
                    label="En stock"
                    detail="Articles disponibles immédiatement"
                    icon={<PackageCheck className="h-4 w-4" />}
                    onChange={(value) => setBooleanFacet("inStock", value)}
                  />
                  <FilterCheck
                    checked={selectedFacets.onSale}
                    label="En promotion"
                    detail="Prix réduit ou offre active"
                    icon={<BadgePercent className="h-4 w-4" />}
                    onChange={(value) => setBooleanFacet("onSale", value)}
                  />
                  <FilterCheck
                    checked={selectedFacets.freeShipping}
                    label="Livraison gratuite"
                    detail="Sans frais de livraison affichés"
                    icon={<Truck className="h-4 w-4" />}
                    onChange={(value) => setBooleanFacet("freeShipping", value)}
                  />
                  <FilterCheck
                    checked={selectedFacets.acceptsCod}
                    label="Paiement à la livraison"
                    detail="Réglez votre commande à la réception"
                    icon={<Banknote className="h-4 w-4" />}
                    onChange={(value) => setBooleanFacet("acceptsCod", value)}
                  />
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#514459]">Note minimale</h4>
                  <Star className="h-4 w-4 text-[#b58c45]" />
                </div>
                <div className="flex gap-2">
                  {[0, 3, 4].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMinRating(rating)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${selectedFacets.minRating === rating ? "border-[#5b4865] bg-[#5b4865] text-white" : "border-[#eee7df] bg-white text-[#554b59] hover:border-[#cbbdce]"}`}
                    >
                      {rating === 0 ? (
                        "Toutes"
                      ) : (
                        <>
                          <Star className="h-3.5 w-3.5 fill-current text-[#d7b66c]" /> {rating}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {availableFacets.conditions.length > 0 && (
                <section className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#514459]">État du produit</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableFacets.conditions.map((option) => {
                      const selected = selectedFacets.conditions.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleFacet("conditions", option.value)}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${selected ? "border-[#5b4865] bg-[#5b4865] text-white" : "border-[#eee7df] bg-white text-slate-600 hover:border-[#cbbdce]"}`}
                        >
                          {option.value} <span className="opacity-70">({option.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* SECTION: Wilayas de provenance list */}
              {availableFacets.wilayas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <h4 className="text-[10px] rtl:text-[12px] font-sans font-bold uppercase text-slate-600 tracking-[0.14em]">
                      {t("region_wilaya", "Région / Wilaya")}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableFacets.wilayas.map((opt) => {
                      const isSelected = selectedFacets.wilayas.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleFacet("wilayas", opt.value)}
                          className={`px-3.5 py-2 rounded-xl text-[10px] rtl:text-[12px] font-black uppercase tracking-wider rtl:tracking-normal transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-transparent"
                          }`}
                        >
                          {t(`wilaya_${opt.value}`, opt.value)}{" "}
                          <span
                            className={`ms-1 text-[8px] ${isSelected ? "text-white/80" : "text-slate-500 font-bold"}`}
                          >
                            ({opt.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: Tailles (Size facets) matching clothing */}
              {activeFacetsConfig.showSize && availableFacets.sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-600" />
                    <h4 className="text-[10px] rtl:text-[12px] font-sans font-bold uppercase text-slate-600 tracking-[0.14em]">
                      {t("available_sizes", "Tailles disponibles (Variantes)")}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableFacets.sizes.map((opt) => {
                      const isSelected = selectedFacets.sizes.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleFacet("sizes", opt.value)}
                          className={`min-w-[42px] h-10 rounded-xl font-black text-[10px] rtl:text-[12px] uppercase transition-all flex items-center justify-center border cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.05]"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {t(opt.value, opt.value)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: Matières (Materials) facets */}
              {activeFacetsConfig.showMaterial && availableFacets.materials.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-slate-600" />
                    <h4 className="text-[10px] rtl:text-[12px] font-sans font-bold uppercase text-slate-600 tracking-[0.14em]">
                      {t("artisanal_materials", "Matières Artisanales")}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableFacets.materials.map((opt) => {
                      const isSelected = selectedFacets.materials.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleFacet("materials", opt.value)}
                          className={`px-4 py-2.5 rounded-xl text-[10px] rtl:text-[12px] font-black uppercase tracking-wider rtl:tracking-normal transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-transparent"
                          }`}
                        >
                          {t(opt.value, opt.value)} <span className="text-[8px] opacity-75">({opt.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: Couleurs facets */}
              {activeFacetsConfig.showColor && availableFacets.colors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-slate-600" />
                    <h4 className="text-[10px] rtl:text-[12px] font-sans font-bold uppercase text-slate-600 tracking-[0.14em]">
                      {t("shades_colors", "Teintes & Couleurs")}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableFacets.colors.map((opt) => {
                      const isSelected = selectedFacets.colors.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleFacet("colors", opt.value)}
                          className={`px-4 py-2.5 rounded-xl text-[10px] rtl:text-[12px] font-black transition-all border flex items-center gap-1.5 uppercase tracking-wider rtl:tracking-normal cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-transparent"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                          <span>{t(opt.value, opt.value)}</span>
                          <span className="text-[8px] opacity-75">({opt.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: Marque / Brand facets */}
              {activeFacetsConfig.showBrand && availableFacets.brands.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] rtl:text-[12px] font-sans font-bold uppercase text-slate-600 tracking-[0.14em] ms-0.5">
                    {t("brand_manufacturer", "Marque / Fabricant")}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {availableFacets.brands.map((opt) => {
                      const isSelected = selectedFacets.brands.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleFacet("brands", opt.value)}
                          className={`px-4 py-2.5 rounded-xl text-[10px] rtl:text-[12px] font-black uppercase tracking-wider rtl:tracking-normal transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-transparent"
                          }`}
                        >
                          {t(opt.value, opt.value)} <span className="text-[8px] opacity-75">({opt.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* End of results fallback inside panel */}
              {totalCount === 0 && (
                <div className="py-6 px-4 bg-red-50 text-center rounded-2xl border border-red-100 space-y-1">
                  <p className="text-xs rtl:text-sm font-sans font-bold text-red-600 uppercase tracking-widest rtl:tracking-normal">
                    {t("no_match", "Aucune correspondance")}
                  </p>
                  <p className="text-[10px] rtl:text-[12px] text-slate-500 font-bold">
                    {t("expand_options_desc", "Essayez d'élargir vos options pour débloquer de magnifiques résultats.")}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Action Footer of the Panel */}
            <div className="p-5 bg-white border-t border-[#eee7df] shrink-0">
              <button
                onClick={onApply}
                className="w-full rounded-full bg-[#4d3b55] py-3.5 text-xs font-sans font-bold text-white shadow-[0_8px_18px_rgba(77,59,85,0.2)] transition-all hover:bg-[#3c2d43] flex items-center justify-center gap-3 border-none cursor-pointer"
              >
                <span>
                  {t("apply_filter", "Appliquer le filtre")} ({totalCount}{" "}
                  {totalCount > 1 ? t("articles", "articles") : t("article", "article")})
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
