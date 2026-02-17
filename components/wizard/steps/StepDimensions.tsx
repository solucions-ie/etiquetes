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
  "portable-small": [
    { value: "12.5", label: "12,5 mm" },
    { value: "19", label: "19 mm" },
    { value: "25.4", label: "25,4 mm (1\")" }
  ],
  portable: [
    { value: "12.5", label: "12,5 mm" },
    { value: "19", label: "19 mm" },
    { value: "25.4", label: "25,4 mm (1\")" }
  ],
  desktop: [
    { value: "25.4", label: "25,4 mm (1\")" },
    { value: "40", label: "40 mm" }
  ],
  "industrial-mid": [
    { value: "25.4", label: "25,4 mm (1\")" },
    { value: "40", label: "40 mm" },
    { value: "76", label: "76 mm (3\")" }
  ],
  "industrial-24-7": [{ value: "76", label: "76 mm (3\")" }],
  "print-engine": [{ value: "external", label: "Bobinat per fora del motor" }]
};
const outerRangeByPrinter: Record<
  WizardValues["printerType"],
  { min: number; max: number; hint: string }
> = {
  "portable-small": { min: 25, max: 66, hint: "Portatil petita: Ø 25 a 66 mm" },
  portable: { min: 25, max: 66, hint: "Portatil: Ø 25 a 66 mm" },
  desktop: { min: 40, max: 120, hint: "Sobretaula: Ø 40 a 120 mm" },
  "industrial-mid": { min: 76, max: 230, hint: "Industrial: Ø 76 a 230 mm" },
  "industrial-24-7": { min: 76, max: 230, hint: "Industrial 24/7: Ø 76 a 230 mm" },
  "print-engine": { min: 76, max: 230, hint: "Motor: Ø 76 a 230 mm" }
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
  const labelFlowType = watch("labelFlowType");
  const hasCut = watch("hasCut");
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
      <div>
        <div>
          <label className="field-label">Amplada (mm)</label>
          <input
            className="field-input"
            type="number"
            min={15}
            {...register("labelWidthMm", { valueAsNumber: true })}
          />
          {errors.labelWidthMm && (
            <p className="field-error">{errors.labelWidthMm.message as string}</p>
          )}
        </div>
        <div>
          <label className="field-label">Alçada (mm)</label>
          <input
            className="field-input"
            type="number"
            min={10}
            disabled={labelFlowType === "continuous"}
            {...register("labelHeightMm", { valueAsNumber: true })}
          />
          {labelFlowType === "continuous" && (
            <p className="mt-1 text-xs text-slate-500">
              En mode continu l'alçada no aplica.
            </p>
          )}
          {errors.labelHeightMm && (
            <p className="field-error">{errors.labelHeightMm.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">Tipus d'avanç de l'etiqueta</label>
          <select className="field-input" {...register("labelFlowType")}>
            <option value="gap">Amb GAP</option>
            <option value="black-mark">Amb marca negra</option>
            <option value="continuous">Continu</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Defineix com detecta la impressora l'inici de cada etiqueta.
          </p>
          {labelFlowType !== "continuous" && (
            <div className="mt-3">
              <label className="text-sm font-medium text-slate-700">
                <input type="checkbox" className="mr-2" {...register("hasCut")} />
                Aplicar tall trepat?
              </label>
              {hasCut && (
                <div className="mt-2">
                  <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    Tipus de tall: <strong>Trepat</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-800">
          Ultim pas: bobina i mandril
        </p>
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
            aria-label="Il·lustracio de mandril i diametre exterior"
          >
            {rollCore === "external" ? (
              <g>
                <rect x="180" y="74" width="170" height="84" rx="12" fill="#e2e8f0" stroke="#475569" />
                <path d="M205 116 H325" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
                <path d="M309 103 L325 116 L309 129" fill="none" stroke="#1f2937" strokeWidth="3" />
                <text x="260" y="54" textAnchor="middle" fontSize="13" fill="#334155">
                  Bobinat per fora del motor
                </text>
              </g>
            ) : (
              <g>
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
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
