import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Plus, Heart, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const OlmaAutoBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useAuth();

  const isHomeActive = location.pathname === "/auto";
  const isSearchActive = location.pathname.startsWith("/auto/catalog") && !location.search.includes("tab=favorites");
  const isVendreActive = location.pathname === "/auto/deposer";
  const isFavoritesActive = location.search.includes("tab=favorites");
  const isAccountActive =
    location.pathname.startsWith("/dashboard/seller/auto") ||
    location.pathname.startsWith("/profile");

  const handleAccountClick = () => {
    if (!currentUser) {
      if (openAuthModal) openAuthModal();
      else window.dispatchEvent(new CustomEvent("auth:openModal", { detail: { mode: "login" } }));
      return;
    }
    navigate("/profile");
  };

  const navItems = [
    {
      id: "home",
      label: "Accueil",
      icon: Home,
      isActive: isHomeActive,
      onClick: () => navigate("/auto"),
    },
    {
      id: "search",
      label: "Rechercher",
      icon: Search,
      isActive: isSearchActive,
      onClick: () => navigate("/auto/catalog"),
    },
    {
      id: "vendre",
      label: "Vendre",
      icon: Plus,
      isSpecial: true,
      isActive: isVendreActive,
      onClick: () => navigate("/auto/deposer"),
    },
    {
      id: "favorites",
      label: "Favoris",
      icon: Heart,
      isActive: isFavoritesActive,
      onClick: () => navigate("/auto/catalog?tab=favorites"),
    },
    {
      id: "account",
      label: "Compte",
      icon: User,
      isActive: isAccountActive,
      onClick: handleAccountClick,
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <nav aria-label="Navigation Olma Auto" className="mx-auto flex max-w-md items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-current={item.isActive ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172B4D] ${
                item.isSpecial
                  ? "text-[#172B4D]"
                  : item.isActive
                    ? "bg-[#f0f5d9] text-[#172B4D]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className={`flex h-8 w-9 items-center justify-center rounded-xl ${item.isSpecial ? "bg-[#D9F66F]" : ""}`}>
                <Icon className={`h-5 w-5 ${item.isSpecial ? "stroke-[2.5]" : "stroke-[2]"}`} />
              </span>
              <span className={`max-w-full truncate text-[10px] leading-none ${item.isActive || item.isSpecial ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
