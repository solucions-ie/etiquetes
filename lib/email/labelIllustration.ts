type LabelIllustrationData = {
  labelWidthMm: number;
  labelHeightMm: number;
  labelFlowType?: "gap" | "black-mark" | "continuous";
  gapMm?: number;
  hasCut?: boolean;
  hasBlackMark?: boolean;
  blackMarkPosition?: "none" | "front" | "back";
  rollOuterDiameterMm: number;
  rollCoreMm: number;
  rollCoreLabel?: string;
  printerType?: "desktop" | "portable" | "industrial";
  hasBackgroundColor?: boolean;
  backgroundColorHex?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function metricChip(label: string, value: string) {
  return `<span style="display:inline-block;padding:5px 8px;border-radius:999px;background:#e2e8f0;color:#1e293b;font-size:10px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin:0 4px 4px 0;">${escapeHtml(
    label
  )} ${escapeHtml(value)}</span>`;
}

function generateRollPreviewSvg(data: LabelIllustrationData) {
  const printerType = data.printerType ?? "desktop";

  const outerOptionsMap = {
    desktop: [90, 100, 115, 120],
    portable: [50, 56, 66],
    industrial: [150, 180, 190]
  } as const;

  const coreOptionsMap = {
    desktop: [25.4, 40],
    portable: [19, 25],
    industrial: [40, 76]
  } as const;

  const outerOptions = outerOptionsMap[printerType];
  const coreOptions = coreOptionsMap[printerType];
  const minOuter = Math.min(...outerOptions);
  const maxOuter = Math.max(...outerOptions);
  const minCore = Math.min(...coreOptions);
  const maxCore = Math.max(...coreOptions);

  const normalizedOuter =
    maxOuter === minOuter
      ? 1
      : (data.rollOuterDiameterMm - minOuter) / (maxOuter - minOuter);
  const normalizedCore =
    maxCore === minCore ? 1 : (data.rollCoreMm - minCore) / (maxCore - minCore);

  const innerRx = 22 + normalizedCore * 18;
  const innerRy = 15 + normalizedCore * 10;
  const outerRx = innerRx + 40 + normalizedOuter * 56;
  const outerRy = innerRy + 26 + normalizedOuter * 34;
  const cx = 180;
  const cy = 132;
  const outerDimY = cy - outerRy - 8;
  const outerLabelY = outerDimY - 12;
  const innerLabelY = cy - 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 252" style="display:block;width:100%;max-width:220px;height:auto;margin:0 auto;">
  <rect x="8" y="24" width="344" height="216" rx="18" fill="#f8fafc"/>
  <ellipse cx="${cx}" cy="${cy + 18}" rx="${outerRx}" ry="${outerRy}" fill="#cfd8e3" opacity="0.55" />
  <ellipse cx="${cx}" cy="${cy}" rx="${outerRx}" ry="${outerRy}" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
  <ellipse cx="${cx}" cy="${cy}" rx="${innerRx}" ry="${innerRy}" fill="#ffffff" stroke="#64748b" stroke-width="1.6" />

  <line x1="${cx - outerRx}" y1="${outerDimY}" x2="${cx + outerRx}" y2="${outerDimY}" stroke="#0f172a" stroke-width="2.2" />
  <path d="M ${cx - outerRx} ${outerDimY} l 9 -6 M ${cx - outerRx} ${outerDimY} l 9 6" fill="none" stroke="#0f172a" stroke-width="2.2" />
  <path d="M ${cx + outerRx} ${outerDimY} l -9 -6 M ${cx + outerRx} ${outerDimY} l -9 6" fill="none" stroke="#0f172a" stroke-width="2.2" />
  <line x1="${cx - outerRx}" y1="${outerDimY + 6}" x2="${cx - outerRx}" y2="${cy - outerRy + 10}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3" />
  <line x1="${cx + outerRx}" y1="${outerDimY + 6}" x2="${cx + outerRx}" y2="${cy - outerRy + 10}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3" />
  <line x1="${cx - outerRx}" y1="${cy}" x2="${cx - outerRx}" y2="${cy + outerRy}" stroke="#64748b" stroke-width="1.2" />
  <line x1="${cx + outerRx}" y1="${cy}" x2="${cx + outerRx}" y2="${cy + outerRy}" stroke="#64748b" stroke-width="1.2" />
  <text x="${cx}" y="${outerLabelY}" text-anchor="middle" font-size="26" font-family="Arial,Helvetica,sans-serif" fill="#0f172a" font-weight="700">${data.rollOuterDiameterMm} mm</text>

  <line x1="${cx - innerRx}" y1="${cy}" x2="${cx + innerRx}" y2="${cy}" stroke="#0f172a" stroke-width="2.2" />
  <path d="M ${cx - innerRx} ${cy} l 8 -6 M ${cx - innerRx} ${cy} l 8 6" fill="none" stroke="#0f172a" stroke-width="2.2" />
  <path d="M ${cx + innerRx} ${cy} l -8 -6 M ${cx + innerRx} ${cy} l -8 6" fill="none" stroke="#0f172a" stroke-width="2.2" />
  <line x1="${cx - innerRx}" y1="${cy - 16}" x2="${cx - innerRx}" y2="${cy + 16}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3" />
  <line x1="${cx + innerRx}" y1="${cy - 16}" x2="${cx + innerRx}" y2="${cy + 16}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3" />
  <text x="${cx}" y="${innerLabelY}" text-anchor="middle" font-size="26" font-family="Arial,Helvetica,sans-serif" fill="#0f172a" font-weight="700">${escapeHtml(
    data.rollCoreLabel ?? `${data.rollCoreMm} mm`
  )}</text>
</svg>`;
}

// String-based port of the web SupportLabelPreview: three labels on a liner
// strip reflecting the manipulation type (gap / black-mark / continuous / cut).
function generateLabelStripSvg(data: LabelIllustrationData, labelFill: string): string {
  const flow = data.labelFlowType ?? "gap";
  const gapMm = data.gapMm ?? 2;
  const hasCut = data.hasCut ?? false;

  const s = Math.min(
    150 / Math.max(data.labelWidthMm, 15),
    64 / Math.max(data.labelHeightMm, 10),
    3
  );
  const labelW = Math.round(data.labelWidthMm * s);
  const labelH = Math.round(Math.max(data.labelHeightMm, 10) * s);
  const gapPx = Math.max(8, Math.min(26, gapMm * 2.6));

  const labelX = 30;
  const label1Y = 16;
  const label2Y = label1Y + labelH + gapPx;
  const label3Y = label2Y + labelH + gapPx;
  const stripBottom = label3Y + labelH;
  const centerX = labelX + labelW / 2;

  const sideMargin = Math.max(4, Math.round(2 * s));
  const supportX = labelX - sideMargin;
  const supportY = label1Y - sideMargin;
  const supportW = labelW + sideMargin * 2;
  const supportH = stripBottom - supportY + sideMargin;

  const svgW = labelX + labelW + 30;
  const svgH = stripBottom + 34;

  const shadow = (y: number, h: number) =>
    `<rect x="${labelX + 4}" y="${y + 5}" width="${labelW}" height="${h}" rx="9" fill="#d7dee8" opacity="0.45"/>`;
  const face = (y: number, h: number) =>
    `<rect x="${labelX}" y="${y}" width="${labelW}" height="${h}" rx="9" fill="${labelFill}" stroke="#334155" stroke-width="1.8"/>`;

  let labelsSvg = "";
  if (flow === "gap") {
    labelsSvg = [label1Y, label2Y, label3Y].map((y) => shadow(y, labelH) + face(y, labelH)).join("");
    if (hasCut) {
      const cut = (y: number) =>
        `<line x1="${labelX}" y1="${y}" x2="${labelX + labelW}" y2="${y}" stroke="#334155" stroke-width="1.3" stroke-dasharray="5 4"/>`;
      labelsSvg += cut(label1Y + labelH + gapPx / 2) + cut(label2Y + labelH + gapPx / 2);
    }
  } else {
    const bigH = stripBottom - label1Y;
    labelsSvg = shadow(label1Y, bigH) + face(label1Y, bigH);
    if (flow === "black-mark") {
      const markH = Math.max(6, Math.round(gapPx * 0.5));
      const markY1 = label1Y + labelH + Math.max(3, gapPx * 0.3);
      const markY2 = label2Y + labelH + Math.max(3, gapPx * 0.3);
      const mark = (y: number) =>
        `<rect x="${labelX}" y="${y}" width="${labelW}" height="${markH}" rx="2" fill="#111827"/>`;
      labelsSvg += mark(markY1) + mark(markY2);
      if (hasCut) {
        const cut = (y: number) =>
          `<line x1="${labelX}" y1="${y}" x2="${labelX + labelW}" y2="${y}" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="4 4"/>`;
        labelsSvg += cut(markY1 + markH / 2) + cut(markY2 + markH / 2);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" style="display:block;margin:0 auto;max-width:${Math.min(
    svgW,
    240
  )}px;width:100%;height:auto;">
  <rect x="${supportX}" y="${supportY}" width="${supportW}" height="${supportH}" rx="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.4"/>
  ${labelsSvg}
  <text x="${centerX}" y="${stripBottom + 16}" text-anchor="middle" font-size="9" font-family="Arial,Helvetica,sans-serif" fill="#64748b" font-weight="700" letter-spacing="0.08em">SORTIDA</text>
  <path d="M ${centerX} ${stripBottom + 20} v 8" stroke="#64748b" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M ${centerX} ${stripBottom + 30} l -4 -5 h 8 z" fill="#64748b"/>
</svg>`;
}

export function generateLabelIllustrationSvg(data: LabelIllustrationData): string {
  const isContinuous = data.labelFlowType === "continuous";
  const labelFill =
    data.hasBackgroundColor && data.backgroundColorHex
      ? escapeHtml(data.backgroundColorHex)
      : "#ffffff";

  const coreLabel = data.rollCoreLabel ?? `${data.rollCoreMm} mm`;
  const rollSvg = generateRollPreviewSvg(data);
  const labelSvg = generateLabelStripSvg(data, labelFill);

  return `<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 14px 12px;margin-bottom:10px;">
  <p style="margin:0 0 10px 0;font-size:10px;color:#64748b;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Format etiqueta</p>
  <div style="margin:0 0 8px 0;">${metricChip("Amplada", `${data.labelWidthMm} mm`)}${
    isContinuous ? "" : metricChip("Avanç", `${data.labelHeightMm} mm`)
  }</div>
  ${labelSvg}
</div>
<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 14px 12px;">
  <p style="margin:0 0 10px 0;font-size:10px;color:#64748b;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Bobina</p>
  <div style="margin:0 0 8px 0;">${metricChip("Diametre", `${data.rollOuterDiameterMm} mm`)}${metricChip(
    "Mandril",
    coreLabel
  )}</div>
  <div style="background:#f8fafc;border-radius:12px;padding:10px 10px 6px;text-align:center;">
    ${rollSvg}
  </div>
</div>`;
}

export function generateLabelIllustrationEmailHtml(data: LabelIllustrationData): string {
  const isContinuous = data.labelFlowType === "continuous";
  const labelFill =
    data.hasBackgroundColor && data.backgroundColorHex
      ? escapeHtml(data.backgroundColorHex)
      : "#ffffff";
  const coreLabel = data.rollCoreLabel ?? `${data.rollCoreMm} mm`;

  return `<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 14px 12px;margin-bottom:10px;">
  <p style="margin:0 0 10px 0;font-size:10px;color:#64748b;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Format etiqueta</p>
  <div style="margin:0 0 8px 0;">${metricChip("Amplada", `${data.labelWidthMm} mm`)}${
    isContinuous ? "" : metricChip("Avanç", `${data.labelHeightMm} mm`)
  }</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
    <tr>
      <td style="padding:10px 12px 4px 12px;text-align:center;font-size:16px;font-weight:700;color:#0f172a;">${data.labelWidthMm} mm</td>
      ${
        isContinuous
          ? ""
          : `<td style="padding:10px 12px 4px 0;text-align:center;font-size:16px;font-weight:700;color:#0f172a;white-space:nowrap;">${data.labelHeightMm} mm</td>`
      }
    </tr>
    <tr>
      <td style="padding:0 12px 10px 12px;${isContinuous ? "" : "width:78%;"}">
        <div style="position:relative;background:${labelFill};border:2px solid #334155;border-radius:10px;height:92px;">
          <div style="height:14px;width:78%;margin:12px auto 0 auto;border-radius:4px;background:#e2e8f0;"></div>
          <div style="height:5px;width:54%;margin:14px 0 0 12px;border-radius:3px;background:#cbd5e1;"></div>
          <div style="height:5px;width:34%;margin:10px 0 0 12px;border-radius:3px;background:#cbd5e1;"></div>
        </div>
        <div style="padding-top:8px;text-align:center;font-size:9px;font-weight:700;letter-spacing:0.08em;color:#64748b;">SORTIDA</div>
        <div style="text-align:center;font-size:12px;color:#64748b;line-height:1;">↓</div>
      </td>
      ${
        isContinuous
          ? ""
          : `<td style="padding:0 12px 10px 0;text-align:center;vertical-align:middle;font-size:12px;font-weight:700;color:#64748b;writing-mode:vertical-rl;">AVANÇ</td>`
      }
    </tr>
  </table>
</div>
<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 14px 12px;">
  <p style="margin:0 0 10px 0;font-size:10px;color:#64748b;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Bobina</p>
  <div style="margin:0 0 8px 0;">${metricChip("Diametre", `${data.rollOuterDiameterMm} mm`)}${metricChip(
    "Mandril",
    coreLabel
  )}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
    <tr>
      <td style="padding:10px 12px 0 12px;text-align:center;font-size:16px;font-weight:700;color:#0f172a;">${data.rollOuterDiameterMm} mm</td>
    </tr>
    <tr>
      <td style="padding:6px 12px;text-align:center;">
        <div style="width:132px;height:132px;margin:0 auto;border-radius:999px;background:#e2e8f0;border:2px solid #475569;position:relative;">
          <div style="width:48px;height:48px;border-radius:999px;background:#ffffff;border:2px solid #64748b;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);"></div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:0 12px 10px 12px;text-align:center;font-size:16px;font-weight:700;color:#0f172a;">${escapeHtml(
        coreLabel
      )}</td>
    </tr>
  </table>
</div>`;
}
