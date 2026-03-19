"use client";

import { useState } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";

type StepMaterialProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
};

type MaterialInfo = {
  id: WizardValues["materialType"];
  family: "Etiqueta de paper" | "Sintètic" | "Tèxtil";
  name: string;
  description: string;
  uses: string;
};

type AdhesiveInfo = {
  id: WizardValues["adhesive"];
  name: string;
  description: string;
  uses: string;
};

const MATERIALS: MaterialInfo[] = [
  {
    id: "paper-thermal-eco",
    family: "Etiqueta de paper",
    name: "Etiqueta tèrmica eco",
    description: "Opció econòmica per a usos temporals; més sensible a la calor, la humitat i el fregament.",
    uses: "Promocions curtes, etiquetatge temporal, flux intern."
  },
  {
    id: "paper-thermal-protected",
    family: "Etiqueta de paper",
    name: "Etiqueta tèrmica protegida",
    description: "Amb capa de protecció superficial per millorar la durada en entorns freds o humits.",
    uses: "Alimentació, refrigerat, preparació de comandes."
  },
  {
    id: "paper-thermal-direct-ticket",
    family: "Etiqueta de paper",
    name: "Paper tèrmic - Tiquet (sense adhesiu)",
    description: "Impressió sense ribbon i sense adhesiu, orientada a la tiqueteria; baixa resistència a la calor i la llum solar.",
    uses: "Tickets, torns, comprovants i tiquet de caixa."
  },
  {
    id: "paper-couche",
    family: "Etiqueta de paper",
    name: "Etiqueta couche",
    description: "Bona qualitat d'impressió i acabat net; ideal per a aplicacions d'interior o de curta durada.",
    uses: "Producte general, retail, identificació interna."
  },
  {
    id: "paper-matte",
    family: "Etiqueta de paper",
    name: "Etiqueta mate",
    description: "Acabat mat amb bona llegibilitat i reflex reduït; bona opció per a text i codis.",
    uses: "Producte, magatzem i etiquetatge intern."
  },
  {
    id: "paper-inkjet-gloss",
    family: "Etiqueta de paper",
    name: "Etiqueta inkjet brillant",
    description: "Recobriment per a impressió a color viva i detall alt amb acabat brillant; menor resistència a l'aigua i al fregament.",
    uses: "Promocions, packaging visual i etiquetes a color."
  },
  {
    id: "paper-inkjet-matte",
    family: "Etiqueta de paper",
    name: "Etiqueta inkjet mate",
    description: "Recobriment per a impressió a color amb acabat mat i bona llegibilitat; menor resistència a l'aigua i al fregament.",
    uses: "Promocions, packaging visual i etiquetes a color sense reflex."
  },
  {
    id: "plastic-pp-gloss",
    family: "Sintètic",
    name: "PP brillant (polipropilè)",
    description: "Bona resistència a l'aigua, greixos i alguns químics amb bon equilibri entre cost i prestacions.",
    uses: "Cosmètica, neteja, higiene i consumibles."
  },
  {
    id: "plastic-pp-matte",
    family: "Sintètic",
    name: "PP mate (polipropilè)",
    description: "Bona resistència a l'aigua, greixos i alguns químics amb acabat sense reflex.",
    uses: "Cosmètica, neteja, higiene i consumibles."
  },
  {
    id: "plastic-pe-gloss",
    family: "Sintètic",
    name: "PE brillant (polietilè)",
    description: "Material flexible que s'adapta bé a envasos corbats o deformables.",
    uses: "Ampolles flexibles, productes de cura personal i detergència."
  },
  {
    id: "plastic-pe-matte",
    family: "Sintètic",
    name: "PE mate (polietilè)",
    description: "Material flexible amb acabat mat, apte per envasos corbats o deformables.",
    uses: "Ampolles flexibles, productes de cura personal i detergència."
  },
  {
    id: "plastic-pet-gloss",
    family: "Sintètic",
    name: "PET brillant (polièster)",
    description: "Molt durable i resistent a la temperatura i al desgast; orientat a entorns exigents.",
    uses: "Industrial, laboratoris, traçabilitat de llarga durada."
  },
  {
    id: "plastic-pet-matte",
    family: "Sintètic",
    name: "PET mate (polièster)",
    description: "Molt durable i resistent a la temperatura i al desgast amb acabat mat.",
    uses: "Industrial, laboratoris, traçabilitat de llarga durada."
  },
  {
    id: "plastic-pvc",
    family: "Sintètic",
    name: "PVC (vinil)",
    description: "Alta resistència a la intempèrie i la humitat, adequat per a aplicacions exteriors.",
    uses: "Senyalització, exterior, etiquetes exposades."
  },
  {
    id: "plastic-artyval",
    family: "Sintètic",
    name: "Sintètic Artyval (sense adhesiu)",
    description: "Aspecte paper amb resistència de plàstic; molt versàtil en entorns humits o industrials.",
    uses: "Magatzem, producció, etiquetatge tècnic amb bona durabilitat."
  },
  {
    id: "textile-polyamide",
    family: "Tèxtil",
    name: "Poliamida (nylon)",
    description: "Etiqueta tèxtil resistent i suau, amb bon comportament en rentat i planxa.",
    uses: "Moda, confecció, composició i cura de peces rentables."
  }
];

const ADHESIVES: AdhesiveInfo[] = [
  {
    id: "acrylic",
    name: "Acrílic (base aigua)",
    description: "Bona durabilitat en sec i aplicacions estables; no és l'opció ideal en humitat alta o fred extrem.",
    uses: "Producte general, retail i etiquetatge interior."
  },
  {
    id: "hotmelt",
    name: "Hotmelt (base cautxú)",
    description: "Excel·lent adherència inicial i bon rendiment en fred i humitat.",
    uses: "Alimentació, logística de fresc, superfícies complexes."
  },
  {
    id: "removable",
    name: "Removible",
    description: "Permet retirar l'etiqueta amb facilitat i minimitza residus d'adhesiu.",
    uses: "Promocions, preus temporals i etiquetatge de curta durada."
  }
];

const FAMILIES: Array<MaterialInfo["family"]> = [
  "Etiqueta de paper",
  "Sintètic",
  "Tèxtil"
];

export function StepMaterial({ register, errors, watch }: StepMaterialProps) {
  const [showMaterialGuide, setShowMaterialGuide] = useState(false);
  const [showAdhesiveGuide, setShowAdhesiveGuide] = useState(false);
  const selectedMaterialId = watch("materialType");
  const selectedAdhesiveId = watch("adhesive");
  const hideAdhesive =
    selectedMaterialId === "paper-thermal-direct-ticket" ||
    selectedMaterialId === "plastic-artyval";
  const selectedMaterial = MATERIALS.find((item) => item.id === selectedMaterialId) ?? MATERIALS[0];
  const selectedAdhesive = ADHESIVES.find((item) => item.id === selectedAdhesiveId) ?? ADHESIVES[0];

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <label className="field-label !mb-0">Material de l'etiqueta</label>
          <button
            type="button"
            onClick={() => setShowMaterialGuide(true)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Guia de materials
          </button>
        </div>
        <select className="field-input" {...register("materialType")}>
          {FAMILIES.map((family) => (
            <optgroup key={family} label={family}>
              {MATERIALS.filter((item) => item.family === family).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
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
        <p className="mt-2 text-xs text-slate-600">
          <strong className="text-[var(--sie-primary-dark)]">Usos recomanats:</strong> {selectedMaterial.uses}
        </p>
      </div>

      {!hideAdhesive ? (
        <>
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="field-label !mb-0">Tipus d'adhesiu</label>
              <button
                type="button"
                onClick={() => setShowAdhesiveGuide(true)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Guia d'adhesius
              </button>
            </div>
            <select className="field-input" {...register("adhesive")}>
              {ADHESIVES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <p className="font-semibold text-[var(--sie-primary)]">{selectedAdhesive.name}</p>
            <p className="mt-1">{selectedAdhesive.description}</p>
            <p className="mt-2 text-xs text-slate-600">
              <strong className="text-[var(--sie-primary-dark)]">Usos recomanats:</strong> {selectedAdhesive.uses}
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-[var(--sie-primary-border)] bg-[var(--sie-primary-softer)] p-3 text-sm text-[var(--sie-ink)]">
          Aquesta opció no porta adhesiu.
        </div>
      )}

      <div>
        <label className="field-label">Quantitat estimada</label>
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
        <p className="mt-2 text-xs text-slate-600">
          Per circumstàncies de producció, el nombre final d'etiquetes pot variar +/- 10%.
        </p>
      </div>

      {showMaterialGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Guia de materials d'etiqueta</h3>
              <button
                type="button"
                onClick={() => setShowMaterialGuide(false)}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Tancar
              </button>
            </div>

            <div className="space-y-4">
              {FAMILIES.map((family) => (
                <section key={family}>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">{family}</h4>
                  <div className="grid gap-2">
                    {MATERIALS.filter((item) => item.family === family).map((item) => (
                      <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-sm font-semibold text-[var(--sie-primary)]">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-700">{item.description}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          <strong className="text-[var(--sie-primary-dark)]">Usos recomanats:</strong> {item.uses}
                        </p>
                      </article>
                    ))}
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
              <h3 className="text-base font-semibold text-slate-900">Guia d'adhesius</h3>
              <button
                type="button"
                onClick={() => setShowAdhesiveGuide(false)}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Tancar
              </button>
            </div>

            <div className="grid gap-2">
              {ADHESIVES.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-[var(--sie-primary)]">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-700">{item.description}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    <strong className="text-[var(--sie-primary-dark)]">Usos recomanats:</strong> {item.uses}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
