"use client";

import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";
import { useI18n } from "@/lib/i18n/I18nProvider";

type StepPrinterProps = {
  register: UseFormRegister<WizardValues>;
  setValue: UseFormSetValue<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
};

const printerOptions: Array<{
  value: WizardValues["printerType"];
  label: string;
  photo: string;
}> = [
  {
    value: "portable",
    label: "Portatil",
    photo: "/printers/portable.jpg"
  },
  {
    value: "desktop",
    label: "Sobretaula",
    photo: "/printers/desktop.jpg"
  },
  {
    value: "industrial",
    label: "Industrial",
    photo: "/printers/industrial-mid.jpg"
  }
];

const printerWidthOptions: Record<
  WizardValues["printerType"],
  Array<{ value: WizardValues["printerWidthClass"]; label: string }>
> = {
  portable: [
    { value: "2", label: '2"' },
    { value: "3", label: '3"' },
    { value: "4", label: '4"' }
  ],
  desktop: [
    { value: "2", label: '2"' },
    { value: "3", label: '3"' },
    { value: "4", label: '4"' }
  ],
  industrial: [
    { value: "4", label: '4"' },
    { value: "6", label: '6"' },
    { value: "8", label: '8"' }
  ]
};

export function StepPrinter({ register, setValue, errors, watch }: StepPrinterProps) {
  const { t } = useI18n();
  const selectedPrinter = watch("printerType");
  const selectedWidthClass = watch("printerWidthClass");

  return (
    <div className="grid gap-2.5">
      {printerOptions.map((option) => {
        const isSelected = selectedPrinter === option.value;
        return (
          <div
            key={option.value}
            className={`cursor-pointer rounded-xl border p-2.5 transition ${
              isSelected
                ? "border-[var(--sie-primary)] bg-[var(--sie-primary-soft)] ring-2 ring-[#ead0d2]"
                : "border-slate-300 bg-white hover:border-slate-400"
            }`}
          >
            <label className="block cursor-pointer">
              <input
                type="radio"
                value={option.value}
                className="sr-only"
                {...register("printerType")}
              />
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <img
                  src={option.photo}
                  alt={t.printer.labels[option.value]}
                  className="h-24 w-full object-contain bg-white p-1.5"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                  }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {t.printer.labels[option.value]}
              </p>
            </label>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {t.printer.compatibleInches}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {printerWidthOptions[option.value].map((widthOption) => {
                const isActive =
                  isSelected && selectedWidthClass === widthOption.value;
                return (
                  <button
                    key={widthOption.value}
                    type="button"
                    onClick={() => {
                      setValue("printerType", option.value, {
                        shouldValidate: true,
                        shouldTouch: true
                      });
                      setValue("printerWidthClass", widthOption.value, {
                        shouldValidate: true,
                        shouldTouch: true
                      });
                    }}
                    className={`rounded-md border px-2 py-1 text-xs font-medium transition ${
                      isActive
                        ? "border-[var(--sie-primary)] bg-[#f3d9db] text-[var(--sie-primary-dark)]"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {widthOption.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {errors.printerType && <p className="field-error">{errors.printerType.message as string}</p>}
      {errors.printerWidthClass && (
        <p className="field-error">{errors.printerWidthClass.message as string}</p>
      )}
    </div>
  );
}
