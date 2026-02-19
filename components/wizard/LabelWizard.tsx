"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultWizardValues, wizardSchema, WizardValues } from "@/lib/schemas/wizard";
import { StepContact } from "./steps/StepContact";
import { StepPrinter } from "./steps/StepPrinter";
import { StepDimensions } from "./steps/StepDimensions";
import { StepMaterial } from "./steps/StepMaterial";
import { WizardStagePreview } from "@/components/preview/WizardStagePreview";

const printerMaxWidthMm: Record<WizardValues["printerType"], number> = {
  desktop: 114,
  industrial: 180
};

export function LabelWizard() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

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
    const defaultWidth = printerMaxWidthMm[values.printerType];
    setValue("labelWidthMm", defaultWidth, { shouldValidate: true });
    setValue("labelHeightMm", 50, { shouldValidate: true });
  }, [setValue, values.printerType]);

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
        throw new Error("No s'han pogut enviar els correus.");
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
      <div className="rounded-2xl border border-[#d1dde0] bg-[#edf2f3] p-5">
        <h2 className="text-lg font-semibold text-[#1C323B]">
          Sol.licitud enviada correctament
        </h2>
        <p className="mt-2 text-sm text-[#1C323B]">
          Hem enviat un correu de confirmacio al client i una notificacio interna a secretaria.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
            1. Material de l'etiqueta
          </h2>
          <StepMaterial register={register} errors={errors} watch={watch} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
            2. Impressora i tecnologia
          </h2>
          <StepPrinter register={register} errors={errors} watch={watch} />
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
            className="rounded-xl bg-[#1C323B] px-4 py-2 text-sm font-medium text-white hover:bg-[#15262d] disabled:opacity-70"
          >
            {isSending ? "Enviant..." : "Enviar sol.licitud"}
          </button>
        </div>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6 lg:h-fit">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Vista previa de l'etiqueta
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Es recalcula automaticament segons les opcions seleccionades.
        </p>
        <div className="mt-4">
          <WizardStagePreview
            register={register}
            errors={errors}
            values={{
              printerType: values.printerType,
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
              rollCoreMm: values.rollCoreMm,
              rollOuterDiameterMm: values.rollOuterDiameterMm,
              adhesive: values.adhesive,
              quantity: values.quantity
            }}
          />
        </div>
        <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
            Mides de la bobina
          </h4>
          <StepDimensions
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </section>
      </aside>
    </form>
  );
}
