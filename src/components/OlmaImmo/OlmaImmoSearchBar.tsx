import React from "react";
import { SlidersHorizontal, X, LocateFixed, Loader2, Search, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocationSearchResult } from "../../data/algerianCommunesDatabase";
import { searchAlgerianLocations } from "../../data/algerianCommunesDatabase";
import { ALGERIA_WILAYAS } from "../../constants/wilayas";

interface OlmaImmoSearchBarProps {
  whatTerm: string;
  whereTerm: string;
  isLocating: boolean;
  onWhatChange: (val: string) => void;
  onWhatClear: () => void;
  onWhereChange: (val: string) => void;
  onWhereClear: () => void;
  onQuickLocate: () => void;
  onOpenFilters: () => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onWhereFocus: (results: LocationSearchResult[]) => void;
}

export const OlmaImmoSearchBar: React.FC<OlmaImmoSearchBarProps> = ({
  whatTerm,
  whereTerm,
  isLocating,
  onWhatChange,
  onWhatClear,
  onWhereChange,
  onWhereClear,
  onQuickLocate,
  onOpenFilters,
  onSubmit,
  onKeyDown,
  onWhereFocus,
}) => {
  const { t } = useTranslation();
  const label = (key: string, fallback: string) => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="bg-white rounded-[1.35rem] sm:rounded-full px-3 sm:px-4 py-2.5 border border-[var(--olma-border-default)] shadow-[var(--olma-shadow-card)] flex items-center justify-between gap-2 transition-all duration-200 focus-within:border-[var(--olma-border-focus)] focus-within:shadow-[var(--olma-shadow-floating)]"
    >
      {/* Left: Quoi ? */}
      <div className="flex-1 min-w-0 flex items-center">
        <Search aria-hidden="true" className="w-4 h-4 mr-2 text-[var(--olma-text-muted)] shrink-0" />
        <input
          type="text"
          placeholder={label("search_what_immo_placeholder", "Type de bien (villa, appartement…)")}
          value={whatTerm}
          onChange={(e) => onWhatChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full text-xs sm:text-sm font-normal text-[#1E293B] placeholder:text-[#64748B] focus:outline-none bg-transparent"
          aria-label={label("search_what_immo_placeholder", "Type de bien recherché")}
        />
        {whatTerm && (
          <button
            type="button"
            onClick={onWhatClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer shrink-0"
            title={label("search_clear", "Effacer")}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="w-px h-7 bg-[var(--olma-border-subtle)] shrink-0 mx-0.5" aria-hidden="true" />

      {/* Right: Où ? */}
      <div className="flex-1 min-w-0 flex items-center relative">
        <MapPin aria-hidden="true" className="w-4 h-4 mr-2 text-[var(--olma-text-muted)] shrink-0" />
        <input
          type="text"
          placeholder={label("search_where_placeholder", "Wilaya, commune ou quartier")}
          list="hero-algeria-wilayas"
          value={whereTerm}
          onChange={(e) => onWhereChange(e.target.value)}
          onFocus={() => {
            if (whereTerm.trim().length >= 2) {
              const results = searchAlgerianLocations(whereTerm.trim(), 8);
              onWhereFocus(results);
            }
          }}
          onKeyDown={onKeyDown}
          className="w-full text-xs sm:text-sm font-normal text-[#1E293B] placeholder:text-[#64748B] focus:outline-none bg-transparent"
          aria-label={label("search_where_placeholder", "Localisation souhaitée")}
        />
        <datalist id="hero-algeria-wilayas">
          {ALGERIA_WILAYAS.map((w) => (
            <option key={w.code} value={w.name}>
              {w.code} - {w.name} {w.name_ar ? `(${w.name_ar})` : ""}
            </option>
          ))}
        </datalist>

        {whereTerm ? (
          <button
            type="button"
            onClick={onWhereClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer shrink-0"
            title={label("search_clear", "Effacer")}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onQuickLocate}
            disabled={isLocating}
            className="p-1 text-[#64748B] hover:text-[#1E293B] rounded-full cursor-pointer shrink-0 transition-colors"
            title={label("search_geolocate_title", "Utiliser ma position")}
            aria-label={label("search_geolocate_title", "Utiliser ma position")}
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#64748B]" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Far Right: Filter Sliders Icon */}
      <button
        type="button"
        onClick={onOpenFilters}
        className="p-1.5 sm:p-2 -mr-1 rounded-full text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100/70 transition-colors cursor-pointer shrink-0"
        title={label("search_filters_button", "Filtres avancés")}
        aria-label={label("search_filters_button", "Ouvrir les filtres avancés")}
      >
        <SlidersHorizontal className="w-4 h-4 text-[var(--olma-brand-primary)]" />
      </button>
      <button
        type="submit"
        className="h-10 w-10 sm:w-auto sm:px-4 rounded-full bg-[var(--olma-brand-primary)] hover:bg-[var(--olma-brand-primary-dark)] text-white inline-flex items-center justify-center gap-2 shrink-0 shadow-sm transition-colors"
        aria-label="Rechercher un bien"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-semibold">Rechercher</span>
      </button>
    </form>
  );
};
