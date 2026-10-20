import React from "react";
import { CustomPageSection, CustomPageTheme } from "../../../domains/seller/customPage.types";
import { Product } from "../../../domains/product/product.types";
import { normalizeTimestamp } from "../../../utils/date";
import { readableTextColor } from "./themeColorUtils";

interface SectionProductFeedsProps {
  section: CustomPageSection<"featured_products" | "new_arrivals" | "best_sellers" | "product_grid">;
  theme: CustomPageTheme;
  products: Product[];
  isEditable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const SectionProductFeeds: React.FC<SectionProductFeedsProps> = ({
  section,
  theme,
  products,
  isEditable,
  isSelected,
  onSelect,
}) => {
  const settings = section.settings as {
    title?: string;
    subtitle?: string;
    productIds?: string[];
    maxItems?: number;
    layout?: "grid" | "carousel";
    filterCategoryId?: string;
  };
  const styles = section.styles;

  let displayProducts: Product[] = [];
  if (section.type === "featured_products" && Array.isArray(settings.productIds)) {
    const idSet = new Set(settings.productIds);
    displayProducts = products.filter((p) => idSet.has(p.id));
  } else {
    const limit = settings.maxItems || 8;
    const feed = section.type === "best_sellers"
      ? [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      : section.type === "new_arrivals"
      ? [...products].sort((a, b) => {
          const aDate = a.createdAt ? normalizeTimestamp(a.createdAt).toMillis() : 0;
          const bDate = b.createdAt ? normalizeTimestamp(b.createdAt).toMillis() : 0;
          return bDate - aDate;
        })
      : [...products];
    const categoryFiltered = settings.filterCategoryId
      ? feed.filter((product) => product.category === settings.filterCategoryId)
      : feed;
    displayProducts = categoryFiltered.slice(0, limit);
  }

  const paddingY = typeof styles.paddingY === "number"
    ? styles.paddingY
    : ({ sm: 16, md: 32, lg: 48, xl: 64 }[styles.paddingY || "md"]);
  const paddingX = styles.paddingX ?? 16;
  const productCardStyle: React.CSSProperties = {
    borderRadius: styles.borderRadius
      ? `${({ none: 0, sm: 8, md: 16, lg: 24 })[styles.borderRadius]}px`
      : `${theme.borderRadiusPx ?? 12}px`,
    backgroundColor: theme.surfaceColor || "#FFFFFF",
    color: readableTextColor(theme.surfaceColor),
  };

  return (
    <div
      onClick={isEditable ? onSelect : undefined}
      className={`transition-all cursor-pointer ${isEditable && isSelected ? "ring-2 ring-inset ring-[#F97316]" : ""}`}
      style={{
        backgroundColor: styles.backgroundColor || "transparent",
        color: styles.textColor || readableTextColor(styles.backgroundColor || theme.canvasColor),
        paddingBlock: `${paddingY}px`,
        paddingInline: `${paddingX}px`,
      }}
    >
      <div className={styles.containerWidth === "contained" ? "max-w-6xl mx-auto" : "w-full"}>
        {settings.title && (
          <div className="mb-6 text-center">
            <h2 className="text-xl md:text-3xl font-extrabold" style={{ color: theme.primaryColor, fontSize: `clamp(1.25rem, 2vw, ${theme.titleFontSizePx ?? 32}px)` }}>
              {settings.title}
            </h2>
            {settings.subtitle && (
              <p className="mt-1 text-sm opacity-70 md:text-base" style={{ fontSize: `${theme.bodyFontSizePx ?? 16}px` }}>{settings.subtitle}</p>
            )}
          </div>
        )}

        {displayProducts.length === 0 ? (
          <div className="rounded-xl border border-black/5 p-8 text-center font-medium" style={{ backgroundColor: theme.surfaceColor || "#FFFFFF", color: readableTextColor(theme.surfaceColor), borderRadius: `${theme.borderRadiusPx ?? 12}px` }}>
            Aucun produit à afficher dans cette section.
          </div>
        ) : (
          <div className={settings.layout === "carousel" ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2" : "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"}>
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className={`overflow-hidden border border-gray-100 shadow-sm transition-shadow hover:shadow-md ${settings.layout === "carousel" ? "w-56 shrink-0 snap-start md:w-64" : ""}`}
                style={productCardStyle}
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      PROMO
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="line-clamp-1 text-xs font-semibold md:text-sm">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-sm font-extrabold md:text-base" style={{ color: theme.primaryColor }}>
                      {product.price.toLocaleString("fr-DZ")} DZD
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
