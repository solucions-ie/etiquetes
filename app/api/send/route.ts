import { NextResponse } from "next/server";
import { Resend } from "resend";
import { wizardSchema } from "@/lib/schemas/wizard";

function printerLabel(printerType: "desktop" | "industrial") {
  return printerType === "desktop" ? "Sobretaula" : "Industrial";
}

function materialLabel(materialType: ReturnType<typeof wizardSchema.parse>["materialType"]) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["materialType"], string> = {
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
    "textile-polyamide": "Poliamida (nylon)"
  };
  return map[materialType];
}

function adhesiveLabel(adhesive: ReturnType<typeof wizardSchema.parse>["adhesive"]) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["adhesive"], string> = {
    acrylic: "Acrílic (base aigua)",
    hotmelt: "Hotmelt (base cautxú)",
    removable: "Removible"
  };
  return map[adhesive];
}

function printTechLabel(type: ReturnType<typeof wizardSchema.parse>["printTechnology"]) {
  return type === "direct-thermal" ? "Tèrmica directa" : "Transferència tèrmica";
}

function ribbonLabel(type: ReturnType<typeof wizardSchema.parse>["ribbonType"]) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["ribbonType"], string> = {
    none: "Sense ribbon",
    cera: "Cera",
    "cera-resina": "Cera/Resina",
    resina: "Resina",
    unknown: "No ho sé"
  };
  return map[type];
}

function flowTypeLabel(type: ReturnType<typeof wizardSchema.parse>["labelFlowType"]) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["labelFlowType"], string> = {
    gap: "Gap",
    "black-mark": "Marca negra",
    continuous: "Continu"
  };
  return map[type];
}

function cutTypeLabel(data: ReturnType<typeof wizardSchema.parse>) {
  return data.hasCut ? data.cutType : "Sense tall";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function summaryRows(data: ReturnType<typeof wizardSchema.parse>) {
  const adhesiveText =
    data.materialType === "paper-thermal-direct-ticket" || data.materialType === "plastic-artyval"
      ? "No aplica (sense adhesiu)"
      : adhesiveLabel(data.adhesive);

  const rows: Array<[string, string]> = [
    ["Empresa", data.company],
    ["Contacte", data.contactName],
    ["Email", data.email],
    ["Telèfon", data.phone || "No informat"],
    ["Impressora", printerLabel(data.printerType)],
    ["Material", materialLabel(data.materialType)],
    ["Tecnologia", printTechLabel(data.printTechnology)],
    ["Ribbon", ribbonLabel(data.ribbonType)],
    ["Mida", `${data.labelWidthMm} x ${data.labelHeightMm} mm`],
    ["Avanç", flowTypeLabel(data.labelFlowType)],
    ["Tipus de tall", cutTypeLabel(data)],
    ["Mandril", data.rollCoreMm === "external" ? "Bobinat extern" : `${data.rollCoreMm} mm`],
    ["Diàmetre bobina", `${data.rollOuterDiameterMm} mm`],
    ["Gap", `${data.gapMm} mm`],
    ["Marca negra", data.hasBlackMark ? `Sí (${data.blackMarkPosition})` : "No"],
    ["Adhesiu", adhesiveText],
    ["Quantitat", String(data.quantity)]
  ];

  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:13px;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");
}

function renderEmailHtml(params: {
  title: string;
  intro: string;
  data: ReturnType<typeof wizardSchema.parse>;
  showGreeting?: boolean;
}) {
  const { title, intro, data, showGreeting = false } = params;

  const previewBadges = [
    `${data.labelWidthMm} x ${data.labelHeightMm} mm`,
    printTechLabel(data.printTechnology),
    flowTypeLabel(data.labelFlowType)
  ]
    .map(
      (item) =>
        `<span style="display:inline-block;background:#eef2ff;border:1px solid #dbeafe;color:#1e3a8a;border-radius:999px;padding:6px 10px;font-size:12px;margin:0 6px 6px 0;">${escapeHtml(item)}</span>`
    )
    .join("");

  return `
    <div style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
        <tr>
          <td style="background:#1c323b;padding:18px 20px;">
            <img src="https://etiquetes.s-ie.cat/logo-sie.png" alt="S-IE" style="height:34px;width:auto;display:block;" />
          </td>
        </tr>
        <tr>
          <td style="padding:20px;">
            ${showGreeting ? `<p style="margin:0 0 8px 0;font-size:14px;color:#334155;">Hola ${escapeHtml(data.contactName)},</p>` : ""}
            <h1 style="margin:0 0 8px 0;font-size:20px;line-height:1.3;color:#0f172a;">${escapeHtml(title)}</h1>
            <p style="margin:0 0 16px 0;font-size:14px;line-height:1.5;color:#475569;">${escapeHtml(intro)}</p>

            <div style="margin:0 0 14px 0;">${previewBadges}</div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;background:#fff;">
              <tbody>
                ${summaryRows(data)}
              </tbody>
            </table>

            <p style="margin:16px 0 0 0;font-size:13px;color:#64748b;line-height:1.5;">
              Missatge enviat des del formulari d'etiquetes de S-IE.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

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

    const [customerResult, internalResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        replyTo: replyToEmail,
        subject: "Confirmació: sol·licitud d'etiqueta rebuda",
        html: renderEmailHtml({
          title: "Hem rebut la teva sol·licitud",
          intro: "Aquest és el resum de la configuració enviada. L'equip de S-IE revisarà la informació i et contactarà.",
          data,
          showGreeting: true
        })
      }),
      resend.emails.send({
        from: fromEmail,
        to: secretaryEmail,
        replyTo: replyToEmail,
        subject: `Nova sol·licitud d'etiqueta - ${data.company}`,
        html: renderEmailHtml({
          title: "Nova sol·licitud rebuda",
          intro: "S'ha registrat una nova petició des del formulari d'etiquetes.",
          data
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
        { error: messages || "Resend ha rebutjat un o més enviaments." },
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
