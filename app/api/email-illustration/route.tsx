import { createEmailIllustrationPng } from "@/lib/email/emailIllustrationImage";

export const runtime = "nodejs";

function parseNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const png = await createEmailIllustrationPng({
    labelWidthMm: parseNumber(searchParams.get("labelWidthMm"), 70),
    labelHeightMm: parseNumber(searchParams.get("labelHeightMm"), 45),
    labelFlowType: (searchParams.get("labelFlowType") ?? "gap") as "gap" | "black-mark" | "continuous",
    rollOuterDiameterMm: parseNumber(searchParams.get("rollOuterDiameterMm"), 115),
    rollCoreMm: parseNumber(searchParams.get("rollCoreMm"), 40),
    rollCoreLabel: searchParams.get("rollCoreLabel") ?? "40 mm",
    printerType: (searchParams.get("printerType") ?? "desktop") as "desktop" | "portable" | "industrial",
    hasBackgroundColor: searchParams.get("hasBackgroundColor") === "true",
    backgroundColorHex: searchParams.get("backgroundColorHex") ?? "#FFFFFF"
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, immutable, no-transform, max-age=31536000"
    }
  });
}
