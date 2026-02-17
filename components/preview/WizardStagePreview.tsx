"use client";

import { useEffect, useRef, useState } from "react";
import { WizardValues } from "@/lib/schemas/wizard";

type PreviewValues = Pick<
  WizardValues,
  | "printerType"
  | "printTechnology"
  | "ribbonType"
  | "labelFlowType"
  | "hasCut"
  | "cutType"
  | "labelWidthMm"
  | "labelHeightMm"
  | "rollCoreMm"
  | "rollOuterDiameterMm"
  | "gapMm"
  | "hasBlackMark"
  | "blackMarkPosition"
  | "adhesive"
  | "finish"
  | "quantity"
>;

type WizardStagePreviewProps = {
  step: number;
  values: PreviewValues;
};

const printerLabelMap: Record<WizardValues["printerType"], string> = {
  "portable-small": "Portatils petites",
  portable: "Portatils",
  desktop: "Sobretaula",
  "industrial-mid": "Industrial mig rang",
  "industrial-24-7": "Industrial 24/7",
  "print-engine": "Motors d'impressio"
};

const printerMaxLabelMap: Record<WizardValues["printerType"], string> = {
  "industrial-24-7": '4" = 114 mm; 6" = 180 mm',
  "print-engine": '4" = 114 mm; 6" = 180 mm',
  "industrial-mid": '4" = 114 mm',
  desktop: '2" = 58 mm; 4" = 114 mm',
  portable: '4" = 112 mm',
  "portable-small": '2" = 58 mm; 3" = 80 mm'
};

const printerMaxWidthMm: Record<WizardValues["printerType"], number> = {
  "industrial-24-7": 180,
  "print-engine": 180,
  "industrial-mid": 114,
  desktop: 114,
  portable: 112,
  "portable-small": 80
};

function PrinterMaxInfo({ values }: { values: PreviewValues }) {
  const maxLabel = printerMaxLabelMap[values.printerType];
  const maxWidth = printerMaxWidthMm[values.printerType];
  const exceeds = values.labelWidthMm > maxWidth;

  return (
    <div
      className={`rounded-xl border p-3 text-xs ${
        exceeds
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <p className="font-semibold">
        Amplada maxima orientativa - {printerLabelMap[values.printerType]}
      </p>
      <p className="mt-1">{maxLabel}</p>
      <p className="mt-1">
        Amplada seleccionada: <strong>{values.labelWidthMm} mm</strong>
      </p>
      {exceeds && (
        <p className="mt-1 font-semibold">
          Aquesta amplada supera el maxim recomanat per aquesta impressora.
        </p>
      )}
    </div>
  );
}

function SupportLabelPreview({
  values,
  compact = false,
  zoom = 100
}: {
  values: PreviewValues;
  compact?: boolean;
  zoom?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    if (zoom > 100) {
      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      el.scrollLeft = maxScrollLeft / 2;
      return;
    }

    el.scrollLeft = 0;
  }, [zoom, values.labelFlowType, values.labelWidthMm, values.labelHeightMm]);

  const centerX = 280;
  const printerTop = compact ? 84 : 92;
  const supportY = printerTop + 26;
  const outputSlotW = compact ? 154 : 168;
  const maxLabelWInSlot = outputSlotW - 6;
  const maxWidthForPrinter = printerMaxWidthMm[values.printerType];
  const widthRatio = Math.max(
    0.18,
    Math.min(1, values.labelWidthMm / Math.max(1, maxWidthForPrinter))
  );
  const effectiveHeightMm = values.labelHeightMm;
  const ratio = Math.max(0.2, effectiveHeightMm / Math.max(1, values.labelWidthMm));
  let labelW = maxLabelWInSlot * widthRatio;
  let labelH = labelW * ratio;
  const maxH = compact ? 152 : 182;
  if (labelH > maxH) {
    labelH = maxH;
    labelW = labelH / ratio;
  }

  const gapPx = Math.max(8, Math.min(34, values.gapMm * 2.8));
  const pxPerMm = labelW / Math.max(1, values.labelWidthMm);
  const sideMarginPx = Math.max(3, 2 * pxPerMm);
  const topBottomMarginPx = Math.max(4, sideMarginPx);
  const labelX = centerX - labelW / 2;
  const label1Y = supportY + topBottomMarginPx;
  const label2Y = label1Y + labelH + gapPx;
  const label3Y = label2Y + labelH + gapPx;
  const supportW = labelW + sideMarginPx * 2;
  const supportH = label3Y + labelH - supportY + topBottomMarginPx;
  const flowType = values.labelFlowType;

  return (
    <div
      ref={scrollerRef}
      className="overflow-auto rounded-2xl border border-slate-200 bg-slate-50"
    >
      <svg
        className="mx-auto block h-auto transition-[width] duration-200"
        style={{ width: `${zoom}%` }}
        viewBox="0 0 560 520"
        role="img"
        aria-label="Vista previa de paper suport amb etiquetes verticals"
      >
        <defs>
        <linearGradient id="labelFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        </defs>

      <rect x="180" y={printerTop} width="200" height="22" rx="6" fill="#334155" />
      <rect
        x={centerX - outputSlotW / 2}
        y={printerTop + 6}
        width={outputSlotW}
        height="10"
        rx="4"
        fill="#94a3b8"
      />
      <text x="280" y={printerTop - 8} textAnchor="middle" fontSize="11" fill="#334155">
        Sortida impressora
      </text>

      <rect
        x={centerX - supportW / 2}
        y={supportY}
        width={supportW}
        height={supportH}
        rx="14"
        fill="#e2e8f0"
        stroke="#94a3b8"
      />

      {flowType === "gap" &&
        [label1Y, label2Y, label3Y].map((ly, idx) => (
          <g key={idx}>
            <rect
              x={labelX + 4}
              y={ly + 6}
              width={labelW}
              height={labelH}
              rx="10"
              fill="#d7dee8"
              opacity="0.45"
            />
            <rect
              x={labelX}
              y={ly}
              width={labelW}
              height={labelH}
              rx="10"
              fill="url(#labelFace)"
              stroke="#334155"
              strokeWidth="2"
            />
            <rect
              x={labelX}
              y={ly}
              width={labelW}
              height="12"
              rx="10"
              fill="#ffffff"
              opacity="0.65"
            />
          </g>
        ))}

      {values.hasCut && flowType === "gap" && (
        <>
          <line
            x1={labelX}
            y1={label1Y + labelH + gapPx / 2}
            x2={labelX + labelW}
            y2={label1Y + labelH + gapPx / 2}
            stroke="#334155"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
          <line
            x1={labelX}
            y1={label2Y + labelH + gapPx / 2}
            x2={labelX + labelW}
            y2={label2Y + labelH + gapPx / 2}
            stroke="#334155"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
        </>
      )}

      {(flowType === "continuous" || flowType === "black-mark") && (
        <g>
          <rect
            x={labelX + 4}
            y={label1Y + 6}
            width={labelW}
            height={label3Y + labelH - label1Y}
            rx="10"
            fill="#d7dee8"
            opacity="0.45"
          />
          <rect
            x={labelX}
            y={label1Y}
            width={labelW}
            height={label3Y + labelH - label1Y}
            rx="10"
            fill="url(#labelFace)"
            stroke="#334155"
            strokeWidth="2"
          />
          <rect
            x={labelX}
            y={label1Y}
            width={labelW}
            height="14"
            rx="10"
            fill="#ffffff"
            opacity="0.65"
          />
          {flowType === "black-mark" && (
            <>
              <rect
                x={labelX}
                y={label1Y + labelH + Math.max(4, gapPx * 0.4)}
                width={labelW}
                height="8"
                rx="3"
                fill="#111827"
              />
              <rect
                x={labelX}
                y={label2Y + labelH + Math.max(4, gapPx * 0.4)}
                width={labelW}
                height="8"
                rx="3"
                fill="#111827"
              />
              {values.hasCut && (
                <>
                  <line
                    x1={labelX}
                    y1={label1Y + labelH + Math.max(4, gapPx * 0.4) + 1}
                    x2={labelX + labelW}
                    y2={label1Y + labelH + Math.max(4, gapPx * 0.4) + 1}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={labelX}
                    y1={label2Y + labelH + Math.max(4, gapPx * 0.4) + 1}
                    x2={labelX + labelW}
                    y2={label2Y + labelH + Math.max(4, gapPx * 0.4) + 1}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />
                </>
              )}
            </>
          )}
        </g>
      )}

      {values.hasCut && flowType === "continuous" && (
        <>
          <line
            x1={labelX}
            y1={label1Y + labelH}
            x2={labelX + labelW}
            y2={label1Y + labelH}
            stroke="#334155"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
          <line
            x1={labelX}
            y1={label2Y + labelH}
            x2={labelX + labelW}
            y2={label2Y + labelH}
            stroke="#334155"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
        </>
      )}

      <text x="26" y="28" fontSize="13" fill="#334155">
        Paper suport amb etiquetes en vertical
      </text>
      <text x="26" y="48" fontSize="12" fill="#64748b">
        Amplada {values.labelWidthMm} mm | Alçada {values.labelHeightMm} mm | Tall {values.cutType}
      </text>
      </svg>
    </div>
  );
}

function flowTypeLabel(type: WizardValues["labelFlowType"]) {
  if (type === "gap") return "Gap";
  if (type === "black-mark") return "Marca negra";
  return "Continu";
}

export function WizardStagePreview({ step, values }: WizardStagePreviewProps) {
  const [zoom, setZoom] = useState(100);

  const zoomOut = () => setZoom((current) => Math.max(70, current - 10));
  const zoomIn = () => setZoom((current) => Math.min(170, current + 10));

  if (step === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
          >
            -
          </button>
          <span className="w-12 text-center text-xs font-medium text-slate-600">{zoom}%</span>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
          >
            +
          </button>
        </div>
        <SupportLabelPreview values={values} compact zoom={zoom} />
        <PrinterMaxInfo values={values} />
      </div>
    );
  }

  if (step === 1 || step === 2) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
          >
            -
          </button>
          <span className="w-12 text-center text-xs font-medium text-slate-600">{zoom}%</span>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
          >
            +
          </button>
        </div>
        <SupportLabelPreview values={values} zoom={zoom} />
        <PrinterMaxInfo values={values} />
        {step === 2 && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              Adhesiu: <strong>{values.adhesive}</strong>
            </p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              Acabat: <strong>{values.finish}</strong>
            </p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              Tipus: <strong>{flowTypeLabel(values.labelFlowType)}</strong>
            </p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              Tall: <strong>{values.hasCut ? values.cutType : "Sense tall"}</strong>
            </p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              Quantitat: <strong>{values.quantity}</strong>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={zoomOut}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          -
        </button>
        <span className="w-12 text-center text-xs font-medium text-slate-600">{zoom}%</span>
        <button
          type="button"
          onClick={zoomIn}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          +
        </button>
      </div>
      <SupportLabelPreview values={values} compact zoom={zoom} />
      <PrinterMaxInfo values={values} />
      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Resum final abans d'enviar</p>
        <p>
          Impressora: <strong>{printerLabelMap[values.printerType]}</strong>
        </p>
        <p>
          Tecnologia: <strong>{values.printTechnology}</strong>
        </p>
        <p>
          Ribbon: <strong>{values.ribbonType}</strong>
        </p>
      </div>
    </div>
  );
}
