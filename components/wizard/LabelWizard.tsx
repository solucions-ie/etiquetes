"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultWizardValues, wizardSchema, WizardValues } from "@/lib/schemas/wizard";
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
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const previousPrinterType = useRef<WizardValues["printerType"] | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
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
    if (values.printTechnology === "direct-thermal" && values.ribbonType !== "none") {
      setValue("ribbonType", "none");
    }
  }, [setValue, values.printTechnology, values.ribbonType]);

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
    if (previousPrinterType.current && previousPrinterType.current !== values.printerType) {
      setValue("printerWidthClass", "", { shouldValidate: true });
    } else if (
      values.printerWidthClass &&
      !printerWidthClasses[values.printerType].includes(values.printerWidthClass)
    ) {
      setValue("printerWidthClass", "", { shouldValidate: true });
    }

    previousPrinterType.current = values.printerType;
  }, [setValue, values.printerType, values.printerWidthClass]);

  useEffect(() => {
    const selectedMaxWidth = values.printerWidthClass
      ? printerWidthClassMaxMm[values.printerWidthClass]
      : printerMaxWidthMm[values.printerType];

    setValue("labelWidthMm", selectedMaxWidth, { shouldValidate: true });
    setValue("labelHeightMm", 50, { shouldValidate: true });
  }, [setValue, values.printerType, values.printerWidthClass]);

  const onSubmit = async (formData: WizardValues) => {
    setSendError(null);
    setIsSending(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        let apiError = "No s'han pogut enviar els correus.";
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
      setSendError(
        error instanceof Error ? error.message : "Error inesperat en l'enviament."
      );
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-[var(--sie-primary-border)] bg-[var(--sie-primary-softer)] p-5">
        <h2 className="text-lg font-semibold text-[var(--sie-primary)]">
          Sollicitud enviada correctament
        </h2>
        <p className="mt-2 text-sm text-[var(--sie-ink)]">
          Hem enviat un correu de confirmacio al client i una notificacio interna a secretaria.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
          1. Material de l'etiqueta
        </h2>
        <StepMaterial register={register} errors={errors} watch={watch} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
          2. Configuracio i vista previa
        </h2>
        <p className="text-sm font-medium text-slate-800">Vista previa de l'etiqueta</p>
        <p className="mt-1 text-xs text-slate-500">
          Es recalcula automaticament segons les opcions seleccionades.
        </p>
        <div className="mt-4 grid gap-4 xl:grid-cols-12 xl:items-stretch">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 xl:col-span-2 xl:h-full">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
              Tipus d'impressora
            </h3>
            <StepPrinter register={register} setValue={setValue} errors={errors} watch={watch} />
          </div>

          <div className="xl:col-span-6">
            <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3">
              <WizardStagePreview
                register={register}
                setValue={setValue}
                errors={errors}
                values={{
                  printerType: values.printerType,
                  printerWidthClass: values.printerWidthClass,
                  printTechnology: values.printTechnology,
                  ribbonType: values.ribbonType,
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

          <div className="xl:col-span-4">
            <StepDimensions
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              compact
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
          3. Dades de contacte
        </h2>
        <StepContact register={register} errors={errors} />
      </section>

      {sendError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {sendError}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSending}
          className="rounded-xl bg-[var(--sie-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--sie-primary-dark)] disabled:opacity-70"
        >
          {isSending ? "Enviant..." : "Enviar sollicitud"}
        </button>
      </div>
    </form>
  );
}
