"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildWizardSchema, defaultWizardValues, WizardValues } from "@/lib/schemas/wizard";
import { VALIDATION_MESSAGES } from "@/lib/i18n/validation";
import { parseLabelCode } from "@/lib/labelCode";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { StepContact } from "./steps/StepContact";
import { StepPrinter } from "./steps/StepPrinter";
import { StepDimensions } from "./steps/StepDimensions";
import { StepMaterial } from "./steps/StepMaterial";
import { WizardStagePreview } from "@/components/preview/WizardStagePreview";

const printerMaxWidthMm: Record<WizardValues["printerType"], number> = {
  desktop: 112,
  portable: 112,
  industrial: 214
};

const printerWidthClassMaxMm: Record<Exclude<WizardValues["printerWidthClass"], "">, number> = {
  "2": 58,
  "3": 76,
  "4": 112,
  "6": 168,
  "8": 214
};

const printerWidthClasses: Record<
  WizardValues["printerType"],
  Array<WizardValues["printerWidthClass"]>
> = {
  desktop: ["2", "3", "4"],
  portable: ["2", "3", "4"],
  industrial: ["4", "6", "8"]
};

export function LabelWizard() {
  const { t, locale } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeMessage, setCodeMessage] = useState<"ok" | "error" | null>(null);

  // Keep the latest locale messages in a ref so a single stable resolver can
  // validate with the current language without re-initialising the form.
  const messagesRef = useRef(VALIDATION_MESSAGES[locale]);
  messagesRef.current = VALIDATION_MESSAGES[locale];
  const resolver = useMemo<Resolver<WizardValues>>(
    () => (values, context, options) =>
      zodResolver(buildWizardSchema(messagesRef.current))(values, context, options),
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<WizardValues>({
    resolver,
    defaultValues: defaultWizardValues,
    mode: "onTouched"
  });

  const values = watch();

  useEffect(() => {
    if (!values.hasBlackMark && values.blackMarkPosition !== "none") {
      setValue("blackMarkPosition", "none");
    }
  }, [setValue, values.blackMarkPosition, values.hasBlackMark]);

  useEffect(() => {
    if (!values.hasBackgroundColor && values.backgroundColorHex !== "#FFFFFF") {
      setValue("backgroundColorHex", "#FFFFFF");
    }
  }, [setValue, values.hasBackgroundColor, values.backgroundColorHex]);

  useEffect(() => {
    if (values.labelFlowType === "gap") {
      if (values.hasBlackMark) setValue("hasBlackMark", false);
      if (values.blackMarkPosition !== "none") setValue("blackMarkPosition", "none");
      if (values.gapMm <= 0) setValue("gapMm", 2);
    }

    if (values.labelFlowType === "black-mark") {
      if (!values.hasBlackMark) setValue("hasBlackMark", true);
      if (values.blackMarkPosition === "none") setValue("blackMarkPosition", "back");
      if (values.gapMm !== 0) setValue("gapMm", 0);
    }

    if (values.labelFlowType === "continuous") {
      if (values.hasBlackMark) setValue("hasBlackMark", false);
      if (values.blackMarkPosition !== "none") setValue("blackMarkPosition", "none");
      if (values.gapMm !== 0) setValue("gapMm", 0);
      if (values.hasCut) setValue("hasCut", false);
      if (values.cutType !== "none") setValue("cutType", "none");
    }
  }, [
    setValue,
    values.labelFlowType,
    values.hasBlackMark,
    values.blackMarkPosition,
    values.gapMm,
    values.hasCut,
    values.cutType
  ]);

  useEffect(() => {
    if (values.hasCut && values.cutType === "none" && values.labelFlowType !== "continuous") {
      setValue("cutType", "trepat");
      return;
    }

    if (!values.hasCut && values.cutType !== "none") {
      setValue("cutType", "none");
    }
  }, [setValue, values.hasCut, values.cutType, values.labelFlowType]);

  useEffect(() => {
    if (
      values.printerWidthClass &&
      !printerWidthClasses[values.printerType].includes(values.printerWidthClass)
    ) {
      setValue("printerWidthClass", "", { shouldValidate: true });
    }

  }, [setValue, values.printerType, values.printerWidthClass]);

  useEffect(() => {
    if (values.printMode === "blank" && values.colorCount !== "0") {
      setValue("colorCount", "0");
    }
  }, [setValue, values.printMode, values.colorCount]);

  const handleApplyCode = () => {
    const parsed = parseLabelCode(codeInput);
    if (!parsed) {
      setCodeMessage("error");
      return;
    }

    setValue("materialType", parsed.materialType, { shouldValidate: true, shouldTouch: true });
    setValue("printMode", parsed.colorCount === "0" ? "blank" : "preprinted");
    setValue("colorCount", parsed.colorCount, { shouldValidate: true });
    setValue("rollCoreMm", parsed.rollCoreMm, { shouldValidate: true });
    setValue("rollOuterDiameterMm", parsed.rollOuterDiameterMm, { shouldValidate: true });
    setValue("labelWidthMm", parsed.labelWidthMm, { shouldValidate: true });

    if (parsed.isContinuous) {
      setValue("labelFlowType", "continuous", { shouldValidate: true });
    } else {
      if (values.labelFlowType === "continuous") {
        setValue("labelFlowType", "gap", { shouldValidate: true });
      }
      setValue("labelHeightMm", parsed.labelHeightMm, { shouldValidate: true });
    }

    setCodeMessage("ok");
  };

  const onSubmit = async (formData: WizardValues) => {
    setSendError(null);
    setIsSending(true);
    try {
      if (fileError) { setIsSending(false); return; }
      const payload = new FormData();
      payload.append("data", JSON.stringify({ ...formData, locale }));
      files.forEach((file) => payload.append("files", file));
      const response = await fetch("/api/send", {
        method: "POST",
        body: payload
      });

      if (!response.ok) {
        let apiError = t.errors.sendFailed;
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload?.error) apiError = payload.error;
        } catch {
          // Ignore parse errors and keep generic message.
        }
        throw new Error(apiError);
      }
      setSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : t.errors.unexpected);
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-[var(--sie-primary-border)] bg-[var(--sie-primary-softer)] p-5">
        <h2 className="text-lg font-semibold text-[var(--sie-primary)]">{t.sent.title}</h2>
        <p className="mt-2 text-sm text-[var(--sie-ink)]">{t.sent.body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <details className="rounded-xl border border-[var(--sie-primary-border)] bg-[var(--sie-primary-softer)] p-3">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--sie-primary)]">
          {t.codeCard.heading}
        </summary>
        <p className="mb-3 text-xs text-slate-600">{t.codeCard.help}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={codeInput}
            onChange={(event) => {
              setCodeInput(event.target.value);
              if (codeMessage) setCodeMessage(null);
            }}
            placeholder={t.codeCard.placeholder}
            className="field-input font-mono uppercase sm:flex-1"
          />
          <button
            type="button"
            onClick={handleApplyCode}
            className="rounded-xl bg-[var(--sie-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--sie-primary-dark)]"
          >
            {t.codeCard.apply}
          </button>
        </div>
        {codeMessage && (
          <p
            className={`mt-2 text-xs ${
              codeMessage === "ok" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {codeMessage === "ok" ? t.codeCard.ok : t.codeCard.error}
          </p>
        )}
      </details>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
          {t.sections.material}
        </h2>
        <StepMaterial register={register} errors={errors} watch={watch} setValue={setValue} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
          {t.sections.config}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.sections.configLead2}</p>
        <div className="mt-3 grid gap-3">
          <div>
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3">
              <WizardStagePreview
                register={register}
                setValue={setValue}
                errors={errors}
                values={{
                  printerType: values.printerType,
                  printerWidthClass: values.printerWidthClass,
                  labelFlowType: values.labelFlowType,
                  hasCut: values.hasCut,
                  cutType: values.cutType,
                  labelWidthMm: values.labelWidthMm,
                  labelHeightMm: values.labelHeightMm,
                  gapMm: values.gapMm,
                  hasBlackMark: values.hasBlackMark,
                  blackMarkPosition: values.blackMarkPosition,
                  hasBackgroundColor: values.hasBackgroundColor,
                  backgroundColorHex: values.backgroundColorHex,
                  rollCoreMm: values.rollCoreMm,
                  rollOuterDiameterMm: values.rollOuterDiameterMm,
                  adhesive: values.adhesive,
                  quantity: values.quantity
                }}
              />
            </div>
          </div>

          <details className="rounded-xl border border-slate-200 bg-white p-3" open={!!errors.printerType || !!errors.printerWidthClass || !!errors.rollCoreMm || !!errors.rollOuterDiameterMm}>
            <summary className="cursor-pointer text-sm font-semibold text-[var(--sie-primary)]">{locale === "es" ? "Impresora y bobinado · opciones técnicas" : "Impressora i bobinat · opcions tècniques"}</summary>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
            <StepPrinter register={register} setValue={setValue} errors={errors} watch={watch} />
            <StepDimensions
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              compact
            />
            </div>
          </details>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
          {t.sections.contact}
        </h2>
        <StepContact register={register} errors={errors} />
        <details className="mt-3 rounded-lg border border-slate-200 bg-white p-3" open={!!fileError}>
          <summary className="cursor-pointer text-sm font-medium">{locale === "es" ? "Adjuntar fotos, muestra o diseño (opcional)" : "Adjuntar fotos, mostra o disseny (opcional)"}{files.length ? ` · ${files.length}` : ""}</summary>
          <div className="mt-2 space-y-2">
          <label htmlFor="quote-files" className="field-label">{locale === "es" ? "Fotos, muestra o diseño (opcional)" : "Fotos, mostra o disseny (opcional)"}</label>
          <input id="quote-files" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple className="field-input" onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
            const invalid = selected.length > 3 || selected.reduce((sum, file) => sum + file.size, 0) > 3 * 1024 * 1024 || selected.some((file) => !allowed.includes(file.type) || file.size === 0);
            setFiles(invalid ? [] : selected);
            setFileError(invalid ? (locale === "es" ? "Adjunta hasta 3 archivos JPG, PNG, WebP o PDF, con un máximo de 3 MB en total." : "Adjunta fins a 3 fitxers JPG, PNG, WebP o PDF, amb un màxim de 3 MB en total.") : null);
            if (invalid) event.target.value = "";
          }} />
          <p className="text-xs text-slate-600">{locale === "es" ? "Hasta 3 archivos JPG, PNG, WebP o PDF. Máximo 3 MB en total. Se enviarán a S-IE con tu solicitud." : "Fins a 3 fitxers JPG, PNG, WebP o PDF. Màxim 3 MB en total. S’enviaran a S-IE amb la sol·licitud."}</p>
          {files.length > 0 && <p className="text-sm">{files.map((file) => file.name).join(", ")}</p>}
          {fileError && <p role="alert" className="field-error">{fileError}</p>}
          </div>
        </details>
      </section>

      {sendError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {sendError}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSending || !!fileError}
          className="rounded-xl bg-[var(--sie-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--sie-primary-dark)] disabled:opacity-70"
        >
          {isSending ? t.actions.submitting : t.actions.submit}
        </button>
      </div>
    </form>
  );
}
