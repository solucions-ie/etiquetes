"use client";

import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";

type StepMaterialProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
  watch: UseFormWatch<WizardValues>;
};

export function StepMaterial({ register, errors, watch }: StepMaterialProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">Ús principal</label>
        <select className="field-input" {...register("labelUse")}>
          <option value="product">Producte</option>
          <option value="shipping">Logística / enviaments</option>
          <option value="warehouse">Magatzem</option>
          <option value="other">Altres</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">Adhesiu</label>
          <select className="field-input" {...register("adhesive")}>
            <option value="permanent">Permanent</option>
            <option value="removable">Removible</option>
            <option value="freezer">Congelació</option>
          </select>
        </div>
        <div>
          <label className="field-label">Acabat</label>
          <select className="field-input" {...register("finish")}>
            <option value="matte">Mate</option>
            <option value="gloss">Brillant</option>
          </select>
        </div>
      </div>

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
    </div>
  );
}
