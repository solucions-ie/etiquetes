import { z } from "zod";

export const wizardSchema = z
  .object({
    company: z.string().min(2, "Indica l'empresa."),
    contactName: z.string().min(2, "Indica el nom de contacte."),
    email: z.string().email("Correu invalid."),
    phone: z.string().min(6, "Telefon massa curt.").optional().or(z.literal("")),
    printerType: z.enum(["desktop", "portable", "industrial"]),
    printerWidthClass: z.enum(["", "2", "3", "4", "6", "8"]),
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
      "plastic-pp-gloss",
      "plastic-pp-matte",
      "plastic-pe-gloss",
      "plastic-pe-matte",
      "plastic-pet-gloss",
      "plastic-pet-matte",
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
    labelWidthMm: z.coerce
      .number({
        invalid_type_error: "Introdueix si us plau un numero a l'amplada.",
        required_error: "Introdueix si us plau un numero a l'amplada."
      })
      .min(15),
    labelHeightMm: z.coerce
      .number({
        invalid_type_error: "Introdueix si us plau un numero a l'alcada.",
        required_error: "Introdueix si us plau un numero a l'alcada."
      })
      .min(10),
    rollCoreMm: z.enum(["12.5", "19", "25", "25.4", "40", "76", "external"]),
    rollOuterDiameterMm: z.coerce.number().min(25).max(230),
    gapMm: z.coerce.number().min(0),
    hasBlackMark: z.boolean(),
    blackMarkPosition: z.enum(["none", "front", "back"]),
    adhesive: z.enum(["acrylic", "hotmelt", "removable"]),
    hasBackgroundColor: z.boolean(),
    backgroundColorHex: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Color invalid."),
    backgroundColorNotes: z.string().optional().or(z.literal("")),
    quantity: z.coerce.number().min(100, "Quantitat minima: 100.")
  })
  .superRefine((data, ctx) => {
    const maxWidthByPrinter: Record<typeof data.printerType, number> = {
      desktop: 112,
      portable: 112,
      industrial: 214
    };
    const coreByPrinter: Record<typeof data.printerType, string[]> = {
      desktop: ["25.4", "40"],
      portable: ["19", "25"],
      industrial: ["40", "76"]
    };
    const widthClassesByPrinter: Record<typeof data.printerType, string[]> = {
      desktop: ["2", "3", "4"],
      portable: ["2", "3", "4"],
      industrial: ["4", "6", "8"]
    };
    const maxWidthByClass: Record<Exclude<typeof data.printerWidthClass, "">, number> = {
      "2": 58,
      "3": 76,
      "4": 112,
      "6": 168,
      "8": 214
    };
    const outerRollOptionsByPrinter: Record<typeof data.printerType, number[]> = {
      desktop: [90, 100, 115],
      portable: [50, 56, 66],
      industrial: [150, 180, 190]
    };

    if (data.labelWidthMm > maxWidthByPrinter[data.printerType]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["labelWidthMm"],
        message: `Aquesta impressora admet fins a ${maxWidthByPrinter[data.printerType]} mm d'amplada.`
      });
    }

    if (data.hasBlackMark && data.blackMarkPosition === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blackMarkPosition"],
        message: "Selecciona posicio de la marca negra."
      });
    }

    if (!data.hasBlackMark && data.blackMarkPosition !== "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blackMarkPosition"],
        message: "Si no hi ha marca negra, la posicio ha de ser 'sense marca'."
      });
    }

    if (data.printTechnology === "direct-thermal" && data.ribbonType !== "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ribbonType"],
        message: "En termica directa no es fa servir ribbon."
      });
    }

    if (data.printTechnology === "thermal-transfer" && data.ribbonType === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ribbonType"],
        message: "Selecciona el tipus de ribbon (o marca 'No ho se')."
      });
    }

    if (
      data.printerWidthClass &&
      !widthClassesByPrinter[data.printerType].includes(data.printerWidthClass)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["printerWidthClass"],
        message: "Aquesta polzada no es compatible amb el tipus d'impressora seleccionat."
      });
    }

    if (
      data.printerWidthClass &&
      data.labelWidthMm > maxWidthByClass[data.printerWidthClass]
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["labelWidthMm"],
        message: `Amb ${data.printerWidthClass}" la mida maxima es ${maxWidthByClass[data.printerWidthClass]} mm.`
      });
    }

    if (!coreByPrinter[data.printerType].includes(data.rollCoreMm)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rollCoreMm"],
        message: "Aquest mandri no es compatible amb el tipus d'impressora seleccionat."
      });
    }

    if (!outerRollOptionsByPrinter[data.printerType].includes(data.rollOuterDiameterMm)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rollOuterDiameterMm"],
        message: "Aquest diametre exterior no es compatible amb el tipus d'impressora seleccionat."
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

    if (!data.hasBackgroundColor && data.backgroundColorHex !== "#FFFFFF") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["backgroundColorHex"],
        message: "Si no hi ha color de fons, el color ha de quedar en blanc."
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
  printerWidthClass: "",
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
  hasBackgroundColor: false,
  backgroundColorHex: "#FFFFFF",
  backgroundColorNotes: "",
  quantity: 1000
};
