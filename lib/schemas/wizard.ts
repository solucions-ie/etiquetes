import { z } from "zod";

export const wizardSchema = z
  .object({
    company: z.string().min(2, "Indica l'empresa."),
    contactName: z.string().min(2, "Indica el nom de contacte."),
    email: z.string().email("Correu invàlid."),
    phone: z.string().min(6, "Telèfon massa curt.").optional().or(z.literal("")),
    printerType: z.enum(["desktop", "industrial"]),
    printTechnology: z.enum(["direct-thermal", "thermal-transfer"]),
    ribbonType: z.enum(["none", "wax", "wax-resin", "resin"]),
    labelUse: z.enum(["product", "shipping", "warehouse", "other"]),
    labelWidthMm: z.coerce.number().min(15).max(220),
    labelHeightMm: z.coerce.number().min(10).max(300),
    rollCoreMm: z.enum(["25", "40", "76"]),
    gapMm: z.coerce.number().min(0),
    hasBlackMark: z.boolean(),
    blackMarkPosition: z.enum(["none", "front", "back"]),
    adhesive: z.enum(["permanent", "removable", "freezer"]),
    finish: z.enum(["matte", "gloss"]),
    quantity: z.coerce.number().min(100, "Quantitat mínima: 100.")
  })
  .superRefine((data, ctx) => {
    // Condició: una impressora desktop acostuma a limitar amplada màxima.
    if (data.printerType === "desktop" && data.labelWidthMm > 110) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["labelWidthMm"],
        message: "En mode desktop l'amplada màxima recomanada és 110 mm."
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
        message: "Selecciona el tipus de ribbon per transferència tèrmica."
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
  labelUse: "product",
  labelWidthMm: 50,
  labelHeightMm: 30,
  rollCoreMm: "25",
  gapMm: 2,
  hasBlackMark: false,
  blackMarkPosition: "none",
  adhesive: "permanent",
  finish: "matte",
  quantity: 1000
};
