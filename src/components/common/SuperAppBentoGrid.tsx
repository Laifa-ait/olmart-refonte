import React from "react";
import { ShoppingBag, Building2, Wrench, Store, Car, ChevronRight, Check } from "lucide-react";
import { SuperAppVertical } from "../../types/superApp";

const VERTICAL_ICONS = {
  ShoppingBag,
  Building2,
  Wrench,
  Store,
  Car,
};

const VERTICAL_THEMES: Record<
  string,
  {
    iconGradient: string;
    iconShadow: string;
    badgeStyle: string;
    activeBorder: string;
    activeBg: string;
    activeText: string;
    activePill: string;
    activeDot: string;
    hoverBorder: string;
    glow: string;
  }
> = {
  marketplace: {
    iconGradient: "from-[#6b5674] to-[#493852]",
    iconShadow: "shadow-[#493852]/20",
    badgeStyle: "bg-[#f3edf5] text-[#5B4865] border-[#ddd0e2]",
    activeBorder: "border-[#5B4865]/55 ring-2 ring-[#5B4865]/15",
    activeBg: "from-[#f4edf6] via-[#fbf8fc] to-white",
    activeText: "text-[#5B4865]",
    activePill: "bg-[#5B4865]",
    activeDot: "bg-[#D7B76C]",
    hoverBorder: "hover:border-[#b9a7c2]",
    glow: "bg-[#cbbbd2]",
  },
  auto: {
    iconGradient: "from-[#b45b50] to-[#843f49]",
    iconShadow: "shadow-[#843f49]/20",
    badgeStyle: "bg-[#fbefed] text-[#8c4547] border-[#efd5d1]",
    activeBorder: "border-[#a94f4b]/55 ring-2 ring-[#a94f4b]/15",
    activeBg: "from-[#fbefed] via-[#fff9f8] to-white",
    activeText: "text-[#934645]",
    activePill: "bg-[#934645]",
    activeDot: "bg-[#e6b5a6]",
    hoverBorder: "hover:border-[#d8aaa2]",
    glow: "bg-[#e4bbb3]",
  },
  immo: {
    iconGradient: "from-[#54866a] to-[#31634c]",
    iconShadow: "shadow-[#31634c]/20",
    badgeStyle: "bg-[#edf5ef] text-[#35684e] border-[#cde0d2]",
    activeBorder: "border-[#43805e]/55 ring-2 ring-[#43805e]/15",
    activeBg: "from-[#edf6ef] via-[#f8fcf8] to-white",
    activeText: "text-[#35684e]",
    activePill: "bg-[#35684e]",
    activeDot: "bg-[#d7b76c]",
    hoverBorder: "hover:border-[#a9cbb4]",
    glow: "bg-[#b9d7c2]",
  },
  bricolage: {
    iconGradient: "from-[#4c8583] to-[#326665]",
    iconShadow: "shadow-[#326665]/20",
    badgeStyle: "bg-[#edf5f4] text-[#356c6b] border-[#cfe1df]",
    activeBorder: "border-[#43807d]/55 ring-2 ring-[#43807d]/15",
    activeBg: "from-[#edf6f5] via-[#f8fcfb] to-white",
    activeText: "text-[#356c6b]",
    activePill: "bg-[#356c6b]",
    activeDot: "bg-[#e4c987]",
    hoverBorder: "hover:border-[#a9cbc8]",
    glow: "bg-[#b9d9d5]",
  },
  shops: {
    iconGradient: "from-[#c29a48] to-[#8b6b2e]",
    iconShadow: "shadow-[#8b6b2e]/20",
    badgeStyle: "bg-[#f8f2e5] text-[#80652f] border-[#e8dbbb]",
    activeBorder: "border-[#a9853c]/55 ring-2 ring-[#a9853c]/15",
    activeBg: "from-[#f8f2e5] via-[#fdfaf3] to-white",
    activeText: "text-[#80652f]",
    activePill: "bg-[#80652f]",
    activeDot: "bg-[#efe0b6]",
    hoverBorder: "hover:border-[#d6c28f]",
    glow: "bg-[#e5d3a3]",
  },
};

interface SuperAppBentoGridProps {
  verticals: SuperAppVertical[];
  activeId: string;
  onSelect: (route: string) => void;
}

export const SuperAppBentoGrid: React.FC<SuperAppBentoGridProps> = ({ verticals, activeId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {verticals.map((v) => {
        const Icon = VERTICAL_ICONS[v.iconName];
        const active = v.id === activeId;
        const theme = VERTICAL_THEMES[v.id] || VERTICAL_THEMES.marketplace;

        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.route)}
            className={`group relative isolate overflow-hidden p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
              active
                ? `bg-gradient-to-br ${theme.activeBg} ${theme.activeBorder} shadow-[0_8px_24px_rgba(73,56,82,0.10)]`
                : `bg-white ${theme.hoverBorder} border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_20px_rgba(73,56,82,0.08)]`
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -right-10 -top-12 z-0 h-32 w-32 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-40 ${theme.glow}`}
            />
            {active && (
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r ${theme.iconGradient}`}
              />
            )}
            <div className="relative z-10">
              {/* Header inside Card: Icon & Badges */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${theme.iconGradient} text-white flex items-center justify-center shadow-md ${theme.iconShadow} group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {active && (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-black text-white px-2.5 py-0.5 rounded-full shadow-xs ${theme.activePill}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.activeDot}`} />
                      Actif
                    </span>
                  )}
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeStyle}`}>
                    {v.badge}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h4
                className={`text-base font-black text-slate-900 transition-colors tracking-tight ${active ? theme.activeText : "group-hover:text-slate-950"}`}
              >
                {v.name}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">{v.description}</p>
            </div>

            {/* Bottom Row: Metric & Action Link */}
            <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700 bg-slate-100/90 px-2.5 py-0.5 rounded-md">
                {v.metrics}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs transition-all duration-200 ${
                  active
                    ? `${theme.activePill} text-white shadow-xs`
                    : "bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white group-hover:shadow-xs"
                }`}
              >
                {active ? (
                  <>
                    <Check className={`w-3.5 h-3.5 ${theme.activeDot}`} />
                    En cours
                  </>
                ) : (
                  <>
                    Ouvrir
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
