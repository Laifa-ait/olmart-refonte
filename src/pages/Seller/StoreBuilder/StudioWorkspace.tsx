import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "./studio-tokens.css";
import { StudioTopBar } from "./components/studio/StudioTopBar";
import { StudioSidebar } from "./components/studio/StudioSidebar";
import { SectionTreePanel } from "./components/studio/SectionTreePanel";
import { StudioPreview } from "./components/studio/StudioPreview";
import { PropertiesInspector } from "./components/studio/PropertiesInspector";
import { MobileStudioHeader } from "./components/studio/MobileStudioHeader";
import { MobileStudioNavigation, MobileStudioColumn } from "./components/studio/MobileStudioNavigation";
import { StudioMobileMenu } from "./components/studio/StudioMobileMenu";
import { StudioNavMode } from "./components/SectionTreePanel";
import { SaveStatus } from "./hooks/useSellerStudio";
import {
  CustomPageSection,
  CustomPageSectionType,
  CustomPageTheme,
  SellerStoreConfig,
  StoreLayoutVersion,
  MediaGalleryItem,
} from "../../../domains/seller/customPage.types";
import { SubscriptionRequest } from "../../../domains/seller/subscription.types";
import { Product } from "../../../domains/product/product.types";

interface StudioWorkspaceProps {
  saveStatus: SaveStatus;
  storeConfig?: SellerStoreConfig | null;
  publishedLayout?: StoreLayoutVersion | null;
  hasActiveSubscription?: boolean;
  sections: CustomPageSection[];
  products?: Product[];
  mediaGallery?: MediaGalleryItem[];
  onUploadMedia?: (file: File) => Promise<MediaGalleryItem>;
  onDeleteMedia?: (id: string) => Promise<void>;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  addSection: (
    type: CustomPageSectionType,
    defaultSettings: Record<string, unknown>,
    defaultTitle?: string
  ) => void;
  updateSection: (id: string, updatedData: Partial<CustomPageSection>) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  deleteSection: (id: string) => void;
  duplicateSection?: (id: string) => void;
  toggleVisibility: (id: string) => void;
  saveStoreConfig: (updatedConfig: Partial<SellerStoreConfig>) => Promise<void>;
  publishStudio: () => void;
  pendingRequest?: SubscriptionRequest | null;
  onRequestPublication?: () => void;
}

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({
  saveStatus,
  storeConfig,
  publishedLayout,
  hasActiveSubscription = false,
  sections,
  products = [],
  mediaGallery = [],
  onUploadMedia,
  onDeleteMedia,
  selectedSectionId,
  setSelectedSectionId,
  addSection,
  updateSection,
  reorderSections,
  deleteSection,
  duplicateSection,
  toggleVisibility,
  saveStoreConfig,
  publishStudio,
  pendingRequest,
  onRequestPublication,
}) => {
  const [navMode, setNavMode] = useState<StudioNavMode | "identity">("sections");
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [mobileColumn, setMobileColumn] = useState<MobileStudioColumn>("canvas");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveThemeOverride, setLiveThemeOverride] = useState<CustomPageTheme | null>(null);

  const selectedSection = sections.find((sec) => sec.id === selectedSectionId) || null;
  const currentTheme: CustomPageTheme = liveThemeOverride || storeConfig?.theme || {
    sector: "mode",
    primaryColor: "#F97316",
    canvasColor: "#F7F8FA",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const isPublished = Boolean(publishedLayout && hasActiveSubscription);

  const handleSaveTheme = async (updatedTheme: CustomPageTheme) => {
    setLiveThemeOverride(updatedTheme);
    await saveStoreConfig({ theme: updatedTheme });
  };

  const handleSelectNavMode = (mode: StudioNavMode | "identity") => {
    setNavMode(mode);
    if (mode === "sections") {
      setMobileColumn("tree");
    } else {
      setMobileColumn("inspector");
    }
  };

  const handleSelectMediaUrl = (url: string) => {
    if (!selectedSection) {
      toast.error("Sélectionnez d'abord une section avec un visuel.");
      return;
    }
    const settings = selectedSection.settings as unknown as Record<string, unknown>;
    const field = typeof settings.imageUrl === "string"
      ? "imageUrl"
      : typeof settings.posterUrl === "string"
      ? "posterUrl"
      : typeof settings.videoUrl === "string"
      ? "videoUrl"
      : selectedSection.type === "showcase_video"
      ? "posterUrl"
      : null;
    if (field) {
      updateSection(selectedSection.id, {
        settings: { ...settings, [field]: url } as unknown as CustomPageSection["settings"],
      });
    } else {
      const listField = selectedSection.type === "promo_carousel"
        ? "slides"
        : selectedSection.type === "featured_categories"
        ? "categories"
        : selectedSection.type === "curated_collections"
        ? "collections"
        : null;
      const list = listField && Array.isArray(settings[listField])
        ? settings[listField] as Array<Record<string, unknown>>
        : [];
      if (!listField || list.length === 0) {
        toast.error("Ajoutez d'abord un élément dans cette section pour y placer un visuel.");
        return;
      }
      const firstItem = { ...list[0], imageUrl: url };
      updateSection(selectedSection.id, {
        settings: { ...settings, [listField]: [firstItem, ...list.slice(1)] } as unknown as CustomPageSection["settings"],
      });
    }
    setNavMode("sections");
    setMobileColumn("inspector");
    toast.success("Visuel appliqué à la section sélectionnée.");
  };

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-10px)] bg-[#F7F8FA] text-[#17191C] overflow-hidden select-none min-w-0 min-h-0">
      {/* 1. Desktop TopBar (Visible strictly on Tablet/Desktop md+) */}
      <div className="hidden md:block shrink-0">
        <StudioTopBar
          viewport={viewport}
          setViewport={setViewport}
          saveStatus={saveStatus}
          shopName={storeConfig?.shopName || "Ma Boutique"}
          shopSlug={storeConfig?.shopSlug}
          isPublished={isPublished}
          hasActiveSubscription={hasActiveSubscription}
          pendingRequest={pendingRequest}
          onPublish={publishStudio}
          onRequestPublication={onRequestPublication}
        />
      </div>

      {/* 2. Mobile Header & Navigation (Visible strictly on Mobile < md) */}
      <div className="block md:hidden shrink-0">
        <MobileStudioHeader
          shopName={storeConfig?.shopName || "Ma Boutique"}
          isPublished={isPublished}
          hasActiveSubscription={hasActiveSubscription}
          hasPendingRequest={Boolean(pendingRequest)}
          onPublish={hasActiveSubscription ? publishStudio : onRequestPublication || publishStudio}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
        />
        <MobileStudioNavigation
          mobileColumn={mobileColumn}
          setMobileColumn={setMobileColumn}
          sectionCount={sections.length}
        />
      </div>

      {/* Mobile Drawer Menu */}
      <StudioMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navMode={navMode}
        onSelectNavMode={handleSelectNavMode}
        shopName={storeConfig?.shopName}
      />

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden min-w-0 min-h-0">
        {/* Zone 1: Navigation globale (260px, Desktop >= 1200px xl+) */}
        <div className="h-full shrink-0 hidden xl:block w-[260px] min-w-[260px] max-w-[260px] border-r border-[#E5E7EB]">
          <StudioSidebar navMode={navMode} onSelectNavMode={handleSelectNavMode} />
        </div>

        {/* Zone 2: Arborescence des sections (100% on Mobile, 280px on Tablet/Desktop) */}
        <div
          className={`h-full min-w-0 ${
            mobileColumn === "tree"
              ? "block w-full flex-1"
              : "hidden md:block md:w-[280px] md:shrink-0"
          }`}
        >
          <SectionTreePanel
            sections={sections}
            selectedSectionId={selectedSectionId}
            navMode={navMode}
            onSelectNavMode={handleSelectNavMode}
            onSelectSection={(id) => {
              setSelectedSectionId(id);
              setNavMode("sections");
              setMobileColumn("inspector");
            }}
            onReorder={reorderSections}
            onToggleVisibility={toggleVisibility}
            onDeleteSection={deleteSection}
            onDuplicateSection={duplicateSection}
            onAddSection={addSection}
          />
        </div>

        {/* Zone 3: Aperçu central flexible (Central Canvas) */}
        <div
          className={`h-full flex-1 min-w-0 overflow-hidden ${
            mobileColumn === "canvas" ? "block w-full" : "hidden md:block"
          }`}
        >
          <StudioPreview
            sections={sections}
            theme={currentTheme}
            products={products}
            viewport={viewport}
            selectedSectionId={selectedSectionId}
            onSelectSection={(id) => {
              setSelectedSectionId(id);
              setNavMode("sections");
              setMobileColumn("inspector");
            }}
          />
        </div>

        {/* Zone 4: Inspecteur droit de propriétés (100% on Mobile, 320px on Tablet/Desktop) */}
        <div
          className={`h-full min-w-0 ${
            mobileColumn === "inspector"
              ? "block w-full flex-1"
              : "hidden md:block md:w-[320px] md:shrink-0"
          }`}
        >
          <PropertiesInspector
            navMode={navMode}
            selectedSection={selectedSection}
            products={products}
            storeConfig={storeConfig}
            currentTheme={currentTheme}
            mediaGallery={mediaGallery}
            onSelectMediaUrl={handleSelectMediaUrl}
            onUploadMedia={onUploadMedia}
            onDeleteMedia={onDeleteMedia}
            onUpdateSection={updateSection}
            onSaveTheme={handleSaveTheme}
            onThemeChangeLive={(newTheme) => setLiveThemeOverride(newTheme)}
            onSaveConfig={saveStoreConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioWorkspace;
