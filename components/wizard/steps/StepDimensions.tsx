"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";

type StepDimensionsProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
};

export function StepDimensions({ register, errors }: StepDimensionsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
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
            {...register("labelHeightMm", { valueAsNumber: true })}
          />
          {errors.labelHeightMm && (
            <p className="field-error">{errors.labelHeightMm.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">Canuto (nucli de bobina)</label>
          <select className="field-input" {...register("rollCoreMm")}>
            <option value="25">25 mm (1&quot;)</option>
            <option value="40">40 mm</option>
            <option value="76">76 mm (3&quot;)</option>
          </select>
        </div>
        <div>
          <label className="field-label">Gap entre etiquetes (mm)</label>
          <input
            className="field-input"
            type="number"
            min={0}
            step="0.1"
            {...register("gapMm", { valueAsNumber: true })}
          />
          {errors.gapMm && (
            <p className="field-error">{errors.gapMm.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}
