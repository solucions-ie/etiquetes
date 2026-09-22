import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { generateLabelIllustrationSvg } from "@/lib/email/labelIllustration";
import {
  buildHtmlDocument,
  renderCompactEmailHtml,
  renderInternalSummaryHtml,
  renderTechnicalSheetHtml as renderTechnicalSheetTemplate
} from "@/lib/email/mailTemplates";
import { renderHtmlToPdf } from "@/lib/email/pdf";
import { wizardSchema } from "@/lib/schemas/wizard";
import { generateLabelCode } from "@/lib/labelCode";

// ──────────────────────────────────────────────
// Label helpers
// ──────────────────────────────────────────────

function printerLabel(printerType: "desktop" | "portable" | "industrial") {
  if (printerType === "desktop") return "Sobretaula";
  if (printerType === "portable") return "Portatil";
  return "Industrial";
}

function printerWidthClassLabel(
  widthClass: ReturnType<typeof wizardSchema.parse>["printerWidthClass"]
) {
  return widthClass ? `${widthClass}"` : "No especificada";
}

function materialLabel(
  materialType: ReturnType<typeof wizardSchema.parse>["materialType"]
) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["materialType"], string> = {
    "paper-thermal-eco": "Etiqueta termica eco",
    "paper-thermal-protected": "Etiqueta termica protegida",
    "paper-thermal-direct-ticket": "Paper termic - Tiquet (sense adhesiu)",
    "paper-couche": "Etiqueta couche",
    "paper-matte": "Etiqueta mate",
    "paper-inkjet-gloss": "Etiqueta inkjet brillant",
    "paper-inkjet-matte": "Etiqueta inkjet mate",
    "plastic-pp-gloss": "PP brillant (polipropile)",
    "plastic-pp-matte": "PP mate (polipropile)",
    "plastic-pe-gloss": "PE brillant (polietile)",
    "plastic-pe-matte": "PE mate (polietile)",
    "plastic-pet-gloss": "PET brillant (poliester)",
    "plastic-pet-matte": "PET mate (poliester)",
    "plastic-pvc": "PVC (vinil)",
    "plastic-artyval": "Sintetic Artyval (sense adhesiu)",
    "textile-polyamide": "Poliamida (nylon)",
    "material-unknown": "Desconegut",
    "material-other": "Altre (especificat pel client)"
  };
  return map[materialType];
}

function adhesiveLabel(
  adhesive: ReturnType<typeof wizardSchema.parse>["adhesive"]
) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["adhesive"], string> = {
    acrylic: "Acrylic (base aigua)",
    hotmelt: "Hotmelt (base cautxu)",
    removable: "Removible"
  };
  return map[adhesive];
}

function flowTypeLabel(
  type: ReturnType<typeof wizardSchema.parse>["labelFlowType"]
) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["labelFlowType"], string> = {
    gap: "Gap",
    "black-mark": "Marca negra",
    continuous: "Continu"
  };
  return map[type];
}

function cutTypeLabel(data: ReturnType<typeof wizardSchema.parse>) {
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ──────────────────────────────────────────────
// SVG: 1 etiqueta amb cotes A/B + rotllo a sota
// ──────────────────────────────────────────────

function generateLabelSvg(data: ReturnType<typeof wizardSchema.parse>): string {
  const outerD =
    typeof data.rollOuterDiameterMm === "number" ? data.rollOuterDiameterMm : 100;
  const coreM = data.rollCoreMm === "external" ? 40 : Number(data.rollCoreMm);
  const coreLabel = data.rollCoreMm === "external" ? "extern" : `${coreM} mm`;

  return generateLabelIllustrationSvg({
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
}

function generateLabelEmailHtml(data: ReturnType<typeof wizardSchema.parse>): string {
  return generateLabelSvg(data);
}

async function readLogoAsset() {
  const logoBuffer = await readFile(path.join(process.cwd(), "public", "logo-sie.png"));

  return {
    base64: logoBuffer.toString("base64"),
    dataUri: `data:image/png;base64,${logoBuffer.toString("base64")}`
  };
}

function getPublicSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!raw) {
    return "http://localhost:3000";
  }

  return raw.startsWith("http") ? raw : `https://${raw}`;
}

async function buildEmailAttachments(
  data: ReturnType<typeof wizardSchema.parse>,
  referenceCode: string
) {
  const logo = await readLogoAsset();
  const pdfHtml = buildHtmlDocument(
    renderTechnicalSheetTemplate(data, { logoSrc: logo.dataUri, referenceCode })
  );
  const pdfBuffer = await renderHtmlToPdf(pdfHtml);

  return [
    {
      content: pdfBuffer.toString("base64"),
      filename: `fitxa-tecnica-${referenceCode}.pdf`,
      contentType: "application/pdf"
    }
  ];
}


// ──────────────────────────────────────────────
// Email HTML builder
// ──────────────────────────────────────────────

function specBlock(title: string, rows: Array<[string, string]>): string {
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

function renderEmailHtml(params: {
  title: string;
  intro: string;
  data: ReturnType<typeof wizardSchema.parse>;
  showGreeting?: boolean;
}) {
  const { title, intro, data, showGreeting = false } = params;

  const date = new Date().toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const adhesiveText =
    data.materialType === "paper-thermal-direct-ticket" ||
    data.materialType === "plastic-artyval"
      ? "No aplica (sense adhesiu)"
      : adhesiveLabel(data.adhesive);

  const backgroundColorText = data.hasBackgroundColor
    ? `${data.backgroundColorHex}${data.backgroundColorNotes ? ` (${data.backgroundColorNotes})` : ""}`
    : "Sense color de fons";

  const labelSvg = generateLabelEmailHtml(data);

  // Spec blocks
  const midesRows: Array<[string, string]> = [["A) Amplada", `${data.labelWidthMm} mm`]];
  if (data.labelFlowType !== "continuous") {
    midesRows.push(["B) Avanç", `${data.labelHeightMm} mm`]);
  }
  const midesBlock = specBlock("MIDES", midesRows);

  const materialBlock = specBlock("MATERIAL I MANIPULAT", [
    ["Material", materialLabel(data.materialType)],
    ["Adhesiu", adhesiveText],
    ["Color de fons", backgroundColorText]
  ]);

  const impressoraRows: Array<[string, string]> = [
    ["Tipus", printerLabel(data.printerType)],
    ["Polzada", printerWidthClassLabel(data.printerWidthClass)]
  ];
  const impressoraBlock = specBlock("IMPRESSORA", impressoraRows);

  const bobinaRows: Array<[string, string]> = [
    ["Avançament", flowTypeLabel(data.labelFlowType)],
    ["Mandril", data.rollCoreMm === "external" ? "Bobinat extern" : `${data.rollCoreMm} mm`],
    ["Diàmetre max", `${data.rollOuterDiameterMm} mm`],
    ["Tall", cutTypeLabel(data)]
  ];
  if (data.labelFlowType !== "continuous") {
    bobinaRows.splice(1, 0, ["Gap", `${data.gapMm} mm`]);
  }
  if (data.hasBlackMark) {
    bobinaRows.push(["Marca negra", `Si (${data.blackMarkPosition})`]);
  }
  const bobinaBlock = specBlock("BOBINA", bobinaRows);

  const quantitatBlock = specBlock("QUANTITAT", [
    ["Unitats sol·licitades", String(data.quantity)]
  ]);

  return `<div style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

    <!-- ── HEADER ── -->
    <tr>
      <td colspan="2" style="background:#8a1c22;padding:0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:14px 20px;vertical-align:middle;">
              <img src="cid:sie-logo" alt="S-IE" style="height:28px;width:auto;display:block;" />
            </td>
            <td style="padding:14px 20px;text-align:right;vertical-align:middle;">
              <span style="color:#e2e8f0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;display:block;">INFORME DE SOL·LICITUD D&apos;ETIQUETA</span>
              <span style="color:#f3d9db;font-size:10px;">Data: ${date}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Red accent line -->
    <tr>
      <td colspan="2" style="background:#6f151a;height:3px;font-size:1px;line-height:1px;padding:0;">&nbsp;</td>
    </tr>

    <!-- ── MAIN: 2 columns ── -->
    <tr>

      <!-- Left: Visuals -->
      <td style="width:42%;padding:20px;vertical-align:top;border-right:1px solid #e2e8f0;background:#f8fafc;">
        ${
          showGreeting
            ? `<p style="margin:0 0 6px 0;font-size:13px;color:#334155;">Hola <strong>${escapeHtml(data.contactName)}</strong>,</p>`
            : ""
        }
        <p style="margin:0 0 18px 0;font-size:12px;line-height:1.55;color:#475569;">${escapeHtml(intro)}</p>

        ${labelSvg}
      </td>

      <!-- Right: Spec blocks -->
      <td style="width:58%;padding:20px;vertical-align:top;">
        ${midesBlock}
        ${materialBlock}
        ${impressoraBlock}
        ${bobinaBlock}
        ${quantitatBlock}
      </td>

    </tr>

    <!-- ── CONTACT FOOTER ── -->
    <tr>
      <td colspan="2" style="padding:16px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;">
        <div style="background:#8a1c22;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:6px 10px;border-radius:6px 6px 0 0;display:inline-block;">DADES DE CONTACTE</div>
        <table role="presentation" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:0 6px 6px 6px;overflow:hidden;background:#ffffff;min-width:300px;">
          <tr>
            <td style="padding:6px 12px;font-size:12px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${escapeHtml(data.company)}</td>
            <td style="padding:6px 12px;font-size:12px;color:#334155;border-bottom:1px solid #f1f5f9;">${escapeHtml(data.contactName)}</td>
          </tr>
          <tr>
            <td style="padding:6px 12px;font-size:12px;color:#475569;border-right:1px solid #f1f5f9;">${escapeHtml(data.email)}</td>
            <td style="padding:6px 12px;font-size:12px;color:#475569;">${data.phone ? escapeHtml(data.phone) : "&#8212;"}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td colspan="2" style="padding:10px 20px;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="margin:0;font-size:10px;color:#94a3b8;">Missatge enviat des del formulari d&apos;etiquetes de S-IE.</p>
      </td>
    </tr>

  </table>
</div>`;
}

function renderTechnicalSheetHtml(data: ReturnType<typeof wizardSchema.parse>) {
  const date = new Date().toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const adhesiveText =
    data.materialType === "paper-thermal-direct-ticket" ||
    data.materialType === "plastic-artyval"
      ? "No aplica (sense adhesiu)"
      : adhesiveLabel(data.adhesive);

  const backgroundColorText = data.hasBackgroundColor
    ? `${data.backgroundColorHex}${data.backgroundColorNotes ? ` (${data.backgroundColorNotes})` : ""}`
    : "Sense color de fons";

  const labelSvg = generateLabelEmailHtml(data);

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
    ["Diàmetre max", `${data.rollOuterDiameterMm} mm`],
    ["Tall", cutTypeLabel(data)]
  ];
  if (data.labelFlowType !== "continuous") {
    bobinaRows.splice(1, 0, ["Gap", `${data.gapMm} mm`]);
  }
  if (data.hasBlackMark) {
    bobinaRows.push(["Marca negra", `Si (${data.blackMarkPosition})`]);
  }

  return `<div style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <tr>
      <td colspan="2" style="background:#8a1c22;padding:0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:14px 20px;vertical-align:middle;">
              <img src="cid:sie-logo" alt="S-IE" style="height:28px;width:auto;display:block;" />
            </td>
            <td style="padding:14px 20px;text-align:right;vertical-align:middle;">
              <span style="color:#e2e8f0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;display:block;">FITXA TECNICA D&apos;ETIQUETA</span>
              <span style="color:#f3d9db;font-size:10px;">Data: ${date}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="background:#6f151a;height:3px;font-size:1px;line-height:1px;padding:0;">&nbsp;</td>
    </tr>
    <tr>
      <td style="width:42%;padding:20px;vertical-align:top;border-right:1px solid #e2e8f0;background:#f8fafc;">
        <p style="margin:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a1c22;">Configuracio visual</p>
        ${labelSvg}
      </td>
      <td style="width:58%;padding:20px;vertical-align:top;">
        ${specBlock("MIDES", midesRows)}
        ${specBlock("MATERIAL I MANIPULAT", [
          ["Material", materialLabel(data.materialType)],
          ["Adhesiu", adhesiveText],
          ["Color de fons", backgroundColorText]
        ])}
        ${specBlock("IMPRESSORA", impressoraRows)}
        ${specBlock("BOBINA", bobinaRows)}
        ${specBlock("QUANTITAT", [["Unitats sollicitades", String(data.quantity)]])}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:16px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;">
        <div style="background:#8a1c22;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:6px 10px;border-radius:6px 6px 0 0;display:inline-block;">DADES DE CONTACTE</div>
        <table role="presentation" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:0 6px 6px 6px;overflow:hidden;background:#ffffff;min-width:300px;">
          <tr>
            <td style="padding:6px 12px;font-size:12px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">${escapeHtml(data.company)}</td>
            <td style="padding:6px 12px;font-size:12px;color:#334155;border-bottom:1px solid #f1f5f9;">${escapeHtml(data.contactName)}</td>
          </tr>
          <tr>
            <td style="padding:6px 12px;font-size:12px;color:#475569;border-right:1px solid #f1f5f9;">${escapeHtml(data.email)}</td>
            <td style="padding:6px 12px;font-size:12px;color:#475569;">${data.phone ? escapeHtml(data.phone) : "&#8212;"}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
}

// ──────────────────────────────────────────────
// POST handler
// ──────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = wizardSchema.parse(json);

    const secretaryEmail = process.env.SECRETARY_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;
    const replyToEmail = process.env.REPLY_TO_EMAIL || "info@s-ie.cat";

    if (!secretaryEmail || !fromEmail || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Falten variables d'entorn per enviar correus." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const referenceCode = generateLabelCode(data);
    const attachments = await buildEmailAttachments(data, referenceCode);
    const logoSrc = `${getPublicSiteUrl()}/logo-sie.png`;

    const [customerResult, internalResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        replyTo: replyToEmail,
        subject: "Confirmació: sol·licitud d'etiqueta rebuda",
        attachments: attachments,
        html: renderCompactEmailHtml({
          title: "INFORME DE SOLLICITUD D'ETIQUETA",
          intro:
            "Aquest és el resum tècnic de la configuració enviada. La fitxa tècnica completa s'adjunta en PDF.",
          data,
          showGreeting: true,
          logoSrc
        })
      }),
      resend.emails.send({
        from: fromEmail,
        to: secretaryEmail,
        replyTo: replyToEmail,
        subject: `Nova sol·licitud d'etiqueta - ${data.company}`,
        attachments: attachments,
        html: renderInternalSummaryHtml({
          data,
          referenceCode,
          logoSrc
        })
      })
    ]);

    const customerError = (customerResult as { error?: { message?: string } }).error;
    const internalError = (internalResult as { error?: { message?: string } }).error;

    if (customerError || internalError) {
      const messages = [customerError?.message, internalError?.message]
        .filter(Boolean)
        .join(" | ");
      return NextResponse.json(
        { error: messages || "Resend ha rebutjat un o mes enviaments." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Error inesperat." }, { status: 500 });
  }
}
