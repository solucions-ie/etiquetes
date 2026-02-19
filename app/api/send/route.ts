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
    "plastic-pet-gloss": "PET brillant (poliester)",
    "plastic-pet-matte": "PET mate (poliester)",
    "plastic-pvc": "PVC (vinil)",
    "plastic-artyval": "Sintètic Artyval (sense adhesiu)",
    "textile-polyamide": "Poliamida (nylon)"
  };
  return map[materialType];
}

function adhesiveLabel(adhesive: ReturnType<typeof wizardSchema.parse>["adhesive"]) {
  const map: Record<ReturnType<typeof wizardSchema.parse>["adhesive"], string> = {
    acrylic: "Acrilic (base aigua)",
    hotmelt: "Hotmelt (base cautxu)",
    removable: "Removible"
  };
  return map[adhesive];
}

function renderSummaryHtml(data: ReturnType<typeof wizardSchema.parse>) {
  const adhesiveText =
    data.materialType === "paper-thermal-direct-ticket" ||
    data.materialType === "plastic-artyval"
      ? "No aplica (sense adhesiu)"
      : adhesiveLabel(data.adhesive);

  return `
    <h2>Resum de sollicitud d'etiqueta</h2>
    <ul>
      <li><strong>Empresa:</strong> ${data.company}</li>
      <li><strong>Contacte:</strong> ${data.contactName}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Telefon:</strong> ${data.phone || "No informat"}</li>
      <li><strong>Impressora:</strong> ${printerLabel(data.printerType)}</li>
      <li><strong>Material:</strong> ${materialLabel(data.materialType)}</li>
      <li><strong>Tecnologia:</strong> ${data.printTechnology}</li>
      <li><strong>Ribbon:</strong> ${data.ribbonType}</li>
      <li><strong>Mida:</strong> ${data.labelWidthMm} x ${data.labelHeightMm} mm</li>
      <li><strong>Tipus d'etiqueta:</strong> ${data.labelFlowType}</li>
      <li><strong>Tipus de tall:</strong> ${data.hasCut ? data.cutType : "Sense tall"}</li>
      <li><strong>Mandril:</strong> ${data.rollCoreMm === "external" ? "Bobinat extern" : `${data.rollCoreMm} mm`}</li>
      <li><strong>Diametre bobina:</strong> ${data.rollOuterDiameterMm} mm</li>
      <li><strong>Gap:</strong> ${data.gapMm} mm</li>
      <li><strong>Marca negra:</strong> ${data.hasBlackMark ? `Si (${data.blackMarkPosition})` : "No"}</li>
      <li><strong>Adhesiu:</strong> ${adhesiveText}</li>
      <li><strong>Quantitat:</strong> ${data.quantity}</li>
    </ul>
  `;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = wizardSchema.parse(json);
    const secretaryEmail = process.env.SECRETARY_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;

    if (!secretaryEmail || !fromEmail || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Falten variables d'entorn per enviar correus." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const summaryHtml = renderSummaryHtml(data);

    const [customerResult, internalResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: "Confirmacio: sollicitud d'etiqueta rebuda",
        html: `
          <p>Hola ${data.contactName},</p>
          <p>Hem rebut la teva sollicitud d'etiqueta. Aquest es el resum:</p>
          ${summaryHtml}
          <p>L'equip de S-IE es posara en contacte amb tu.</p>
        `
      }),
      resend.emails.send({
        from: fromEmail,
        to: secretaryEmail,
        subject: `Nova sollicitud d'etiqueta - ${data.company}`,
        html: `
          <p>Nova peticio rebuda des del formulari d'etiquetes.</p>
          ${summaryHtml}
        `
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

