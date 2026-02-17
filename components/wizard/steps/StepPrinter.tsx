"use client";

import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";

type StepPrinterProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
};

export function StepPrinter({ register, errors, watch }: StepPrinterProps) {
  const printTechnology = watch("printTechnology");

  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Tipus d&apos;impressora</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="rounded-xl border border-slate-300 p-3 text-sm">
            <input
              type="radio"
              value="desktop"
              className="mr-2"
              {...register("printerType")}
            />
            Desktop (bobina petita)
          </label>
          <label className="rounded-xl border border-slate-300 p-3 text-sm">
            <input
              type="radio"
              value="industrial"
              className="mr-2"
              {...register("printerType")}
            />
            Industrial (bobina gran)
          </label>
        </div>
      </div>

      <div>
        <p className="field-label">Tecnologia d&apos;impressió</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="rounded-xl border border-slate-300 p-3 text-sm">
            <input
              type="radio"
              value="direct-thermal"
              className="mr-2"
              {...register("printTechnology")}
            />
            Tèrmica directa
          </label>
          <label className="rounded-xl border border-slate-300 p-3 text-sm">
            <input
              type="radio"
              value="thermal-transfer"
              className="mr-2"
              {...register("printTechnology")}
            />
            Transferència tèrmica
          </label>
        </div>
      </div>

      <div>
        <label className="field-label">Tipus de ribbon</label>
        <select className="field-input" {...register("ribbonType")}>
          <option value="none">Sense ribbon</option>
          <option value="wax">Wax</option>
          <option value="wax-resin">Wax/Resin</option>
          <option value="resin">Resin</option>
        </select>
        <p className="mt-1 text-xs text-slate-500">
          Aquesta opció és obligatòria si tries transferència tèrmica.
        </p>
        {errors.ribbonType && (
          <p className="field-error">{errors.ribbonType.message as string}</p>
        )}
        {printTechnology === "direct-thermal" && (
          <p className="mt-2 text-xs text-slate-500">
            En tèrmica directa, normalment no s&apos;utilitza ribbon.
          </p>
        )}
      </div>
    </div>
  );
}
