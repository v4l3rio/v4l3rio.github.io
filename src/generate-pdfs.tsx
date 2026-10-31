import { renderToFile } from "@react-pdf/renderer";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { ResumePdf, registerPdfFonts } from "./ResumePdf";
import { content } from "./content";

export async function generatePdfs() {
  registerPdfFonts(resolve("public/fonts/cv"));
  await mkdir("dist/cv", { recursive: true });
  for (const data of Object.values(content)) {
    await renderToFile(<ResumePdf data={data} />, resolve("dist/cv", data.pdf.filename));
    console.log(`Generated ${data.pdf.filename} from cv-${data.language}.json`);
  }
}
