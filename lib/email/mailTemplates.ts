import { generateLabelIllustrationSvg } from "@/lib/email/labelIllustration";
import { wizardSchema } from "@/lib/schemas/wizard";

export type WizardData = ReturnType<typeof wizardSchema.parse>;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function printerLabel(printerType: WizardData["printerType"]) {
  if (printerType === "desktop") return "Sobretaula";
  if (printerType === "portable") return "Portàtil";
  return "Industrial";
}

function printerWidthClassLabel(widthClass: WizardData["printerWidthClass"]) {
  return widthClass ? `${widthClass}"` : "No especificada";
}

function materialLabel(materialType: WizardData["materialType"]) {
  const map: Record<WizardData["materialType"], string> = {
    "paper-thermal-eco": "Etiqueta tèrmica eco",
    "paper-thermal-protected": "Etiqueta tèrmica protegida",
    "paper-thermal-direct-ticket": "Paper tèrmic - Tiquet (sense adhesiu)",
    "paper-couche": "Etiqueta couche",
    "paper-matte": "Etiqueta mate",
    "paper-inkjet-gloss": "Etiqueta inkjet brillant",
    "paper-inkjet-matte": "Etiqueta inkjet mate",
    "plastic-pp-gloss": "PP brillant (polipropilè)",
    "plastic-pp-matte": "PP mate (polipropilè)",
    "plastic-pe-gloss": "PE brillant (polietilè)",
    "plastic-pe-matte": "PE mate (polietilè)",
    "plastic-pet-gloss": "PET brillant (polièster)",
    "plastic-pet-matte": "PET mate (polièster)",
    "plastic-pvc": "PVC (vinil)",
    "plastic-artyval": "Sintètic Artyval (sense adhesiu)",
    "textile-polyamide": "Poliamida (nylon)",
    "material-unknown": "Desconegut",
    "material-other": "Altre (especificat pel client)"
  };
  return map[materialType];
}

function adhesiveLabel(adhesive: WizardData["adhesive"]) {
  const map: Record<WizardData["adhesive"], string> = {
    acrylic: "Acrylic (base aigua)",
    hotmelt: "Hotmelt (base cautxú)",
    removable: "Removible"
  };
  return map[adhesive];
}

function flowTypeLabel(type: WizardData["labelFlowType"]) {
  const map: Record<WizardData["labelFlowType"], string> = {
    gap: "Gap",
    "black-mark": "Marca negra",
    continuous: "Continu"
  };
  return map[type];
}

function cutTypeLabel(data: WizardData) {
  if (!data.hasCut) return "Sense tall";
  const map: Record<string, string> = {
    none: "Sense tall",
    trepat: "Trepat",
    troquelat: "Troquelat",
    "tall-italia": "Tall Italia",
    "tall-linia-recte": "Tall linia recte",
    "tall-perforat": "Tall perforat",
    "etiqueta-desmallada": "Etiqueta desmallada",
    linerless: "Linerless"
  };
  return map[data.cutType] ?? data.cutType;
}

function specBlock(title: string, rows: Array<[string, string]>) {
  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 8px 6px 10px;color:#64748b;font-size:12px;font-weight:600;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f1f5f9;">${escapeHtml(label)}</td>
          <td style="padding:6px 10px 6px 8px;color:#0f172a;font-size:12px;vertical-align:top;border-bottom:1px solid #f1f5f9;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `<div style="margin-bottom:12px;">
    <div style="background:#8a1c22;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:6px 10px;border-radius:6px 6px 0 0;">${escapeHtml(title)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 6px 6px;overflow:hidden;background:#fff;">
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>`;
}

function buildSpecBlocksHtml(data: WizardData) {
  const adhesiveText =
    data.materialType === "paper-thermal-direct-ticket" ||
    data.materialType === "plastic-artyval"
      ? "No aplica (sense adhesiu)"
      : adhesiveLabel(data.adhesive);

  const backgroundColorText = data.hasBackgroundColor
    ? `${data.backgroundColorHex}${data.backgroundColorNotes ? ` (${data.backgroundColorNotes})` : ""}`
    : "Sense color de fons";

  const midesRows: Array<[string, string]> = [["A) Amplada", `${data.labelWidthMm} mm`]];
  if (data.labelFlowType !== "continuous") {
    midesRows.push(["B) Avanç", `${data.labelHeightMm} mm`]);
  }

  const impressoraRows: Array<[string, string]> = [
    ["Tipus", printerLabel(data.printerType)],
    ["Polzada", printerWidthClassLabel(data.printerWidthClass)]
  ];

  const bobinaRows: Array<[string, string]> = [
    ["Avançament", flowTypeLabel(data.labelFlowType)],
    ["Mandril", data.rollCoreMm === "external" ? "Bobinat extern" : `${data.rollCoreMm} mm`],
    ["Diàmetre màx", `${data.rollOuterDiameterMm} mm`],
    ["Tall", cutTypeLabel(data)]
  ];
  if (data.labelFlowType !== "continuous") {
    bobinaRows.splice(1, 0, ["Gap", `${data.gapMm} mm`]);
  }
  if (data.hasBlackMark) {
    bobinaRows.push(["Marca negra", `Sí (${data.blackMarkPosition})`]);
  }

  return [
    specBlock("MIDES", midesRows),
    specBlock("MATERIAL I MANIPULAT", [
      ["Material", materialLabel(data.materialType)],
      ...(data.materialType === "material-other" && data.materialOtherDescription
        ? [["Descripció", data.materialOtherDescription] as [string, string]]
        : []),
      ["Adhesiu", adhesiveText],
      ["Color de fons", backgroundColorText]
    ]),
    specBlock("IMPRESSORA", impressoraRows),
    specBlock("BOBINA", bobinaRows),
    specBlock("QUANTITAT", [["Unitats sol·licitades", String(data.quantity)]])
  ].join("");
}

function renderContactBlockHtml(data: WizardData) {
  return `<div style="background:#8a1c22;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:6px 10px;border-radius:6px 6px 0 0;display:inline-block;">DADES DE CONTACTE</div>
  <table role="presentation" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:0 6px 6px 6px;overflow:hidden;background:#ffffff;min-width:300px;">
    <tr>
      <td style="padding:6px 12px;font-size:12px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${escapeHtml(data.company)}</td>
      <td style="padding:6px 12px;font-size:12px;color:#334155;border-bottom:1px solid #f1f5f9;">${escapeHtml(data.contactName)}</td>
    </tr>
    <tr>
      <td style="padding:6px 12px;font-size:12px;color:#475569;border-right:1px solid #f1f5f9;">${escapeHtml(data.email)}</td>
      <td style="padding:6px 12px;font-size:12px;color:#475569;">${data.phone ? escapeHtml(data.phone) : "&#8212;"}</td>
    </tr>
  </table>`;
}

function renderHeader(title: string, date: string, logoSrc: string) {
  return `<tr>
      <td style="background:#8a1c22;padding:0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:14px 20px;vertical-align:middle;">
              <img src="${escapeHtml(logoSrc)}" alt="S-IE" style="height:28px;width:auto;display:block;" />
            </td>
            <td style="padding:14px 20px;text-align:right;vertical-align:middle;">
              <span style="color:#e2e8f0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;display:block;">${escapeHtml(title)}</span>
              <span style="color:#f3d9db;font-size:10px;">Data: ${date}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td style="background:#6f151a;height:3px;font-size:1px;line-height:1px;padding:0;">&nbsp;</td></tr>`;
}

// ── Internal copy-paste summary (Spanish) for Odoo / manufacturer ──

const MATERIALS_WITHOUT_ADHESIVE: Array<WizardData["materialType"]> = [
  "paper-thermal-direct-ticket",
  "plastic-artyval",
  "material-unknown",
  "material-other"
];

function materialLabelEs(data: WizardData): string {
  if (data.materialType === "material-other") {
    return data.materialOtherDescription?.trim() || "Otro material (a especificar)";
  }
  const map: Record<WizardData["materialType"], string> = {
    "paper-thermal-eco": "Etiqueta térmica eco",
    "paper-thermal-protected": "Etiqueta térmica protegida",
    "paper-thermal-direct-ticket": "Papel térmico - Tique (sin adhesivo)",
    "paper-couche": "Etiqueta couché",
    "paper-matte": "Etiqueta mate",
    "paper-inkjet-gloss": "Etiqueta Inkjet papel brillo",
    "paper-inkjet-matte": "Etiqueta Inkjet papel mate",
    "plastic-pp-gloss": "PP brillo (polipropileno)",
    "plastic-pp-matte": "PP mate (polipropileno)",
    "plastic-pe-gloss": "PE brillo (polietileno)",
    "plastic-pe-matte": "PE mate (polietileno)",
    "plastic-pet-gloss": "PET brillo (poliéster)",
    "plastic-pet-matte": "PET mate (poliéster)",
    "plastic-pvc": "PVC (vinilo)",
    "plastic-artyval": "Sintético Artyval (sin adhesivo)",
    "textile-polyamide": "Poliamida (nylon)",
    "material-unknown": "Material por determinar",
    "material-other": "Otro material (a especificar)"
  };
  return map[data.materialType];
}

function productDescriptionEs(data: WizardData): string {
  const base = materialLabelEs(data);
  if (MATERIALS_WITHOUT_ADHESIVE.includes(data.materialType)) return base;
  const adhesiveEs = data.adhesive === "removable" ? "removible" : "permanente";
  return `${base} con adhesivo ${adhesiveEs}`;
}

function printerEs(printerType: WizardData["printerType"]): string {
  if (printerType === "desktop") return "sobremesa";
  if (printerType === "portable") return "portátil";
  return "industrial";
}

function cutLineEs(data: WizardData): string {
  if (!data.hasCut) return "Trepado: no.";
  if (data.cutType === "trepat") return "Trepado: sí.";
  const map: Record<string, string> = {
    troquelat: "Troquelado",
    "tall-italia": "Corte italiano",
    "tall-linia-recte": "Corte línea recta",
    "tall-perforat": "Perforado",
    "etiqueta-desmallada": "Etiqueta desmallada",
    linerless: "Linerless"
  };
  return `${map[data.cutType] ?? data.cutType}: sí.`;
}

export function buildInternalSummaryText(data: WizardData, referenceCode: string): string {
  const isContinuous = data.labelFlowType === "continuous";
  const desc = productDescriptionEs(data);
  const dims = isContinuous
    ? `${data.labelWidthMm} (continua)`
    : `${data.labelWidthMm} x ${data.labelHeightMm}`;
  const coreEs = data.rollCoreMm === "external" ? "externo" : `${data.rollCoreMm} mm`;

  const lines: string[] = [`Ancho ${data.labelWidthMm} mm.`];
  if (!isContinuous) lines.push(`Salida ${data.labelHeightMm} mm.`);
  lines.push(cutLineEs(data));
  lines.push(`Mandril: ${coreEs}.`);
  lines.push(`Diámetro bobina: ${data.rollOuterDiameterMm} mm.`);
  lines.push(`Apto para ${printerEs(data.printerType)}`);
  if (!isContinuous) {
    lines.push(
      "Este producto se vende en millares (Nota: por circunstancias de producción el número final de etiquetas puede variar +/- 10%)"
    );
  }
  lines.push("Notas:");

  return `PRODUCTE: ${desc}. ${dims}\n\nDESCRIPCIÓ: ${desc}\n${lines.join(
    "\n"
  )}\n\nReferència: ${referenceCode}`;
}

export function renderInternalSummaryHtml(params: {
  data: WizardData;
  referenceCode: string;
  logoSrc?: string;
}) {
  const { data, referenceCode, logoSrc = "/logo-sie.png" } = params;
  const date = new Date().toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const summaryText = buildInternalSummaryText(data, referenceCode);

  return `<div style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    ${renderHeader("NOVA SOL·LICITUD D'ETIQUETA", date, logoSrc)}
    <tr>
      <td style="padding:20px;">
        <p style="margin:0 0 12px 0;font-size:12px;color:#475569;">Resum per copiar i enganxar (la fitxa tècnica completa s&apos;adjunta en PDF):</p>
        <div style="white-space:pre-wrap;font-family:'Courier New',Courier,monospace;font-size:13px;line-height:1.55;color:#0f172a;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">${escapeHtml(summaryText)}</div>
      </td>
    </tr>
  </table>
</div>`;
}

export function renderCompactEmailHtml(params: {
  title: string;
  intro: string;
  data: WizardData;
  showGreeting?: boolean;
  logoSrc?: string;
  referenceCode?: string;
}) {
  const { title, intro, data, showGreeting = false, logoSrc = "/logo-sie.png", referenceCode } = params;
  const date = new Date().toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return `<div style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    ${renderHeader(title, date, logoSrc)}
    <tr>
      <td style="padding:20px;">
        ${
          showGreeting
            ? `<p style="margin:0 0 6px 0;font-size:13px;color:#334155;">Hola <strong>${escapeHtml(data.contactName)}</strong>,</p>`
            : ""
        }
        <p style="margin:0 0 18px 0;font-size:12px;line-height:1.55;color:#475569;">${escapeHtml(intro)}</p>
        ${referenceCode ? `<div style="margin-bottom:16px;background:#0f172a;border-radius:8px;padding:10px 14px;">
          <p style="margin:0 0 2px 0;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Referència interna</p>
          <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.06em;color:#ffffff;font-family:monospace;">${escapeHtml(referenceCode)}</p>
        </div>` : ""}
        ${data.materialObservations ? `<div style="margin-bottom:16px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;">
          <p style="margin:0 0 2px 0;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8a1c22;">Observacions sobre el material</p>
          <p style="margin:0;font-size:12px;line-height:1.5;color:#0f172a;">${escapeHtml(data.materialObservations)}</p>
        </div>` : ""}
        ${buildSpecBlocksHtml(data)}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;">
        ${renderContactBlockHtml(data)}
      </td>
    </tr>
    <tr>
      <td style="padding:10px 20px;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="margin:0;font-size:10px;color:#94a3b8;">La fitxa tècnica s&apos;adjunta en PDF.</p>
        ${data.comments ? `<p style="margin:8px 0 0 0;font-size:11px;color:#475569;"><strong style="color:#0f172a;">Comentaris:</strong> ${escapeHtml(data.comments)}</p>` : ""}
      </td>
    </tr>
  </table>
</div>`;
}

export function renderTechnicalSheetHtml(
  data: WizardData,
  options?: { logoSrc?: string; referenceCode?: string }
) {
  const date = new Date().toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const logoSrc = options?.logoSrc ?? "/logo-sie.png";
  const referenceCode = options?.referenceCode;
  const outerD =
    typeof data.rollOuterDiameterMm === "number" ? data.rollOuterDiameterMm : 100;
  const coreM = data.rollCoreMm === "external" ? 40 : Number(data.rollCoreMm);
  const coreLabel = data.rollCoreMm === "external" ? "extern" : `${coreM} mm`;

  const labelSvg = generateLabelIllustrationSvg({
    labelWidthMm: data.labelWidthMm,
    labelHeightMm: data.labelHeightMm,
    labelFlowType: data.labelFlowType,
    gapMm: data.gapMm,
    hasCut: data.hasCut,
    hasBlackMark: data.hasBlackMark,
    blackMarkPosition: data.blackMarkPosition,
    rollOuterDiameterMm: outerD,
    rollCoreMm: coreM,
    rollCoreLabel: coreLabel,
    printerType: data.printerType,
    hasBackgroundColor: data.hasBackgroundColor,
    backgroundColorHex: data.backgroundColorHex
  });

  return `<div style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <tr>
      <td colspan="2" style="background:#8a1c22;padding:0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:14px 20px;vertical-align:middle;white-space:nowrap;">
              <img src="${escapeHtml(logoSrc)}" alt="S-IE" style="height:28px;width:auto;display:block;" />
            </td>
            <td style="padding:14px 12px;vertical-align:middle;">
              <span style="color:#ffffff;font-size:12px;font-weight:700;display:block;line-height:1.35;">${escapeHtml(data.company)}</span>
              <span style="color:#f3d9db;font-size:11px;display:block;line-height:1.35;">${escapeHtml(data.contactName)}</span>
              <span style="color:#f3d9db;font-size:10px;display:block;line-height:1.35;">${escapeHtml(data.email)}${data.phone ? ` · ${escapeHtml(data.phone)}` : ""}</span>
            </td>
            <td style="padding:14px 20px;text-align:right;vertical-align:middle;white-space:nowrap;">
              <span style="color:#e2e8f0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;display:block;">FITXA TÈCNICA D&apos;ETIQUETA</span>
              <span style="color:#f3d9db;font-size:10px;">Data: ${date}</span>
              ${referenceCode ? `<span style="display:inline-block;margin-top:5px;padding:3px 8px;border-radius:5px;background:#ffffff;color:#8a1c22;font-family:monospace;font-size:12px;font-weight:700;letter-spacing:0.04em;">${escapeHtml(referenceCode)}</span>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td colspan="2" style="background:#6f151a;height:3px;font-size:1px;line-height:1px;padding:0;">&nbsp;</td></tr>
    <tr>
      <td style="width:42%;padding:20px;vertical-align:top;border-right:1px solid #e2e8f0;background:#f8fafc;">
        <p style="margin:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a1c22;">Configuració visual</p>
        ${labelSvg}
      </td>
      <td style="width:58%;padding:20px;vertical-align:top;">
        ${buildSpecBlocksHtml(data)}
        ${data.materialObservations ? `<div style="margin-bottom:12px;">
          <div style="background:#8a1c22;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:6px 10px;border-radius:6px 6px 0 0;">Observacions del material</div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 6px 6px;background:#fff;padding:8px 10px;font-size:12px;color:#0f172a;line-height:1.5;">${escapeHtml(data.materialObservations)}</div>
        </div>` : ""}
      </td>
    </tr>
  </table>
</div>`;
}

export function buildHtmlDocument(innerHtml: string) {
  return `<!doctype html>
<html lang="ca">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fitxa tècnica</title>
  </head>
  <body style="margin:0;background:#f1f5f9;">
    ${innerHtml}
  </body>
</html>`;
}
