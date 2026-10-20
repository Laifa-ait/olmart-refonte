import React from "react";
import {
  X,
  Image as ImageIcon,
  Grid,
  BookOpen,
  ShieldCheck,
  ShoppingBag,
  HelpCircle,
  Phone,
  Sparkles,
  Layers,
} from "lucide-react";
import { CustomPageSectionType } from "../../../../domains/seller/customPage.types";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: CustomPageSectionType, defaultSettings: Record<string, unknown>, defaultTitle?: string) => void;
}

interface SectionOption {
  type: CustomPageSectionType;
  title: string;
  category: "Bannières & Vitrine" | "Catalogue Produits" | "Marque & Histoire" | "Confiance & Contact";
  description: string;
  icon: React.ElementType;
  defaultSettings: Record<string, unknown>;
}

const SECTION_CATALOG: SectionOption[] = [
  {
    type: "hero_banner",
    title: "Bannière Hero Plein Écran",
    category: "Bannières & Vitrine",
    icon: ImageIcon,
    description: "Grande image d'impact avec titre accrocheur, sous-titre et bouton d'action principal.",
    defaultSettings: {
      title: "Collection Exclusive",
      subtitle: "Qualité supérieure livrée dans les 69 Wilayas",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      ctaText: "Découvrir nos articles",
      ctaLink: "#catalog",
      textAlignment: "center",
      overlayOpacity: 35,
    },
  },
  {
    type: "promo_carousel",
    title: "Carrousel Promotionnel",
    category: "Bannières & Vitrine",
    icon: Sparkles,
    description: "Diaporama animé pour mettre en valeur vos offres du moment et réductions.",
    defaultSettings: {
      slides: [
        { id: "s1", imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80", title: "Offres Spéciales Semaine" },
      ],
      autoplay: true,
      intervalSec: 5,
    },
  },
  {
    type: "featured_products",
    title: "Grille d'Articles en Vedette",
    category: "Catalogue Produits",
    icon: ShoppingBag,
    description: "Sélection de produits phares avec prix en DZD, badge de stock et ajout rapide au panier.",
    defaultSettings: {
      title: "Nos Meilleures Ventes",
      productIds: [],
      layout: "grid",
    },
  },
  {
    type: "featured_categories",
    title: "Navigation par Catégories",
    category: "Catalogue Produits",
    icon: Grid,
    description: "Blocs visuels de vos rayons ou collections phares pour faciliter la découverte.",
    defaultSettings: {
      title: "Parcourir par Univers",
      categories: [],
      layout: "grid",
    },
  },
  {
    type: "curated_collections",
    title: "Collections éditoriales",
    category: "Catalogue Produits",
    icon: Layers,
    description: "Créez des sélections de produits autour d'un thème ou d'une saison.",
    defaultSettings: { title: "Nos collections", collections: [] },
  },
  {
    type: "new_arrivals",
    title: "Nouveautés",
    category: "Catalogue Produits",
    icon: ShoppingBag,
    description: "Mettez automatiquement vos derniers produits en avant.",
    defaultSettings: { title: "Nouveautés", subtitle: "Les dernières arrivées", maxItems: 8, layout: "grid" },
  },
  {
    type: "best_sellers",
    title: "Meilleures ventes",
    category: "Catalogue Produits",
    icon: ShoppingBag,
    description: "Présentez les articles que vos clients préfèrent.",
    defaultSettings: { title: "Les plus appréciés", maxItems: 8, layout: "grid" },
  },
  {
    type: "product_grid",
    title: "Catalogue complet",
    category: "Catalogue Produits",
    icon: Grid,
    description: "Affichez une grille de produits filtrable par catégorie.",
    defaultSettings: { title: "Tous nos produits", subtitle: "Découvrez toute la boutique", maxItems: 12, layout: "grid" },
  },
  {
    type: "brand_story",
    title: "Histoire de Marque & Valeurs",
    category: "Marque & Histoire",
    icon: BookOpen,
    description: "Racontez l'histoire de votre entreprise artisanale, vos origines et votre savoir-faire.",
    defaultSettings: {
      heading: "Notre passion & notre atelier",
      bodyText: "Présentez l'histoire, les valeurs et le savoir-faire de votre boutique.",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
    },
  },
  {
    type: "showcase_video",
    title: "Vidéo de présentation",
    category: "Marque & Histoire",
    icon: ImageIcon,
    description: "Ajoutez une vidéo de votre atelier, de vos produits ou de votre marque.",
    defaultSettings: { title: "Découvrez notre atelier", autoplay: false, loop: false, muted: true },
  },
  {
    type: "verified_reviews",
    title: "Avis clients vérifiés",
    category: "Confiance & Contact",
    icon: ShieldCheck,
    description: "Réservez un espace pour les retours d'expérience de vos clients.",
    defaultSettings: { title: "Ils nous font confiance", maxReviews: 6, filterMinRating: 4 },
  },
  {
    type: "delivery_info",
    title: "Livraison & délais",
    category: "Confiance & Contact",
    icon: Phone,
    description: "Expliquez vos délais, vos zones de livraison et vos offres de livraison.",
    defaultSettings: { title: "Livraison partout en Algérie", defaultTimeframe: "24h à 72h", freeShippingAbove: 15000 },
  },
  {
    type: "return_policy",
    title: "Retours & échanges",
    category: "Confiance & Contact",
    icon: ShieldCheck,
    description: "Présentez clairement vos conditions de retour et d'échange.",
    defaultSettings: { title: "Retours & échanges", delayDays: 14, conditions: "Décrivez ici les conditions de retour.", returnShippingFeeBy: "buyer" },
  },
  {
    type: "faq_accordion",
    title: "Foire Aux Questions (FAQ)",
    category: "Confiance & Contact",
    icon: HelpCircle,
    description: "Répondez aux questions fréquentes sur vos délais, tailles et garanties.",
    defaultSettings: {
      title: "Questions Fréquentes",
      items: [
        { question: "Quels sont vos délais de livraison ?", answer: "Entre 24h et 72h selon votre wilaya." },
        { question: "Comment contacter la boutique ?", answer: "Retrouvez nos coordonnées dans la section contact." },
      ],
    },
  },
  {
    type: "contact_footer",
    title: "Coordonnées & Support Boutique",
    category: "Confiance & Contact",
    icon: Phone,
    description: "Affichez votre numéro de service client, adresse, email et horaires d'ouverture.",
    defaultSettings: {
      workingHours: "Samedi au Jeudi de 09h00 à 18h00",
    },
  },
];

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection,
}) => {
  if (!isOpen) return null;

  const categories: Array<SectionOption["category"]> = [
    "Bannières & Vitrine",
    "Catalogue Produits",
    "Marque & Histoire",
    "Confiance & Contact",
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">Ajouter une Section</h2>
            <p className="text-xs text-slate-500">Composez l'agencement de votre vitrine personnalisée</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Categories */}
        <div className="overflow-y-auto pr-1 space-y-5 flex-1">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                {cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {SECTION_CATALOG.filter((s) => s.category === cat).map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.type}
                      onClick={() => {
                        onAddSection(sec.type, sec.defaultSettings, sec.title);
                        onClose();
                      }}
                      className="p-3.5 bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-400 rounded-2xl text-left transition-all group cursor-pointer flex items-start gap-3 shadow-xs"
                    >
                      <div className="p-2 rounded-xl bg-white group-hover:bg-orange-500 text-orange-600 group-hover:text-white shrink-0 transition-colors border border-slate-200 shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-900 block group-hover:text-orange-700 transition-colors">
                          {sec.title}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {sec.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
