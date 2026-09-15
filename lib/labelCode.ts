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
  "textile-polyamide": "ETP",
  "material-unknown": "IND",
  "material-other": "XXX"
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

// Reverse map material code -> materialType. Codes are unique ("IND" for
// unknown, "XXX" for other); first-wins guards against any future collision.
const MATERIAL_BY_CODE: Record<string, WizardValues["materialType"]> = (() => {
  const rev: Record<string, WizardValues["materialType"]> = {};
  (Object.entries(MATERIAL_CODE) as Array<[WizardValues["materialType"], string]>).forEach(
    ([material, code]) => {
      if (!(code in rev)) rev[code] = material;
    }
  );
  return rev;
})();

// Reverse map for the 3-digit core code. "025" is produced by both "25" and
// "25.4"; we resolve it to the standard 1" core ("25.4").
const CORE_BY_CODE: Record<string, WizardValues["rollCoreMm"]> = {
  "000": "external",
  "013": "12.5",
  "019": "19",
  "025": "25.4",
  "040": "40",
  "076": "76"
};

export type ParsedLabelCode = {
  materialType: WizardValues["materialType"];
  colorCount: WizardValues["colorCount"];
  rollCoreMm: WizardValues["rollCoreMm"];
  rollOuterDiameterMm: number;
  labelWidthMm: number;
  labelHeightMm: number;
  isContinuous: boolean;
};

/**
 * Decodes a 16-char label code back into the six dimensions it carries.
 * Returns null if the string is not a well-formed, recognised code.
 * The code does not encode printer, adhesive, quantity, background or the
 * gap/black-mark distinction, so those are left untouched by the caller.
 */
export function parseLabelCode(raw: string): ParsedLabelCode | null {
  const code = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (code.length !== 16) return null;

  const materialCode = code.slice(0, 3);
  const colorChar = code.slice(3, 4);
  const coreCode = code.slice(4, 7);
  const outerCode = code.slice(7, 10);
  const widthCode = code.slice(10, 13);
  const heightCode = code.slice(13, 16);

  const materialType = MATERIAL_BY_CODE[materialCode];
  if (!materialType) return null;

  if (!/^[0-4]$/.test(colorChar)) return null;
  const colorCount = colorChar as WizardValues["colorCount"];

  const rollCoreMm = CORE_BY_CODE[coreCode];
  if (!rollCoreMm) return null;

  if (!/^\d{9}$/.test(`${outerCode}${widthCode}${heightCode}`)) return null;

  const isContinuous = heightCode === "000";

  return {
    materialType,
    colorCount,
    rollCoreMm,
    rollOuterDiameterMm: Number(outerCode),
    labelWidthMm: Number(widthCode),
    labelHeightMm: isContinuous ? 0 : Number(heightCode),
    isContinuous
  };
}
