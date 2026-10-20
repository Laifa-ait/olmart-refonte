import React from "react";
import { X } from "lucide-react";
import {
  VehicleFilterParams,
  VehiclePriceType,
  AutoSellerType,
  VehicleFuel,
  VehicleTransmission,
} from "../../domains/auto/auto.types";
import { FUEL_LABELS, PRICE_TYPE_LABELS, TRANSMISSION_LABELS } from "../../domains/auto/auto.utils";
import { WILAYAS_69 } from "../../domains/auto/auto.wilayas";
import { CAR_BRANDS, getModelsForBrand } from "../../domains/auto/auto.brands";
import { PaperFilterBlock, BodyFilterBlock } from "./AutoFilterSectionBlocks";

export interface AutoFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VehicleFilterParams;
  onChange: (updated: Partial<VehicleFilterParams>) => void;
  onReset: () => void;
  onApply?: () => void;
  totalResults?: number;
}

export const AutoFilterDrawer: React.FC<AutoFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  onApply,
  totalResults,
}) => {
  if (!isOpen) return null;
  const availableModels = filters.brand ? getModelsForBrand(filters.brand) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-[#0B1730]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-[#0B1730] text-white">
            <div>
              <h2 className="text-base font-bold">Filtres de recherche</h2>
              <p className="mt-0.5 text-xs text-slate-300">Précisez le véhicule que vous cherchez</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-5">
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">1 · Véhicule</h3>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filters.brand || ""}
                  onChange={(event) => onChange({ brand: event.target.value || undefined, model: undefined, page: 1 })}
                  aria-label="Marque"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800"
                >
                  <option value="">Toutes les marques</option>
                  {CAR_BRANDS.map((brand) => <option key={brand.brandName} value={brand.brandName}>{brand.brandName}</option>)}
                </select>
                <select
                  value={filters.model || ""}
                  onChange={(event) => onChange({ model: event.target.value || undefined, page: 1 })}
                  aria-label="Modèle"
                  disabled={!filters.brand}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 disabled:opacity-50"
                >
                  <option value="">Tous les modèles</option>
                  {availableModels.map((model) => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filters.fuel || ""}
                  onChange={(event) => onChange({ fuel: (event.target.value as VehicleFuel) || undefined, page: 1 })}
                  aria-label="Carburant"
                  className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800"
                >
                  <option value="">Tous les carburants</option>
                  {(Object.keys(FUEL_LABELS) as VehicleFuel[]).map((fuel) => <option key={fuel} value={fuel}>{FUEL_LABELS[fuel]}</option>)}
                </select>
                <select
                  value={filters.transmission || ""}
                  onChange={(event) => onChange({ transmission: (event.target.value as VehicleTransmission) || undefined, page: 1 })}
                  aria-label="Boîte de vitesse"
                  className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800"
                >
                  <option value="">Toutes les boîtes</option>
                  {(Object.keys(TRANSMISSION_LABELS) as VehicleTransmission[]).map((transmission) => <option key={transmission} value={transmission}>{TRANSMISSION_LABELS[transmission]}</option>)}
                </select>
              </div>
            </section>

            <section className="space-y-3 border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">2 · Budget et année</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={filters.minPrice ?? ""}
                  onChange={(event) => onChange({ minPrice: event.target.value ? Number(event.target.value) : undefined, page: 1 })}
                  placeholder="Prix min (DZD)"
                  aria-label="Prix minimum en dinars"
                  className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
                />
                <input
                  type="number"
                  min={0}
                  value={filters.maxPrice ?? ""}
                  onChange={(event) => onChange({ maxPrice: event.target.value ? Number(event.target.value) : undefined, page: 1 })}
                  placeholder="Prix max (DZD)"
                  aria-label="Prix maximum en dinars"
                  className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1960}
                  max={new Date().getFullYear() + 1}
                  value={filters.minYear ?? ""}
                  onChange={(event) => onChange({ minYear: event.target.value ? Number(event.target.value) : undefined, page: 1 })}
                  placeholder="Année min"
                  aria-label="Année minimum"
                  className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
                />
                <input
                  type="number"
                  min={1960}
                  max={new Date().getFullYear() + 1}
                  value={filters.maxYear ?? ""}
                  onChange={(event) => onChange({ maxYear: event.target.value ? Number(event.target.value) : undefined, page: 1 })}
                  placeholder="Année max"
                  aria-label="Année maximum"
                  className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
                />
              </div>
            </section>

            <section className="space-y-3 border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">3 · Localisation</h3>
            <div>
              <label className="sr-only">Wilaya</label>
              <select
                value={filters.wilayaId || ""}
                onChange={(e) =>
                  onChange({
                    wilayaId: e.target.value ? Number(e.target.value) : undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#172B4D] min-h-[44px]"
              >
                <option value="">Toute l'Algérie (69 Wilayas)</option>
                {WILAYAS_69.map((w) => (
                  <option key={w.code} value={w.id}>
                    {w.code} - {w.name} ({w.name_ar})
                  </option>
                ))}
              </select>
            </div>
            </section>

            <section className="space-y-5 border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">4 · État et vendeur</h3>
            <PaperFilterBlock
              selected={filters.paperStatus}
              onSelect={(p) => onChange({ paperStatus: p, page: 1 })}
            />

            {/* 3. État de la Tôle / Carrosserie */}
            <BodyFilterBlock
              selected={filters.bodyCondition}
              onSelect={(b) => onChange({ bodyCondition: b, page: 1 })}
            />

            {/* 4. Type de Prix */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Modalités de Prix
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PRICE_TYPE_LABELS) as VehiclePriceType[]).map((pt) => {
                  const isChecked = filters.priceType === pt;
                  return (
                    <button
                      key={pt}
                      type="button"
                      onClick={() =>
                        onChange({ priceType: isChecked ? undefined : pt, page: 1 })
                      }
                      className={`p-2.5 rounded-lg border text-xs text-center transition-colors min-h-[44px] cursor-pointer ${
                        isChecked
                          ? "bg-[#0B1730] border-[#0B1730] text-white font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {PRICE_TYPE_LABELS[pt]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Kilométrage Max */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Kilométrage Maximum
              </label>
              <input
                type="number"
                placeholder="Ex: 120000 km"
                value={filters.maxMileage || ""}
                onChange={(e) =>
                  onChange({
                    maxMileage: e.target.value ? Number(e.target.value) : undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 min-h-[44px]"
              />
            </div>

            {/* 6. Type de Vendeur */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Type de Vendeur
              </label>
              <select
                value={filters.sellerType || ""}
                onChange={(e) =>
                  onChange({
                    sellerType: (e.target.value as AutoSellerType) || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 min-h-[44px]"
              >
                <option value="">Tous les vendeurs</option>
                <option value="particulier">Particulier uniquement</option>
                <option value="professionnel">Showroom Professionnel</option>
                <option value="concessionnaire">Concessionnaire agréé</option>
              </select>
            </div>
            <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(filters.onlyInspected)}
                onChange={(event) => onChange({ onlyInspected: event.target.checked || undefined, page: 1 })}
                className="h-4 w-4 accent-[#172B4D]"
              />
              Véhicules inspectés uniquement
            </label>
            </section>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 py-2.5 px-3 border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:bg-white transition-colors min-h-[44px] cursor-pointer"
            >
              Réinitialiser
            </button>
            <button
              type="button"
              onClick={onApply || onClose}
              className="flex-2 py-2.5 px-4 bg-[#D9F66F] hover:bg-[#C5E94F] text-[#0B1730] font-bold rounded-lg text-xs sm:text-sm transition-colors shadow-xs min-h-[44px] cursor-pointer"
            >
              Appliquer {totalResults !== undefined ? `(${totalResults} annonces)` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
