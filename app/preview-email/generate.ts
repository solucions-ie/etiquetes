import { defaultWizardValues, type WizardValues } from "@/lib/schemas/wizard";
import { renderCompactEmailHtml } from "@/lib/email/mailTemplates";
import { generateLabelCode } from "@/lib/labelCode";

// Preview of the REAL emails sent from /api/send. Delegates to the same
// template, so any change to the email shows up here automatically.
// Shows both recipients: the customer copy and the internal copy (with code).
export function generatePreviewHtml(): string {
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

  const customer = renderCompactEmailHtml({
    title: "INFORME DE SOLLICITUD D'ETIQUETA",
    intro:
      "Aquest és el resum tècnic de la configuració enviada. La fitxa tècnica completa s'adjunta en PDF.",
    data: sample,
    showGreeting: true,
    logoSrc
  });

  const internal = renderCompactEmailHtml({
    title: "NOVA SOLLICITUD D'ETIQUETA",
    intro: "S'adjunta la fitxa tècnica completa en PDF.",
    data: sample,
    logoSrc,
    referenceCode
  });

  const sectionTitle = (text: string) =>
    `<p style="max-width:720px;margin:24px auto 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a1c22;">${text}</p>`;

  return `${sectionTitle("Correu al client")}${customer}${sectionTitle(
    "Correu intern (secretaria)"
  )}${internal}`;
}
