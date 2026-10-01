import { z } from "zod";
import { VALIDATION_MESSAGES, WizardMessages } from "@/lib/i18n/validation";

export function buildWizardSchema(m: WizardMessages) {
  return z
  .object({
    company: z.string().min(2, m.company),
    contactName: z.string().min(2, m.contactName),
    email: z.string().email(m.email),
    phone: z.string().min(6, m.phone).optional().or(z.literal("")),
    printerType: z.enum(["desktop", "portable", "industrial"]),
    printerWidthClass: z.enum(["", "2", "3", "4", "6", "8"]),
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
      "textile-polyamide",
      "material-unknown",
      "material-other"
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
      .number({ invalid_type_error: m.widthNumber, required_error: m.widthNumber })
      .min(15),
    labelHeightMm: z.coerce
      .number({ invalid_type_error: m.heightNumber, required_error: m.heightNumber })
      .min(10),
    rollCoreMm: z.enum(["12.5", "19", "25", "25.4", "40", "76", "external"]),
    rollOuterDiameterMm: z.coerce.number().min(25).max(230),
    gapMm: z.coerce.number().min(0),
    hasBlackMark: z.boolean(),
    blackMarkPosition: z.enum(["none", "front", "back"]),
    adhesive: z.enum(["acrylic", "hotmelt", "removable"]),
    hasBackgroundColor: z.boolean(),
    backgroundColorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, m.colorHex),
    backgroundColorNotes: z.string().optional().or(z.literal("")),
    quantity: z.coerce.number().min(100, m.quantityMin),
    colorCount: z.enum(["0", "1", "2", "3", "4"]),
    comments: z.string().optional().or(z.literal("")),
    materialOtherDescription: z.string().optional().or(z.literal("")),
    materialObservations: z.string().optional().or(z.literal(""))
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
      desktop: [90, 100, 115, 120],
      portable: [50, 56, 66],
      industrial: [150, 180, 190]
    };

    if (data.labelWidthMm > maxWidthByPrinter[data.printerType]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["labelWidthMm"],
        message: m.maxWidthByPrinter(maxWidthByPrinter[data.printerType])
      });
    }

    if (data.hasBlackMark && data.blackMarkPosition === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blackMarkPosition"],
        message: m.blackMarkSelectPos
      });
    }

    if (!data.hasBlackMark && data.blackMarkPosition !== "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blackMarkPosition"],
        message: m.blackMarkNone
      });
    }

    if (
      data.printerWidthClass &&
      !widthClassesByPrinter[data.printerType].includes(data.printerWidthClass)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["printerWidthClass"],
        message: m.widthClassIncompatible
      });
    }

    if (
      data.printerWidthClass &&
      data.labelWidthMm > maxWidthByClass[data.printerWidthClass]
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["labelWidthMm"],
        message: m.maxWidthByClass(data.printerWidthClass, maxWidthByClass[data.printerWidthClass])
      });
    }

    if (!coreByPrinter[data.printerType].includes(data.rollCoreMm)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rollCoreMm"],
        message: m.coreIncompatible
      });
    }

    if (!outerRollOptionsByPrinter[data.printerType].includes(data.rollOuterDiameterMm)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rollOuterDiameterMm"],
        message: m.outerIncompatible
      });
    }

    if (data.labelFlowType === "gap" && data.gapMm <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gapMm"],
        message: m.gapPositive
      });
    }

    if (data.hasCut && data.cutType === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cutType"],
        message: m.cutSelect
      });
    }

    if (!data.hasBackgroundColor && data.backgroundColorHex !== "#FFFFFF") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["backgroundColorHex"],
        message: m.backgroundWhite
      });
    }
  });
}

export const wizardSchema = buildWizardSchema(VALIDATION_MESSAGES.ca);

export type WizardValues = z.infer<typeof wizardSchema>;

export const defaultWizardValues: WizardValues = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  printerType: "desktop",
  printerWidthClass: "",
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
  quantity: 1000,
  colorCount: "0",
  comments: "",
  materialOtherDescription: "",
  materialObservations: ""
};
