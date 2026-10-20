import React, { useState, useEffect } from "react";
import {
  Menu,
  User as UserIcon,
  Heart,
  ShoppingBag,
  Globe,
  Truck,
  Headphones,
  LayoutGrid,
  ArrowLeft,
  Store,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import { useUI } from "../context/UIContext";
import { Language } from "../domains/home/homepage.types";
import { AdvancedSearchbar as Searchbar } from "./Search/AdvancedSearchbar";
import { NotificationCenter } from "./NotificationCenter";
import { SuperAppSwitcherModal } from "./common/SuperAppSwitcherModal";
import { UserAvatar } from "./ui/UserAvatar";

export interface OlmaLogoProps {
  className?: string;
}

export const OlmaLogo: React.FC<OlmaLogoProps> = ({ className = "w-8 h-8" }) => (
  <Store className={className} strokeWidth={1.8} role="img" aria-label="Boutique Olmart" />
);

export const Navbar: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const { cart, wishlist } = useCart();
  const { setSearchQuery, setActiveCategory, setIsSaleFilterActive, setActiveTag } = useShop();
  const { setIsCartOpen, setIsWishlistOpen, setIsMobileMenuOpen, setIsAccountMenuOpen } = useUI();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isCategoriesPage = location.pathname === "/categories";
  const isProductPage = location.pathname.startsWith("/product/");

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const lang = i18n.language as Language;

  const [isScrolled, setIsScrolled] = useState(false);

  const cartCount = React.useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const setLang = (l: string) => {
    i18n.changeLanguage(l);
  };

  const handleLogoClick = () => {
    navigate("/");
    setSearchQuery("");
    setActiveCategory("Tous");
    setIsSaleFilterActive(false);
    setActiveTag(null);
  };

  return (
    <>
      <div
        id="olmart-top-utility-bar"
        className="bg-[#241D2D] text-slate-300 text-xs font-medium px-4 sm:px-6 lg:px-12 py-1.5 gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide justify-between items-center relative hidden lg:flex border-b border-white/10"
      >
        <div className="flex items-center mx-auto w-full max-w-[90rem] justify-between relative z-10">
          {/* The platform list is intentionally opened from this button. */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSwitcherOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:border-white/20 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B76C]"
              aria-haspopup="dialog"
              aria-label={t("nav_applications", "Applications Olmart")}
              title={t("nav_applications", "Applications Olmart")}
            >
              <LayoutGrid className="h-4 w-4 text-[#D7B76C] transition-transform group-hover:rotate-12" />
              <span>{t("nav_applications", "Applications")}</span>
              <span className="hidden xl:inline text-[10px] font-medium text-slate-400">Olmart</span>
            </button>
          </div>

          {/* Quick Tools & Seller CTA */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              to="/shipping-calculator"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("shipping_calc") || "Tarifs Livraison 69 Wilayas"}</span>
            </Link>

            <span className="text-slate-700">|</span>

            <Link
              to="/support"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("support") || "Aide & Support"}</span>
            </Link>

            <span className="text-slate-700">|</span>

            <button
              onClick={() => {
                if (currentUser && userProfile?.role === "seller") {
                  navigate("/dashboard/seller");
                } else if (currentUser) {
                  navigate("/dashboard/buyer");
                } else {
                  navigate("/auth?role=seller");
                }
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#D7B76C] hover:bg-[#E5CE91] text-[#2B2331] font-extrabold transition-all shadow-xs cursor-pointer border-none uppercase tracking-wider text-[10px]"
            >
              {t("sell_on_olma")}
            </button>
          </div>
        </div>
      </div>

      <nav className={`${
        isProductPage
          ? "sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9E3EA] shadow-xs"
          : `sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-slate-200 transition-shadow duration-200 ${
              isScrolled ? "shadow-[0_4px_20px_rgba(15,23,42,0.06)]" : "shadow-xs"
            }`
      } py-1.5 sm:py-2`}>
        {/* On mobile for Product Details: Dedicated sticky search bar with back button */}
        {isProductPage && (
          <div className="flex md:hidden items-center justify-between w-full gap-2.5 h-11 px-3 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-1);
                } else {
                  navigate("/shop");
                }
              }}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 shadow-xs transition-all active:scale-95"
              aria-label="Retour"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </button>

            <div className="flex-1 min-w-0">
              <Searchbar variant="transparent" />
            </div>
          </div>
        )}

        <div className={`${isProductPage ? "hidden md:grid" : "grid"} grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[auto_minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_minmax(20rem,1.6fr)_minmax(0,1fr)] items-center px-4 sm:px-6 md:px-8 mx-auto w-full max-w-[90rem] relative gap-x-2 sm:gap-x-3 md:gap-x-2 xl:gap-x-5 gap-y-2 xl:gap-y-0`}>
          {/* Logo */}
          <div className="col-start-1 row-start-1 flex h-11 min-w-0 items-center justify-start sm:h-12">
              <button
                 onClick={handleLogoClick}
                 className="flex items-center gap-2 shrink-0 select-none cursor-pointer group bg-transparent border-none p-0"
                 aria-label="Accueil Olmart"
               >
                 <span className="flex items-center gap-2.5 transition-transform duration-200 group-hover:scale-[1.02]">
                   <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#F3EFF4] text-[#4B3B55] ring-1 ring-[#E6DEE8] sm:h-[34px] sm:w-[34px]">
                     <Store className="h-[19px] w-[19px] stroke-[1.8]" aria-hidden="true" />
                   </span>
                   <span className="font-sans text-[17px] font-extrabold leading-none tracking-[0.1em] text-[#35283F] sm:text-[18px]">
                     OLMART
                   </span>
                 </span>
              </button>
          </div>

          {!isCategoriesPage && (
            <div className={`col-span-2 row-start-2 flex min-w-0 w-full items-center justify-center md:col-start-2 md:col-span-1 md:row-start-1 ${isProductPage ? "xl:px-12 xl:max-w-2xl" : "xl:px-8 xl:max-w-3xl"}`}>
              <div className="w-full min-w-0">
                <Searchbar variant={isProductPage ? "discreet" : "default"} />
              </div>
            </div>
          )}

          {/* Commandes accessibles au pouce sur téléphone, complètes sur tablette. */}
          <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 md:col-start-3 md:row-start-1 md:gap-0.5 xl:hidden">
               <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label={t("Mon Panier") || "Mon Panier"}
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-slate-700 transition-all hover:bg-[#F5F2F4] hover:text-[#5B4865] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62] active:scale-95 md:h-11 md:w-11"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6B5874] text-white flex items-center justify-center text-[10px] font-black shadow-xs border border-white tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                aria-label={wishlist.length > 0 ? `${t("Favoris") || "Favoris"} (${wishlist.length})` : t("Favoris") || "Favoris"}
                className="relative hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-transparent text-slate-700 transition-all hover:bg-[#F5F2F4] hover:text-[#5B4865] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62] active:scale-95 sm:flex"
              >
                <Heart className="h-5 w-5 stroke-[1.8]" />
                {wishlist.length > 0 && (
                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border border-white bg-[#6B5874] px-1 text-[9px] font-bold text-white shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!currentUser) navigate("/auth", { replace: true });
                  else setIsAccountMenuOpen(true);
                }}
                aria-label="Compte utilisateur"
                className="hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-transparent text-slate-700 transition-all hover:bg-[#F5F2F4] hover:text-[#5B4865] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62] active:scale-95 sm:flex"
              >
                {currentUser ? (
                  <UserAvatar
                    photoURL={userProfile?.photoURL || currentUser.photoURL}
                    displayName={userProfile?.displayName || currentUser.displayName}
                    email={currentUser.email}
                    providerData={currentUser.providerData}
                    size="sm"
                    alt={userProfile?.displayName || "Profil"}
                  />
                ) : (
                  <UserIcon className="h-5 w-5 stroke-[1.8]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsSwitcherOpen(true)}
                aria-label={t("nav_applications")}
                title={t("nav_applications")}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-slate-700 transition-all hover:bg-[#F5F2F4] hover:text-[#5B4865] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62] active:scale-95 md:h-11 md:w-11"
              >
                <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
              </button>
              
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label={t("Menu") || "Menu"}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-slate-700 transition-all hover:bg-[#F5F2F4] hover:text-[#5B4865] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A62] active:scale-95 md:h-11 md:w-11"
              >
                <Menu className="w-5 h-5 stroke-[1.8]" />
              </button>
          </div>

          <div className="hidden xl:col-start-3 xl:row-start-1 xl:flex min-w-0 items-center justify-end gap-2 xl:gap-3 relative shrink-0">
            <div className="hidden lg:block">
              <NotificationCenter />
            </div>

            {/* Desktop Language Selector */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsLangDropdownOpen(!isLangDropdownOpen);
                  } else if (e.key === "Escape") {
                    setIsLangDropdownOpen(false);
                  }
                }}
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="true"
                aria-label="Changer de langue"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#5B4865] hover:bg-[#F7F4F1] border border-[#E7E1E8] transition-all h-9 px-3 bg-[#FBFAF8] rounded-full cursor-pointer"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="uppercase">{lang ? lang.split("-")[0] : "fr"}</span>
              </button>
              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-50 cursor-default" onClick={() => setIsLangDropdownOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 shadow-xl z-[60] py-2 rounded-2xl min-w-[140px] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    {[
                      { code: "fr", name: "Français" },
                      { code: "ar", name: "العربية" },
                      { code: "en", name: "English" },
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm font-medium transition-colors bg-transparent border-none cursor-pointer flex items-center justify-between gap-2 hover:bg-slate-50 ${
                          lang === l.code ? "text-[#5B4865] font-bold" : "text-slate-600"
                        }`}
                      >
                        <span>{l.name}</span>
                        {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden lg:flex items-center justify-center text-slate-700 hover:text-[#5B4865] hover:bg-[#F7F4F1] border border-[#E7E1E8] transition-all cursor-pointer relative bg-[#FBFAF8] w-10 h-10 rounded-full"
            >
              <Heart className="w-5 h-5 stroke-[1.5] text-slate-600" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#6B5874] text-white flex items-center justify-center text-[9px] font-bold shadow-sm border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Panier */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={t("Mon Panier") || "Mon Panier"}
              className="flex items-center justify-center text-slate-700 hover:text-[#5B4865] hover:bg-[#F7F4F1] border border-[#E7E1E8] transition-all cursor-pointer relative bg-[#FBFAF8] w-10 h-10 rounded-full active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8] text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6B5874] text-white flex items-center justify-center text-[10px] font-black shadow-xs border border-white tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Google Account Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!currentUser) {
                    navigate("/auth", { replace: true });
                  } else {
                    setIsAccountMenuOpen(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!currentUser) {
                      navigate("/auth", { replace: true });
                    } else {
                      setIsAccountMenuOpen(true);
                    }
                  }
                }}
                aria-haspopup="true"
                aria-label="Compte utilisateur"
                className={`flex items-center justify-center transition-all cursor-pointer w-10 h-10 rounded-full border ${
                  currentUser
                    ? "p-0.5 border-slate-300 hover:ring-2 hover:ring-[#B79A62]/30 hover:border-[#B79A62] bg-white"
                    : "text-slate-700 hover:text-[#5B4865] hover:bg-[#F7F4F1] border-[#E7E1E8] bg-[#FBFAF8]"
                }`}
              >
                {currentUser ? (
                  <UserAvatar
                    photoURL={userProfile?.photoURL || currentUser.photoURL}
                    displayName={userProfile?.displayName || currentUser.displayName}
                    email={currentUser.email}
                    providerData={currentUser.providerData}
                    size="sm"
                    alt={userProfile?.displayName || "Profil"}
                  />
                ) : (
                  <UserIcon className="w-5 h-5 stroke-[1.5] text-slate-600" />
                )}
              </button>
            </div>

            {/* PC Version Hamburger / Sandwich Menu on the Right */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="hidden lg:flex items-center justify-center text-slate-700 hover:text-[#5B4865] hover:bg-[#F7F4F1] border border-[#E7E1E8] transition-all cursor-pointer bg-[#FBFAF8] w-10 h-10 rounded-full shrink-0"
              title={t("menu") || "Menu"}
            >
              <Menu className="w-5 h-5 stroke-[1.5] text-slate-600" />
            </button>
          </div>
        </div>

      </nav>

      {/* Super-App Switcher Modal */}
      <SuperAppSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
};
