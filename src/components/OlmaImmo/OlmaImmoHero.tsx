import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { PropertyType } from "../../types/realEstate";
import { FilterState } from "./SearchFilters";
import { OlmaImmoFilterModal } from "./filters/OlmaImmoFilterModal";
import { searchAlgerianLocations, LocationSearchResult } from "../../data/algerianCommunesDatabase";
import { requestUserAlgerianWilaya } from "../../utils/realEstateGeolocation";
import { ALGERIA_WILAYAS } from "../../constants/wilayas";
import { LocationSuggestionsPopup } from "./LocationSuggestionsPopup";
import { OlmaImmoSearchBar } from "./OlmaImmoSearchBar";
import { MapPinned } from "lucide-react";
import { OlmaImmoMobileSearchButton } from "./OlmaImmoMobileSearchButton";
interface OlmaImmoHeroProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onSearchSubmit: () => void;
}
export const OlmaImmoHero: React.FC<OlmaImmoHeroProps> = ({ filters, onFilterChange, onSearchSubmit }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [whereTerm, setWhereTerm] = useState(
    filters.commune
      ? `${filters.commune} (${filters.wilaya || ""})`
      : filters.daira
        ? `${filters.daira} (Daïra, ${filters.wilaya || ""})`
        : filters.wilaya || ""
  );
  const [whatTerm, setWhatTerm] = useState(
    filters.propertyType
      ? filters.propertyType === "villa"
        ? "Villas"
        : filters.propertyType === "apartment"
          ? "Appartements"
          : filters.propertyType
      : ""
  );
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (filters.commune && filters.wilaya) {
      setWhereTerm(`${filters.commune} (${filters.wilaya})`);
    } else if (filters.daira && filters.wilaya) {
      setWhereTerm(`${filters.daira} (${filters.wilaya})`);
    } else if (filters.wilaya) {
      setWhereTerm(filters.wilaya);
    } else if (!filters.wilaya && !filters.commune && !filters.daira) {
      setWhereTerm("");
    }
  }, [filters.wilaya, filters.commune, filters.daira]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsContainerRef.current && !suggestionsContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleWhereChange = (val: string) => {
    setWhereTerm(val);
    const matchedWilaya = ALGERIA_WILAYAS.find((w) => w.name.toLowerCase() === val.trim().toLowerCase());
    if (matchedWilaya) {
      onFilterChange({
        ...filters,
        wilaya: matchedWilaya.name,
        daira: undefined,
        commune: undefined,
      });
    }
    if (val.trim().length >= 2) {
      const results = searchAlgerianLocations(val.trim(), 8);
      setSuggestions(results);
      setIsSuggestionsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  };
  const handleSelectSuggestion = (item: LocationSearchResult) => {
    setWhereTerm(item.label);
    setIsSuggestionsOpen(false);
    if (item.type === "commune") {
      onFilterChange({
        ...filters,
        wilaya: item.wilaya,
        daira: item.daira || undefined,
        commune: item.commune,
      });
    } else if (item.type === "daira") {
      onFilterChange({
        ...filters,
        wilaya: item.wilaya,
        daira: item.daira,
        commune: undefined,
      });
    } else {
      onFilterChange({
        ...filters,
        wilaya: item.wilaya,
        daira: undefined,
        commune: undefined,
      });
    }
    setTimeout(() => onSearchSubmit(), 60);
  };
  const handleWhatChange = (val: string) => {
    setWhatTerm(val);
    const lower = val.toLowerCase().trim();
    let pType: PropertyType | undefined = undefined;
    if (lower.includes("villa") || lower.includes("maison")) pType = "villa";
    else if (lower.includes("appart")) pType = "apartment";
    else if (lower.includes("studio") || lower.includes("loft")) pType = "studio";
    else if (lower.includes("terrain")) pType = "land";
    else if (lower.includes("comm")) pType = "commercial";
    onFilterChange({ ...filters, propertyType: pType });
  };
  const handleQuickLocate = () => {
    setIsLocating(true);
    requestUserAlgerianWilaya(
      (result) => {
        setIsLocating(false);
        const locationLabel = result.commune ? `${result.commune} (${result.wilaya.name})` : result.wilaya.name;
        setWhereTerm(locationLabel);
        onFilterChange({
          ...filters,
          wilaya: result.wilaya.name,
          daira: result.daira || undefined,
          commune: result.commune || undefined,
        });
        toast.success(`Position détectée : ${locationLabel}`);
        setTimeout(() => onSearchSubmit(), 60);
      },
      (errMsg) => {
        setIsLocating(false);
        toast.error(errMsg);
      },
      () => {
        setIsLocating(false);
      }
    );
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSuggestionsOpen(false);
      if (whereTerm.trim().length >= 2) {
        const matches = searchAlgerianLocations(whereTerm.trim(), 1);
        if (matches.length > 0) {
          handleSelectSuggestion(matches[0]);
          return;
        }
      }
      onSearchSubmit();
    }
  };
  return (
    <section className="w-full relative z-30 border-b border-[var(--olma-border-subtle)] bg-[linear-gradient(180deg,#fff_0%,var(--olma-bg-base)_100%)]">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-9 pb-5 sm:pb-7 relative"
        ref={suggestionsContainerRef}
      >
        <div className="hidden sm:flex max-w-6xl mx-auto mb-5 sm:mb-6 flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[var(--olma-brand-primary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--olma-brand-accent)]" />
              Olma Immo <span className="text-[var(--olma-text-subtle)]">·</span> 69 wilayas
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-[2.5rem] leading-tight tracking-tight font-semibold text-[var(--olma-text-primary)]">
              Le bon bien, au bon endroit.
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-[var(--olma-text-secondary)]">
              Achetez, louez ou réservez un séjour partout en Algérie.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--olma-text-muted)] pb-1">
            <MapPinned className="w-4 h-4 text-[var(--olma-brand-accent)]" />
            Recherche dans les 69 wilayas
          </div>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <OlmaImmoMobileSearchButton onClick={() => setIsFilterModalOpen(true)} />
          <div className="hidden sm:block">
            <OlmaImmoSearchBar
              whatTerm={whatTerm}
              whereTerm={whereTerm}
              isLocating={isLocating}
              onWhatChange={handleWhatChange}
              onWhatClear={() => {
                setWhatTerm("");
                onFilterChange({ ...filters, propertyType: undefined });
              }}
              onWhereChange={handleWhereChange}
              onWhereClear={() => {
                setWhereTerm("");
                setSuggestions([]);
                setIsSuggestionsOpen(false);
                onFilterChange({
                  ...filters,
                  wilaya: undefined,
                  daira: undefined,
                  commune: undefined,
                });
              }}
              onQuickLocate={handleQuickLocate}
              onOpenFilters={() => setIsFilterModalOpen(true)}
              onSubmit={() => {
                setIsSuggestionsOpen(false);
                onSearchSubmit();
              }}
              onKeyDown={handleKeyDown}
              onWhereFocus={(results) => {
                setSuggestions(results);
                setIsSuggestionsOpen(results.length > 0);
              }}
            />
            {/* Dynamic Location Auto-Suggestions Popup */}
            {isSuggestionsOpen && (
              <LocationSuggestionsPopup suggestions={suggestions} onSelect={handleSelectSuggestion} />
            )}
          </div>
        </div>
        {/* Filter Modal */}
        <OlmaImmoFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onApplyFilters={(newFilters) => {
            onFilterChange(newFilters);
            setTimeout(() => onSearchSubmit(), 50);
          }}
          onResetFilters={() => {
            onFilterChange({ sort: "recent" });
            setWhatTerm("");
            setWhereTerm("");
            setTimeout(() => onSearchSubmit(), 50);
          }}
        />
      </div>
    </section>
  );
};
