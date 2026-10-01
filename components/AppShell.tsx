"use client";

import { LabelWizard } from "@/components/wizard/LabelWizard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Locale } from "@/lib/i18n/dictionaries";
import { I18nProvider, useI18n } from "@/lib/i18n/I18nProvider";

function Header() {
  const { t } = useI18n();
  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <img
          src="/logo-sie.png"
          alt="Logo S-IE"
          className="h-14 w-auto rounded-md bg-[#8a1c22] p-1"
        />
        <LanguageSelector />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#8a1c22]">
        etiquetes.s-ie.cat
      </p>
      <h1 className="mt-2 text-2xl font-bold text-ink md:text-3xl">{t.page.title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">{t.page.subtitle}</p>
    </>
  );
}

export function AppShell({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <main className="flex min-h-screen items-center bg-gradient-to-b from-[#f8ecec] via-[#f5f1ef] to-[#e8e1de] px-6 py-10 md:px-10">
        <div className="mx-auto w-full max-w-[1320px]">
          <section className="wizard-card">
            <Header />
            <div className="mt-8">
              <LabelWizard />
            </div>
          </section>
        </div>
      </main>
    </I18nProvider>
  );
}
