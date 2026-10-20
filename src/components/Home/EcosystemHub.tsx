import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, Car, ShoppingBag, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EcosystemSpace {
  name: string;
  route: string;
  label: string;
  description: string;
  icon: LucideIcon;
  theme: string;
  labelStyle: string;
  iconStyle: string;
  watermarkStyle: string;
  accentStyle: string;
}

const spaces: EcosystemSpace[] = [
  {
    name: "Marketplace",
    route: "/shop",
    label: "home_ecosystem_marketplace_label",
    description: "home_ecosystem_marketplace_description",
    icon: ShoppingBag,
    theme: "bg-[#0d3b2e] text-white",
    labelStyle: "bg-white/10 text-emerald-100 border-white/10",
    iconStyle: "bg-[#d5f274] text-[#123b30]",
    watermarkStyle: "text-emerald-200/10",
    accentStyle: "text-[#d5f274]",
  },
  {
    name: "Olma Immo",
    route: "/immo",
    label: "home_ecosystem_immo_label",
    description: "home_ecosystem_immo_description",
    icon: Building2,
    theme: "bg-[#e9f0e9] text-[#173d34]",
    labelStyle: "bg-white/75 text-[#346052] border-white/80",
    iconStyle: "bg-white text-[#24745d]",
    watermarkStyle: "text-[#83a992]/20",
    accentStyle: "text-[#24745d]",
  },
  {
    name: "Artisans",
    route: "/artisans",
    label: "home_ecosystem_artisans_label",
    description: "home_ecosystem_artisans_description",
    icon: Wrench,
    theme: "bg-[#f3ead8] text-[#3b3020]",
    labelStyle: "bg-white/75 text-[#76552a] border-white/80",
    iconStyle: "bg-white text-[#a46a17]",
    watermarkStyle: "text-[#d19b48]/20",
    accentStyle: "text-[#9a6417]",
  },
  {
    name: "Olma Auto",
    route: "/auto",
    label: "home_ecosystem_auto_label",
    description: "home_ecosystem_auto_description",
    icon: Car,
    theme: "bg-[#10203b] text-white",
    labelStyle: "bg-white/10 text-slate-200 border-white/10",
    iconStyle: "bg-[#d5f274] text-[#10203b]",
    watermarkStyle: "text-slate-200/10",
    accentStyle: "text-[#d5f274]",
  },
];

export const EcosystemHub: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <section
      aria-labelledby="ecosystem-heading"
      className="mx-auto w-full max-w-[90rem] px-4 pb-10 pt-7 sm:px-6 sm:pb-14 md:px-8 md:pt-10"
    >
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
            {t("home_ecosystem_eyebrow")}
          </p>
          <h2
            id="ecosystem-heading"
            className="font-display text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl md:text-4xl"
          >
            {t("home_ecosystem_title")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            {t("home_ecosystem_intro")}
          </p>
        </div>
        <div className="hidden items-center gap-2 pb-1 text-xs font-semibold text-slate-500 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t("home_ecosystem_account")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {spaces.map((space, index) => {
          const Icon = space.icon;

          return (
            <Link
              key={space.route}
              to={space.route}
              className={`group relative isolate flex min-h-[238px] flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.04] p-5 shadow-[0_8px_26px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:min-h-[258px] sm:p-6 ${space.theme}`}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-8 -top-10 -z-10 transition-transform duration-500 group-hover:scale-110 ${space.watermarkStyle}`}
              >
                <Icon className="h-48 w-48 stroke-[0.8]" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -left-12 -z-10 h-44 w-44 rounded-full border border-current opacity-[0.07]"
              />

              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105 ${space.iconStyle}`}>
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                </div>
                <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${space.labelStyle}`}>
                  {t(space.label)}
                </span>
              </div>

              <div className="mt-auto pt-8">
                <div className="mb-2 text-[10px] font-bold tracking-[0.18em] opacity-50">
                  0{index + 1} <span className="px-1">/</span> 04
                </div>
                <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">{space.name}</h3>
                <p className="mt-1.5 max-w-[17rem] text-xs leading-5 opacity-75 sm:text-sm">
                  {t(space.description)}
                </p>
                <div className={`mt-5 inline-flex items-center gap-2 text-xs font-extrabold ${space.accentStyle}`}>
                  <span>{t("home_ecosystem_open")}</span>
                  <ArrowUpRight className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${i18n.dir() === "rtl" ? "rotate-[-90deg]" : ""}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
