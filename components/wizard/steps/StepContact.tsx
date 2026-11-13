"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";
import { useI18n } from "@/lib/i18n/I18nProvider";

type StepContactProps = {
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
};

export function StepContact({ register, errors }: StepContactProps) {
  const { t, locale } = useI18n();
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="contact-company" className="field-label">{t.contact.company}</label>
        <input className="field-input" id="contact-company" {...register("company")} />
        {errors.company && (
          <p className="field-error">{errors.company.message as string}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-contactName" className="field-label">{t.contact.contactName}</label>
        <input className="field-input" id="contact-contactName" {...register("contactName")} />
        {errors.contactName && (
          <p className="field-error">{errors.contactName.message as string}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className="field-label">{t.contact.email}</label>
        <input className="field-input" type="email" id="contact-email" {...register("email")} />
        {errors.email && (
          <p className="field-error">{errors.email.message as string}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-phone" className="field-label">{t.contact.phone}</label>
        <input className="field-input" id="contact-phone" {...register("phone")} />
        {errors.phone && (
          <p className="field-error">{errors.phone.message as string}</p>
        )}
      </div>
      <div>
        <label htmlFor="required-date" className="field-label">{locale === "es" ? "¿Para cuándo las necesitas? (opcional)" : "Per a quan les necessites? (opcional)"}</label>
        <input id="required-date" type="date" className="field-input" {...register("requiredDate")} />
        <p className="mt-1 text-xs text-slate-500">{locale === "es" ? "Confirmaremos la disponibilidad y el plazo en el presupuesto." : "Confirmarem la disponibilitat i el termini al pressupost."}</p>
      </div>
      <div>
        <label htmlFor="contact-comments" className="field-label">{t.contact.comments}</label>
        <textarea
          className="field-input min-h-[80px] resize-y"
          placeholder={t.contact.commentsPlaceholder}
          id="contact-comments" {...register("comments")}
        />
      </div>
    </div>
  );
}
