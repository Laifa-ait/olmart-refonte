import React from "react";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Heart, Package, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface MobileMenuQuickActionsProps {
  onNavigate: (path: string) => void;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const MobileMenuQuickActions: React.FC<MobileMenuQuickActionsProps> = ({
  onNavigate,
  onClose,
  onOpenCart,
}) => {
  const { t } = useTranslation();
  const { cart = [] } = useCart();
  const cartCount = cart.reduce((acc: number, it: { quantity?: number }) => acc + (it.quantity || 1), 0);

  const actions = [
    {
      id: "catalog",
      label: t("Catalogue"),
      icon: ShoppingBag,
      color: "text-[#5B4865]",
      bg: "bg-[#F1EDF2]",
      border: "border-[#E2D9E5]",
      onClick: () => {
        onNavigate("/shop");
        onClose();
      },
    },
    {
      id: "wishlist",
      label: t("Favoris"),
      icon: Heart,
      color: "text-[#9A7A43]",
      bg: "bg-[#FBF6E9]",
      border: "border-[#EDE1C3]",
      onClick: () => {
        onNavigate("/shop#wishlist");
        onClose();
      },
    },
    {
      id: "orders",
      label: t("Commandes"),
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200/60",
      onClick: () => {
        onNavigate("/dashboard/buyer?tab=orders");
        onClose();
      },
    },
    {
      id: "cart",
      label: t("Panier"),
      icon: ShoppingCart,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200/60",
      badge: cartCount > 0 ? String(cartCount) : undefined,
      onClick: () => {
        onClose();
        if (onOpenCart) onOpenCart();
      },
    },
  ];

  return (
    <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white divide-x divide-zinc-100 rtl:divide-x-reverse">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            type="button"
            onClick={act.onClick}
            className="relative flex min-w-0 flex-col items-center justify-center gap-1.5 px-1 py-2.5 text-center transition-colors hover:bg-zinc-50 active:bg-zinc-100 cursor-pointer group"
          >
            <div
              className={`w-8 h-8 rounded-xl ${act.bg} ${act.color} flex items-center justify-center transition-transform group-hover:scale-105 border ${act.border}`}
            >
              <Icon className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="max-w-full truncate text-[10px] font-semibold text-zinc-700">
              {act.label}
            </span>
            {act.badge && (
              <span className="absolute right-1 top-1 rounded-full bg-[#6B5874] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                {act.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
