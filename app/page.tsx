import { LabelWizard } from "@/components/wizard/LabelWizard";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center bg-gradient-to-b from-[#f8ecec] via-[#f5f1ef] to-[#e8e1de] px-6 py-10 md:px-10">
      <div className="mx-auto w-full max-w-[1320px]">
        <section className="wizard-card">
          <div className="mb-5">
            <img
              src="/logo-sie.png"
              alt="Logo S-IE"
              className="h-14 w-auto rounded-md bg-[#8a1c22] p-1"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a1c22]">
            etiquetes.s-ie.cat
          </p>
          <h1 className="mt-2 text-2xl font-bold text-ink md:text-3xl">
            Formulari d&apos;identificació d&apos;etiquetes
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Completa el formulari i t&apos;ajudarem a definir el format exacte de
            l&apos;etiqueta que necessites.
          </p>
          <div className="mt-8">
            <LabelWizard />
          </div>
        </section>
      </div>
    </main>
  );
}
