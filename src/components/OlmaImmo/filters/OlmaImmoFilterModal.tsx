import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Wallet,
  House,
  FileCheck2,
} from "lucide-react";
import { FilterState } from "../SearchFilters";
import { OlmaImmoFilterStep } from "./OlmaImmoFilterStep";

interface OlmaImmoFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  portalContainer?: HTMLElement | null;
  usePortal?: boolean;
}

export const OlmaImmoFilterModal: React.FC<OlmaImmoFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  portalContainer,
  usePortal,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar" || i18n.language?.startsWith("ar");
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
  const [currentStep, setCurrentStep] = useState(0);
  const [isResetDraft, setIsResetDraft] = useState(false);

  const steps = [
    {
      label: isAr ? "المعاملة" : "Transaction",
      title: isAr ? "ماذا تبحث؟" : "Que recherchez-vous ?",
      icon: SlidersHorizontal,
    },
    {
      label: isAr ? "الموقع" : "Localisation",
      title: isAr ? "أين تبحث؟" : "Où souhaitez-vous chercher ?",
      icon: MapPin,
    },
    { label: isAr ? "الميزانية" : "Budget", title: isAr ? "ما ميزانيتك؟" : "Quel est votre budget ?", icon: Wallet },
    { label: isAr ? "العقار" : "Bien", title: isAr ? "ما نوع العقار؟" : "Quel type de bien ?", icon: House },
    {
      label: isAr ? "المستندات" : "Documents",
      title: isAr ? "الوثائق والترتيب" : "Documents et classement",
      icon: FileCheck2,
    },
  ];

  const updateDraftFilters = (update: (current: FilterState) => FilterState) => {
    setDraftFilters(update);
    setIsResetDraft(false);
  };

  useEffect(() => {
    if (isOpen) {
      setDraftFilters(filters);
      setCurrentStep(0);
      setIsResetDraft(false);
    }
  }, [isOpen, filters]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (isResetDraft) onResetFilters();
    else onApplyFilters(draftFilters);
    onClose();
  };

  const handleResetDraft = () => {
    const clean: FilterState = { sort: "recent" };
    setDraftFilters(clean);
    setIsResetDraft(true);
    setCurrentStep(0);
  };

  const countActiveDraft = [
    draftFilters.listingType,
    draftFilters.propertyType,
    draftFilters.wilaya,
    draftFilters.daira,
    draftFilters.commune,
    draftFilters.minPrice,
    draftFilters.maxPrice,
    draftFilters.minRooms,
    draftFilters.minArea,
    draftFilters.hasActeNotarie,
    draftFilters.hasLivretFoncier,
    draftFilters.legalPaperType,
  ].filter(Boolean).length;
  const CurrentStepIcon = steps[currentStep].icon;

  const modalContent = (
    <div
      className="olma-immo-scope olma-immo-filter-overlay fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-t-[1.5rem] sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94dvh] sm:max-h-[86vh] animate-in slide-in-from-bottom-3 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile top handle */}
        <div className="sm:hidden pt-2 pb-1 flex justify-center bg-white">
          <div className="w-10 h-1 rounded-full bg-stone-300" />
        </div>

        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--olma-brand-primary-light)] text-[var(--olma-brand-primary)] flex items-center justify-center">
              <SlidersHorizontal className="w-[1.15rem] h-[1.15rem]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="filter-modal-title" className="text-base sm:text-lg font-bold text-[var(--olma-text-primary)]">
                  {isAr ? "فلاتر البحث العقاري" : t("immo_filter_modal_title", "Filtres immobiliers")}
                </h2>
                {countActiveDraft > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--olma-brand-accent-soft)] text-[var(--olma-brand-accent-hover)] border border-amber-300/60">
                    <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                    {isAr ? `${countActiveDraft} نشط` : `${countActiveDraft} filtre${countActiveDraft > 1 ? "s" : ""}`}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Choisissez vos critères, puis appliquez les filtres</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-stone-100 cursor-pointer transition min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Fermer la fenêtre des filtres"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step progress */}
        <div
          className="px-4 sm:px-6 pt-3 pb-2 bg-white shrink-0"
          aria-label={
            isAr ? `الخطوة ${currentStep + 1} من ${steps.length}` : `Étape ${currentStep + 1} sur ${steps.length}`
          }
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[var(--olma-text-muted)]">
              {isAr ? `الخطوة ${currentStep + 1} من ${steps.length}` : `Étape ${currentStep + 1} sur ${steps.length}`}
            </span>
            <span className="text-xs font-bold text-[var(--olma-brand-primary)]">{steps[currentStep].label}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className={`h-1.5 rounded-full ${index <= currentStep ? "bg-[var(--olma-brand-primary)]" : "bg-stone-200"}`}
              />
            ))}
          </div>
        </div>

        {/* One filter group at a time */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 text-slate-800">
          <h3 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[var(--olma-text-primary)] mb-1">
            <span className="w-9 h-9 rounded-xl bg-[var(--olma-brand-primary-light)] text-[var(--olma-brand-primary)] flex items-center justify-center shrink-0">
              <CurrentStepIcon className="w-4 h-4" />
            </span>
            {steps[currentStep].title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--olma-text-muted)] mb-5">
            {currentStep === 0 &&
              (isAr
                ? "حدد نوع المعاملة المناسبة."
                : "Choisissez le type de transaction. Vous pourrez modifier ce choix ensuite.")}
            {currentStep === 1 &&
              (isAr
                ? "اختر الولاية، ثم حدد الدائرة أو البلدية."
                : "Choisissez une wilaya, puis affinez par daïra ou commune.")}
            {currentStep === 2 &&
              (isAr ? "حدد الحد الأدنى والأقصى للسعر." : "Indiquez une fourchette de prix adaptée au bien.")}
            {currentStep === 3 &&
              (isAr
                ? "اختر نوع العقار والمساحة وعدد الغرف."
                : "Précisez le type de bien, le nombre de pièces et la surface.")}
            {currentStep === 4 &&
              (isAr
                ? "أضف الوثائق المطلوبة واختر ترتيب النتائج."
                : "Ajoutez des critères de documents et choisissez le classement des résultats.")}
          </p>

          <OlmaImmoFilterStep
            step={currentStep}
            filters={draftFilters}
            isAr={isAr}
            updateFilters={updateDraftFilters}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-stone-200 bg-white flex items-center justify-between gap-2 shrink-0 pb-[calc(.75rem+env(safe-area-inset-bottom,0px))] sm:pb-4">
          <button
            type="button"
            onClick={handleResetDraft}
            className="px-2.5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer rounded-xl hover:bg-stone-100 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? "إعادة ضبط" : t("immo_filter_reset", "Réinitialiser")}</span>
          </button>

          {currentStep > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
              className="px-3 py-2.5 text-xs font-semibold text-slate-600 rounded-full hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              {isAr ? "السابق" : "Retour"}
            </button>
          ) : (
            <span className="w-16" aria-hidden="true" />
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}
              className="px-5 py-3 bg-[var(--olma-brand-primary)] hover:bg-[var(--olma-brand-primary-dark)] text-white rounded-full text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isAr ? "التالي" : "Continuer"}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="px-4 sm:px-5 py-3 bg-[var(--olma-brand-primary)] hover:bg-[var(--olma-brand-primary-dark)] text-white rounded-full text-xs font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[var(--olma-brand-accent)] stroke-[2.5]" />
              <span>
                {isAr
                  ? `عرض العقارات ${countActiveDraft > 0 ? `(${countActiveDraft})` : ""}`
                  : `Afficher les biens ${countActiveDraft > 0 ? `(${countActiveDraft})` : ""}`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";
  const shouldPortal = usePortal !== undefined ? usePortal : !isTest && typeof document !== "undefined";

  if (shouldPortal && typeof document !== "undefined") {
    const target = portalContainer ?? document.body;
    return createPortal(modalContent, target);
  }

  return modalContent;
};
