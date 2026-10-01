import { WizardValues } from "@/lib/schemas/wizard";

export type Locale = "ca" | "es";

export const LOCALES: Locale[] = ["ca", "es"];
export const DEFAULT_LOCALE: Locale = "ca";

type MaterialId = WizardValues["materialType"];
type AdhesiveId = WizardValues["adhesive"];
type FamilyKey = "paper" | "synthetic" | "textile" | "other";

type ItemText = { name: string; description: string; uses: string };

export type Dictionary = {
  localeName: string;
  page: { title: string; subtitle: string };
  languageSelector: { label: string; ca: string; es: string };
  codeCard: {
    heading: string;
    help: string;
    placeholder: string;
    apply: string;
    ok: string;
    error: string;
  };
  sections: {
    material: string;
    config: string;
    configLead1: string;
    configLead2: string;
    printerTitle: string;
    contact: string;
  };
  actions: { submit: string; submitting: string };
  sent: { title: string; body: string };
  errors: { sendFailed: string; unexpected: string };
  material: {
    label: string;
    guideButton: string;
    usesLabel: string;
    describeLabel: string;
    describePlaceholder: string;
    observationsLabel: string;
    observationsPlaceholder: string;
    colorCountLabel: string;
    colorCountOptions: Record<WizardValues["colorCount"], string>;
    quantityLabel: string;
    quantityNote: string;
    guideModalTitle: string;
    close: string;
    families: Record<FamilyKey, string>;
    items: Record<MaterialId, ItemText>;
  };
  adhesive: {
    label: string;
    guideButton: string;
    usesLabel: string;
    noAdhesive: string;
    guideModalTitle: string;
    items: Record<AdhesiveId, ItemText>;
  };
  printer: {
    labels: Record<WizardValues["printerType"], string>;
    compatibleInches: string;
  };
  dimensions: {
    title: string;
    coreLabel: string;
    outerLabel: string;
    svgAria: string;
    svgOuter: (mm: number) => string;
    svgCore: (mm: string) => string;
  };
  preview: {
    widthMm: string;
    advanceMm: string;
    advanceLateral: string;
    flowGap: string;
    flowBlackMark: string;
    flowContinuous: string;
    cutCheckbox: string;
    aria: string;
    backgroundTitle: string;
    backgroundNone: string;
    backgroundWith: string;
    backgroundChosen: string;
    backgroundNotesLabel: string;
    backgroundNotesPlaceholder: string;
    widthClassInfo: (inches: string, mm: number) => string;
    familyMaxInfo: (mm: number) => string;
  };
  contact: {
    company: string;
    contactName: string;
    email: string;
    phone: string;
    comments: string;
    commentsPlaceholder: string;
  };
};

const ca: Dictionary = {
  localeName: "Català",
  page: {
    title: "Formulari d'identificació d'etiquetes",
    subtitle:
      "Completa el formulari i t'ajudarem a definir el format exacte de l'etiqueta que necessites."
  },
  languageSelector: { label: "Idioma", ca: "Català", es: "Español" },
  codeCard: {
    heading: "Tens un codi d'etiqueta?",
    help: "Enganxa un codi de referència i omplirem automàticament el material, les tintes, el mandril, el diàmetre i les mides.",
    placeholder: "Ex. PTE0025100050030",
    apply: "Aplicar codi",
    ok: "Camps omplerts des del codi. Revisa impressora, adhesiu, quantitat i tipus d'avanç, que no van dins del codi.",
    error: "Codi no reconegut. Ha de tenir 16 caràcters amb el format correcte."
  },
  sections: {
    material: "1. Material de l'etiqueta",
    config: "2. Configuració i vista prèvia",
    configLead1: "Vista prèvia de l'etiqueta",
    configLead2: "Es recalcula automàticament segons les opcions seleccionades.",
    printerTitle: "Tipus d'impressora",
    contact: "3. Dades de contacte"
  },
  actions: { submit: "Enviar sol·licitud", submitting: "Enviant..." },
  sent: {
    title: "Sol·licitud enviada correctament",
    body: "Hem enviat un correu de confirmació al client i una notificació interna a secretaria."
  },
  errors: {
    sendFailed: "No s'han pogut enviar els correus.",
    unexpected: "Error inesperat en l'enviament."
  },
  material: {
    label: "Material de l'etiqueta",
    guideButton: "Guia de materials",
    usesLabel: "Usos recomanats:",
    describeLabel: "Descriu el material",
    describePlaceholder: "Ex. paper kraft, material tèrmic especial, PE expandit...",
    observationsLabel: "Observacions sobre el material (opcional)",
    observationsPlaceholder: "Detalls o requisits específics del material...",
    colorCountLabel: "Nombre de tintes",
    colorCountOptions: {
      "0": "0 — Sense tintes",
      "1": "1 — Fondejat (1 tinta)",
      "2": "2 — Dos tintes",
      "3": "3 — Tres tintes",
      "4": "4 — Quatre tintes"
    },
    quantityLabel: "Quantitat estimada",
    quantityNote:
      "Per circumstàncies de producció, el nombre final d'etiquetes pot variar +/- 10%.",
    guideModalTitle: "Guia de materials d'etiqueta",
    close: "Tancar",
    families: {
      paper: "Etiqueta de paper",
      synthetic: "Sintètic",
      textile: "Tèxtil",
      other: "Altres"
    },
    items: {
      "paper-thermal-eco": {
        name: "Etiqueta tèrmica eco",
        description:
          "Opció econòmica per a usos temporals; més sensible a la calor, la humitat i el fregament.",
        uses: "Promocions curtes, etiquetatge temporal, flux intern."
      },
      "paper-thermal-protected": {
        name: "Etiqueta tèrmica protegida",
        description:
          "Amb capa de protecció superficial per millorar la durada en entorns freds o humits.",
        uses: "Alimentació, refrigerat, preparació de comandes."
      },
      "paper-thermal-direct-ticket": {
        name: "Paper tèrmic - Tiquet (sense adhesiu)",
        description:
          "Impressió sense ribbon i sense adhesiu, orientada a la tiqueteria; baixa resistència a la calor i la llum solar.",
        uses: "Tickets, torns, comprovants i tiquet de caixa."
      },
      "paper-couche": {
        name: "Etiqueta couche",
        description:
          "Bona qualitat d'impressió i acabat net; ideal per a aplicacions d'interior o de curta durada.",
        uses: "Producte general, retail, identificació interna."
      },
      "paper-matte": {
        name: "Etiqueta mate",
        description:
          "Acabat mat amb bona llegibilitat i reflex reduït; bona opció per a text i codis.",
        uses: "Producte, magatzem i etiquetatge intern."
      },
      "paper-inkjet-gloss": {
        name: "Etiqueta inkjet brillant",
        description:
          "Recobriment per a impressió a color viva i detall alt amb acabat brillant; menor resistència a l'aigua i al fregament.",
        uses: "Promocions, packaging visual i etiquetes a color."
      },
      "paper-inkjet-matte": {
        name: "Etiqueta inkjet mate",
        description:
          "Recobriment per a impressió a color amb acabat mat i bona llegibilitat; menor resistència a l'aigua i al fregament.",
        uses: "Promocions, packaging visual i etiquetes a color sense reflex."
      },
      "plastic-pp-gloss": {
        name: "PP brillant (polipropilè)",
        description:
          "Bona resistència a l'aigua, greixos i alguns químics amb bon equilibri entre cost i prestacions.",
        uses: "Cosmètica, neteja, higiene i consumibles."
      },
      "plastic-pp-matte": {
        name: "PP mate (polipropilè)",
        description:
          "Bona resistència a l'aigua, greixos i alguns químics amb acabat sense reflex.",
        uses: "Cosmètica, neteja, higiene i consumibles."
      },
      "plastic-pe-gloss": {
        name: "PE brillant (polietilè)",
        description: "Material flexible que s'adapta bé a envasos corbats o deformables.",
        uses: "Ampolles flexibles, productes de cura personal i detergència."
      },
      "plastic-pe-matte": {
        name: "PE mate (polietilè)",
        description:
          "Material flexible amb acabat mat, apte per envasos corbats o deformables.",
        uses: "Ampolles flexibles, productes de cura personal i detergència."
      },
      "plastic-pet-gloss": {
        name: "PET brillant (polièster)",
        description:
          "Molt durable i resistent a la temperatura i al desgast; orientat a entorns exigents.",
        uses: "Industrial, laboratoris, traçabilitat de llarga durada."
      },
      "plastic-pet-matte": {
        name: "PET mate (polièster)",
        description:
          "Molt durable i resistent a la temperatura i al desgast amb acabat mat.",
        uses: "Industrial, laboratoris, traçabilitat de llarga durada."
      },
      "plastic-pvc": {
        name: "PVC (vinil)",
        description:
          "Alta resistència a la intempèrie i la humitat, adequat per a aplicacions exteriors.",
        uses: "Senyalització, exterior, etiquetes exposades."
      },
      "plastic-artyval": {
        name: "Sintètic Artyval (sense adhesiu)",
        description:
          "Aspecte paper amb resistència de plàstic; molt versàtil en entorns humits o industrials.",
        uses: "Magatzem, producció, etiquetatge tècnic amb bona durabilitat."
      },
      "textile-polyamide": {
        name: "Poliamida (nylon)",
        description:
          "Etiqueta tèxtil resistent i suau, amb bon comportament en rentat i planxa.",
        uses: "Moda, confecció, composició i cura de peces rentables."
      },
      "material-unknown": {
        name: "Ho desconec",
        description:
          "No saps quin material és o no el trobes a la llista. Indiqueu-ho i us assessorarem.",
        uses: "Qualsevol aplicació. Us contactarem per determinar el material adequat."
      },
      "material-other": {
        name: "Cap d'aquests (especifica)",
        description:
          "El material que necessites no apareix a la llista. Descriu-lo al camp de text.",
        uses: "Materials específics, especials o fora de catàleg estàndard."
      }
    }
  },
  adhesive: {
    label: "Tipus d'adhesiu",
    guideButton: "Guia d'adhesius",
    usesLabel: "Usos recomanats:",
    noAdhesive: "Aquesta opció no porta adhesiu.",
    guideModalTitle: "Guia d'adhesius",
    items: {
      acrylic: {
        name: "Acrílic (base aigua)",
        description:
          "Bona durabilitat en sec i aplicacions estables; no és l'opció ideal en humitat alta o fred extrem.",
        uses: "Producte general, retail i etiquetatge interior."
      },
      hotmelt: {
        name: "Hotmelt (base cautxú)",
        description: "Excel·lent adherència inicial i bon rendiment en fred i humitat.",
        uses: "Alimentació, logística de fresc, superfícies complexes."
      },
      removable: {
        name: "Removible",
        description: "Permet retirar l'etiqueta amb facilitat i minimitza residus d'adhesiu.",
        uses: "Promocions, preus temporals i etiquetatge de curta durada."
      }
    }
  },
  printer: {
    labels: { desktop: "Sobretaula", portable: "Portàtil", industrial: "Industrial" },
    compatibleInches: "Polzades compatibles"
  },
  dimensions: {
    title: "Mida de la bobina i mandril",
    coreLabel: "Canuto (nucli de bobina)",
    outerLabel: "Diametre exterior bobina (mm)",
    svgAria: "Il·lustració de mandril i diàmetre exterior",
    svgOuter: (mm) => `Diametre exterior ${mm} mm`,
    svgCore: (mm) => `Mandril ${mm} mm`
  },
  preview: {
    widthMm: "Amplada (mm)",
    advanceMm: "Avanç (mm)",
    advanceLateral: "Avanç (lateral)",
    flowGap: "Gap",
    flowBlackMark: "Marca negra",
    flowContinuous: "Continu",
    cutCheckbox: "Tall trepat",
    aria: "Vista prèvia de paper suport amb etiquetes verticals",
    backgroundTitle: "Color de fons",
    backgroundNone: "Sense color",
    backgroundWith: "Amb color",
    backgroundChosen: "Color escollit",
    backgroundNotesLabel: "Observacions del color (opcional)",
    backgroundNotesPlaceholder: "Ex. blau corporatiu, Pantone aproximat...",
    widthClassInfo: (inches, mm) =>
      `Amb ${inches}" la mida màxima recomanada és ${mm} mm.`,
    familyMaxInfo: (mm) => `Aquesta família d'impressora admet fins a ${mm} mm d'amplada.`
  },
  contact: {
    company: "Empresa",
    contactName: "Persona de contacte",
    email: "Correu electrònic",
    phone: "Telèfon (opcional)",
    comments: "Comentaris addicionals (opcional)",
    commentsPlaceholder: "Qualsevol detall addicional que ens vulguis fer arribar..."
  }
};

const es: Dictionary = {
  localeName: "Español",
  page: {
    title: "Formulario de identificación de etiquetas",
    subtitle:
      "Completa el formulario y te ayudaremos a definir el formato exacto de la etiqueta que necesitas."
  },
  languageSelector: { label: "Idioma", ca: "Català", es: "Español" },
  codeCard: {
    heading: "¿Tienes un código de etiqueta?",
    help: "Pega un código de referencia y rellenaremos automáticamente el material, las tintas, el mandril, el diámetro y las medidas.",
    placeholder: "Ej. PTE0025100050030",
    apply: "Aplicar código",
    ok: "Campos rellenados desde el código. Revisa impresora, adhesivo, cantidad y tipo de avance, que no van dentro del código.",
    error: "Código no reconocido. Debe tener 16 caracteres con el formato correcto."
  },
  sections: {
    material: "1. Material de la etiqueta",
    config: "2. Configuración y vista previa",
    configLead1: "Vista previa de la etiqueta",
    configLead2: "Se recalcula automáticamente según las opciones seleccionadas.",
    printerTitle: "Tipo de impresora",
    contact: "3. Datos de contacto"
  },
  actions: { submit: "Enviar solicitud", submitting: "Enviando..." },
  sent: {
    title: "Solicitud enviada correctamente",
    body: "Hemos enviado un correo de confirmación al cliente y una notificación interna a secretaría."
  },
  errors: {
    sendFailed: "No se han podido enviar los correos.",
    unexpected: "Error inesperado en el envío."
  },
  material: {
    label: "Material de la etiqueta",
    guideButton: "Guía de materiales",
    usesLabel: "Usos recomendados:",
    describeLabel: "Describe el material",
    describePlaceholder: "Ej. papel kraft, material térmico especial, PE expandido...",
    observationsLabel: "Observaciones sobre el material (opcional)",
    observationsPlaceholder: "Detalles o requisitos específicos del material...",
    colorCountLabel: "Número de tintas",
    colorCountOptions: {
      "0": "0 — Sin tintas",
      "1": "1 — Fondo (1 tinta)",
      "2": "2 — Dos tintas",
      "3": "3 — Tres tintas",
      "4": "4 — Cuatro tintas"
    },
    quantityLabel: "Cantidad estimada",
    quantityNote:
      "Por circunstancias de producción, el número final de etiquetas puede variar +/- 10%.",
    guideModalTitle: "Guía de materiales de etiqueta",
    close: "Cerrar",
    families: {
      paper: "Etiqueta de papel",
      synthetic: "Sintético",
      textile: "Textil",
      other: "Otros"
    },
    items: {
      "paper-thermal-eco": {
        name: "Etiqueta térmica eco",
        description:
          "Opción económica para usos temporales; más sensible al calor, la humedad y el roce.",
        uses: "Promociones cortas, etiquetado temporal, flujo interno."
      },
      "paper-thermal-protected": {
        name: "Etiqueta térmica protegida",
        description:
          "Con capa de protección superficial para mejorar la durabilidad en entornos fríos o húmedos.",
        uses: "Alimentación, refrigerado, preparación de pedidos."
      },
      "paper-thermal-direct-ticket": {
        name: "Papel térmico - Tique (sin adhesivo)",
        description:
          "Impresión sin ribbon y sin adhesivo, orientada a la tiquetería; baja resistencia al calor y la luz solar.",
        uses: "Tiques, turnos, comprobantes y tique de caja."
      },
      "paper-couche": {
        name: "Etiqueta couché",
        description:
          "Buena calidad de impresión y acabado limpio; ideal para aplicaciones de interior o de corta duración.",
        uses: "Producto general, retail, identificación interna."
      },
      "paper-matte": {
        name: "Etiqueta mate",
        description:
          "Acabado mate con buena legibilidad y reflejo reducido; buena opción para texto y códigos.",
        uses: "Producto, almacén y etiquetado interno."
      },
      "paper-inkjet-gloss": {
        name: "Etiqueta inkjet brillo",
        description:
          "Recubrimiento para impresión a color viva y alto detalle con acabado brillante; menor resistencia al agua y al roce.",
        uses: "Promociones, packaging visual y etiquetas a color."
      },
      "paper-inkjet-matte": {
        name: "Etiqueta inkjet mate",
        description:
          "Recubrimiento para impresión a color con acabado mate y buena legibilidad; menor resistencia al agua y al roce.",
        uses: "Promociones, packaging visual y etiquetas a color sin reflejo."
      },
      "plastic-pp-gloss": {
        name: "PP brillo (polipropileno)",
        description:
          "Buena resistencia al agua, grasas y algunos químicos con buen equilibrio entre coste y prestaciones.",
        uses: "Cosmética, limpieza, higiene y consumibles."
      },
      "plastic-pp-matte": {
        name: "PP mate (polipropileno)",
        description:
          "Buena resistencia al agua, grasas y algunos químicos con acabado sin reflejo.",
        uses: "Cosmética, limpieza, higiene y consumibles."
      },
      "plastic-pe-gloss": {
        name: "PE brillo (polietileno)",
        description: "Material flexible que se adapta bien a envases curvados o deformables.",
        uses: "Botellas flexibles, productos de cuidado personal y detergencia."
      },
      "plastic-pe-matte": {
        name: "PE mate (polietileno)",
        description:
          "Material flexible con acabado mate, apto para envases curvados o deformables.",
        uses: "Botellas flexibles, productos de cuidado personal y detergencia."
      },
      "plastic-pet-gloss": {
        name: "PET brillo (poliéster)",
        description:
          "Muy durable y resistente a la temperatura y al desgaste; orientado a entornos exigentes.",
        uses: "Industrial, laboratorios, trazabilidad de larga duración."
      },
      "plastic-pet-matte": {
        name: "PET mate (poliéster)",
        description:
          "Muy durable y resistente a la temperatura y al desgaste con acabado mate.",
        uses: "Industrial, laboratorios, trazabilidad de larga duración."
      },
      "plastic-pvc": {
        name: "PVC (vinilo)",
        description:
          "Alta resistencia a la intemperie y la humedad, adecuado para aplicaciones exteriores.",
        uses: "Señalización, exterior, etiquetas expuestas."
      },
      "plastic-artyval": {
        name: "Sintético Artyval (sin adhesivo)",
        description:
          "Aspecto papel con resistencia de plástico; muy versátil en entornos húmedos o industriales.",
        uses: "Almacén, producción, etiquetado técnico con buena durabilidad."
      },
      "textile-polyamide": {
        name: "Poliamida (nylon)",
        description:
          "Etiqueta textil resistente y suave, con buen comportamiento en lavado y planchado.",
        uses: "Moda, confección, composición y cuidado de prendas lavables."
      },
      "material-unknown": {
        name: "No lo sé",
        description:
          "No sabes qué material es o no lo encuentras en la lista. Indícalo y te asesoraremos.",
        uses: "Cualquier aplicación. Te contactaremos para determinar el material adecuado."
      },
      "material-other": {
        name: "Ninguno de estos (especificar)",
        description:
          "El material que necesitas no aparece en la lista. Descríbelo en el campo de texto.",
        uses: "Materiales específicos, especiales o fuera de catálogo estándar."
      }
    }
  },
  adhesive: {
    label: "Tipo de adhesivo",
    guideButton: "Guía de adhesivos",
    usesLabel: "Usos recomendados:",
    noAdhesive: "Esta opción no lleva adhesivo.",
    guideModalTitle: "Guía de adhesivos",
    items: {
      acrylic: {
        name: "Acrílico (base agua)",
        description:
          "Buena durabilidad en seco y aplicaciones estables; no es la opción ideal en humedad alta o frío extremo.",
        uses: "Producto general, retail y etiquetado interior."
      },
      hotmelt: {
        name: "Hotmelt (base caucho)",
        description: "Excelente adherencia inicial y buen rendimiento en frío y humedad.",
        uses: "Alimentación, logística de fresco, superficies complejas."
      },
      removable: {
        name: "Removible",
        description: "Permite retirar la etiqueta con facilidad y minimiza residuos de adhesivo.",
        uses: "Promociones, precios temporales y etiquetado de corta duración."
      }
    }
  },
  printer: {
    labels: { desktop: "Sobremesa", portable: "Portátil", industrial: "Industrial" },
    compatibleInches: "Pulgadas compatibles"
  },
  dimensions: {
    title: "Medida de la bobina y mandril",
    coreLabel: "Mandril (núcleo de bobina)",
    outerLabel: "Diámetro exterior bobina (mm)",
    svgAria: "Ilustración de mandril y diámetro exterior",
    svgOuter: (mm) => `Diámetro exterior ${mm} mm`,
    svgCore: (mm) => `Mandril ${mm} mm`
  },
  preview: {
    widthMm: "Ancho (mm)",
    advanceMm: "Avance (mm)",
    advanceLateral: "Avance (lateral)",
    flowGap: "Gap",
    flowBlackMark: "Marca negra",
    flowContinuous: "Continuo",
    cutCheckbox: "Troquelado",
    aria: "Vista previa de papel soporte con etiquetas verticales",
    backgroundTitle: "Color de fondo",
    backgroundNone: "Sin color",
    backgroundWith: "Con color",
    backgroundChosen: "Color elegido",
    backgroundNotesLabel: "Observaciones del color (opcional)",
    backgroundNotesPlaceholder: "Ej. azul corporativo, Pantone aproximado...",
    widthClassInfo: (inches, mm) =>
      `Con ${inches}" la medida máxima recomendada es ${mm} mm.`,
    familyMaxInfo: (mm) => `Esta familia de impresora admite hasta ${mm} mm de ancho.`
  },
  contact: {
    company: "Empresa",
    contactName: "Persona de contacto",
    email: "Correo electrónico",
    phone: "Teléfono (opcional)",
    comments: "Comentarios adicionales (opcional)",
    commentsPlaceholder: "Cualquier detalle adicional que nos quieras hacer llegar..."
  }
};

export const dictionaries: Record<Locale, Dictionary> = { ca, es };
