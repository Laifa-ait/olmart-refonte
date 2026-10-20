import React from "react";
import { House, RefreshCw, HelpCircle } from "lucide-react";
import { OlmaSurface } from "./primitives/OlmaSurface";
import { OlmaButton } from "./primitives/OlmaButton";
import { FilterState } from "./SearchFilters";

interface OlmaImmoEmptyStateProps {
  filters?: FilterState;
  onResetFilters: () => void;
  className?: string;
}

export const OlmaImmoEmptyState: React.FC<OlmaImmoEmptyStateProps> = ({ filters, onResetFilters, className = "" }) => {
  const activeTags: string[] = [];
  if (filters?.wilaya) activeTags.push(`Wilaya : ${filters.wilaya}`);
  if (filters?.commune) activeTags.push(`Commune : ${filters.commune}`);
  if (filters?.listingType) {
    const mapListing: Record<string, string> = {
      sale: "Achat / Vente",
      rent_long: "Location",
      rent_short: "Séjour vacances",
    };
    activeTags.push(mapListing[filters.listingType] || filters.listingType);
  }
  if (filters?.propertyType) activeTags.push(`Type : ${filters.propertyType}`);
  if (filters?.minPrice || filters?.maxPrice) {
    const min = filters.minPrice ? `${filters.minPrice.toLocaleString("fr-DZ")} DA` : "0";
    const max = filters.maxPrice ? `${filters.maxPrice.toLocaleString("fr-DZ")} DA` : "max";
    activeTags.push(`Budget : ${min} - ${max}`);
  }

  return (
    <OlmaSurface
      variant="default"
      elevation="card"
      radius="3xl"
      padding="md"
      bordered
      borderVariant="default"
      className={`text-center space-y-3 my-3 sm:my-5 flex flex-col items-center max-w-2xl mx-auto !rounded-[1.5rem] ${className}`}
    >
      <div className="w-12 h-12 bg-[var(--olma-brand-primary-light)] text-[var(--olma-brand-primary)] rounded-2xl flex items-center justify-center mx-auto">
        <House className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-[var(--olma-text-primary)] font-['Playfair_Display',serif]">
          Aucun bien ne correspond à ces critères
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Aucun résultat pour le moment. Modifiez votre recherche ou élargissez la zone.
        </p>
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Critères testés :</span>
          {activeTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="hidden sm:flex w-full bg-[var(--olma-bg-subtle)] rounded-xl px-3 py-2.5 border border-[var(--olma-border-default)] text-left text-[11px] sm:text-xs text-slate-600 items-start gap-2">
        <HelpCircle className="w-4 h-4 text-[var(--olma-brand-accent)] shrink-0 mt-0.5" />
        <span>Essayez une autre wilaya, une fourchette de prix plus large ou un autre type de bien.</span>
      </div>

      <OlmaButton
        onClick={onResetFilters}
        variant="primary"
        size="md"
        leftIcon={<RefreshCw className="w-3.5 h-3.5 text-white" />}
        className="w-full sm:w-auto"
      >
        Réinitialiser tous les filtres
      </OlmaButton>
    </OlmaSurface>
  );
};
