import { Locale } from "@/lib/i18n/dictionaries";
import { WizardValues } from "@/lib/schemas/wizard";

type CutType = WizardValues["cutType"];

export type EmailStrings = {
  customerSubject: string;
  customerTitle: string;
  customerIntro: string;
  techSheetTitle: string;
  visualConfig: string;
  contactTitle: string;
  observationsTitle: string;
  pdfAttached: string;
  commentsLabel: string;
  greeting: (name: string) => string;
  specTitles: {
    mides: string;
    material: string;
    printer: string;
    bobina: string;
    quantity: string;
  };
  rows: {
    widthA: string;
    advanceB: string;
    material: string;
    description: string;
    adhesive: string;
    backgroundColor: string;
    type: string;
    inches: string;
    flow: string;
    gap: string;
    core: string;
    outerMax: string;
    cut: string;
    blackMark: string;
    units: string;
  };
  widthNotSpecified: string;
  materialOther: string;
  materialUnknown: string;
  noAdhesive: string;
  noBackground: string;
  externalCore: string;
  flow: Record<WizardValues["labelFlowType"], string>;
  cut: Record<CutType, string>;
  printer: Record<WizardValues["printerType"], string>;
  blackMarkPos: Record<WizardValues["blackMarkPosition"], string>;
  blackMarkValue: (posLabel: string) => string;
};

const ca: EmailStrings = {
  customerSubject: "Confirmació: sol·licitud d'etiqueta rebuda",
  customerTitle: "INFORME DE SOL·LICITUD D'ETIQUETA",
  customerIntro:
    "Aquest és el resum tècnic de la configuració enviada. La fitxa tècnica completa s'adjunta en PDF.",
  techSheetTitle: "FITXA TÈCNICA D'ETIQUETA",
  visualConfig: "Configuració visual",
  contactTitle: "DADES DE CONTACTE",
  observationsTitle: "Observacions del material",
  pdfAttached: "La fitxa tècnica s'adjunta en PDF.",
  commentsLabel: "Comentaris:",
  greeting: (name) => `Hola ${name},`,
  specTitles: {
    mides: "MIDES",
    material: "MATERIAL I MANIPULAT",
    printer: "IMPRESSORA",
    bobina: "BOBINA",
    quantity: "QUANTITAT"
  },
  rows: {
    widthA: "A) Amplada",
    advanceB: "B) Avanç",
    material: "Material",
    description: "Descripció",
    adhesive: "Adhesiu",
    backgroundColor: "Color de fons",
    type: "Tipus",
    inches: "Polzada",
    flow: "Avançament",
    gap: "Gap",
    core: "Mandril",
    outerMax: "Diàmetre màx",
    cut: "Tall",
    blackMark: "Marca negra",
    units: "Unitats sol·licitades"
  },
  widthNotSpecified: "No especificada",
  materialOther: "Altre (especificat pel client)",
  materialUnknown: "Desconegut",
  noAdhesive: "No aplica (sense adhesiu)",
  noBackground: "Sense color de fons",
  externalCore: "Bobinat extern",
  flow: { gap: "Gap", "black-mark": "Marca negra", continuous: "Continu" },
  cut: {
    none: "Sense tall",
    trepat: "Trepat",
    troquelat: "Troquelat",
    "tall-italia": "Tall Italia",
    "tall-linia-recte": "Tall línia recte",
    "tall-perforat": "Tall perforat",
    "etiqueta-desmallada": "Etiqueta desmallada",
    linerless: "Linerless"
  },
  printer: { desktop: "Sobretaula", portable: "Portàtil", industrial: "Industrial" },
  blackMarkPos: { none: "sense", front: "davant", back: "darrere" },
  blackMarkValue: (posLabel) => `Sí (${posLabel})`
};

const es: EmailStrings = {
  customerSubject: "Confirmación: solicitud de etiqueta recibida",
  customerTitle: "INFORME DE SOLICITUD DE ETIQUETA",
  customerIntro:
    "Este es el resumen técnico de la configuración enviada. La ficha técnica completa se adjunta en PDF.",
  techSheetTitle: "FICHA TÉCNICA DE ETIQUETA",
  visualConfig: "Configuración visual",
  contactTitle: "DATOS DE CONTACTO",
  observationsTitle: "Observaciones del material",
  pdfAttached: "La ficha técnica se adjunta en PDF.",
  commentsLabel: "Comentarios:",
  greeting: (name) => `Hola ${name},`,
  specTitles: {
    mides: "MEDIDAS",
    material: "MATERIAL Y MANIPULADO",
    printer: "IMPRESORA",
    bobina: "BOBINA",
    quantity: "CANTIDAD"
  },
  rows: {
    widthA: "A) Ancho",
    advanceB: "B) Avance",
    material: "Material",
    description: "Descripción",
    adhesive: "Adhesivo",
    backgroundColor: "Color de fondo",
    type: "Tipo",
    inches: "Pulgada",
    flow: "Avance",
    gap: "Gap",
    core: "Mandril",
    outerMax: "Diámetro máx",
    cut: "Corte",
    blackMark: "Marca negra",
    units: "Unidades solicitadas"
  },
  widthNotSpecified: "No especificada",
  materialOther: "Otro (especificado por el cliente)",
  materialUnknown: "Desconocido",
  noAdhesive: "No aplica (sin adhesivo)",
  noBackground: "Sin color de fondo",
  externalCore: "Bobinado externo",
  flow: { gap: "Gap", "black-mark": "Marca negra", continuous: "Continuo" },
  cut: {
    none: "Sin corte",
    trepat: "Trepado",
    troquelat: "Troquelado",
    "tall-italia": "Corte italiano",
    "tall-linia-recte": "Corte línea recta",
    "tall-perforat": "Perforado",
    "etiqueta-desmallada": "Etiqueta desmatrizada",
    linerless: "Linerless"
  },
  printer: { desktop: "Sobremesa", portable: "Portátil", industrial: "Industrial" },
  blackMarkPos: { none: "sin", front: "delante", back: "detrás" },
  blackMarkValue: (posLabel) => `Sí (${posLabel})`
};

export const EMAIL_STRINGS: Record<Locale, EmailStrings> = { ca, es };
