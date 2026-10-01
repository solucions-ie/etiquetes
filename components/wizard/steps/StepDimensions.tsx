"use client";

import { useEffect } from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";
import { useI18n } from "@/lib/i18n/I18nProvider";

type StepDimensionsProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
  setValue: UseFormSetValue<WizardValues>;
  compact?: boolean;
};

const coreOptionsMap: Record<
  WizardValues["printerType"],
  Array<{ value: WizardValues["rollCoreMm"]; label: string }>
> = {
  desktop: [
    { value: "25.4", label: "25,4 mm (1\")" },
    { value: "40", label: "40 mm" }
  ],
  portable: [
    { value: "19", label: "19 mm" },
    { value: "25", label: "25 mm" }
  ],
  industrial: [
    { value: "40", label: "40 mm" },
    { value: "76", label: "76 mm (3\")" }
  ]
};

const outerOptionsMap: Record<
  WizardValues["printerType"],
  Array<{ value: number; label: string }>
> = {
  desktop: [
    { value: 90, label: "90 mm" },
    { value: 100, label: "100 mm" },
    { value: 115, label: "115 mm" },
    { value: 120, label: "120 mm" }
  ],
  portable: [
    { value: 50, label: "50 mm" },
    { value: 56, label: "56 mm" },
    { value: 66, label: "66 mm" }
  ],
  industrial: [
    { value: 150, label: "150 mm" },
    { value: 180, label: "180 mm" },
    { value: 190, label: "190 mm" }
  ]
};

export function StepDimensions({
  register,
  errors,
  watch,
  setValue,
  compact = false
}: StepDimensionsProps) {
  const { t } = useI18n();
  const printerType = watch("printerType");
  const rollCore = watch("rollCoreMm");
  const rollOuter = watch("rollOuterDiameterMm");
  const coreOptions = coreOptionsMap[printerType];
  const outerOptions = outerOptionsMap[printerType];

  useEffect(() => {
    if (!coreOptions.some((opt) => opt.value === rollCore)) {
      setValue("rollCoreMm", coreOptions[0].value, { shouldValidate: true });
    }
  }, [coreOptions, rollCore, setValue]);

  useEffect(() => {
    if (!outerOptions.some((option) => option.value === rollOuter)) {
      setValue("rollOuterDiameterMm", outerOptions[0].value, { shouldValidate: true });
    }
  }, [outerOptions, rollOuter, setValue]);

  const wrapperClass = compact
    ? "flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3"
    : "rounded-xl border border-slate-200 bg-white p-4";
  const titleClass = compact
    ? "mb-2 text-sm font-semibold text-slate-800"
    : "mb-3 text-sm font-semibold text-slate-800";
  const gridClass = compact ? "grid gap-3" : "grid gap-4 md:grid-cols-2";
  const svgClass = compact
    ? "h-full w-full rounded-xl border border-slate-200 bg-slate-50"
    : "h-auto w-full rounded-xl border border-slate-200 bg-slate-50";

  return (
    <div className={compact ? "h-full" : "space-y-4"}>
      <div className={wrapperClass}>
        <p className={titleClass}>{t.dimensions.title}</p>
        <div className={gridClass}>
          <div>
            <label className="field-label">{t.dimensions.coreLabel}</label>
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
            <label className="field-label">{t.dimensions.outerLabel}</label>
            <select
              className="field-input"
              {...register("rollOuterDiameterMm", { valueAsNumber: true })}
            >
              {outerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.rollOuterDiameterMm && (
              <p className="field-error">{errors.rollOuterDiameterMm.message as string}</p>
            )}
          </div>
        </div>
        <div className={compact ? "mt-3 flex-1" : "mt-4"}>
          <svg
            className={svgClass}
            preserveAspectRatio={compact ? "xMidYMid meet" : undefined}
            viewBox="0 0 520 240"
            role="img"
            aria-label={t.dimensions.svgAria}
          >
            {(() => {
              const outerOptions = outerOptionsMap[printerType].map((option) => option.value);
              const minOuter = Math.min(...outerOptions);
              const maxOuter = Math.max(...outerOptions);
              const normalizedOuter =
                maxOuter === minOuter ? 1 : (rollOuter - minOuter) / (maxOuter - minOuter);
              const coreOptions = coreOptionsMap[printerType].map((option) => Number(option.value));
              const minCore = Math.min(...coreOptions);
              const maxCore = Math.max(...coreOptions);
              const normalizedCore =
                maxCore === minCore ? 1 : (Number(rollCore) - minCore) / (maxCore - minCore);

              const innerRx = 22 + normalizedCore * 18;
              const innerRy = 15 + normalizedCore * 10;
              const outerRx = innerRx + 40 + normalizedOuter * 56;
              const outerRy = innerRy + 26 + normalizedOuter * 34;
              const cx = 260;
              const cy = 148;
              return (
                <>
                  <ellipse cx={cx} cy={cy + 18} rx={outerRx} ry={outerRy} fill="#cfd8e3" opacity="0.55" />
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
                    {t.dimensions.svgOuter(rollOuter)}
                  </text>

                  <line x1={cx - innerRx} y1={cy} x2={cx + innerRx} y2={cy} stroke="#0f172a" strokeWidth="1.7" />
                  <path d={`M ${cx - innerRx} ${cy} l 6 -4 M ${cx - innerRx} ${cy} l 6 4`} fill="none" stroke="#0f172a" strokeWidth="1.7" />
                  <path d={`M ${cx + innerRx} ${cy} l -6 -4 M ${cx + innerRx} ${cy} l -6 4`} fill="none" stroke="#0f172a" strokeWidth="1.7" />
                  <line x1={cx - innerRx} y1={cy - 16} x2={cx - innerRx} y2={cy + 16} stroke="#334155" strokeWidth="1.1" strokeDasharray="4 3" />
                  <line x1={cx + innerRx} y1={cy - 16} x2={cx + innerRx} y2={cy + 16} stroke="#334155" strokeWidth="1.1" strokeDasharray="4 3" />
                  <text x={cx} y={cy - 20} textAnchor="middle" fontSize="10.5" fill="#0f172a">
                    {t.dimensions.svgCore(rollCore)}
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
