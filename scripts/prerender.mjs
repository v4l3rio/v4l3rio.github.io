import { build } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";

await build({
  build: { ssr: "src/prerender.tsx", outDir: ".prerender" },
});
await build({ build: { ssr: "src/generate-pdfs.tsx", outDir: ".pdf-build" } });
const { generatePdfs } = await import("../.pdf-build/generate-pdfs.js");
await generatePdfs();
const { render, content } = await import("../.prerender/prerender.js");
const template = await readFile("dist/index.html", "utf8");
if (!template.includes("<!--app-html-->")) throw new Error("Missing prerender insertion point.");
for (const language of ["en", "it"]) {
  let html = template.replace("<!--app-html-->", render(language));
  if (language === "it") {
    html = html.replace('<html lang="en"', '<html lang="it"');
    await mkdir("dist/it", { recursive: true });
  }
  const data = content[language];
  const escapeAttribute = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  html = html.replace(/<title>.*?<\/title>/, () => `<title>${escapeAttribute(data.metadata.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, (_, before, after) => before + escapeAttribute(data.metadata.description) + after)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, (_, before, after) => before + escapeAttribute(data.metadata.title) + after)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, (_, before, after) => before + escapeAttribute(data.metadata.socialDescription) + after);
  const canonical = data.person.websiteUrl.replace(/\/$/, "") + (language === "it" ? "/it/" : "/");
  html = html.replace(/(rel="canonical" href=")[^"]*(")/, (_, before, after) => before + escapeAttribute(canonical) + after)
    .replace(/(property="og:url" content=")[^"]*(")/, (_, before, after) => before + escapeAttribute(canonical) + after);
  await writeFile(language === "it" ? "dist/it/index.html" : "dist/index.html", html);
}
await writeFile("dist/.nojekyll", "");
console.log("Prerendered English and Italian: content and CV links are readable without JavaScript.");
