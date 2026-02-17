"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { defaultWizardValues, wizardSchema, WizardValues } from "@/lib/schemas/wizard";
import { StepContact } from "./steps/StepContact";
import { StepPrinter } from "./steps/StepPrinter";
import { StepDimensions } from "./steps/StepDimensions";
import { StepMaterial } from "./steps/StepMaterial";
import { LabelPreviewSvg } from "@/components/preview/LabelPreviewSvg";

const stepFields: Array<(keyof WizardValues)[]> = [
  ["company", "contactName", "email", "phone"],
  ["printerType", "printTechnology", "ribbonType"],
  ["labelWidthMm", "labelHeightMm", "rollCoreMm", "gapMm"],
  ["labelUse", "adhesive", "finish", "hasBlackMark", "blackMarkPosition", "quantity"]
];

export function LabelWizard() {
  const [step, setStep] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors }
  } = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: defaultWizardValues,
    mode: "onTouched"
  });

  const values = watch();
  const totalSteps = 4;

  useEffect(() => {
    // Manté estat coherent: sense marca negra => posició "none".
    if (!values.hasBlackMark && values.blackMarkPosition !== "none") {
      setValue("blackMarkPosition", "none");
    }
  }, [setValue, values.blackMarkPosition, values.hasBlackMark]);

  useEffect(() => {
    // Manté estat coherent: tèrmica directa => sense ribbon.
    if (values.printTechnology === "direct-thermal" && values.ribbonType !== "none") {
      setValue("ribbonType", "none");
    }
  }, [setValue, values.printTechnology, values.ribbonType]);

  const stepTitle = useMemo(
    () =>
      [
        "Dades de contacte",
        "Impressora i tecnologia",
        "Mides i bobina",
        "Material i condicions"
      ][step],
    [step]
  );

  const goNext = async () => {
    const isValid = await trigger(stepFields[step]);
    if (!isValid) return;
    setStep((current) => Math.min(current + 1, totalSteps - 1));
  };

  const goPrev = () => setStep((current) => Math.max(current - 1, 0));

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
          Hem enviat un correu de confirmació al client i una notificació interna
          a secretaria.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            Pas {step + 1} de {totalSteps}
          </p>
          <p className="text-sm text-slate-500">{stepTitle}</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#1C323B] transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            {step === 0 && <StepContact register={register} errors={errors} />}
            {step === 1 && (
              <StepPrinter register={register} errors={errors} watch={watch} />
            )}
            {step === 2 && <StepDimensions register={register} errors={errors} />}
            {step === 3 && (
              <StepMaterial register={register} errors={errors} watch={watch} />
            )}
          </motion.div>
        </AnimatePresence>

        {sendError && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {sendError}
          </p>
        )}

        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={goPrev}
              className="rounded-xl border border-[#d1dde0] px-4 py-2 text-sm font-medium text-[#1C323B] hover:bg-[#edf2f3]"
            >
              Enrere
            </button>
          )}
          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-xl bg-[#1C323B] px-4 py-2 text-sm font-medium text-white hover:bg-[#15262d]"
            >
              Seguent
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSending}
              className="rounded-xl bg-[#1C323B] px-4 py-2 text-sm font-medium text-white hover:bg-[#15262d] disabled:opacity-70"
            >
              {isSending ? "Enviant..." : "Enviar sol.licitud"}
            </button>
          )}
        </div>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6 lg:h-fit">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Vista prèvia de l&apos;etiqueta
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Es recalcula automàticament segons les opcions seleccionades.
        </p>
        <div className="mt-4">
          <LabelPreviewSvg
            values={{
              labelWidthMm: values.labelWidthMm,
              labelHeightMm: values.labelHeightMm,
              gapMm: values.gapMm,
              hasBlackMark: values.hasBlackMark,
              blackMarkPosition: values.blackMarkPosition,
              rollCoreMm: values.rollCoreMm
            }}
          />
        </div>
      </aside>
    </form>
  );
}
