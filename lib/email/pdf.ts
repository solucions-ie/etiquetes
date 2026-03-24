import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const CHROMIUM_RELEASE = "v143.0.0";

function getExecutablePath() {
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return process.env.CHROMIUM_EXECUTABLE_PATH;
  }

  if (process.env.CHROMIUM_PACK_URL) {
    return chromium.executablePath(process.env.CHROMIUM_PACK_URL);
  }

  if (process.env.VERCEL) {
    const arch = process.arch === "arm64" ? "arm64" : "x64";
    return chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/${CHROMIUM_RELEASE}/chromium-${CHROMIUM_RELEASE}-pack.${arch}.tar`
    );
  }

  if (!process.env.VERCEL && process.platform === "win32") {
    throw new Error(
      "Per generar PDFs en local a Windows cal definir CHROMIUM_EXECUTABLE_PATH."
    );
  }

  return chromium.executablePath();
}

export async function renderHtmlToPdf(html: string) {
  const executablePath = await getExecutablePath();

  const browser = await puppeteer.launch({
    executablePath,
    args: chromium.args,
    headless: true
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm"
      }
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
