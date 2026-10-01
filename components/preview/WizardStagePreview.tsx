"use client";

import { ChangeEvent, useEffect, useRef } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { WizardValues } from "@/lib/schemas/wizard";
import { useI18n } from "@/lib/i18n/I18nProvider";

type PreviewValues = Pick<
  WizardValues,
  | "printerType"
  | "printerWidthClass"
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
  | "hasBackgroundColor"
  | "backgroundColorHex"
  | "adhesive"
  | "quantity"
>;

type WizardStagePreviewProps = {
  values: PreviewValues;
  register: UseFormRegister<WizardValues>;
  setValue: UseFormSetValue<WizardValues>;
  errors: FieldErrors<WizardValues>;
};

const printerLabelMap: Record<WizardValues["printerType"], string> = {
  desktop: "Sobretaula",
  portable: "Portatil",
  industrial: "Industrial"
};

const printerMaxWidthMm: Record<WizardValues["printerType"], number> = {
  desktop: 112,
  portable: 112,
  industrial: 214
};

const printerWidthClassMm: Record<Exclude<WizardValues["printerWidthClass"], "">, number> = {
  "2": 58,
  "3": 76,
  "4": 112,
  "6": 168,
  "8": 214
};

const printerHeadConfig: Record<
  WizardValues["printerType"],
  { headWidth: number; slotWidth: number; headX: number }
> = {
  portable: { headWidth: 156, slotWidth: 124, headX: 202 },
  desktop: { headWidth: 200, slotWidth: 168, headX: 180 },
  industrial: { headWidth: 250, slotWidth: 214, headX: 155 }
};

function PrinterMaxInfo({ values }: { values: PreviewValues }) {
  const { t } = useI18n();
  const maxWidth = printerMaxWidthMm[values.printerType];
  const selectedWidthLimit = values.printerWidthClass
    ? printerWidthClassMm[values.printerWidthClass]
    : null;
  const exceedsSelectedWidth = selectedWidthLimit
    ? values.labelWidthMm > selectedWidthLimit
    : false;
  const exceedsFamilyMax = values.labelWidthMm > maxWidth;

  if (!exceedsSelectedWidth && !exceedsFamilyMax) {
    return null;
  }

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
      {selectedWidthLimit ? (
        <p className="font-semibold">
          {t.preview.widthClassInfo(values.printerWidthClass, selectedWidthLimit)}
        </p>
      ) : (
        <p className="font-semibold">{t.preview.familyMaxInfo(maxWidth)}</p>
      )}
    </div>
  );
}

function SupportLabelPreview({ values }: { values: PreviewValues }) {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
  }, [values.labelFlowType, values.labelWidthMm, values.labelHeightMm]);

  const centerX = 280;
  const printerTop = 92;
  const supportY = printerTop + 26;
  const headConfig = printerHeadConfig[values.printerType];
  const outputSlotW = headConfig.slotWidth;
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
  const labelFill = values.hasBackgroundColor ? values.backgroundColorHex : "url(#labelFace)";

  return (
    <div
      ref={scrollerRef}
      className="overflow-auto rounded-xl border border-slate-200 bg-slate-50"
    >
      <svg
        className="mx-auto block h-auto w-full max-w-[390px]"
        viewBox="30 40 500 430"
        role="img"
        aria-label={t.preview.aria}
      >
        <defs>
          <linearGradient id="labelFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
        </defs>

        <rect
          x={headConfig.headX}
          y={printerTop}
          width={headConfig.headWidth}
          height="22"
          rx="6"
          fill="#334155"
        />
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
                fill={labelFill}
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
              fill={labelFill}
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

export function WizardStagePreview({
  values,
  register,
  setValue,
  errors
}: WizardStagePreviewProps) {
  const { t } = useI18n();
  const handleBackgroundColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue("backgroundColorHex", event.target.value.toUpperCase(), {
      shouldValidate: true,
      shouldTouch: true
    });
  };

  const handleBackgroundToggle = (enabled: boolean) => {
    setValue("hasBackgroundColor", enabled, {
      shouldValidate: true,
      shouldTouch: true
    });
    if (!enabled) {
      setValue("backgroundColorHex", "#FFFFFF", {
        shouldValidate: true,
        shouldTouch: true
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 p-3">
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {t.preview.widthMm}
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                type="number"
                min={15}
                max={
                  values.printerWidthClass
                    ? printerWidthClassMm[values.printerWidthClass]
                    : printerMaxWidthMm[values.printerType]
                }
                {...register("labelWidthMm", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {t.preview.advanceMm}
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                type="number"
                min={10}
                disabled={values.labelFlowType === "continuous"}
                {...register("labelHeightMm", { valueAsNumber: true })}
              />
            </div>
          </div>

          {(errors.labelWidthMm || errors.labelHeightMm) && (
            <div className="mt-2 space-y-1 text-xs text-red-600">
              {errors.labelWidthMm && <p>{errors.labelWidthMm.message as string}</p>}
              {errors.labelHeightMm && <p>{errors.labelHeightMm.message as string}</p>}
            </div>
          )}
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_150px]">
          <div className="p-3">
            <SupportLabelPreview values={values} />
          </div>

          <aside className="border-t border-slate-200 bg-slate-50 p-3 lg:border-l lg:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {t.preview.advanceLateral}
            </p>
            <div className="mt-2 space-y-2">
              <label className="block rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <input type="radio" value="gap" className="mr-2" {...register("labelFlowType")} />
                {t.preview.flowGap}
              </label>
              <label className="block rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <input
                  type="radio"
                  value="black-mark"
                  className="mr-2"
                  {...register("labelFlowType")}
                />
                {t.preview.flowBlackMark}
              </label>
              <label className="block rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <input
                  type="radio"
                  value="continuous"
                  className="mr-2"
                  {...register("labelFlowType")}
                />
                {t.preview.flowContinuous}
              </label>
            </div>

            {values.labelFlowType !== "continuous" && (
              <label className="mt-3 block text-xs text-slate-700">
                <input type="checkbox" className="mr-2" {...register("hasCut")} />
                {t.preview.cutCheckbox}
              </label>
            )}
          </aside>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {t.preview.backgroundTitle}
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <input
              type="radio"
              checked={!values.hasBackgroundColor}
              onChange={() => handleBackgroundToggle(false)}
            />
            {t.preview.backgroundNone}
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <input
              type="radio"
              checked={values.hasBackgroundColor}
              onChange={() => handleBackgroundToggle(true)}
            />
            {t.preview.backgroundWith}
          </label>
        </div>

        {values.hasBackgroundColor && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t.preview.backgroundChosen}
              </label>
              <div className="flex items-center gap-3">
                <input
                  className="h-11 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                  type="color"
                  value={values.backgroundColorHex}
                  onChange={handleBackgroundColorChange}
                />
                <input
                  className="field-input"
                  value={values.backgroundColorHex}
                  onChange={handleBackgroundColorChange}
                />
              </div>
              {errors.backgroundColorHex && (
                <p className="field-error">{errors.backgroundColorHex.message as string}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t.preview.backgroundNotesLabel}
              </label>
              <input
                className="field-input"
                placeholder={t.preview.backgroundNotesPlaceholder}
                {...register("backgroundColorNotes")}
              />
            </div>
          </div>
        )}
      </div>

      {!errors.labelWidthMm && <PrinterMaxInfo values={values} />}
    </div>
  );
}
