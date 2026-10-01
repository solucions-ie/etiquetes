// Validation messages for the wizard schema, kept separate from the big UI
// dictionary. A local locale union avoids any import cycle with the schema.
type Loc = "ca" | "es";

export type WizardMessages = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  widthNumber: string;
  heightNumber: string;
  colorHex: string;
  quantityMin: string;
  maxWidthByPrinter: (mm: number) => string;
  blackMarkSelectPos: string;
  blackMarkNone: string;
  widthClassIncompatible: string;
  maxWidthByClass: (inches: string, mm: number) => string;
  coreIncompatible: string;
  outerIncompatible: string;
  gapPositive: string;
  cutSelect: string;
  backgroundWhite: string;
};

const ca: WizardMessages = {
  company: "Indica l'empresa.",
  contactName: "Indica el nom de contacte.",
  email: "Correu invàlid.",
  phone: "Telèfon massa curt.",
  widthNumber: "Introdueix si us plau un número a l'amplada.",
  heightNumber: "Introdueix si us plau un número a l'alçada.",
  colorHex: "Color invàlid.",
  quantityMin: "Quantitat mínima: 100.",
  maxWidthByPrinter: (mm) => `Aquesta impressora admet fins a ${mm} mm d'amplada.`,
  blackMarkSelectPos: "Selecciona posició de la marca negra.",
  blackMarkNone: "Si no hi ha marca negra, la posició ha de ser 'sense marca'.",
  widthClassIncompatible: "Aquesta polzada no és compatible amb el tipus d'impressora seleccionat.",
  maxWidthByClass: (inches, mm) => `Amb ${inches}" la mida màxima és ${mm} mm.`,
  coreIncompatible: "Aquest mandril no és compatible amb el tipus d'impressora seleccionat.",
  outerIncompatible:
    "Aquest diàmetre exterior no és compatible amb el tipus d'impressora seleccionat.",
  gapPositive: "Si tries GAP, la separació ha de ser superior a 0.",
  cutSelect: "Marca un tipus de tall o desactiva l'opció de tall.",
  backgroundWhite: "Si no hi ha color de fons, el color ha de quedar en blanc."
};

const es: WizardMessages = {
  company: "Indica la empresa.",
  contactName: "Indica el nombre de contacto.",
  email: "Correo no válido.",
  phone: "Teléfono demasiado corto.",
  widthNumber: "Introduce por favor un número en el ancho.",
  heightNumber: "Introduce por favor un número en el alto.",
  colorHex: "Color no válido.",
  quantityMin: "Cantidad mínima: 100.",
  maxWidthByPrinter: (mm) => `Esta impresora admite hasta ${mm} mm de ancho.`,
  blackMarkSelectPos: "Selecciona la posición de la marca negra.",
  blackMarkNone: "Si no hay marca negra, la posición debe ser 'sin marca'.",
  widthClassIncompatible: "Esta pulgada no es compatible con el tipo de impresora seleccionado.",
  maxWidthByClass: (inches, mm) => `Con ${inches}" la medida máxima es ${mm} mm.`,
  coreIncompatible: "Este mandril no es compatible con el tipo de impresora seleccionado.",
  outerIncompatible:
    "Este diámetro exterior no es compatible con el tipo de impresora seleccionado.",
  gapPositive: "Si eliges GAP, la separación debe ser superior a 0.",
  cutSelect: "Marca un tipo de corte o desactiva la opción de corte.",
  backgroundWhite: "Si no hay color de fondo, el color debe quedar en blanco."
};

export const VALIDATION_MESSAGES: Record<Loc, WizardMessages> = { ca, es };
