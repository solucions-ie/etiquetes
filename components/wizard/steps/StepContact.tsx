"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";

type StepContactProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
};

export function StepContact({ register, errors }: StepContactProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">Empresa</label>
        <input className="field-input" {...register("company")} />
        {errors.company && (
          <p className="field-error">{errors.company.message as string}</p>
        )}
      </div>
      <div>
        <label className="field-label">Persona de contacte</label>
        <input className="field-input" {...register("contactName")} />
        {errors.contactName && (
          <p className="field-error">{errors.contactName.message as string}</p>
        )}
      </div>
      <div>
        <label className="field-label">Correu electronic</label>
        <input className="field-input" type="email" {...register("email")} />
        {errors.email && (
          <p className="field-error">{errors.email.message as string}</p>
        )}
      </div>
      <div>
        <label className="field-label">Telefon (opcional)</label>
        <input className="field-input" {...register("phone")} />
        {errors.phone && (
          <p className="field-error">{errors.phone.message as string}</p>
        )}
      </div>
    </div>
  );
}
