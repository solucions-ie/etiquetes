import { defaultWizardValues, type WizardValues } from "@/lib/schemas/wizard";
import { renderCompactEmailHtml, renderInternalSummaryHtml } from "@/lib/email/mailTemplates";
import { generateLabelCode } from "@/lib/labelCode";
import { DEFAULT_LOCALE, Locale } from "@/lib/i18n/dictionaries";
import { EMAIL_STRINGS } from "@/lib/i18n/email";

// Preview of the REAL emails sent from /api/send. Delegates to the same
// template, so any change to the email shows up here automatically.
// Shows both recipients: the customer copy and the internal copy (with code).
export function generatePreviewHtml(locale: Locale = DEFAULT_LOCALE): string {
  const sample: WizardValues = {
    ...defaultWizardValues,
    company: "Distribucions Pla, S.L.",
    contactName: "Laura Puig",
    email: "laura.puig@distribucionspla.cat",
    phone: "93 456 78 90",
    printerType: "desktop",
    printerWidthClass: "4",
    materialType: "plastic-pp-gloss",
    labelWidthMm: 70,
    labelHeightMm: 45,
    rollCoreMm: "40",
    rollOuterDiameterMm: 115,
    labelFlowType: "gap",
    gapMm: 3,
    hasCut: true,
    cutType: "trepat",
    colorCount: "2",
    quantity: 5000,
    materialObservations: "Exemple d'observació sobre el material.",
    comments: "Exemple de comentari addicional del client."
  };

  const logoSrc = "/logo-sie.png";
  const referenceCode = generateLabelCode(sample);
  const e = EMAIL_STRINGS[locale];

  const customer = renderCompactEmailHtml({
    title: e.customerTitle,
    intro: e.customerIntro,
    data: sample,
    showGreeting: true,
    logoSrc,
    locale
  });

  const internal = renderInternalSummaryHtml({
    data: sample,
    referenceCode,
    logoSrc
  });

  const sectionTitle = (text: string) =>
    `<p style="max-width:720px;margin:24px auto 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a1c22;">${text}</p>`;

  const labels =
    locale === "es"
      ? { customer: "Correo al cliente", internal: "Correo interno (secretaría)" }
      : { customer: "Correu al client", internal: "Correu intern (secretaria)" };

  return `${sectionTitle(labels.customer)}${customer}${sectionTitle(labels.internal)}${internal}`;
}
