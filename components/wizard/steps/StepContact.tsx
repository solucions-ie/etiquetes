"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";
import { useI18n } from "@/lib/i18n/I18nProvider";

type StepContactProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
};

export function StepContact({ register, errors }: StepContactProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">{t.contact.company}</label>
        <input className="field-input" {...register("company")} />
        {errors.company && (
          <p className="field-error">{errors.company.message as string}</p>
        )}
      </div>
      <div>
        <label className="field-label">{t.contact.contactName}</label>
        <input className="field-input" {...register("contactName")} />
        {errors.contactName && (
          <p className="field-error">{errors.contactName.message as string}</p>
        )}
      </div>
      <div>
        <label className="field-label">{t.contact.email}</label>
        <input className="field-input" type="email" {...register("email")} />
        {errors.email && (
          <p className="field-error">{errors.email.message as string}</p>
        )}
      </div>
      <div>
        <label className="field-label">{t.contact.phone}</label>
        <input className="field-input" {...register("phone")} />
        {errors.phone && (
          <p className="field-error">{errors.phone.message as string}</p>
        )}
      </div>
      <div>
        <label className="field-label">{t.contact.comments}</label>
        <textarea
          className="field-input min-h-[80px] resize-y"
          placeholder={t.contact.commentsPlaceholder}
          {...register("comments")}
        />
      </div>
    </div>
  );
}
