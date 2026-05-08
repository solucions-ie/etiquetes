import { WizardValues } from "@/lib/schemas/wizard";

const MATERIAL_CODE: Record<WizardValues["materialType"], string> = {
  "paper-thermal-eco": "PTE",
  "paper-thermal-protected": "PTP",
  "paper-thermal-direct-ticket": "PTT",
  "paper-couche": "PCO",
  "paper-matte": "PMR",
  "paper-inkjet-gloss": "PIB",
  "paper-inkjet-matte": "EPI",
  "plastic-pp-gloss": "HBB",
  "plastic-pp-matte": "HBM",
  "plastic-pe-gloss": "EPL",
  "plastic-pe-matte": "PEM",
  "plastic-pet-gloss": "PBB",
  "plastic-pet-matte": "PBM",
  "plastic-pvc": "PVC",
  "plastic-artyval": "ART",
  "textile-polyamide": "ETP"
};

function pad3(n: number): string {
  return String(Math.round(n)).padStart(3, "0");
}

export function generateLabelCode(data: WizardValues): string {
  const material = MATERIAL_CODE[data.materialType];
  const color = data.colorCount;
  const core = data.rollCoreMm === "external" ? "000" : pad3(Number(data.rollCoreMm));
  const outerDiameter = pad3(data.rollOuterDiameterMm);
  const width = pad3(data.labelWidthMm);
  const height = data.labelFlowType === "continuous" ? "000" : pad3(data.labelHeightMm);

  return `${material}${color}${core}${outerDiameter}${width}${height}`;
}
