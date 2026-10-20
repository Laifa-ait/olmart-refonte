import React from "react";
import { ArrowRight, History, Trash2, ArrowUpLeft, Store, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "../../domains/product/product.types";
import { SearchStoreResult } from "../../types/search";
import { SearchStoreCard } from "./SearchStoreCard";
import { SearchProductCard } from "./SearchProductCard";

interface SearchDropdownContentProps {
  localQuery: string;
  isSearching: boolean;
  filteredStores: SearchStoreResult[];
  filteredResults: Product[];
  recentSearches: string[];
  fallbackProducts: Product[];
  onSelectTerm: (term: string) => void;
  onClearRecent: () => void;
  onSelectStore: (storeId: string) => void;
  onSelectProduct: (productId: string, name: string) => void;
  onSubmitSearch: () => void;
}

export const SearchDropdownContent: React.FC<SearchDropdownContentProps> = ({
  localQuery,
  isSearching,
  filteredStores,
  filteredResults,
  recentSearches,
  fallbackProducts,
  onSelectTerm,
  onClearRecent,
  onSelectStore,
  onSelectProduct,
  onSubmitSearch,
}) => {
  const { t } = useTranslation();

  if (!localQuery.trim()) {
    return (
      <div className="space-y-5">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-[#eee8ef]">
              <h4 className="text-xs font-bold uppercase text-[#302638] tracking-wider flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-[#8a7a91]" />
                <span>{t("recent_searches", "Recherches récentes")}</span>
              </h4>
              <button
                type="button"
                onClick={onClearRecent}
                className="text-[11px] text-slate-400 hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer border-none bg-transparent"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t("clear", "Effacer")}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {recentSearches.slice(0, 4).map((term, i) => (
                <div
                  key={i}
                  onClick={() => onSelectTerm(term)}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[#f8f5f9] text-[13px] font-medium text-[#3f3545] cursor-pointer group transition-colors border border-[#eee8ef]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <History className="w-3.5 h-3.5 text-[#a395aa] shrink-0" />
                    <span className="truncate">{term}</span>
                  </div>
                  <ArrowUpLeft className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#5b4865] transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular catalog items preview */}
        {fallbackProducts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#eee8ef]">
              <h4 className="text-xs font-bold uppercase text-[#4d4054] tracking-wider">
                {t("popular_creations", "Articles populaires du catalogue")}
              </h4>
              <span className="text-[11px] text-[#8a6b35] font-semibold">Tendance en Algérie</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {fallbackProducts.slice(0, 4).map((p) => (
                <SearchProductCard key={p.id} product={p} query="" onSelect={onSelectProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active query state: Clean, direct standard results display without clunky proposition/category bars
  return (
    <div className="space-y-4">
      {/* Stores section if matched */}
      {filteredStores.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-[#4d4054] tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#8a6b35]" />
            <span>{t("matching_stores", "Boutiques certifiées")}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredStores.slice(0, 2).map((s) => (
              <SearchStoreCard key={s.id || s.uid} store={s} onSelect={onSelectStore} />
            ))}
          </div>
        </div>
      )}

      {/* Product Results */}
      {filteredResults.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#eee8ef]">
            <h4 className="text-xs font-bold uppercase text-[#302638] tracking-wider">
              {t("matching_creations", "Produits correspondants")} ({filteredResults.length})
            </h4>
            <span className="text-[11px] text-[#8a6b35] font-semibold">Livraison 58 wilayas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredResults.slice(0, 6).map((p) => (
              <SearchProductCard key={p.id} product={p} query={localQuery} onSelect={onSelectProduct} />
            ))}
          </div>

          {/* Full search submit button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onSubmitSearch}
              className="w-full py-3 px-4 bg-[#5b4865] hover:bg-[#493852] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer border-none flex items-center justify-center gap-2"
            >
              <span>
                {t("see_all_results_for", "Voir tous les résultats pour")} &laquo;{localQuery}&raquo;
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : isSearching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="p-3 bg-[#f7f4f8] rounded-2xl border border-[#eee8ef] flex items-center gap-3 animate-pulse"
            >
              <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3.5 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-[#eee8ef] bg-[#fbf9fc] px-5 py-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#796781] shadow-sm ring-1 ring-[#eee8ef]">
            <Search className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-[#302638]">
            {t("no_results_for", "Aucun produit direct pour")} &laquo;{localQuery}&raquo;
          </p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
            {t("try_broader_keywords", "Vérifiez l'orthographe ou lancez la recherche sur tout le catalogue.")}
          </p>
          <button
            type="button"
            onClick={onSubmitSearch}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5b4865] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#493852] cursor-pointer border-none"
          >
            {t("search_all_catalog", "Lancer la recherche globale")}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
