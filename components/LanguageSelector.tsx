"use client";

import { useRouter } from "next/navigation";
import { LOCALES, Locale } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/lib/i18n/I18nProvider";

const SHORT_LABEL: Record<Locale, string> = { ca: "CA", es: "ES" };
// Route for each locale: Catalan is the root, Spanish lives at /es.
const LOCALE_PATH: Record<Locale, string> = { ca: "/", es: "/es" };

export function LanguageSelector() {
  const { locale, t } = useI18n();
  const router = useRouter();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-0.5"
      role="group"
      aria-label={t.languageSelector.label}
    >
      {LOCALES.map((code) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => router.push(LOCALE_PATH[code])}
            aria-pressed={isActive}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              isActive
                ? "bg-[var(--sie-primary)] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {SHORT_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
