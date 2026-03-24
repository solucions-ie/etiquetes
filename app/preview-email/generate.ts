import { generateLabelIllustrationSvg } from "@/lib/email/labelIllustration";

// Pagina temporal per previsualitzar l'email - eliminar abans de publicar
export function generatePreviewHtml(): string {
  const lw_mm = 70;
  const lh_mm = 45;
  const labelFlowType = "gap";
  const isContinuous = false;
  const rollCoreMm = 40;
  const rollOuterDiameterMm = 115;

  function e(v: string) {
    return v
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  const labelSvg = generateLabelIllustrationSvg({
    labelWidthMm: lw_mm,
    labelHeightMm: lh_mm,
    labelFlowType,
    rollOuterDiameterMm: rollOuterDiameterMm,
    rollCoreMm: rollCoreMm,
    printerType: "desktop",
    hasBackgroundColor: false,
    backgroundColorHex: "#FFFFFF"
  });

  function specBlock(title: string, rows: Array<[string, string]>): string {
    const rowsHtml = rows
      .map(
        ([label, value]) => `<tr>
        <td style="padding:6px 8px 6px 10px;color:#64748b;font-size:12px;font-weight:600;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f1f5f9;">${e(label)}</td>
        <td style="padding:6px 10px 6px 8px;color:#0f172a;font-size:12px;vertical-align:top;border-bottom:1px solid #f1f5f9;">${e(value)}</td>
      </tr>`
      )
      .join("");

    return `<div style="margin-bottom:12px;">
      <div style="background:#8a1c22;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:6px 10px;border-radius:6px 6px 0 0;">${e(title)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 6px 6px;overflow:hidden;background:#fff;">
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
  }

  const date = new Date().toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return `<div style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <tr>
      <td colspan="2" style="background:#8a1c22;padding:0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:14px 20px;vertical-align:middle;">
              <img src="/logo-sie.png" alt="S-IE" style="height:28px;width:auto;display:block;" />
            </td>
            <td style="padding:14px 20px;text-align:right;vertical-align:middle;">
              <span style="color:#e2e8f0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;display:block;">INFORME DE SOL.LICITUD D&apos;ETIQUETA</span>
              <span style="color:#f3d9db;font-size:10px;">Data: ${date}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td colspan="2" style="background:#6f151a;height:3px;font-size:1px;line-height:1px;padding:0;">&nbsp;</td></tr>
    <tr>
      <td style="width:42%;padding:20px;vertical-align:top;border-right:1px solid #e2e8f0;background:#f8fafc;">
        <p style="margin:0 0 6px 0;font-size:13px;color:#334155;">Hola <strong>Laura Puig</strong>,</p>
        <p style="margin:0 0 18px 0;font-size:12px;line-height:1.55;color:#475569;">Aquest es el resum de la configuracio enviada. L'equip de S-IE revisara la informacio i et contactara.</p>
        ${labelSvg}
      </td>
      <td style="width:58%;padding:20px;vertical-align:top;">
        ${specBlock(
          "MIDES",
          isContinuous
            ? [["A) Amplada", "70 mm"]]
            : [["A) Amplada", "70 mm"], ["B) Avanç", "45 mm"]]
        )}
        ${specBlock("MATERIAL I MANIPULAT", [
          ["Material", "PP brillant (polipropile)"],
          ["Adhesiu", "Acrylic (base aigua)"],
          ["Color de fons", "Sense color de fons"]
        ])}
        ${specBlock("IMPRESSORA", [
          ["Tipus", "Sobretaula"],
          ["Polzada", '4"'],
          ["Tecnologia", "Transferencia termica"],
          ["Ribbon", "Cera/Resina"]
        ])}
        ${specBlock(
          "BOBINA",
          isContinuous
            ? [
                ["Avancament", "Continu"],
                ["Mandril", "40 mm"],
                ["Diametre max", "115 mm"],
                ["Tall", "Trepat"]
              ]
            : [
                ["Avancament", "Gap"],
                ["Gap", "3 mm"],
                ["Mandril", "40 mm"],
                ["Diametre max", "115 mm"],
                ["Tall", "Trepat"]
              ]
        )}
        ${specBlock("QUANTITAT", [["Unitats sollicitades", "5.000"]])}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:16px 20px;border-top:1px solid #e2e8f0;background:#f8fafc;">
        <div style="background:#8a1c22;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;padding:6px 10px;border-radius:6px 6px 0 0;display:inline-block;">DADES DE CONTACTE</div>
        <table role="presentation" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:0 6px 6px 6px;overflow:hidden;background:#ffffff;min-width:300px;">
          <tr>
            <td style="padding:6px 12px;font-size:12px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">Distribucions Pla, S.L.</td>
            <td style="padding:6px 12px;font-size:12px;color:#334155;border-bottom:1px solid #f1f5f9;">Laura Puig</td>
          </tr>
          <tr>
            <td style="padding:6px 12px;font-size:12px;color:#475569;border-right:1px solid #f1f5f9;">laura.puig@distribucionspla.cat</td>
            <td style="padding:6px 12px;font-size:12px;color:#475569;">93 456 78 90</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:10px 20px;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="margin:0;font-size:10px;color:#94a3b8;">Missatge enviat des del formulari d'etiquetes de S-IE.</p>
      </td>
    </tr>
  </table>
</div>`;
}
