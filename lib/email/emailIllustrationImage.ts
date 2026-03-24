import sharp from "sharp";
import {
  type LabelIllustrationData,
  generateLabelIllustrationUnifiedSvg
} from "@/lib/email/labelIllustration";

export type EmailIllustrationImageParams = LabelIllustrationData;

export async function createEmailIllustrationPng(params: EmailIllustrationImageParams) {
  const svg = generateLabelIllustrationUnifiedSvg(params);
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer();
}
