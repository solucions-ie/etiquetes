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
    value: "desktop",
    label: "Sobretaula",
    note: "Entorn oficina i volum moderat.",
    photo: "/printers/desktop.jpg"
  },
  {
    value: "industrial",
    label: "Industrial",
    note: "Produccio continua i alt volum.",
    photo: "/printers/industrial-mid.jpg"
  }
];

export function StepPrinter({ register, errors, watch }: StepPrinterProps) {
  const selectedPrinter = watch("printerType");

  return (
    <div className="grid gap-2.5">
      {printerOptions.map((option) => {
        const isSelected = selectedPrinter === option.value;
        return (
          <label
            key={option.value}
            className={`cursor-pointer rounded-xl border p-2.5 transition ${
              isSelected
                ? "border-[#2563eb] bg-blue-50 ring-2 ring-blue-100"
                : "border-slate-300 bg-white hover:border-slate-400"
            }`}
          >
            <input
              type="radio"
              value={option.value}
              className="sr-only"
              {...register("printerType")}
            />
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <img
                src={option.photo}
                alt={option.label}
                className="h-24 w-full object-contain bg-white p-1.5"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                }}
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800">{option.label}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">{option.note}</p>
          </label>
        );
      })}
      {errors.printerType && <p className="field-error">{errors.printerType.message as string}</p>}
    </div>
  );
}
