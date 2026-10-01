import { generateTechnicalSheetHtml } from "./generate";
import { DEFAULT_LOCALE, LOCALES, Locale } from "@/lib/i18n/dictionaries";

export default function PreviewTechnicalSheetPage({
  searchParams
}: {
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang;
  const locale: Locale =
    lang && (LOCALES as string[]).includes(lang) ? (lang as Locale) : DEFAULT_LOCALE;
  const html = generateTechnicalSheetHtml(locale);

  return (
    <div
      style={{ background: "#f1f5f9", minHeight: "100vh" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
