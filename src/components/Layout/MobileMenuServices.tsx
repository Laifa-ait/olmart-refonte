import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { Wrench, Building2, Store, Scale, Truck, Headphones, Car, ChevronDown, Layers3 } from "lucide-react";

interface MobileMenuServicesProps {
  onNavigate: (path: string) => void;
  onClose: () => void;
}

export const MobileMenuServices: React.FC<MobileMenuServicesProps> = ({
  onNavigate,
  onClose,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const services = [
    {
      id: "auto",
      title: "Olma Auto",
      subtitle: "Motors & Véhicules",
      icon: Car,
      path: "/auto",
      badge: "Motors DZ",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-500/10",
      borderColor: "hover:border-orange-200",
    },
    {
      id: "brico",
      title: "Olma Brico",
      subtitle: "Artisans & Travaux",
      icon: Wrench,
      path: "/bricolage",
      badge: "Artisans",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-500/10",
      borderColor: "hover:border-amber-200",
    },
    {
      id: "immo",
      title: "Olma Immo",
      subtitle: "Location & Vente",
      icon: Building2,
      path: "/immo",
      badge: "Immobilier",
      iconColor: "text-[#5B4865]",
      iconBg: "bg-[#F1EDF2]",
      borderColor: "hover:border-[#D8CBDD]",
    },
    {
      id: "shops",
      title: "Boutiques",
      subtitle: "Marques & Stores",
      icon: Store,
      path: "/shops",
      badge: "Officiel",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-500/10",
      borderColor: "hover:border-blue-200",
    },
    {
      id: "comparator",
      title: "Comparateur",
      subtitle: "Prix & Produits",
      icon: Scale,
      path: "/comparator",
      badge: "Top Prix",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-500/10",
      borderColor: "hover:border-purple-200",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls="mobile-menu-services-list"
        onClick={() => setIsExpanded((open) => !open)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-zinc-50 rtl:text-right"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1EDF2] text-[#5B4865]">
          <Layers3 className="h-4.5 w-4.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-zinc-900">
            {t("Univers & Services Olmart")}
          </span>
          <span className="mt-0.5 block text-[11px] text-zinc-500">
            58 Wilayas
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="mobile-menu-services-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-100"
          >
            <div className="grid grid-cols-2 gap-2 p-2.5">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.path);
                      onClose();
                    }}
                    className={`flex min-h-[58px] items-center gap-2 rounded-xl border border-zinc-200/80 bg-white p-2 text-left transition-colors hover:bg-zinc-50 ${item.borderColor} rtl:text-right`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor}`}>
                      <Icon className="h-4 w-4 stroke-[2]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold leading-tight text-zinc-900">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] leading-tight text-zinc-500">
                        {item.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 px-2.5 pb-2.5">
              <button
                type="button"
                onClick={() => {
                  onNavigate("/shipping-calculator");
                  onClose();
                }}
                className="flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 rtl:text-right"
              >
                <Truck className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span className="truncate">{t("Tarifs Livraison")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate("/support");
                  onClose();
                }}
                className="flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 rtl:text-right"
              >
                <Headphones className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span className="truncate">{t("Support & Aide")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
