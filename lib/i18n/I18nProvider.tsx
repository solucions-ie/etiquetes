"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  Dictionary,
  LOCALES,
  Locale,
  dictionaries
} from "@/lib/i18n/dictionaries";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "etiquetes-locale";

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as string[]).includes(value);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // On mount, resolve the initial locale: a ?lang= URL param wins (so a link
  // like /?lang=es can be shared with a client), then the saved choice.
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      if (isLocale(fromUrl)) {
        setLocaleState(fromUrl);
        return;
      }
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
    } catch {
      // Ignore storage / URL access errors (private mode, blocked, etc.).
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage access errors.
    }
    // Keep the URL in sync so the current language is always shareable.
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url);
    } catch {
      // Ignore history/URL errors.
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
