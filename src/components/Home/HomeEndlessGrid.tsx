import React, { useState, useEffect } from "react";
import { Product } from "../../domains/product/product.types";
import { ProductCard } from "../Product/ProductCard";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const HomeEndlessGrid: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const INITIAL_FETCH_LIMIT = 24;
  const LOAD_MORE_LIMIT = 12;

  useEffect(() => {
    let cancelled = false;
    const fetchInitial = async () => {
      try {
        let docs: Product[] = [];
        try {
          const res = await fetch(`/api/v1/public/home-endless-grid?limit=${INITIAL_FETCH_LIMIT}`);
          if (res.ok) {
            const data = await res.json();
            docs = data.products || [];
          }
        } catch {
          // Fetch failed, proceed to fallback
        }

        if (docs.length === 0) {
          try {
            const fallbackRes = await fetch(`/api/v1/products?limit=${INITIAL_FETCH_LIMIT}`);
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              docs = fallbackData.products || [];
            }
          } catch {
            // Fallback failed, proceed to next
          }
        }

        if (docs.length === 0) {
          try {
            const homeDataRes = await fetch(`/api/v1/public/home-data`);
            if (homeDataRes.ok) {
              const homeData = await homeDataRes.json();
              docs = homeData.featuredProducts || [];
            }
          } catch {
            // Final fallback failed
          }
        }

        if (!cancelled) {
          const validDocs = docs.filter((d) => d && (d.stock === undefined || d.stock > 0));
          setProducts(validDocs);
          setHasMore(docs.length >= INITIAL_FETCH_LIMIT);
        }
      } catch {
        // Silently handle error and set empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMoreProducts = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      let newDocs: Product[] = [];
      try {
        const res = await fetch(
          `/api/v1/public/home-endless-grid?limit=${LOAD_MORE_LIMIT}&offset=${products.length}`
        );
        if (res.ok) {
          const data = await res.json();
          newDocs = data.products || [];
        }
      } catch {
        // Fetch failed, proceed to fallback
      }

      if (newDocs.length === 0) {
        try {
          const fallbackRes = await fetch(
            `/api/v1/products?limit=${LOAD_MORE_LIMIT}&offset=${products.length}`
          );
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            newDocs = data.products || [];
          }
        } catch {
          // Fallback failed
        }
      }

      const validNewDocs = newDocs.filter((d) => d && (d.stock === undefined || d.stock > 0));

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filteredNew = validNewDocs.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });

      setHasMore(newDocs.length >= LOAD_MORE_LIMIT);
    } catch {
      // Handle load more error silently
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto mb-12 w-full max-w-[96rem] px-4 sm:mb-16 sm:px-6 md:px-8">
        <div className="h-6 w-48 bg-zinc-200 animate-pulse rounded-md mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto mb-14 w-full max-w-[96rem] px-4 sm:mb-20 sm:px-6 md:px-8">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-800 sm:text-[11px]">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            {t("home.endless_grid.eyebrow", "À découvrir maintenant")}
          </div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.035em] text-[#15271f] sm:text-3xl">
            {t("home.endless_grid.title", "Les dernières trouvailles")}
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {t("home.endless_grid.subtitle", "Les nouveautés partagées par les boutiques Olmart.")}
          </p>
        </div>
        <Link
          to="/shop"
          className="mb-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:text-sm"
        >
          <span>{t("home.endless_grid.view_all", "Tout le catalogue")}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grille des publications directement intégrée sans cadre */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* Bouton Afficher plus */}
      {hasMore && (
        <div className="flex justify-center mt-10 sm:mt-12">
          <button
            type="button"
            onClick={loadMoreProducts}
            disabled={loadingMore}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer border-none"
          >
            {loadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce" />
              </div>
            ) : (
              <span>{t("home.endless_grid.load_more", "Afficher plus d'articles")}</span>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
