import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistent d'etiquetes | S-IE",
  description:
    "Wizard per identificar l'etiqueta adequada segons impressora, mida, gap i marca negra."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
