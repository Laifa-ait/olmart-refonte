import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Compass, Heart, Calendar, MessageSquare, User } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { useOlmaBookingsCount } from "../../hooks/useOlmaBookingsCount";
import { UnifiedMessagingDrawer } from "../Chat/UnifiedMessagingDrawer";

export const OlmaImmoBottomNav: React.FC<{ activeTab?: string }> = ({ activeTab }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useAuth();
  const { activeBookingsCount } = useOlmaBookingsCount();
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const isExplorerActive = location.pathname === "/immo" && !location.search.includes("view=map");
  const isFavoritesActive = location.pathname === "/immo" && location.search.includes("favorites=true");
  const isBookingsActive = location.pathname === "/immo/my-bookings" || activeTab === "stays";
  const isProfileActive = location.pathname === "/immo/profile" || activeTab === "profile";
  const isEditorActive =
    location.pathname.includes("/editor") ||
    location.pathname.includes("/new") ||
    location.pathname.includes("/publish");

  if (isProfileActive || isEditorActive) {
    return null;
  }

  const handleOpenMessaging = () => {
    if (!currentUser) {
      if (openAuthModal) openAuthModal();
      else window.dispatchEvent(new CustomEvent("auth:openModal", { detail: { mode: "login" } }));
      return;
    }
    setIsMessagingOpen(true);
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      if (openAuthModal) openAuthModal();
      else window.dispatchEvent(new CustomEvent("auth:openModal", { detail: { mode: "login" } }));
      return;
    }
    navigate("/immo/profile");
  };

  const navItems = [
    {
      id: "explorer",
      label: t("nav_explorer", "Explorer"),
      icon: Compass,
      isActive: isExplorerActive && !isFavoritesActive,
      onClick: () => navigate("/immo"),
    },
    {
      id: "favorites",
      label: t("nav_immo_favorites", "Favoris"),
      icon: Heart,
      isActive: isFavoritesActive,
      onClick: () => navigate("/immo?favorites=true"),
    },
    {
      id: "bookings",
      label: t("nav_immo_trips", "Voyages"),
      icon: Calendar,
      isActive: isBookingsActive,
      badgeCount: activeBookingsCount,
      onClick: () => navigate("/immo/my-bookings"),
    },
    {
      id: "messages",
      label: t("nav_messages_exchanges", "Messages"),
      icon: MessageSquare,
      isActive: isMessagingOpen,
      onClick: handleOpenMessaging,
    },
    {
      id: "profile",
      label: t("nav_immo_profile", "Profil"),
      icon: User,
      isActive: isProfileActive,
      onClick: handleProfileClick,
    },
  ];

  return (
    <>
      <div
        className="md:hidden fixed bottom-0 inset-x-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-[var(--olma-border-default)] shadow-[0_-6px_24px_rgba(35,74,62,0.08)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <nav
          aria-label="Navigation immobilière"
          className="w-full max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            const badge =
              "badgeCount" in item && typeof item.badgeCount === "number" && item.badgeCount > 0
                ? item.badgeCount
                : null;

            return (
              <motion.button
                key={item.id}
                id={`olma-immo-bottom-${item.id}`}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={item.onClick}
                title={item.label}
                aria-label={badge ? `${item.label} (${badge} active(s))` : item.label}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 py-0.5 cursor-pointer bg-transparent border-none focus:outline-none"
              >
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-colors duration-150 ${
                    active
                      ? "text-[var(--olma-brand-primary)]"
                      : "text-slate-500 hover:text-[var(--olma-brand-primary)]"
                  }`}
                >
                  <Icon className={`w-[1.45rem] h-[1.45rem] ${active ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
                  {badge && (
                    <span className="absolute -top-1 -right-1.5 min-w-4 h-4 bg-[var(--olma-brand-accent)] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 ring-1 ring-white shadow-2xs">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] leading-4 ${active ? "font-semibold text-[var(--olma-brand-primary)]" : "font-medium text-[var(--olma-text-muted)]"}`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Unified Messaging Drawer */}
      {isMessagingOpen && <UnifiedMessagingDrawer isOpen={isMessagingOpen} onClose={() => setIsMessagingOpen(false)} />}
    </>
  );
};
