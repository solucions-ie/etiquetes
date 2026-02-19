"use client";

import { useEffect, useRef } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
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
  | "quantity"
>;

type WizardStagePreviewProps = {
  values: PreviewValues;
  register: UseFormRegister<WizardValues>;
  errors: FieldErrors<WizardValues>;
};

const printerLabelMap: Record<WizardValues["printerType"], string> = {
  desktop: "Sobretaula",
  industrial: "Industrial"
};

const printerMaxWidthMm: Record<WizardValues["printerType"], number> = {
  desktop: 114,
  industrial: 180
};

function PrinterMaxInfo({ values }: { values: PreviewValues }) {
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
        Impressora: {printerLabelMap[values.printerType]} | Amplada maxima orientativa {maxWidth} mm
      </p>
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

function SupportLabelPreview({ values }: { values: PreviewValues }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
  }, [values.labelFlowType, values.labelWidthMm, values.labelHeightMm]);

  const centerX = 280;
  const printerTop = 92;
  const supportY = printerTop + 26;
  const outputSlotW = 168;
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
  const maxH = 182;
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
      className="overflow-auto rounded-xl border border-slate-200 bg-slate-50"
    >
      <svg
        className="mx-auto block h-auto w-full"
        viewBox="30 40 500 430"
        role="img"
        aria-label="Vista prèvia de paper suport amb etiquetes verticals"
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
                      y1={label1Y + labelH + Math.max(4, gapPx * 0.4) + 4}
                      x2={labelX + labelW}
                      y2={label1Y + labelH + Math.max(4, gapPx * 0.4) + 4}
                      stroke="#ffffff"
                      strokeWidth="1.4"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1={labelX}
                      y1={label2Y + labelH + Math.max(4, gapPx * 0.4) + 4}
                      x2={labelX + labelW}
                      y2={label2Y + labelH + Math.max(4, gapPx * 0.4) + 4}
                      stroke="#ffffff"
                      strokeWidth="1.4"
                      strokeDasharray="4 4"
                    />
                  </>
                )}
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

export function WizardStagePreview({ values, register, errors }: WizardStagePreviewProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 p-3">
          <div className="grid gap-2 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                Amplada
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                type="number"
                min={15}
                {...register("labelWidthMm", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                Alcada
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                type="number"
                min={10}
                disabled={values.labelFlowType === "continuous"}
                {...register("labelHeightMm", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                Tecnologia
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                {...register("printTechnology")}
              >
                <option value="direct-thermal">Tèrmica directa</option>
                <option value="thermal-transfer">Transferencia</option>
              </select>
            </div>
          </div>

          {(errors.labelWidthMm || errors.labelHeightMm || errors.ribbonType) && (
            <div className="mt-2 space-y-1 text-xs text-red-600">
              {errors.labelWidthMm && <p>{errors.labelWidthMm.message as string}</p>}
              {errors.labelHeightMm && <p>{errors.labelHeightMm.message as string}</p>}
              {errors.ribbonType && <p>{errors.ribbonType.message as string}</p>}
            </div>
          )}
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_160px]">
          <div className="p-3">
            <SupportLabelPreview values={values} />
          </div>

          <aside className="border-t border-slate-200 bg-slate-50 p-3 md:border-l md:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              Avanc (lateral)
            </p>
            <div className="mt-2 space-y-2">
              <label className="block rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <input type="radio" value="gap" className="mr-2" {...register("labelFlowType")} />
                Gap
              </label>
              <label className="block rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <input
                  type="radio"
                  value="black-mark"
                  className="mr-2"
                  {...register("labelFlowType")}
                />
                Marca negra
              </label>
              <label className="block rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <input
                  type="radio"
                  value="continuous"
                  className="mr-2"
                  {...register("labelFlowType")}
                />
                Continu
              </label>
            </div>

            {values.printTechnology === "thermal-transfer" && (
              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  Ribbon
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                  {...register("ribbonType")}
                >
                  <option value="none">Selecciona</option>
                  <option value="cera">Cera</option>
                  <option value="cera-resina">Cera/Resina</option>
                  <option value="resina">Resina</option>
                  <option value="unknown">No ho se</option>
                </select>
              </div>
            )}

            {values.labelFlowType !== "continuous" && (
              <label className="mt-3 block text-xs text-slate-700">
                <input type="checkbox" className="mr-2" {...register("hasCut")} />
                Tall trepat
              </label>
            )}
          </aside>
        </div>
      </div>

      <PrinterMaxInfo values={values} />
    </div>
  );
}
