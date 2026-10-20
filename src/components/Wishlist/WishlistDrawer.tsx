import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useShop } from "../../context/ShopContext";
import { SideDrawer } from "../SideDrawer";
import { formatPrice } from "../../utils/format";
import { getTranslatedField } from "../../utils/translations";
import { Language } from "../../domains/home/homepage.types";
import { Product } from "../../domains/product/product.types";
import { ProductImage } from "../Product/ProductImage";

export const WishlistDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { wishlist } = useCart();
  const { fetchProductsByIds } = useShop();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language as Language;

  useEffect(() => {
    if (isOpen) {
      if (wishlist.length > 0) {
        fetchProductsByIds(wishlist).then(setWishlistProducts);
      } else {
        setWishlistProducts([]);
      }
    }
  }, [isOpen, wishlist, fetchProductsByIds]);

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={t("wishlist") || "Favoris"}
      icon={<Heart className="w-5 h-5" />}
    >
      <div className="flex-1 overflow-y-auto bg-[#fbf9fc] p-5 sm:p-6">
        {wishlistProducts.length === 0 ? (
          <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[26px] border border-[#eee5ef] bg-white text-[#6b5874] shadow-[0_10px_28px_rgba(54,39,61,0.08)]">
              <Heart className="h-8 w-8" strokeWidth={1.8} />
            </div>
            <h3 className="mb-2 text-base font-bold tracking-tight text-[#302638]">
              {t("empty_wishlist_title") || "Votre liste est vide"}
            </h3>
            <p className="mb-8 max-w-[270px] text-sm leading-relaxed text-[#7c7481]">
              {t("empty_wishlist_desc") ||
                "Explorez nos créations d'artisanat d'exception et sauvegardez vos articles favoris ici."}
            </p>
            <button
              onClick={() => {
                onClose();
                navigate("/shop");
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#5b4865] bg-[#5b4865] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(54,39,61,0.18)] transition-colors hover:bg-[#493852] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b5874] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("go_to_shop") || "Découvrir la boutique"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="flex gap-4 group cursor-pointer"
                onClick={() => {
                  onClose();
                  navigate(`/product/${p.id}`);
                }}
              >
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <ProductImage src={p.image} className="w-full h-full" alt="" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm group-hover:underline">{getTranslatedField(p, "name", lang)}</h4>
                  <p className="text-xs rtl:text-sm text-zinc-500">{formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SideDrawer>
  );
};
