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
  family: "Etiqueta de paper" | "Plastic (sintetic)" | "Textil";
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
    description: "Opcio economica per usos temporals; mes sensible a calor, humitat i fregament.",
    uses: "Promocions curtes, etiquetatge temporal, flux intern."
  },
  {
    id: "paper-thermal-protected",
    family: "Etiqueta de paper",
    name: "Etiqueta tèrmica protegida",
    description: "Amb capa de proteccio superficial per millorar durada en entorns freds o humits.",
    uses: "Alimentacio, refrigerat, preparacio de comandes."
  },
  {
    id: "paper-thermal-direct-ticket",
    family: "Etiqueta de paper",
    name: "Etiqueta tèrmica directa tiquet (sense adhesiu)",
    description: "Impressio sense ribbon i sense adhesiu, orientada a tiqueteria; baixa resistencia a calor i llum solar.",
    uses: "Tickets, torns, comprovants i tiquet de caixa."
  },
  {
    id: "paper-couche",
    family: "Etiqueta de paper",
    name: "Etiqueta couche",
    description: "Bona qualitat d'impressio i acabat net; ideal per aplicacions d'interior o de curta durada.",
    uses: "Producte general, retail, identificacio interna."
  },
  {
    id: "paper-matte",
    family: "Etiqueta de paper",
    name: "Etiqueta mate",
    description: "Acabat mat amb bona llegibilitat i reflex reduit; bona opcio per text i codis.",
    uses: "Producte, magatzem i etiquetatge intern."
  },
  {
    id: "paper-inkjet-gloss",
    family: "Etiqueta de paper",
    name: "Etiqueta inkjet brillant",
    description: "Recobriment per impressio color viva i detall alt amb acabat brillant; menor resistencia a aigua i fregament.",
    uses: "Promocions, packaging visual i etiquetes a color."
  },
  {
    id: "paper-inkjet-matte",
    family: "Etiqueta de paper",
    name: "Etiqueta inkjet mate",
    description: "Recobriment per impressio color amb acabat mat i bona llegibilitat; menor resistencia a aigua i fregament.",
    uses: "Promocions, packaging visual i etiquetes a color sense reflex."
  },
  {
    id: "plastic-pp",
    family: "Plastic (sintetic)",
    name: "PP (polipropile)",
    description: "Bona resistencia a aigua, greixos i alguns quimics amb bon equilibri entre cost i prestacions.",
    uses: "Cosmetica, neteja, higiene i consumibles."
  },
  {
    id: "plastic-pe",
    family: "Plastic (sintetic)",
    name: "PE (polietile)",
    description: "Material flexible que s'adapta be a envasos corbats o deformables.",
    uses: "Ampolles flexibles, productes de cura personal i detergencia."
  },
  {
    id: "plastic-pet",
    family: "Plastic (sintetic)",
    name: "PET (poliester)",
    description: "Molt durable i resistent a temperatura i desgast; orientat a entorns exigents.",
    uses: "Industrial, laboratoris, traçabilitat de llarga durada."
  },
  {
    id: "plastic-pvc",
    family: "Plastic (sintetic)",
    name: "PVC (vinil)",
    description: "Alta resistencia a intemperie i humitat, adequat per aplicacions exteriors.",
    uses: "Senyalitzacio, exterior, etiquetes exposades."
  },
  {
    id: "plastic-artyval",
    family: "Plastic (sintetic)",
    name: "Paper sintetic Artyval",
    description: "Aspecte paper amb resistencia de plastic; molt versatil en entorns humits o industrials.",
    uses: "Magatzem, produccio, etiquetatge tecnic amb bona durabilitat."
  },
  {
    id: "textile-polyamide",
    family: "Textil",
    name: "Poliamida (nylon)",
    description: "Etiqueta textil resistent i suau, amb bon comportament en rentat i planxa.",
    uses: "Moda, confeccio, composicio i cura de peces rentables."
  }
];

const ADHESIVES: AdhesiveInfo[] = [
  {
    id: "acrylic",
    name: "Acrilic (base aigua)",
    description: "Bona durabilitat en sec i aplicacions estables; no es l'opcio ideal en humitat alta o fred extrem.",
    uses: "Producte general, retail i etiquetatge interior."
  },
  {
    id: "hotmelt",
    name: "Hotmelt (base cautxu)",
    description: "Excel.lent adherencia inicial i bon rendiment en fred i humitat.",
    uses: "Alimentacio, logistica de fresc, superfices complexes."
  },
  {
    id: "solvent",
    name: "Solvent (formules especials)",
    description: "Adhesiu d'altes prestacions per necessitats molt concretes, amb cost mes alt.",
    uses: "Casos tecnics especials on cal maxima resistencia."
  }
];

const FAMILIES: Array<MaterialInfo["family"]> = [
  "Etiqueta de paper",
  "Plastic (sintetic)",
  "Textil"
];

export function StepMaterial({ register, errors, watch }: StepMaterialProps) {
  const [showMaterialGuide, setShowMaterialGuide] = useState(false);
  const [showAdhesiveGuide, setShowAdhesiveGuide] = useState(false);
  const selectedMaterialId = watch("materialType");
  const selectedAdhesiveId = watch("adhesive");
  const isTicketNoAdhesive = selectedMaterialId === "paper-thermal-direct-ticket";
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
        <p className="font-semibold text-slate-900">{selectedMaterial.name}</p>
        <p className="mt-1">{selectedMaterial.description}</p>
        <p className="mt-2 text-xs text-slate-600">
          <strong>Usos recomanats:</strong> {selectedMaterial.uses}
        </p>
      </div>

      {!isTicketNoAdhesive ? (
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
            <p className="font-semibold text-slate-900">{selectedAdhesive.name}</p>
            <p className="mt-1">{selectedAdhesive.description}</p>
            <p className="mt-2 text-xs text-slate-600">
              <strong>Usos recomanats:</strong> {selectedAdhesive.uses}
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
          Aquesta opcio es de tiquet i no porta adhesiu.
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
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-700">{item.description}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          <strong>Usos recomanats:</strong> {item.uses}
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

      {showAdhesiveGuide && !isTicketNoAdhesive && (
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
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-700">{item.description}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    <strong>Usos recomanats:</strong> {item.uses}
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
