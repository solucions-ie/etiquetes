import { defaultWizardValues, type WizardValues } from "@/lib/schemas/wizard";
import { renderTechnicalSheetHtml } from "@/lib/email/mailTemplates";
import { generateLabelCode } from "@/lib/labelCode";

// Representative sample so the preview reflects the real PDF attached to the
// email. It delegates to the same template used for the attachment, so any
// change to the technical sheet shows up here automatically.
export function generateTechnicalSheetHtml(): string {
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
    quantity: 5000
  };

  return renderTechnicalSheetHtml(sample, {
    logoSrc: "/logo-sie.png",
    referenceCode: generateLabelCode(sample)
  });
}
