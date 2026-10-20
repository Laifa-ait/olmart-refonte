import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LOGOTEKA_BRAND_LOGOS } from "../../domains/auto/data/brandLogosMap";

export const AutoPopularBrandsSection: React.FC = () => {
  const displayedBrands = LOGOTEKA_BRAND_LOGOS.slice(0, 12);

  return (
    <section className="mb-10 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">Rechercher par marque</h2>
          <p className="mt-1 text-xs text-slate-500">Les marques les plus recherchées en Algérie</p>
        </div>

        <Link
          to="/auto/catalog"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-[#172B4D] transition hover:bg-slate-100"
        >
          <span>Tout voir</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6">
        {displayedBrands.map((brand) => (
          <Link
            key={brand.id}
            to={`/auto/catalog?brand=${encodeURIComponent(brand.name)}`}
            aria-label={`Voir les véhicules ${brand.name}`}
            className="group flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-2 py-3 text-center transition hover:border-[#172B4D]/40 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#172B4D] sm:min-h-[94px]"
          >
            <div className="flex h-9 w-12 items-center justify-center sm:h-10">
              <img
                src={brand.file}
                alt={`Logo officiel ${brand.name}`}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <span className="max-w-full truncate text-[11px] font-semibold text-slate-700 group-hover:text-[#172B4D] sm:text-xs">{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
