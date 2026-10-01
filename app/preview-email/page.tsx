// Pàgina temporal per previsualitzar l'email — eliminar abans de publicar
import { generatePreviewHtml } from "./generate";
import { DEFAULT_LOCALE, LOCALES, Locale } from "@/lib/i18n/dictionaries";

export default function PreviewEmailPage({
  searchParams
}: {
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang;
  const locale: Locale =
    lang && (LOCALES as string[]).includes(lang) ? (lang as Locale) : DEFAULT_LOCALE;
  const html = generatePreviewHtml(locale);
  return (
    <div
      style={{ background: "#f1f5f9", minHeight: "100vh" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
