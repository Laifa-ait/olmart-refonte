/* eslint-disable max-lines */
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { OlmaLogo } from "./Navbar";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { subscribeToNewsletter } from "../services/newsletterService";
import {
  Store,
  ShoppingBag,
  Sparkles,
  Mail,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { BrandIcon } from "./ui/BrandIcon";
import { safeLogger } from "../utils/logger";
import { apiGet } from "../lib/api";

export const Footer: React.FC<{ isHomepage?: boolean }> = ({ isHomepage = false }) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = isHomepage || location.pathname === "/";
  const [supportEmail, setSupportEmail] = useState("contact@olmart.dz");
  const [openFooterSection, setOpenFooterSection] = useState<"buyers" | "help" | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArabic = i18n.language === "ar" || i18n.language?.startsWith("ar");

  useEffect(() => {
    let cancelled = false;
    const fetchSettings = async () => {
      try {
        const data = await apiGet<{ supportEmail?: string }>("/api/v1/public/settings");
        if (!cancelled && data?.supportEmail) {
          setSupportEmail(data.supportEmail);
        }
      } catch (error) {
        if (!cancelled) {
          safeLogger.warn("Notice: could not load dynamic support email, using standard fallback", {
            err: error instanceof Error ? error.message : String(error),
          });
        }
      }
    };
    fetchSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) {
      toast.error(
        t("Veuillez vous connecter pour vous inscrire à la newsletter") ||
          "Veuillez vous connecter pour vous inscrire à la newsletter."
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error(t("invalid_email") || "Veuillez entrer un email valide");
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeToNewsletter(email.trim());
      toast.success(t("newsletter_success") || "Inscription réussie aux alertes Olmart !");
      setEmail("");
    } catch (error: unknown) {
      safeLogger.error("Erreur lors de l'inscription à la newsletter", {
        err: error instanceof Error ? error.message : String(error),
      });
      toast.error(
        error instanceof Error && error.message === "ALREADY_SUBSCRIBED"
          ? t("already_subscribed") || "Vous êtes déjà inscrit !"
          : t("error_try_later") || "Erreur, veuillez réessayer ultérieurement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHome) {
    return null;
  }

  return (
    <footer
      id="olmart-main-footer"
      className={`bg-slate-950 text-slate-300 border-t border-slate-800 ${isHomepage ? "pb-24 sm:pb-12" : "pb-12"}`}
    >
      {/* 2. Main Navigation & Columns Grid */}
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-10 sm:pt-10 sm:pb-10">
        {/* Column 1: Brand & Vendeur Callout (Span 4) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-3">
            <OlmaLogo className="w-9 h-9 text-[#D7B76C]" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1 font-sans">
                {isArabic ? "أولمارت" : "OLMA"}
                {!isArabic && <span className="text-[#D7B76C]">RT</span>}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t("footer_marketplace_subtitle", "Premier Marketplace Algérien")}
              </span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="space-y-2 pt-1">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">Suivez Olmart</span>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                {t("footer_follow_us_desc", "Retrouvez nos nouveautés et bons plans sur nos réseaux sociaux.")}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <a
                href="https://facebook.com/olmart.dz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Olmart"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#5B4865] text-slate-400 hover:text-white border border-slate-800 hover:border-[#493852] flex items-center justify-center transition-all"
              >
                <BrandIcon name="facebook" size={16} />
              </a>
              <a
                href="https://instagram.com/olmart.dz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Olmart"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#5B4865] text-slate-400 hover:text-white border border-slate-800 hover:border-[#493852] flex items-center justify-center transition-all"
              >
                <BrandIcon name="instagram" size={16} />
              </a>
              <a
                href="https://tiktok.com/@olmart.dz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Olmart"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#5B4865] text-slate-400 hover:text-white border border-slate-800 hover:border-[#493852] flex items-center justify-center transition-all"
              >
                <BrandIcon name="tiktok" size={16} />
              </a>
              <a
                href="https://youtube.com/@olmart"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Olmart"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#5B4865] text-slate-400 hover:text-white border border-slate-800 hover:border-[#493852] flex items-center justify-center transition-all"
              >
                <BrandIcon name="youtube" size={16} />
              </a>
              <a
                href="https://linkedin.com/company/olmart"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Olmart"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#5B4865] text-slate-400 hover:text-white border border-slate-800 hover:border-[#493852] flex items-center justify-center transition-all"
              >
                <BrandIcon name="linkedin" size={16} />
              </a>
              <a
                href="https://x.com/olmart_dz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) Olmart"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#5B4865] text-slate-400 hover:text-white border border-slate-800 hover:border-[#493852] flex items-center justify-center transition-all"
              >
                <BrandIcon name="x" size={15} />
              </a>
              <a
                href="https://wa.me/213550000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Support Olmart"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#5B4865] text-slate-400 hover:text-white border border-slate-800 hover:border-[#493852] flex items-center justify-center transition-all"
              >
                <BrandIcon name="whatsapp" size={16} />
              </a>
            </div>
          </div>

          {/* Seller Card Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#302638]/60 via-slate-900 to-slate-900 border border-[#D7B76C]/20 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <Store className="w-4 h-4 text-[#D7B76C]" />
              <span>{t("footer_are_you_merchant", "Vous êtes commerçant ?")}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              {t(
                "footer_open_store_desc",
                "Rejoignez le réseau Olmart et développez votre activité dans tout le pays avec des outils de vente puissants."
              )}
            </p>
            <button
              onClick={() => navigate("/seller-onboarding")}
              className="mt-1 inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#5B4865] hover:bg-[#493852] text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer border-none"
            >
              <span>{t("footer_become_seller_btn", "Ouvrir ma boutique")}</span>
              {isArabic ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Column 2: Acheteurs & Shopping (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h5 className="border-b border-slate-800 pb-2">
            <button
              type="button"
              aria-expanded={openFooterSection === "buyers"}
              aria-controls="footer-buyers-links"
              onClick={() => setOpenFooterSection(openFooterSection === "buyers" ? null : "buyers")}
              className="flex w-full items-center justify-between gap-2 text-start text-xs font-bold uppercase tracking-widest text-white lg:pointer-events-none"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D7B76C]" />
                Acheteurs
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform lg:hidden ${openFooterSection === "buyers" ? "rotate-180" : ""}`}
              />
            </button>
          </h5>
          <ul
            id="footer-buyers-links"
            className={`${openFooterSection === "buyers" ? "block" : "hidden"} space-y-2 text-xs text-slate-400 font-medium lg:block`}
          >
            <li>
              <button
                onClick={() => navigate("/shop")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_all_products", "Catalogue général")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/shops")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_shops_directory", "Boutiques certifiées")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/shipping-calculator")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_shipping_calc_link", "Frais de livraison")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/buyer/orders")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_my_orders", "Suivre ma commande")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/refund-policy")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_returns_guarantees", "Garanties & Retours")}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Aide & Légal (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h5 className="border-b border-slate-800 pb-2">
            <button
              type="button"
              aria-expanded={openFooterSection === "help"}
              aria-controls="footer-help-links"
              onClick={() => setOpenFooterSection(openFooterSection === "help" ? null : "help")}
              className="flex w-full items-center justify-between gap-2 text-start text-xs font-bold uppercase tracking-widest text-white lg:pointer-events-none"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D7B76C]" />
                Aide & Sécurité
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform lg:hidden ${openFooterSection === "help" ? "rotate-180" : ""}`}
              />
            </button>
          </h5>
          <ul
            id="footer-help-links"
            className={`${openFooterSection === "help" ? "block" : "hidden"} space-y-2 text-xs text-slate-400 font-medium lg:block`}
          >
            <li>
              <button
                onClick={() => navigate("/support")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_support", "Centre d'assistance")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/privacy-policy")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_privacy", "Protection des données")}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/terms-of-service")}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>Conditions d’utilisation</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-olma-updates"))}
                className="hover:text-[#D7B76C] transition-colors bg-transparent border-none p-0 cursor-pointer text-start flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>{t("footer_updates_log", "Nouveautés & Mises à jour")}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Mobile App (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-4 h-4 text-[#D7B76C]" />
            <span>{t("footer_offers_app_heading", "Restez informé")}</span>
          </h5>

          <div className="space-y-2">
            <p className="text-[11px] leading-normal text-slate-400">
              {t(
                "footer_newsletter_promo_desc",
                "Recevez nos alertes bons plans et promotions exclusives chaque semaine."
              )}
            </p>
            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
              <div className="relative min-w-0 flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("footer_email_placeholder", "Votre email...")}
                  aria-label={t("footer_email_placeholder", "Votre email...")}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3.5 text-xs text-white transition-all placeholder:text-slate-500 focus:border-[#493852] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex shrink-0 cursor-pointer items-center gap-1 rounded-2xl border-none bg-[#5B4865] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#493852] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span aria-live="polite">...</span>
                ) : (
                  <>
                    <span>{t("footer_subscribe_btn", "OK")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Mobile QR Box */}
          <div className="p-4 bg-[#10182a] rounded-2xl border border-[#273149] flex items-center gap-3.5">
            <div className="w-14 h-14 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center shadow-md">
              <QRCodeSVG value="https://olmart.dz" size={46} level="M" />
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-bold text-white">{t("footer_app_title", "Application Olmart")}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t("footer_app_scan", "Scannez pour commander sur mobile")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal */}
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 pt-5 border-t border-slate-800 flex justify-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="font-medium text-[11px]">
            © {new Date().getFullYear()} {t("footer_copyright", "Olmart Marketplace Algérie. Tous droits réservés.")}
          </span>
          {supportEmail && (
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">• {supportEmail}</span>
          )}
        </div>
      </div>
    </footer>
  );
};
