import React from "react";
import { MapPin, Building2, Landmark } from "lucide-react";
import { ALGERIA_WILAYAS } from "../../../constants/wilayas";
import { findDairaForCommune, getCommunesForDaira, CommuneInfo } from "../../../data/algerianCommunesDatabase";
import { useAlgerianLocationData } from "../../../hooks/useAlgerianLocationData";
import { OlmaSelect } from "../primitives/OlmaSelect";
import { AlgerianTerritoryInfoButton } from "../common/AlgerianTerritoryExplainer";

interface LocationFilterSelectsProps {
  wilaya?: string;
  daira?: string;
  commune?: string;
  onWilayaChange: (wilaya: string | undefined) => void;
  onDairaChange?: (daira: string | undefined) => void;
  onCommuneChange: (commune: string | undefined) => void;
  size?: "sm" | "md" | "lg";
  layout?: "row" | "col";
  idPrefix?: string;
  showHelpButton?: boolean;
}

export const LocationFilterSelects: React.FC<LocationFilterSelectsProps> = ({
  wilaya,
  daira,
  commune,
  onWilayaChange,
  onDairaChange,
  onCommuneChange,
  size = "md",
  layout = "row",
  idPrefix = "filter",
  showHelpButton = true,
}) => {
  // Async Location Data (Dairas & Communes loaded on-demand per Wilaya)
  const {
    dairas: availableDairas,
    communes: availableCommunes,
    isLoading: isCommunesLoading,
  } = useAlgerianLocationData(wilaya, daira);

  const handleWilayaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const nextWilaya = val === "all" || !val ? undefined : val;
    onWilayaChange(nextWilaya);

    // Reset daira and commune when wilaya changes
    if (onDairaChange) {
      onDairaChange(undefined);
    }
    if (commune) {
      onCommuneChange(undefined);
    }
  };

  const handleDairaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const nextDaira = val === "all" || !val ? undefined : val;
    if (onDairaChange) {
      onDairaChange(nextDaira);
    }

    // If selected commune does not belong to new daira, reset it
    if (commune && wilaya && nextDaira) {
      const dairaCommunes = getCommunesForDaira(wilaya, nextDaira);
      const isStillValid = dairaCommunes.some((c: CommuneInfo) => c.name.toLowerCase() === commune.toLowerCase());
      if (!isStillValid) {
        onCommuneChange(undefined);
      }
    }
  };

  const handleCommuneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const nextCommune = val === "all" || !val ? undefined : val;
    onCommuneChange(nextCommune);

    // If commune selected and no daira set, auto-select its daira
    if (nextCommune && wilaya && (!daira || daira === "all") && onDairaChange) {
      const resolvedDaira = findDairaForCommune(wilaya, nextCommune);
      if (resolvedDaira) {
        onDairaChange(resolvedDaira);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      {showHelpButton && (
        <div className="flex items-center justify-between gap-2 px-0.5">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Découpage territorial officiel (3 niveaux)
          </span>
          <AlgerianTerritoryInfoButton variant="link" />
        </div>
      )}

      <div
        className={layout === "row" ? "grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full" : "flex flex-col gap-2.5 w-full"}
      >
        {/* 1. Wilaya */}
        <OlmaSelect
          id={`${idPrefix}-wilaya`}
          label="Wilaya"
          leftIcon={<Landmark className="w-4 h-4 text-emerald-700 shrink-0" />}
          value={wilaya || "all"}
          onChange={handleWilayaSelect}
          size={size}
          radius="xl"
          fullWidth
        >
          <option value="all">Toutes les wilayas ({ALGERIA_WILAYAS.length})</option>
          {ALGERIA_WILAYAS.map((w) => (
            <option key={w.code} value={w.name}>
              {w.code} - {w.name} {w.name_ar ? `(${w.name_ar})` : ""}
            </option>
          ))}
        </OlmaSelect>

        {/* 2. Daira */}
        <OlmaSelect
          id={`${idPrefix}-daira`}
          label={
            <span>
              Daïra{" "}
              {wilaya && availableDairas.length > 0 && (
                <span className="text-[11px] font-normal text-slate-500">({availableDairas.length})</span>
              )}
            </span>
          }
          leftIcon={<Building2 className="w-4 h-4 text-blue-700 shrink-0" />}
          value={daira || "all"}
          onChange={handleDairaSelect}
          disabled={!wilaya || availableDairas.length === 0}
          size={size}
          radius="xl"
          fullWidth
        >
          <option value="all">
            {!wilaya
              ? "Choisir une wilaya d’abord"
              : availableDairas.length === 0
                ? "Aucune daïra"
                : `Toutes les daïras (${availableDairas.length})`}
          </option>
          {availableDairas.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </OlmaSelect>

        {/* 3. Baladia / Commune */}
        <OlmaSelect
          id={`${idPrefix}-commune`}
          label={
            <span>
              Commune{" "}
              {wilaya && availableCommunes.length > 0 && (
                <span className="text-[11px] font-normal text-slate-500">({availableCommunes.length})</span>
              )}
            </span>
          }
          leftIcon={<MapPin className="w-4 h-4 text-amber-600 shrink-0" />}
          value={commune || "all"}
          onChange={handleCommuneSelect}
          disabled={!wilaya || availableCommunes.length === 0}
          size={size}
          radius="xl"
          fullWidth
        >
          <option value="all">
            {isCommunesLoading
              ? "Chargement des communes…"
              : !wilaya
                ? "Choisir une wilaya d’abord"
                : availableCommunes.length === 0
                  ? "Aucune commune disponible"
                  : daira && daira !== "all"
                    ? `Toutes les communes de ${daira} (${availableCommunes.length})`
                    : `Toutes les communes de ${wilaya} (${availableCommunes.length})`}
          </option>
          {availableCommunes.map((c) => (
            <option key={`${c.name}-${c.postal_code || ""}`} value={c.name}>
              {c.name} {c.name_ar ? `(${c.name_ar})` : ""}
            </option>
          ))}
        </OlmaSelect>
      </div>
    </div>
  );
};
