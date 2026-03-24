import { generateTechnicalSheetHtml } from "./generate";

export default function PreviewTechnicalSheetPage() {
  const html = generateTechnicalSheetHtml();

  return (
    <div
      style={{ background: "#f1f5f9", minHeight: "100vh" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
