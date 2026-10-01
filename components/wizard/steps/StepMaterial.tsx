"use client";

import { useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";
import { useI18n } from "@/lib/i18n/I18nProvider";

type StepMaterialProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
  setValue: UseFormSetValue<WizardValues>;
};

type FamilyKey = "paper" | "synthetic" | "textile" | "other";

// Structural data (ids + grouping). Display text lives in the i18n dictionary.
const MATERIALS: Array<{ id: WizardValues["materialType"]; family: FamilyKey }> = [
  { id: "paper-thermal-eco", family: "paper" },
  { id: "paper-thermal-protected", family: "paper" },
  { id: "paper-thermal-direct-ticket", family: "paper" },
  { id: "paper-couche", family: "paper" },
  { id: "paper-matte", family: "paper" },
  { id: "paper-inkjet-gloss", family: "paper" },
  { id: "paper-inkjet-matte", family: "paper" },
  { id: "plastic-pp-gloss", family: "synthetic" },
  { id: "plastic-pp-matte", family: "synthetic" },
  { id: "plastic-pe-gloss", family: "synthetic" },
  { id: "plastic-pe-matte", family: "synthetic" },
  { id: "plastic-pet-gloss", family: "synthetic" },
  { id: "plastic-pet-matte", family: "synthetic" },
  { id: "plastic-pvc", family: "synthetic" },
  { id: "plastic-artyval", family: "synthetic" },
  { id: "textile-polyamide", family: "textile" },
  { id: "material-unknown", family: "other" },
  { id: "material-other", family: "other" }
];

const ADHESIVES: Array<WizardValues["adhesive"]> = ["acrylic", "hotmelt", "removable"];

const FAMILIES: FamilyKey[] = ["paper", "synthetic", "textile", "other"];

export function StepMaterial({ register, errors, watch }: StepMaterialProps) {
  const { t } = useI18n();
  const [showMaterialGuide, setShowMaterialGuide] = useState(false);
  const [showAdhesiveGuide, setShowAdhesiveGuide] = useState(false);
  const selectedMaterialId = watch("materialType");
  const selectedAdhesiveId = watch("adhesive");
  const hideAdhesive =
    selectedMaterialId === "paper-thermal-direct-ticket" ||
    selectedMaterialId === "plastic-artyval" ||
    selectedMaterialId === "material-unknown" ||
    selectedMaterialId === "material-other";
  const isIndeterminate =
    selectedMaterialId === "material-unknown" || selectedMaterialId === "material-other";
  const selectedMaterial = t.material.items[selectedMaterialId] ?? t.material.items["paper-thermal-eco"];
  const selectedAdhesive = t.adhesive.items[selectedAdhesiveId] ?? t.adhesive.items.acrylic;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <label className="field-label !mb-0">{t.material.label}</label>
          <button
            type="button"
            onClick={() => setShowMaterialGuide(true)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.material.guideButton}
          </button>
        </div>
        <select className="field-input" {...register("materialType")}>
          {FAMILIES.map((family) => (
            <optgroup key={family} label={t.material.families[family]}>
              {MATERIALS.filter((item) => item.family === family).map((item) => (
                <option key={item.id} value={item.id}>
                  {t.material.items[item.id].name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.materialType && (
          <p className="field-error">{errors.materialType.message as string}</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
        <p className="font-semibold text-[var(--sie-primary)]">{selectedMaterial.name}</p>
        <p className="mt-1">{selectedMaterial.description}</p>
        {!isIndeterminate && (
          <p className="mt-2 text-xs text-slate-600">
            <strong className="text-[var(--sie-primary-dark)]">{t.material.usesLabel}</strong>{" "}
            {selectedMaterial.uses}
          </p>
        )}
      </div>

      {selectedMaterialId === "material-other" && (
        <div>
          <label className="field-label">{t.material.describeLabel}</label>
          <textarea
            className="field-input min-h-[72px] resize-y"
            placeholder={t.material.describePlaceholder}
            {...register("materialOtherDescription")}
          />
        </div>
      )}

      <div>
        <label className="field-label">{t.material.observationsLabel}</label>
        <textarea
          className="field-input min-h-[72px] resize-y"
          placeholder={t.material.observationsPlaceholder}
          {...register("materialObservations")}
        />
      </div>

      {!hideAdhesive ? (
        <>
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="field-label !mb-0">{t.adhesive.label}</label>
              <button
                type="button"
                onClick={() => setShowAdhesiveGuide(true)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.adhesive.guideButton}
              </button>
            </div>
            <select className="field-input" {...register("adhesive")}>
              {ADHESIVES.map((id) => (
                <option key={id} value={id}>
                  {t.adhesive.items[id].name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <p className="font-semibold text-[var(--sie-primary)]">{selectedAdhesive.name}</p>
            <p className="mt-1">{selectedAdhesive.description}</p>
            <p className="mt-2 text-xs text-slate-600">
              <strong className="text-[var(--sie-primary-dark)]">{t.adhesive.usesLabel}</strong>{" "}
              {selectedAdhesive.uses}
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-[var(--sie-primary-border)] bg-[var(--sie-primary-softer)] p-3 text-sm text-[var(--sie-ink)]">
          {t.adhesive.noAdhesive}
        </div>
      )}

      <div>
        <label className="field-label">{t.material.colorCountLabel}</label>
        <select className="field-input" {...register("colorCount")}>
          {(["0", "1", "2", "3", "4"] as WizardValues["colorCount"][]).map((value) => (
            <option key={value} value={value}>
              {t.material.colorCountOptions[value]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">{t.material.quantityLabel}</label>
        <input
          className="field-input"
          type="number"
          min={100}
          step={100}
          {...register("quantity", { valueAsNumber: true })}
        />
        {errors.quantity && (
          <p className="field-error">{errors.quantity.message as string}</p>
        )}
        <p className="mt-2 text-xs text-slate-600">{t.material.quantityNote}</p>
      </div>

      {showMaterialGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">{t.material.guideModalTitle}</h3>
              <button
                type="button"
                onClick={() => setShowMaterialGuide(false)}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.material.close}
              </button>
            </div>

            <div className="space-y-4">
              {FAMILIES.map((family) => (
                <section key={family}>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                    {t.material.families[family]}
                  </h4>
                  <div className="grid gap-2">
                    {MATERIALS.filter((item) => item.family === family).map((item) => {
                      const text = t.material.items[item.id];
                      return (
                        <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-sm font-semibold text-[var(--sie-primary)]">{text.name}</p>
                          <p className="mt-1 text-sm text-slate-700">{text.description}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            <strong className="text-[var(--sie-primary-dark)]">{t.material.usesLabel}</strong>{" "}
                            {text.uses}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAdhesiveGuide && !hideAdhesive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">{t.adhesive.guideModalTitle}</h3>
              <button
                type="button"
                onClick={() => setShowAdhesiveGuide(false)}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.material.close}
              </button>
            </div>

            <div className="grid gap-2">
              {ADHESIVES.map((id) => {
                const text = t.adhesive.items[id];
                return (
                  <article key={id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-[var(--sie-primary)]">{text.name}</p>
                    <p className="mt-1 text-sm text-slate-700">{text.description}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      <strong className="text-[var(--sie-primary-dark)]">{t.adhesive.usesLabel}</strong>{" "}
                      {text.uses}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
