/* eslint-disable max-lines */
import React from "react";
import { Image as ImageIcon, Link as LinkIcon, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Product } from "../../../../../domains/product/product.types";

interface SectionContentTabProps {
  sectionType?: string;
  settings: Record<string, unknown>;
  products: Product[];
  onSettingsChange: (field: string, value: unknown) => void;
}

const inputClass =
  "h-10 w-full rounded-lg border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#17191C] focus:border-[#F97316] focus:outline-none";
const labelClass = "block space-y-1.5 text-[12px] font-medium text-[#475467]";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const SectionContentTab: React.FC<SectionContentTabProps> = ({
  sectionType,
  settings,
  products,
  onSettingsChange,
}) => {
  const updateRecordList = <T extends Record<string, unknown>>(field: string, index: number, patch: Partial<T>) => {
    const items = Array.isArray(settings[field]) ? [...(settings[field] as T[])] : [];
    items[index] = { ...items[index], ...patch };
    onSettingsChange(field, items);
  };

  const renderText = (field: string, label: string, placeholder = "") => (
    <label key={field} className={labelClass}>
      <span>{label}</span>
      <input
        type="text"
        value={typeof settings[field] === "string" ? (settings[field] as string) : ""}
        placeholder={placeholder}
        onChange={(event) => onSettingsChange(field, event.target.value)}
        className={inputClass}
      />
    </label>
  );

  const renderNumber = (field: string, label: string, min: number, max: number, step = 1) => (
    <label key={field} className={labelClass}>
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={typeof settings[field] === "number" ? (settings[field] as number) : ""}
        onChange={(event) =>
          onSettingsChange(field, event.target.value === "" ? undefined : Number(event.target.value))
        }
        className={inputClass}
      />
    </label>
  );

  const renderUrl = (field: string, label: string, optional = true) => (
    <label key={field} className={labelClass}>
      <span>{label}</span>
      <input
        type="url"
        value={typeof settings[field] === "string" ? (settings[field] as string) : ""}
        onChange={(event) => onSettingsChange(field, optional && !event.target.value ? undefined : event.target.value)}
        placeholder="https://..."
        className={`${inputClass} font-mono text-[12px]`}
      />
    </label>
  );

  const renderTitle = () => "title" in settings && renderText("title", "Titre de la section");
  const productIds = Array.isArray(settings.productIds) ? (settings.productIds as string[]) : [];

  return (
    <div className="space-y-4">
      {renderTitle()}

      {"subtitle" in settings && renderText("subtitle", "Sous-titre")}
      {"badgeText" in settings && renderText("badgeText", "Petit badge au-dessus du titre", "Ex. Fabrication locale")}

      {"heading" in settings && renderText("heading", "Titre de votre histoire")}
      {"bodyText" in settings && (
        <label className={labelClass}>
          <span>Votre histoire</span>
          <textarea
            rows={5}
            maxLength={2000}
            value={typeof settings.bodyText === "string" ? settings.bodyText : ""}
            onChange={(event) => onSettingsChange("bodyText", event.target.value)}
            className="w-full rounded-lg border border-[#E4E7EC] bg-white p-3 text-[13px] text-[#17191C] focus:border-[#F97316] focus:outline-none"
          />
        </label>
      )}
      {"signature" in settings && renderText("signature", "Signature ou nom de l'artisan")}
      {"yearsOfExperience" in settings && renderNumber("yearsOfExperience", "Années d'expérience", 0, 100)}

      {"imageUrl" in settings && (
        <div className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#475467]">
            <ImageIcon className="h-3.5 w-3.5 text-[#F97316]" />
            Image principale
          </span>
          {renderUrl("imageUrl", "Adresse de l'image", sectionType !== "hero_banner")}
        </div>
      )}
      {"mobileImageUrl" in settings && renderUrl("mobileImageUrl", "Image optimisée pour mobile (facultatif)")}
      {"overlayOpacity" in settings && (
        <label className="block space-y-2">
          <span className="flex items-center justify-between text-[12px] font-medium text-[#475467]">
            <span>Voile sombre sur l'image</span>
            <span className="font-mono text-[#F97316]">{Number(settings.overlayOpacity || 0)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={80}
            step={5}
            value={typeof settings.overlayOpacity === "number" ? settings.overlayOpacity : 30}
            onChange={(event) => onSettingsChange("overlayOpacity", Number(event.target.value))}
            className="w-full accent-[#F97316]"
          />
        </label>
      )}

      {sectionType === "showcase_video" && renderUrl("videoUrl", "Adresse de la vidéo")}
      {sectionType === "showcase_video" && renderUrl("posterUrl", "Image de couverture de la vidéo")}
      {"autoplay" in settings && (
        <label className="flex items-center gap-2 rounded-lg border border-[#E4E7EC] p-3 text-[12px] text-[#475467]">
          <input
            type="checkbox"
            checked={Boolean(settings.autoplay)}
            onChange={(event) => onSettingsChange("autoplay", event.target.checked)}
            className="accent-[#F97316]"
          />
          Lecture automatique
        </label>
      )}
      {sectionType === "showcase_video" && (
        <div className="grid grid-cols-2 gap-2">
          {["loop", "muted"].map((field) => (
            <label
              key={field}
              className="flex items-center gap-2 rounded-lg border border-[#E4E7EC] p-3 text-[12px] text-[#475467]"
            >
              <input
                type="checkbox"
                checked={Boolean(settings[field])}
                onChange={(event) => onSettingsChange(field, event.target.checked)}
                className="accent-[#F97316]"
              />
              {field === "loop" ? "Répéter" : "Sans son"}
            </label>
          ))}
        </div>
      )}

      {"ctaText" in settings && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-4">
          <h3 className="flex items-center gap-1.5 text-[12px] font-semibold text-[#17191C]">
            <LinkIcon className="h-3.5 w-3.5 text-[#F97316]" />
            Bouton d'action
          </h3>
          {renderText("ctaText", "Texte du bouton", "Découvrir")}
          {renderText("ctaLink", "Lien du bouton", "#catalog")}
        </div>
      )}

      {"productIds" in settings && (
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-[12px] font-medium text-[#475467]">
            <ShoppingBag className="h-3.5 w-3.5 text-[#F97316]" />
            Articles mis en avant
          </label>
          <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-2">
            {products.length === 0 ? (
              <p className="p-2 text-[12px] text-[#667085]">Ajoutez d'abord des produits à votre boutique.</p>
            ) : (
              products.map((product) => (
                <label
                  key={product.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-[12px] text-[#344054] hover:bg-white"
                >
                  <input
                    type="checkbox"
                    checked={productIds.includes(product.id)}
                    onChange={(event) =>
                      onSettingsChange(
                        "productIds",
                        event.target.checked
                          ? [...productIds, product.id]
                          : productIds.filter((id) => id !== product.id)
                      )
                    }
                    className="accent-[#F97316]"
                  />
                  <span className="truncate">{product.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {"maxItems" in settings && renderNumber("maxItems", "Nombre maximum d'articles", 2, 24)}
      {"filterCategoryId" in settings && (
        <label className={labelClass}>
          <span>Filtrer par catégorie</span>
          <select
            value={typeof settings.filterCategoryId === "string" ? settings.filterCategoryId : ""}
            onChange={(event) => onSettingsChange("filterCategoryId", event.target.value || undefined)}
            className={inputClass}
          >
            <option value="">Toutes les catégories</option>
            {Array.from(new Set(products.map((product) => product.category).filter(Boolean))).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      )}
      {"layout" in settings && (
        <label className={labelClass}>
          <span>Présentation</span>
          <select
            value={typeof settings.layout === "string" ? settings.layout : "grid"}
            onChange={(event) => onSettingsChange("layout", event.target.value)}
            className={inputClass}
          >
            <option value="grid">Grille</option>
            <option value="carousel">Défilement horizontal</option>
          </select>
        </label>
      )}

      {"categories" in settings && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-semibold text-[#17191C]">Catégories à afficher</h3>
            <button
              type="button"
              disabled={(Array.isArray(settings.categories) ? settings.categories.length : 0) >= 12}
              onClick={() =>
                onSettingsChange("categories", [
                  ...(Array.isArray(settings.categories) ? settings.categories : []),
                  { id: `category_${Date.now()}`, name: "Nouvelle catégorie", slug: "nouvelle-categorie" },
                ])
              }
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#F97316] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </button>
          </div>
          {(Array.isArray(settings.categories) ? (settings.categories as Array<Record<string, unknown>>) : []).map(
            (category, index) => (
              <div key={String(category.id || index)} className="space-y-2 rounded-lg border border-[#E4E7EC] p-3">
                <div className="flex gap-2">
                  <input
                    aria-label="Nom de la catégorie"
                    value={String(category.name || "")}
                    onChange={(event) =>
                      updateRecordList("categories", index, {
                        name: event.target.value,
                        slug: slugify(event.target.value),
                      })
                    }
                    placeholder="Nom de la catégorie"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    aria-label="Supprimer la catégorie"
                    onClick={() =>
                      onSettingsChange(
                        "categories",
                        (settings.categories as unknown[]).filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                    className="rounded-lg border border-red-100 px-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  aria-label="Image de la catégorie"
                  type="url"
                  value={String(category.imageUrl || "")}
                  onChange={(event) =>
                    updateRecordList("categories", index, { imageUrl: event.target.value || undefined })
                  }
                  placeholder="URL de son image (facultatif)"
                  className={inputClass}
                />
              </div>
            )
          )}
          {(!Array.isArray(settings.categories) || settings.categories.length === 0) && (
            <p className="text-[12px] text-[#667085]">Ajoutez des catégories pour les afficher dans la boutique.</p>
          )}
        </div>
      )}

      {"collections" in settings && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-semibold text-[#17191C]">Collections</h3>
            <button
              type="button"
              disabled={(Array.isArray(settings.collections) ? settings.collections.length : 0) >= 6}
              onClick={() =>
                onSettingsChange("collections", [
                  ...(Array.isArray(settings.collections) ? settings.collections : []),
                  { id: `collection_${Date.now()}`, title: "Nouvelle collection", productIds: [] },
                ])
              }
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#F97316] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </button>
          </div>
          {(Array.isArray(settings.collections) ? (settings.collections as Array<Record<string, unknown>>) : []).map(
            (collection, index) => {
              const ids = Array.isArray(collection.productIds) ? (collection.productIds as string[]) : [];
              return (
                <div key={String(collection.id || index)} className="space-y-2 rounded-lg border border-[#E4E7EC] p-3">
                  <div className="flex gap-2">
                    <input
                      aria-label="Nom de la collection"
                      value={String(collection.title || "")}
                      onChange={(event) => updateRecordList("collections", index, { title: event.target.value })}
                      placeholder="Ex. Collection d'été"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      aria-label="Supprimer la collection"
                      onClick={() =>
                        onSettingsChange(
                          "collections",
                          (settings.collections as unknown[]).filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                      className="rounded-lg border border-red-100 px-2 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    aria-label="Image de la collection"
                    type="url"
                    value={String(collection.imageUrl || "")}
                    onChange={(event) =>
                      updateRecordList("collections", index, { imageUrl: event.target.value || undefined })
                    }
                    placeholder="Image de la collection (facultatif)"
                    className={inputClass}
                  />
                  {products.length > 0 && (
                    <div className="max-h-32 space-y-1 overflow-auto rounded-md bg-[#F9FAFB] p-2">
                      {products.map((product) => (
                        <label key={product.id} className="flex items-center gap-2 text-[11px] text-[#475467]">
                          <input
                            type="checkbox"
                            checked={ids.includes(product.id)}
                            onChange={(event) =>
                              updateRecordList("collections", index, {
                                productIds: event.target.checked
                                  ? [...ids, product.id]
                                  : ids.filter((id) => id !== product.id),
                              })
                            }
                            className="accent-[#F97316]"
                          />
                          <span className="truncate">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}
          {(!Array.isArray(settings.collections) || settings.collections.length === 0) && (
            <p className="text-[12px] text-[#667085]">Créez des sélections thématiques de produits.</p>
          )}
        </div>
      )}

      {"slides" in settings && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-semibold text-[#17191C]">Diapositives (5 maximum)</h3>
            <button
              type="button"
              disabled={(settings.slides as unknown[]).length >= 5}
              onClick={() =>
                onSettingsChange("slides", [
                  ...(settings.slides as Array<Record<string, unknown>>),
                  {
                    id: `slide_${Date.now()}`,
                    imageUrl:
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
                    title: "Nouvelle offre",
                  },
                ])
              }
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#F97316] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </button>
          </div>
          {(settings.slides as Array<Record<string, unknown>>).map((slide, index) => (
            <div key={String(slide.id || index)} className="space-y-2 rounded-lg border border-[#E4E7EC] p-3">
              <div className="flex gap-2">
                <input
                  aria-label="Titre de la diapositive"
                  value={String(slide.title || "")}
                  onChange={(event) => updateRecordList("slides", index, { title: event.target.value })}
                  placeholder="Titre de l'offre"
                  className={inputClass}
                />
                <button
                  type="button"
                  disabled={(settings.slides as unknown[]).length <= 1}
                  aria-label="Supprimer la diapositive"
                  onClick={() =>
                    onSettingsChange(
                      "slides",
                      (settings.slides as unknown[]).filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                  className="rounded-lg border border-red-100 px-2 text-red-600 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                aria-label="Image de la diapositive"
                value={String(slide.imageUrl || "")}
                onChange={(event) => updateRecordList("slides", index, { imageUrl: event.target.value })}
                placeholder="URL de l'image"
                className={inputClass}
              />
              <input
                aria-label="Lien de la diapositive"
                value={String(slide.link || "")}
                onChange={(event) => updateRecordList("slides", index, { link: event.target.value || undefined })}
                placeholder="Lien (facultatif)"
                className={inputClass}
              />
            </div>
          ))}
          {"intervalSec" in settings && renderNumber("intervalSec", "Durée par diapositive (secondes)", 2, 15)}
        </div>
      )}

      {"items" in settings && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-semibold text-[#17191C]">Questions et réponses</h3>
            <button
              type="button"
              disabled={(settings.items as unknown[]).length >= 10}
              onClick={() =>
                onSettingsChange("items", [
                  ...(settings.items as Array<Record<string, unknown>>),
                  { question: "Nouvelle question", answer: "Votre réponse" },
                ])
              }
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#F97316] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </button>
          </div>
          {(settings.items as Array<Record<string, unknown>>).map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-[#E4E7EC] p-3">
              <div className="flex gap-2">
                <input
                  aria-label="Question"
                  value={String(item.question || "")}
                  onChange={(event) => updateRecordList("items", index, { question: event.target.value })}
                  placeholder="Question"
                  className={inputClass}
                />
                <button
                  type="button"
                  aria-label="Supprimer la question"
                  onClick={() =>
                    onSettingsChange(
                      "items",
                      (settings.items as unknown[]).filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                  className="rounded-lg border border-red-100 px-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                aria-label="Réponse"
                rows={3}
                value={String(item.answer || "")}
                onChange={(event) => updateRecordList("items", index, { answer: event.target.value })}
                placeholder="Réponse"
                className="w-full rounded-lg border border-[#E4E7EC] p-3 text-[12px] focus:border-[#F97316] focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {"maxReviews" in settings && renderNumber("maxReviews", "Nombre d'avis à afficher", 1, 12)}
      {"filterMinRating" in settings && renderNumber("filterMinRating", "Note minimale des avis", 1, 5, 0.5)}
      {"defaultTimeframe" in settings && renderText("defaultTimeframe", "Délai habituel", "24 h à 72 h")}
      {"freeShippingAbove" in settings &&
        renderNumber("freeShippingAbove", "Livraison offerte dès (DZD)", 1, 10000000, 500)}
      {"customTariffs" in settings && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-semibold text-[#17191C]">Tarifs par wilaya (facultatif)</h3>
            <button
              type="button"
              disabled={(Array.isArray(settings.customTariffs) ? settings.customTariffs.length : 0) >= 69}
              onClick={() =>
                onSettingsChange("customTariffs", [
                  ...(Array.isArray(settings.customTariffs) ? settings.customTariffs : []),
                  { wilayaName: "Alger", estimatedDays: "24h à 48h", priceDZD: 0, homeDeliveryAvailable: true },
                ])
              }
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#F97316] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </button>
          </div>
          {(Array.isArray(settings.customTariffs)
            ? (settings.customTariffs as Array<Record<string, unknown>>)
            : []
          ).map((tariff, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 rounded-lg border border-[#E4E7EC] p-3">
              <input
                aria-label="Wilaya"
                value={String(tariff.wilayaName || "")}
                onChange={(event) => updateRecordList("customTariffs", index, { wilayaName: event.target.value })}
                placeholder="Wilaya"
                className={inputClass}
              />
              <input
                aria-label="Délai de livraison"
                value={String(tariff.estimatedDays || "")}
                onChange={(event) => updateRecordList("customTariffs", index, { estimatedDays: event.target.value })}
                placeholder="Délai"
                className={inputClass}
              />
              <input
                aria-label="Tarif en DZD"
                type="number"
                min={0}
                value={typeof tariff.priceDZD === "number" ? tariff.priceDZD : 0}
                onChange={(event) => updateRecordList("customTariffs", index, { priceDZD: Number(event.target.value) })}
                placeholder="Prix DZD"
                className={inputClass}
              />
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-1.5 text-[11px] text-[#475467]">
                  <input
                    type="checkbox"
                    checked={tariff.homeDeliveryAvailable !== false}
                    onChange={(event) =>
                      updateRecordList("customTariffs", index, { homeDeliveryAvailable: event.target.checked })
                    }
                    className="accent-[#F97316]"
                  />
                  À domicile
                </label>
                <button
                  type="button"
                  aria-label="Supprimer le tarif"
                  onClick={() =>
                    onSettingsChange(
                      "customTariffs",
                      (settings.customTariffs as unknown[]).filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                  className="rounded-lg border border-red-100 p-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {"delayDays" in settings && renderNumber("delayDays", "Délai de retour (jours)", 1, 90)}
      {"conditions" in settings && (
        <label className={labelClass}>
          <span>Conditions de retour</span>
          <textarea
            rows={4}
            value={String(settings.conditions || "")}
            onChange={(event) => onSettingsChange("conditions", event.target.value)}
            className="w-full rounded-lg border border-[#E4E7EC] p-3 text-[13px] focus:border-[#F97316] focus:outline-none"
          />
        </label>
      )}
      {"returnShippingFeeBy" in settings && (
        <label className={labelClass}>
          <span>Frais de retour</span>
          <select
            value={String(settings.returnShippingFeeBy)}
            onChange={(event) => onSettingsChange("returnShippingFeeBy", event.target.value)}
            className={inputClass}
          >
            <option value="buyer">À la charge du client</option>
            <option value="seller">À ma charge</option>
            <option value="free">Offerts</option>
          </select>
        </label>
      )}

      {sectionType === "contact_footer" && (
        <div className="space-y-3 border-t border-[#E4E7EC] pt-4">
          <h3 className="text-[12px] font-semibold text-[#17191C]">Coordonnées et réseaux</h3>
          {renderText("shopPhone", "Téléphone")}
          {renderText("shopEmail", "Adresse e-mail")}
          {renderText("address", "Adresse")}
          {renderText("wilaya", "Wilaya")}
          {renderText("workingHours", "Horaires d'ouverture")}
          {renderText("socialInstagram", "Instagram")}
          {renderText("socialFacebook", "Facebook")}
          {renderText("socialTiktok", "TikTok")}
        </div>
      )}
    </div>
  );
};
