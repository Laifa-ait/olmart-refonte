import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SUPER_APP_VERTICALS } from "../../data/superAppData";
import { QuickRoleAccess } from "../../types/superApp";
import { SuperAppBentoGrid } from "./SuperAppBentoGrid";
import { SuperAppRoleShortcuts } from "./SuperAppRoleShortcuts";

interface SuperAppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuperAppSwitcherModal: React.FC<SuperAppSwitcherModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, currentUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const profileCapabilities = (userProfile as (typeof userProfile & { capabilities?: unknown }) | null | undefined)
    ?.capabilities;
  const capabilities = Array.isArray(profileCapabilities)
    ? profileCapabilities.filter((capability): capability is string => typeof capability === "string")
    : [];
  const role = userProfile?.role || "buyer";

  const roleShortcuts: QuickRoleAccess[] = [];
  if (role === "seller" || capabilities.includes("seller")) {
    roleShortcuts.push({
      id: "seller",
      title: "Mon Espace Vendeur",
      subtitle: "Commandes & Produits Marketplace",
      route: "/dashboard/seller",
      badge: "Boutique",
      iconName: "Briefcase",
    });
  }
  if (role === "property_owner" || capabilities.includes("property_owner")) {
    roleShortcuts.push({
      id: "owner",
      title: "Mon Espace Bailleur",
      subtitle: "Mes Biens & Réservations",
      route: "/immo/owner",
      badge: "Bailleur",
      iconName: "Building2",
    });
  }
  if (role === "artisan" || capabilities.includes("artisan")) {
    roleShortcuts.push({
      id: "artisan",
      title: "Mon Espace Artisan",
      subtitle: "Devis & Interventions Pro",
      route: "/artisans/dashboard",
      badge: "Artisan",
      iconName: "Wrench",
    });
  }
  if (role === "admin" || role === "superadmin") {
    roleShortcuts.push({
      id: "admin",
      title: "Console Super-Admin",
      subtitle: "Modération & Écosystème Global",
      route: "/admin",
      badge: "Admin",
      iconName: "ShieldCheck",
    });
  }

  const handleNavigate = (route: string) => {
    onClose();
    // Synchronisation de la navigation avec react-router-dom pour conserver l'historique
    if (route === location.pathname) {
      return;
    }
    navigate(route, {
      state: {
        from: location.pathname + location.search,
        timestamp: Date.now(),
      },
    });
  };

  const getActiveVerticalId = () => {
    if (location.pathname.startsWith("/auto")) return "auto";
    if (location.pathname.startsWith("/immo")) return "immo";
    if (location.pathname.startsWith("/artisans") || location.pathname.startsWith("/bricolage")) return "bricolage";
    if (location.pathname.startsWith("/shops")) return "shops";
    return "marketplace";
  };

  const modal = (
    <motion.div
      key="olmart-app-switcher-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-3 sm:p-4 md:p-6"
    >
      <div onClick={onClose} className="fixed inset-0 bg-stone-950/70 backdrop-blur-md" />

      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 8 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-[#e9e1d8] bg-[#fffdfb] text-slate-900 shadow-[0_25px_60px_-15px_rgba(73,56,82,0.24)] sm:max-h-[90dvh] sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="olmart-app-switcher-title"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#eee8e0] bg-[#faf7f3] px-4 py-3.5 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6b5674] to-[#493852] text-white shadow-md shadow-[#493852]/20">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="olmart-app-switcher-title"
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-black tracking-tight text-slate-900 sm:text-lg"
              >
                Écosystème Olmart
                <span className="rounded-full border border-[#e7d8b6] bg-[#f5eedf] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#755b31]">
                  Super-App DZ
                </span>
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Basculez instantanément entre vos univers avec votre compte unique
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le sélecteur d'applications"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#e9e1d8] bg-white text-slate-500 transition-colors hover:bg-[#f1ebf3] hover:text-[#493852]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-gradient-to-b from-[#f8f5f1] via-white to-[#faf8f5] p-3 sm:space-y-5 sm:p-6">
          <SuperAppBentoGrid
            verticals={SUPER_APP_VERTICALS}
            activeId={getActiveVerticalId()}
            onSelect={handleNavigate}
          />

          <SuperAppRoleShortcuts shortcuts={roleShortcuts} hasUser={Boolean(currentUser)} onSelect={handleNavigate} />
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#eee8e0] bg-[#faf7f3] px-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] text-[11px] text-slate-600 sm:px-6 sm:text-xs sm:pb-3.5">
          <span className="flex items-center gap-2 font-semibold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-[#D7B76C]" />
            Compte Unique & Session Unifiée
          </span>
          <span className="font-extrabold text-slate-800">69 Wilayas d'Algérie</span>
        </div>
      </motion.div>
    </motion.div>
  );

  return typeof document !== "undefined"
    ? createPortal(<AnimatePresence>{isOpen ? modal : null}</AnimatePresence>, document.body, "olmart-app-switcher")
    : null;
};
