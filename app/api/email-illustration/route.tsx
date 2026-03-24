import { createEmailIllustrationImageResponse } from "@/lib/email/emailIllustrationImage";

export const runtime = "nodejs";

function parseNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return createEmailIllustrationImageResponse({
    labelWidthMm: parseNumber(searchParams.get("labelWidthMm"), 70),
    labelHeightMm: parseNumber(searchParams.get("labelHeightMm"), 45),
    labelFlowType: searchParams.get("labelFlowType") ?? "gap",
    rollOuterDiameterMm: parseNumber(searchParams.get("rollOuterDiameterMm"), 115),
    rollCoreMm: parseNumber(searchParams.get("rollCoreMm"), 40),
    rollCoreLabel: searchParams.get("rollCoreLabel") ?? "40 mm",
    hasBackgroundColor: searchParams.get("hasBackgroundColor") === "true",
    backgroundColorHex: searchParams.get("backgroundColorHex") ?? "#FFFFFF"
  });
}
