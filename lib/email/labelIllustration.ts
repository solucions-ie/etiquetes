export type LabelIllustrationData = {
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

function svgTextWidth(text: string, fontSize = 10, weight = 700) {
  const factor = weight >= 700 ? 0.62 : 0.58;
  return Math.ceil(text.length * fontSize * factor);
}

function svgChip(x: number, y: number, label: string, value: string) {
  const text = `${label.toUpperCase()} ${value}`;
  const fontSize = 10;
  const width = svgTextWidth(text, fontSize) + 18;

  return {
    width,
    markup: `<g transform="translate(${x} ${y})">
  <rect width="${width}" height="24" rx="12" fill="#e2e8f0"/>
  <text x="${width / 2}" y="15" text-anchor="middle" font-size="${fontSize}" font-family="Arial,Helvetica,sans-serif" fill="#1e293b" font-weight="700" letter-spacing="0.04em">${escapeHtml(
      text
    )}</text>
</g>`
  };
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

function generateRollPreviewSvgFragment(data: LabelIllustrationData) {
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

  return `<rect x="8" y="24" width="344" height="216" rx="18" fill="#f8fafc"/>
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
  )}</text>`;
}

export function generateLabelIllustrationUnifiedSvg(data: LabelIllustrationData): string {
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
  const labelRight = labelX + labelWidth;
  const labelBottom = labelY + labelHeight;
  const dimTopY = labelY - 10;
  const dimRightX = labelRight + 10;
  const widthTextX = labelX + Math.round(labelWidth / 2);
  const heightTextY = labelY + Math.round(labelHeight / 2);
  const heightTextX = dimRightX + 10;
  const formatInnerWidth = isContinuous ? Math.max(186, labelRight + 24) : Math.max(186, heightTextX + 20);
  const formatInnerHeight = linerY + 36;
  const cardWidth = 388;
  const formatCardHeight = 238;
  const rollCardHeight = 328;
  const totalHeight = formatCardHeight + rollCardHeight + 10;
  const coreLabel = data.rollCoreLabel ?? `${data.rollCoreMm} mm`;
  const widthChip = svgChip(14, 30, "Amplada", `${data.labelWidthMm} mm`);
  const heightChip = isContinuous ? null : svgChip(14 + widthChip.width + 6, 30, "Avanc", `${data.labelHeightMm} mm`);
  const rollChip = svgChip(14, 30, "Diametre", `${data.rollOuterDiameterMm} mm`);
  const coreChip = svgChip(14 + rollChip.width + 6, 30, "Mandril", coreLabel);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardWidth} ${totalHeight}" width="${cardWidth}" height="${totalHeight}">
  <rect width="${cardWidth}" height="${totalHeight}" rx="18" fill="#ffffff"/>

  <g transform="translate(0 0)">
    <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${formatCardHeight - 1}" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="14" y="18" font-size="10" font-family="Arial,Helvetica,sans-serif" fill="#64748b" font-weight="700" letter-spacing="0.1em">FORMAT ETIQUETA</text>
    ${widthChip.markup}
    ${heightChip ? heightChip.markup : ""}
    <g transform="translate(${Math.round((cardWidth - formatInnerWidth) / 2)} 64)">
      <rect x="0" y="0" width="${formatInnerWidth}" height="${formatInnerHeight}" rx="18" fill="#f8fafc"/>
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
    </g>
  </g>

  <g transform="translate(0 ${formatCardHeight + 10})">
    <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${rollCardHeight - 1}" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="14" y="18" font-size="10" font-family="Arial,Helvetica,sans-serif" fill="#64748b" font-weight="700" letter-spacing="0.1em">BOBINA</text>
    ${rollChip.markup}
    ${coreChip.markup}
    <g transform="translate(14 60)">
      ${generateRollPreviewSvgFragment(data)}
    </g>
  </g>
</svg>`;
}

export function generateLabelIllustrationSvg(data: LabelIllustrationData): string {
  const unifiedSvg = generateLabelIllustrationUnifiedSvg(data);
  return `<div style="display:block;width:100%;max-width:388px;margin:0 auto;">${unifiedSvg}</div>`;
}

export function generateLabelIllustrationSvgLegacy(data: LabelIllustrationData): string {
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
