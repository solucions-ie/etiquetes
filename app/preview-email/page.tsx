// Pàgina temporal per previsualitzar l'email — eliminar abans de publicar
import { generatePreviewHtml } from "./generate";

export default function PreviewEmailPage() {
  const html = generatePreviewHtml();
  return (
    <div
      style={{ background: "#f1f5f9", minHeight: "100vh" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
