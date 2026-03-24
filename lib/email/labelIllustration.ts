type LabelIllustrationData = {
  labelWidthMm: number;
  labelHeightMm: number;
  labelFlowType?: "gap" | "black-mark" | "continuous";
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
    desktop: [90, 100, 115],
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

export function generateLabelIllustrationSvg(data: LabelIllustrationData): string {
  const isContinuous = data.labelFlowType === "continuous";
  const labelFill =
    data.hasBackgroundColor && data.backgroundColorHex
      ? escapeHtml(data.backgroundColorHex)
      : "#ffffff";

  const scale = Math.min(
    132 / Math.max(data.labelWidthMm, 15),
    88 / Math.max(data.labelHeightMm, 10),
    2.9
  );
  const labelWidth = Math.round(data.labelWidthMm * scale);
  const labelHeight = Math.round(data.labelHeightMm * scale);

  const labelX = 22;
  const labelY = 42;
  const linerY = labelY + labelHeight + 12;
  const linerHeight = 14;
  const labelRight = labelX + labelWidth;
  const labelBottom = labelY + labelHeight;
  const dimTopY = labelY - 10;
  const dimRightX = labelRight + 10;
  const widthTextX = labelX + Math.round(labelWidth / 2);
  const heightTextY = labelY + Math.round(labelHeight / 2);
  const heightTextX = dimRightX + 10;
  const svgWidth = isContinuous ? Math.max(186, labelRight + 24) : Math.max(186, heightTextX + 20);
  const svgHeight = linerY + linerHeight + 22;

  const labelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" style="display:block;margin:0 auto;max-width:${svgWidth}px;width:100%;height:auto;">
  <rect x="10" y="12" width="${svgWidth - 20}" height="${svgHeight - 22}" rx="18" fill="#f8fafc"/>
  <rect x="${labelX - 6}" y="${labelY + 6}" width="${labelWidth}" height="${labelHeight}" rx="8" fill="#dbe4ee"/>
  <rect x="${labelX}" y="${labelY}" width="${labelWidth}" height="${labelHeight}" rx="8" fill="${labelFill}" stroke="#334155" stroke-width="1.5"/>
  <rect x="${labelX + 10}" y="${labelY + 10}" width="${Math.max(
    22,
    labelWidth - 20
  )}" height="${Math.max(12, Math.round(labelHeight * 0.18))}" rx="4" fill="#e2e8f0"/>
  <rect x="${labelX + 10}" y="${labelY + 28}" width="${Math.max(
    44,
    Math.round(labelWidth * 0.55)
  )}" height="5" rx="2.5" fill="#cbd5e1"/>
  <rect x="${labelX + 10}" y="${labelY + 38}" width="${Math.max(
    30,
    Math.round(labelWidth * 0.36)
  )}" height="5" rx="2.5" fill="#cbd5e1"/>
  <line x1="${labelX}" y1="${dimTopY}" x2="${labelRight}" y2="${dimTopY}" stroke="#0f172a" stroke-width="1.8"/>
  <path d="M ${labelX} ${dimTopY} l 8 -5 M ${labelX} ${dimTopY} l 8 5" fill="none" stroke="#0f172a" stroke-width="1.8"/>
  <path d="M ${labelRight} ${dimTopY} l -8 -5 M ${labelRight} ${dimTopY} l -8 5" fill="none" stroke="#0f172a" stroke-width="1.8"/>
  <line x1="${labelX}" y1="${dimTopY + 6}" x2="${labelX}" y2="${labelY - 4}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3"/>
  <line x1="${labelRight}" y1="${dimTopY + 6}" x2="${labelRight}" y2="${labelY - 4}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3"/>
  ${
    isContinuous
      ? ""
      : `<line x1="${dimRightX}" y1="${labelY}" x2="${dimRightX}" y2="${labelBottom}" stroke="#0f172a" stroke-width="1.8"/>
  <path d="M ${dimRightX} ${labelY} l -5 8 M ${dimRightX} ${labelY} l 5 8" fill="none" stroke="#0f172a" stroke-width="1.8"/>
  <path d="M ${dimRightX} ${labelBottom} l -5 -8 M ${dimRightX} ${labelBottom} l 5 -8" fill="none" stroke="#0f172a" stroke-width="1.8"/>
  <line x1="${labelRight + 4}" y1="${labelY}" x2="${dimRightX - 6}" y2="${labelY}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3"/>
  <line x1="${labelRight + 4}" y1="${labelBottom}" x2="${dimRightX - 6}" y2="${labelBottom}" stroke="#334155" stroke-width="1.1" stroke-dasharray="4 3"/>`
  }
  <text x="${widthTextX}" y="${dimTopY - 8}" text-anchor="middle" font-size="16" font-family="Arial,Helvetica,sans-serif" fill="#0f172a" font-weight="700">${data.labelWidthMm} mm</text>
  ${
    isContinuous
      ? ""
      : `<text x="${heightTextX}" y="${heightTextY}" text-anchor="middle" dominant-baseline="middle" font-size="16" font-family="Arial,Helvetica,sans-serif" fill="#0f172a" font-weight="700" transform="rotate(90 ${heightTextX} ${heightTextY})">${data.labelHeightMm} mm</text>`
  }
  <text x="${widthTextX}" y="${linerY + 18}" text-anchor="middle" font-size="9" font-family="Arial,Helvetica,sans-serif" fill="#64748b" font-weight="700" letter-spacing="0.08em">SORTIDA</text>
  <path d="M ${widthTextX} ${linerY + 22} v 10" stroke="#64748b" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M ${widthTextX} ${linerY + 36} l -4 -5 h 8 z" fill="#64748b"/>
</svg>`;

  const coreLabel = data.rollCoreLabel ?? `${data.rollCoreMm} mm`;
  const rollSvg = generateRollPreviewSvg(data);

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
