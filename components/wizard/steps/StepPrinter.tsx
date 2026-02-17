"use client";

import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";

type StepPrinterProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
};

const printerOptions: Array<{
  value: WizardValues["printerType"];
  label: string;
  note: string;
  photo: string;
}> = [
  {
    value: "portable-small",
    label: "Portatils petites",
    note: "Compactes i mobilitat maxima.",
    photo: "/printers/portable-small.png"
  },
  {
    value: "portable",
    label: "Portatils",
    note: "Format mobil per treball de camp.",
    photo: "/printers/portable.jpg"
  },
  {
    value: "desktop",
    label: "Sobretaula",
    note: "Entorn oficina i volum moderat.",
    photo: "/printers/desktop.jpg"
  },
  {
    value: "industrial-mid",
    label: "Industrial mig rang",
    note: "Operacio continua amb robustesa.",
    photo: "/printers/industrial-mid.jpg"
  },
  {
    value: "industrial-24-7",
    label: "Industrial 24/7",
    note: "Altes carregues i produccio intensiva.",
    photo: "/printers/industrial-24-7.jpg"
  },
  {
    value: "print-engine",
    label: "Motors d'impressio",
    note: "Integracio en linies automatiques.",
    photo: "/printers/print-engine.jpg"
  }
];

export function StepPrinter({ register, errors, watch }: StepPrinterProps) {
  const selectedPrinter = watch("printerType");
  const printTechnology = watch("printTechnology");
  const isPortable =
    selectedPrinter === "portable" || selectedPrinter === "portable-small";

  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Tipus d'impressora</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {printerOptions.map((option) => {
            const isSelected = selectedPrinter === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border p-3 ${
                  isSelected ? "border-[#1C323B] bg-[#edf2f3]" : "border-slate-300 bg-white"
                }`}
              >
                <input type="radio" value={option.value} className="sr-only" {...register("printerType")} />
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <img
                    src={option.photo}
                    alt={option.label}
                    className="h-36 w-full object-contain bg-white p-2"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = "none";
                    }}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-800">{option.label}</p>
                <p className="mt-1 text-xs text-slate-500">{option.note}</p>
              </label>
            );
          })}
        </div>
        {errors.printerType && <p className="field-error">{errors.printerType.message as string}</p>}
      </div>

      {isPortable ? (
        <div className="rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Tecnologia d'impressio</p>
          <p className="mt-1">
            En impressora portatil, aquesta eina fixa la tecnologia a <strong>Termica directa</strong> i sense ribbon.
          </p>
        </div>
      ) : (
        <>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="field-label !mb-0">Tecnologia d'impressio</p>
              <div className="group relative">
                <button
                  type="button"
                  aria-label="Mes informacio sobre tecnologies d'impressio"
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#1C323B] text-[11px] font-bold text-[#1C323B]"
                >
                  ?
                </button>
                <div className="pointer-events-none absolute left-1/2 top-7 z-20 w-72 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700 opacity-0 shadow-lg transition group-hover:opacity-100">
                  <p className="font-semibold text-slate-800">Termica directa</p>
                  <p className="mt-1">No utilitza ribbon. Mes economica i rapida, ideal per etiquetes de curta durada.</p>
                  <p className="mt-2 font-semibold text-slate-800">Transferencia termica</p>
                  <p className="mt-1">Utilitza ribbon (cera, mixt o resina). Dona mes durabilitat i resistencia a fregament, calor i humitat.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="rounded-xl border border-slate-300 p-3 text-sm">
                <input type="radio" value="direct-thermal" className="mr-2" {...register("printTechnology")} />
                Termica directa
              </label>
              <label className="rounded-xl border border-slate-300 p-3 text-sm">
                <input type="radio" value="thermal-transfer" className="mr-2" {...register("printTechnology")} />
                Transferencia termica
              </label>
            </div>
          </div>

          {printTechnology === "thermal-transfer" ? (
            <div>
              <label className="field-label">Tipus de ribbon</label>
              <select className="field-input" {...register("ribbonType")}>
                <option value="none">Selecciona una opcio</option>
                <option value="cera">Cera</option>
                <option value="cera-resina">Cera/Resina</option>
                <option value="resina">Resina</option>
                <option value="unknown">No ho sé</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">Aquesta opcio es obligatoria si tries transferencia termica.</p>
              {errors.ribbonType && <p className="field-error">{errors.ribbonType.message as string}</p>}
            </div>
          ) : (
            <p className="text-xs text-slate-500">En termica directa, normalment no s'utilitza ribbon.</p>
          )}
        </>
      )}
    </div>
  );
}
