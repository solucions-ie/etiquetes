import { z } from "zod";

export const wizardSchema = z
  .object({
    company: z.string().min(2, "Indica l'empresa."),
    contactName: z.string().min(2, "Indica el nom de contacte."),
    email: z.string().email("Correu invàlid."),
    phone: z.string().min(6, "Telèfon massa curt.").optional().or(z.literal("")),
    printerType: z.enum(["desktop", "industrial"]),
    printTechnology: z.enum(["direct-thermal", "thermal-transfer"]),
    ribbonType: z.enum(["none", "cera", "cera-resina", "resina", "unknown"]),
    materialType: z.enum([
      "paper-thermal-eco",
      "paper-thermal-protected",
      "paper-thermal-direct-ticket",
      "paper-couche",
      "paper-matte",
      "paper-inkjet-gloss",
      "paper-inkjet-matte",
      "plastic-pp",
      "plastic-pe",
      "plastic-pet",
      "plastic-pvc",
      "plastic-artyval",
      "textile-polyamide"
    ]),
    labelFlowType: z.enum(["gap", "black-mark", "continuous"]),
    hasCut: z.boolean(),
    cutType: z.enum([
      "none",
      "trepat",
      "troquelat",
      "tall-italia",
      "tall-linia-recte",
      "tall-perforat",
      "etiqueta-desmallada",
      "linerless"
    ]),
    labelWidthMm: z.coerce.number().min(15).max(220),
    labelHeightMm: z.coerce.number().min(10).max(300),
    rollCoreMm: z.enum(["12.5", "19", "25.4", "40", "76", "external"]),
    rollOuterDiameterMm: z.coerce.number().min(25).max(230),
    gapMm: z.coerce.number().min(0),
    hasBlackMark: z.boolean(),
    blackMarkPosition: z.enum(["none", "front", "back"]),
    adhesive: z.enum(["acrylic", "hotmelt", "solvent"]),
    quantity: z.coerce.number().min(100, "Quantitat mínima: 100.")
  })
  .superRefine((data, ctx) => {
    const maxWidthByPrinter: Record<typeof data.printerType, number> = {
      desktop: 114,
      industrial: 180
    };
    const coreByPrinter: Record<typeof data.printerType, string[]> = {
      desktop: ["25.4", "40"],
      industrial: ["40", "76"]
    };
    const outerRollRangeByPrinter: Record<
      typeof data.printerType,
      { min: number; max: number }
    > = {
      desktop: { min: 40, max: 120 },
      industrial: { min: 76, max: 230 }
    };

    if (data.labelWidthMm > maxWidthByPrinter[data.printerType]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["labelWidthMm"],
        message: `Aquesta impressora admet fins a ${maxWidthByPrinter[data.printerType]} mm d'amplada.`
      });
    }

    // Condició: si hi ha marca negra, cal indicar posició.
    if (data.hasBlackMark && data.blackMarkPosition === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blackMarkPosition"],
        message: "Selecciona posició de la marca negra."
      });
    }

    if (!data.hasBlackMark && data.blackMarkPosition !== "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blackMarkPosition"],
        message: "Si no hi ha marca negra, la posició ha de ser 'sense marca'."
      });
    }

    if (data.printTechnology === "direct-thermal" && data.ribbonType !== "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ribbonType"],
        message: "En tèrmica directa no es fa servir ribbon."
      });
    }

    if (data.printTechnology === "thermal-transfer" && data.ribbonType === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ribbonType"],
        message: "Selecciona el tipus de ribbon (o marca 'No ho sé')."
      });
    }

    if (!coreByPrinter[data.printerType].includes(data.rollCoreMm)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rollCoreMm"],
        message: "Aquest canuto no és compatible amb el tipus d'impressora seleccionat."
      });
    }

    const outerRange = outerRollRangeByPrinter[data.printerType];
    if (
      data.rollOuterDiameterMm < outerRange.min ||
      data.rollOuterDiameterMm > outerRange.max
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rollOuterDiameterMm"],
        message: `La bobina per aquesta impressora ha d'estar entre ${outerRange.min} i ${outerRange.max} mm.`
      });
    }

    if (data.labelFlowType === "gap" && data.gapMm <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gapMm"],
        message: "Si tries GAP, la separacio ha de ser superior a 0."
      });
    }

    if (data.hasCut && data.cutType === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cutType"],
        message: "Marca un tipus de tall o desactiva l'opcio de tall."
      });
    }
  });

export type WizardValues = z.infer<typeof wizardSchema>;

export const defaultWizardValues: WizardValues = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  printerType: "desktop",
  printTechnology: "direct-thermal",
  ribbonType: "none",
  materialType: "paper-thermal-eco",
  labelFlowType: "gap",
  hasCut: false,
  cutType: "none",
  labelWidthMm: 50,
  labelHeightMm: 30,
  rollCoreMm: "25.4",
  rollOuterDiameterMm: 100,
  gapMm: 2,
  hasBlackMark: false,
  blackMarkPosition: "none",
  adhesive: "acrylic",
  quantity: 1000
};
