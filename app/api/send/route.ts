import { NextResponse } from "next/server";
import { Resend } from "resend";
import { wizardSchema } from "@/lib/schemas/wizard";

const resend = new Resend(process.env.RESEND_API_KEY);
// Si prefereixes SendGrid, aquí es pot substituir aquesta instància per
// "@sendgrid/mail" mantenint la mateixa estructura de payload.

function renderSummaryHtml(data: ReturnType<typeof wizardSchema.parse>) {
  return `
    <h2>Resum de sol.licitud d'etiqueta</h2>
    <ul>
      <li><strong>Empresa:</strong> ${data.company}</li>
      <li><strong>Contacte:</strong> ${data.contactName}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Telèfon:</strong> ${data.phone || "No informat"}</li>
      <li><strong>Impressora:</strong> ${data.printerType}</li>
      <li><strong>Tecnologia:</strong> ${data.printTechnology}</li>
      <li><strong>Ribbon:</strong> ${data.ribbonType}</li>
      <li><strong>Mida:</strong> ${data.labelWidthMm} x ${data.labelHeightMm} mm</li>
      <li><strong>Tipus d'etiqueta:</strong> ${data.labelFlowType}</li>
      <li><strong>Tipus de tall:</strong> ${data.hasCut ? data.cutType : "Sense tall"}</li>
      <li><strong>Mandril:</strong> ${data.rollCoreMm === "external" ? "Bobinat extern" : `${data.rollCoreMm} mm`}</li>
      <li><strong>Diametre bobina:</strong> ${data.rollOuterDiameterMm} mm</li>
      <li><strong>Gap:</strong> ${data.gapMm} mm</li>
      <li><strong>Marca negra:</strong> ${data.hasBlackMark ? `Sí (${data.blackMarkPosition})` : "No"}</li>
      <li><strong>Adhesiu:</strong> ${data.adhesive}</li>
      <li><strong>Acabat:</strong> ${data.finish}</li>
      <li><strong>Quantitat:</strong> ${data.quantity}</li>
      <li><strong>Ús:</strong> ${data.labelUse}</li>
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

    const summaryHtml = renderSummaryHtml(data);

    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: "Confirmació: sol.licitud d'etiqueta rebuda",
        html: `
          <p>Hola ${data.contactName},</p>
          <p>Hem rebut la teva sol.licitud d'etiqueta. Aquest és el resum:</p>
          ${summaryHtml}
          <p>L'equip de S-IE es posarà en contacte amb tu.</p>
        `
      }),
      resend.emails.send({
        from: fromEmail,
        to: secretaryEmail,
        subject: `Nova sol.licitud d'etiqueta - ${data.company}`,
        html: `
          <p>Nova petició rebuda des del wizard d'etiquetes.</p>
          ${summaryHtml}
        `
      })
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Error inesperat." }, { status: 500 });
  }
}
