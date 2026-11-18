"use client";

import { LabelWizard } from "@/components/wizard/LabelWizard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Locale } from "@/lib/i18n/dictionaries";
import { I18nProvider, useI18n } from "@/lib/i18n/I18nProvider";

function Header() {
  const { t } = useI18n();
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <img
          src="/logo-sie.png"
          alt="Logo S-IE"
          className="h-10 w-auto rounded-md bg-[#8a1c22] p-1"
        />
        <LanguageSelector />
      </div>
      <h1 className="text-2xl font-bold text-ink md:text-3xl">{t.page.title}</h1>
    </>
  );
}

export function AppShell({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <main className="flex min-h-screen items-center bg-gradient-to-b from-[#f8ecec] via-[#f5f1ef] to-[#e8e1de] px-2 py-3 sm:px-5 sm:py-5">
        <div className="mx-auto w-full max-w-[1320px]">
          <section className="wizard-card">
            <Header />
            <div className="mt-4">
              <LabelWizard />
            </div>
          </section>
        </div>
      </main>
    </I18nProvider>
  );
}
