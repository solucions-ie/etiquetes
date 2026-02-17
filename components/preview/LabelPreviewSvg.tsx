"use client";

import { WizardValues } from "@/lib/schemas/wizard";

type LabelPreviewSvgProps = {
  values: Pick<
    WizardValues,
    | "labelWidthMm"
    | "labelHeightMm"
    | "gapMm"
    | "hasBlackMark"
    | "blackMarkPosition"
    | "rollCoreMm"
  >;
};

export function LabelPreviewSvg({ values }: LabelPreviewSvgProps) {
  const width = Math.max(120, values.labelWidthMm * 3);
  const height = Math.max(80, values.labelHeightMm * 2.2);
  const gap = Math.min(50, Math.max(4, values.gapMm * 4));
  const totalHeight = height + gap + 60;

  const blackMarkY =
    values.blackMarkPosition === "front"
      ? height - 14
      : values.blackMarkPosition === "back"
        ? 10
        : -999;

  return (
    <svg
      className="h-auto w-full rounded-2xl border border-slate-200 bg-slate-50"
      viewBox={`0 0 ${width + 80} ${totalHeight}`}
      role="img"
      aria-label="Previsualització de l'etiqueta"
    >
      {/* Canuto: cercle inferior per representar el nucli de la bobina */}
      <circle
        cx={50}
        cy={totalHeight - 30}
        r={Number(values.rollCoreMm) / 2}
        fill="#cbd5e1"
        stroke="#64748b"
        strokeWidth="2"
      />

      {/* Etiqueta actual */}
      <rect
        x={60}
        y={20}
        width={width}
        height={height}
        rx={8}
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Gap entre etiquetes */}
      <rect
        x={60}
        y={20 + height}
        width={width}
        height={gap}
        fill="#dbeafe"
        opacity="0.8"
      />

      {/* Següent etiqueta per entendre continuïtat de la bobina */}
      <rect
        x={60}
        y={20 + height + gap}
        width={width}
        height={40}
        rx={8}
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeDasharray="6 4"
      />

      {values.hasBlackMark && values.blackMarkPosition !== "none" && (
        <rect
          x={90}
          y={20 + blackMarkY}
          width={Math.max(40, width * 0.32)}
          height={8}
          rx={3}
          fill="#0f172a"
        />
      )}

      <text x={70} y={44} fontSize="12" fill="#475569">
        {values.labelWidthMm} x {values.labelHeightMm} mm
      </text>
      <text x={70} y={60} fontSize="11" fill="#64748b">
        Gap: {values.gapMm} mm | Canuto: {values.rollCoreMm} mm
      </text>
    </svg>
  );
}
