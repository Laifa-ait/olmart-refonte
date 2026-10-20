/* eslint-disable max-lines */
import React from "react";
import { CustomPageSection, CustomPageTheme } from "../../../domains/seller/customPage.types";
import { readableTextColor } from "./themeColorUtils";

interface SectionContentAndTrustProps {
  section: CustomPageSection;
  theme: CustomPageTheme;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const spacingScale: Record<string, number> = { sm: 16, md: 32, lg: 48, xl: 64 };
const radiusScale: Record<string, number> = { none: 0, sm: 8, md: 16, lg: 24 };

export const SectionContentAndTrust: React.FC<SectionContentAndTrustProps> = ({
  section,
  theme,
  isEditable,
  isSelected,
  onSelect,
}) => {
  const styles = section.styles || {};
  const settings = section.settings as unknown as Record<string, unknown>;
  const paddingY = typeof styles.paddingY === "number" ? styles.paddingY : spacingScale[styles.paddingY || "md"];
  const paddingX = styles.paddingX ?? 16;
  const maxWidth = styles.containerWidth === "full" ? "w-full" : "max-w-6xl mx-auto";
  const sectionStyle: React.CSSProperties = {
    backgroundColor: styles.backgroundColor || "transparent",
    color: styles.textColor || readableTextColor(styles.backgroundColor || theme.canvasColor),
    paddingBlock: `${paddingY}px`,
    paddingInline: `${paddingX}px`,
    borderRadius: styles.borderRadius ? `${radiusScale[styles.borderRadius]}px` : undefined,
  };
  const selectedClass = isEditable && isSelected ? "ring-2 ring-inset ring-[#F97316]" : "";
  const wrapperClass = `cursor-pointer transition-all ${selectedClass}`;
  const headingClass = "mb-4 text-xl font-bold md:text-2xl";
  const headingStyle: React.CSSProperties = {
    color: theme.primaryColor,
    fontSize: `clamp(1.25rem, 3vw, ${theme.titleFontSizePx ?? 32}px)`,
  };

  if (section.type === "brand_story") {
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div className={`${maxWidth} flex flex-col items-center gap-8 md:flex-row`}>
          {typeof settings.imageUrl === "string" && settings.imageUrl && (
            <img
              src={settings.imageUrl}
              alt={String(settings.heading || "Notre atelier")}
              className="h-64 w-full rounded-2xl object-cover md:w-1/2"
            />
          )}
          <div className="min-w-0 flex-1">
            <h2 className={headingClass} style={headingStyle}>
              {String(settings.heading || "Notre histoire")}
            </h2>
            <p
              className="whitespace-pre-line text-sm leading-relaxed opacity-90 md:text-base"
              style={{ fontSize: `${theme.bodyFontSizePx ?? 16}px` }}
            >
              {String(settings.bodyText || "")}
            </p>
            {typeof settings.signature === "string" && settings.signature && (
              <p className="mt-4 font-semibold italic" style={{ color: theme.accentColor }}>
                {settings.signature}
              </p>
            )}
            {typeof settings.yearsOfExperience === "number" && settings.yearsOfExperience > 0 && (
              <p className="mt-2 text-sm opacity-70">{settings.yearsOfExperience} ans de savoir-faire</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "featured_categories") {
    const categories = Array.isArray(settings.categories)
      ? (settings.categories as Array<Record<string, unknown>>)
      : [];
    const carousel = settings.layout === "carousel";
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div className={maxWidth}>
          <h2 className={`${headingClass} text-center`} style={headingStyle}>
            {String(settings.title || "Nos catégories")}
          </h2>
          {categories.length === 0 ? (
            <EmptyState isEditable={isEditable} text="Ajoutez des catégories pour personnaliser cette vitrine." />
          ) : (
            <div
              className={
                carousel ? "flex gap-4 overflow-x-auto pb-2" : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              }
            >
              {categories.map((category, index) => (
                <article
                  key={String(category.id || index)}
                  className={`overflow-hidden border border-black/5 bg-white shadow-sm ${carousel ? "w-48 shrink-0" : ""}`}
                  style={{
                    borderRadius: `${theme.borderRadiusPx ?? 12}px`,
                    backgroundColor: theme.surfaceColor || "#FFFFFF",
                  }}
                >
                  {typeof category.imageUrl === "string" && category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={String(category.name || "Catégorie")}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-100" />
                  )}
                  <h3 className="p-3 text-center text-sm font-semibold">{String(category.name || "Catégorie")}</h3>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "curated_collections") {
    const collections = Array.isArray(settings.collections)
      ? (settings.collections as Array<Record<string, unknown>>)
      : [];
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div className={maxWidth}>
          <h2 className={`${headingClass} text-center`} style={headingStyle}>
            {String(settings.title || "Nos collections")}
          </h2>
          {collections.length === 0 ? (
            <EmptyState isEditable={isEditable} text="Créez une collection et sélectionnez les produits à présenter." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection, index) => (
                <article
                  key={String(collection.id || index)}
                  className="overflow-hidden border border-black/5 bg-white shadow-sm"
                  style={{
                    borderRadius: `${theme.borderRadiusPx ?? 12}px`,
                    backgroundColor: theme.surfaceColor || "#FFFFFF",
                  }}
                >
                  {typeof collection.imageUrl === "string" && collection.imageUrl ? (
                    <img
                      src={collection.imageUrl}
                      alt={String(collection.title || "Collection")}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-100" />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{String(collection.title || "Collection")}</h3>
                    <p className="mt-1 text-sm opacity-70">
                      {Array.isArray(collection.productIds) ? collection.productIds.length : 0} article(s)
                      sélectionné(s)
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "showcase_video") {
    const videoUrl = typeof settings.videoUrl === "string" ? settings.videoUrl : "";
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div className={`${maxWidth} text-center`}>
          <h2 className={headingClass} style={headingStyle}>
            {String(settings.title || "Découvrez notre univers")}
          </h2>
          {videoUrl ? (
            <video
              src={videoUrl}
              poster={typeof settings.posterUrl === "string" ? settings.posterUrl : undefined}
              controls={!settings.autoplay}
              autoPlay={Boolean(settings.autoplay)}
              loop={Boolean(settings.loop)}
              muted={Boolean(settings.muted) || Boolean(settings.autoplay)}
              playsInline
              className="mx-auto max-h-[560px] w-full rounded-2xl bg-black object-cover"
            />
          ) : (
            <EmptyState isEditable={isEditable} text="Ajoutez un lien vidéo sécurisé pour présenter votre boutique." />
          )}
        </div>
      </section>
    );
  }

  if (section.type === "delivery_info") {
    const tariffs = Array.isArray(settings.customTariffs)
      ? (settings.customTariffs as Array<Record<string, unknown>>)
      : [];
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div
          className={`${maxWidth} rounded-2xl border border-black/5 p-6 text-center md:p-8`}
          style={{ backgroundColor: theme.surfaceColor || "#FFFFFF", borderRadius: `${theme.borderRadiusPx ?? 16}px` }}
        >
          <span
            className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${theme.accentColor || theme.primaryColor}20`, color: theme.primaryColor }}
          >
            Livraison
          </span>
          <h2 className={headingClass} style={headingStyle}>
            {String(settings.title || "Livraison partout en Algérie")}
          </h2>
          <p className="text-sm opacity-75">
            Délai habituel : <strong>{String(settings.defaultTimeframe || "24 h à 72 h")}</strong>
          </p>
          {typeof settings.freeShippingAbove === "number" && (
            <p className="mt-3 text-sm font-semibold">
              Livraison offerte à partir de {settings.freeShippingAbove.toLocaleString("fr-DZ")} DZD
            </p>
          )}
          {tariffs.length > 0 && (
            <div className="mt-5 grid gap-2 text-left sm:grid-cols-2 lg:grid-cols-3">
              {tariffs.map((tariff, index) => (
                <div key={index} className="rounded-xl border border-black/5 bg-white/70 p-3 text-sm">
                  <p className="font-semibold">{String(tariff.wilayaName || "Wilaya")}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {String(tariff.estimatedDays || "Délai à confirmer")} ·{" "}
                    {typeof tariff.priceDZD === "number"
                      ? `${tariff.priceDZD.toLocaleString("fr-DZ")} DZD`
                      : "Tarif à confirmer"}
                  </p>
                  <p className="mt-1 text-xs opacity-70">
                    {tariff.homeDeliveryAvailable === false ? "Retrait en point relais" : "Livraison à domicile"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "return_policy") {
    const feeText =
      settings.returnShippingFeeBy === "free"
        ? "Les frais de retour sont offerts."
        : settings.returnShippingFeeBy === "seller"
          ? "Les frais de retour sont à la charge de la boutique."
          : "Les frais de retour sont à la charge du client.";
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div
          className={`${maxWidth} rounded-2xl border border-black/5 p-6`}
          style={{ backgroundColor: theme.surfaceColor || "#FFFFFF", borderRadius: `${theme.borderRadiusPx ?? 16}px` }}
        >
          <h2 className={headingClass} style={headingStyle}>
            {String(settings.title || "Retours et échanges")}
          </h2>
          <p className="text-sm leading-relaxed" style={{ fontSize: `${theme.bodyFontSizePx ?? 16}px` }}>
            {String(settings.conditions || "Les conditions de retour seront précisées par la boutique.")}
          </p>
          <p className="mt-3 text-sm opacity-75">
            Demande à effectuer sous {String(settings.delayDays || 14)} jours. {feeText}
          </p>
        </div>
      </section>
    );
  }

  if (section.type === "verified_reviews") {
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div
          className={`${maxWidth} rounded-2xl border border-black/5 p-6 text-center`}
          style={{ backgroundColor: theme.surfaceColor || "#FFFFFF", borderRadius: `${theme.borderRadiusPx ?? 16}px` }}
        >
          <h2 className={headingClass} style={headingStyle}>
            {String(settings.title || "Avis de nos clients")}
          </h2>
          <p className="text-sm opacity-70">Les avis vérifiés de vos clients apparaîtront ici après leurs achats.</p>
        </div>
      </section>
    );
  }

  if (section.type === "faq_accordion") {
    const items = Array.isArray(settings.items) ? (settings.items as Array<Record<string, unknown>>) : [];
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div className={`${maxWidth} max-w-3xl`}>
          <h2 className={`${headingClass} text-center`} style={headingStyle}>
            {String(settings.title || "Questions fréquentes")}
          </h2>
          {items.length === 0 && (
            <EmptyState isEditable={isEditable} text="Ajoutez les questions que vos clients vous posent souvent." />
          )}
          <div className="space-y-3">
            {items.map((item, index) => (
              <details
                key={index}
                className="border border-black/5 p-4"
                style={{
                  borderRadius: `${theme.borderRadiusPx ?? 12}px`,
                  backgroundColor: theme.surfaceColor || "#FFFFFF",
                  color: readableTextColor(theme.surfaceColor),
                }}
              >
                <summary className="cursor-pointer font-semibold">{String(item.question || "Question")}</summary>
                <p className="mt-2 text-sm leading-relaxed opacity-75">{String(item.answer || "")}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "contact_footer") {
    const socialLinks: Array<[string, string]> = [
      ["Instagram", typeof settings.socialInstagram === "string" ? settings.socialInstagram : ""],
      ["Facebook", typeof settings.socialFacebook === "string" ? settings.socialFacebook : ""],
      ["TikTok", typeof settings.socialTiktok === "string" ? settings.socialTiktok : ""],
    ].filter(([, value]) => Boolean(value));
    return (
      <section onClick={isEditable ? onSelect : undefined} className={wrapperClass} style={sectionStyle}>
        <div
          className={`${maxWidth} flex flex-col gap-5 border-t border-black/10 pt-6 sm:flex-row sm:items-start sm:justify-between`}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: theme.primaryColor }}>
              Contact boutique
            </h2>
            {typeof settings.address === "string" && settings.address && (
              <p className="mt-1 text-sm">{settings.address}</p>
            )}
            {typeof settings.wilaya === "string" && settings.wilaya && <p className="text-sm">{settings.wilaya}</p>}
            {typeof settings.workingHours === "string" && settings.workingHours && (
              <p className="mt-2 text-sm opacity-70">{settings.workingHours}</p>
            )}
          </div>
          <div className="text-sm sm:text-right">
            {typeof settings.shopPhone === "string" && settings.shopPhone && (
              <p>
                <a href={`tel:${settings.shopPhone}`} className="font-semibold">
                  {settings.shopPhone}
                </a>
              </p>
            )}
            {typeof settings.shopEmail === "string" && settings.shopEmail && (
              <p>
                <a href={`mailto:${settings.shopEmail}`}>{settings.shopEmail}</a>
              </p>
            )}
            <div className="mt-2 flex gap-3 sm:justify-end">
              {socialLinks.map(([label, value]) => (
                <span key={label} className="font-medium" style={{ color: theme.primaryColor }}>
                  {label}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

const EmptyState: React.FC<{ isEditable?: boolean; text: string }> = ({ isEditable, text }) => (
  <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-7 text-center text-sm text-[#667085]">
    {isEditable ? text : "Cette boutique prépare cette section."}
  </div>
);
