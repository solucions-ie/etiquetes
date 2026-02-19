"use client";

import { useEffect } from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";

type StepDimensionsProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
  setValue: UseFormSetValue<WizardValues>;
};

const coreOptionsMap: Record<
  WizardValues["printerType"],
  Array<{ value: WizardValues["rollCoreMm"]; label: string }>
> = {
  desktop: [
    { value: "25.4", label: "25,4 mm (1\")" },
    { value: "40", label: "40 mm" }
  ],
  industrial: [
    { value: "40", label: "40 mm" },
    { value: "76", label: "76 mm (3\")" }
  ]
};

const outerRangeByPrinter: Record<
  WizardValues["printerType"],
  { min: number; max: number; hint: string }
> = {
  desktop: { min: 40, max: 120, hint: "Sobretaula: diametre 40 a 120 mm" },
  industrial: { min: 76, max: 230, hint: "Industrial: diametre 76 a 230 mm" }
};

export function StepDimensions({
  register,
  errors,
  watch,
  setValue
}: StepDimensionsProps) {
  const printerType = watch("printerType");
  const rollCore = watch("rollCoreMm");
  const rollOuter = watch("rollOuterDiameterMm");
  const coreOptions = coreOptionsMap[printerType];
  const outerRange = outerRangeByPrinter[printerType];

  useEffect(() => {
    if (!coreOptions.some((opt) => opt.value === rollCore)) {
      setValue("rollCoreMm", coreOptions[0].value, { shouldValidate: true });
    }
  }, [coreOptions, rollCore, setValue]);

  useEffect(() => {
    if (rollOuter < outerRange.min || rollOuter > outerRange.max) {
      setValue("rollOuterDiameterMm", outerRange.max, { shouldValidate: true });
    }
  }, [outerRange.max, outerRange.min, rollOuter, setValue]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-800">Mida de la bobina i mandril</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="field-label">Canuto (nucli de bobina)</label>
            <select className="field-input" {...register("rollCoreMm")}>
              {coreOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.rollCoreMm && (
              <p className="field-error">{errors.rollCoreMm.message as string}</p>
            )}
          </div>
          <div>
            <label className="field-label">Diametre exterior bobina (mm)</label>
            <input
              className="field-input"
              type="number"
              min={outerRange.min}
              max={outerRange.max}
              {...register("rollOuterDiameterMm", { valueAsNumber: true })}
            />
            <p className="mt-1 text-xs text-slate-500">{outerRange.hint}</p>
            {errors.rollOuterDiameterMm && (
              <p className="field-error">{errors.rollOuterDiameterMm.message as string}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <svg
            className="h-auto w-full rounded-xl border border-slate-200 bg-slate-50"
            viewBox="0 0 520 220"
            role="img"
            aria-label="Il-lustracio de mandril i diametre exterior"
          >
            {(() => {
              const innerRx = Math.max(14, Math.min(34, Number(rollCore) / 1.8));
              const innerRy = Math.max(10, Math.min(22, Number(rollCore) / 2.8));
              const outerRx = Math.max(innerRx + 18, Math.min(96, rollOuter / 2.15));
              const outerRy = Math.max(innerRy + 12, Math.min(58, rollOuter / 3.2));
              const cx = 260;
              const cy = 132;
              return (
                <>
                  <ellipse cx={cx} cy={cy + 16} rx={outerRx} ry={outerRy} fill="#cfd8e3" opacity="0.55" />
                  <ellipse cx={cx} cy={cy} rx={outerRx} ry={outerRy} fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                  <ellipse cx={cx} cy={cy} rx={innerRx} ry={innerRy} fill="#ffffff" stroke="#64748b" strokeWidth="1.6" />

                  <line x1={cx - outerRx} y1={cy - outerRy - 24} x2={cx + outerRx} y2={cy - outerRy - 24} stroke="#0f172a" strokeWidth="1.6" />
                  <path d={`M ${cx - outerRx} ${cy - outerRy - 24} l 7 -4 M ${cx - outerRx} ${cy - outerRy - 24} l 7 4`} fill="none" stroke="#0f172a" strokeWidth="1.6" />
                  <path d={`M ${cx + outerRx} ${cy - outerRy - 24} l -7 -4 M ${cx + outerRx} ${cy - outerRy - 24} l -7 4`} fill="none" stroke="#0f172a" strokeWidth="1.6" />
                  <line x1={cx - outerRx} y1={cy - outerRy - 18} x2={cx - outerRx} y2={cy - outerRy + 10} stroke="#334155" strokeWidth="1.1" strokeDasharray="4 3" />
                  <line x1={cx + outerRx} y1={cy - outerRy - 18} x2={cx + outerRx} y2={cy - outerRy + 10} stroke="#334155" strokeWidth="1.1" strokeDasharray="4 3" />
                  <line x1={cx - outerRx} y1={cy} x2={cx - outerRx} y2={cy + outerRy} stroke="#64748b" strokeWidth="1.2" />
                  <line x1={cx + outerRx} y1={cy} x2={cx + outerRx} y2={cy + outerRy} stroke="#64748b" strokeWidth="1.2" />
                  <text x={cx} y={cy - outerRy - 34} textAnchor="middle" fontSize="11" fill="#0f172a">
                    Diametre exterior {rollOuter} mm
                  </text>

                  <line x1={cx - innerRx} y1={cy} x2={cx + innerRx} y2={cy} stroke="#0f172a" strokeWidth="1.7" />
                  <path d={`M ${cx - innerRx} ${cy} l 6 -4 M ${cx - innerRx} ${cy} l 6 4`} fill="none" stroke="#0f172a" strokeWidth="1.7" />
                  <path d={`M ${cx + innerRx} ${cy} l -6 -4 M ${cx + innerRx} ${cy} l -6 4`} fill="none" stroke="#0f172a" strokeWidth="1.7" />
                  <line x1={cx - innerRx} y1={cy - 16} x2={cx - innerRx} y2={cy + 16} stroke="#334155" strokeWidth="1.1" strokeDasharray="4 3" />
                  <line x1={cx + innerRx} y1={cy - 16} x2={cx + innerRx} y2={cy + 16} stroke="#334155" strokeWidth="1.1" strokeDasharray="4 3" />
                  <text x={cx} y={cy - 20} textAnchor="middle" fontSize="10.5" fill="#0f172a">
                    Mandril {rollCore} mm
                  </text>
                </>
              );
            })()}
          </svg>
        </div>
      </div>
    </div>
  );
}
