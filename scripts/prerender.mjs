import { build } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";

await build({
  build: { ssr: "src/prerender.tsx", outDir: ".prerender" },
});
const { render } = await import("../.prerender/prerender.js");
const template = await readFile("dist/index.html", "utf8");
if (!template.includes("<!--app-html-->")) throw new Error("Missing prerender insertion point.");
for (const language of ["en", "it"]) {
  let html = template.replace("<!--app-html-->", render(language));
  if (language === "it") {
    html = html.replace('<html lang="en"', '<html lang="it"')
      .replace('rel="canonical" href="https://v4l3rio.github.io/"', 'rel="canonical" href="https://v4l3rio.github.io/it/"')
      .replace('property="og:url" content="https://v4l3rio.github.io/"', 'property="og:url" content="https://v4l3rio.github.io/it/"')
      .replace('content="Valerio Di Zio, Cloud Developer based in Cesena. Google Cloud, Python and FastAPI. Professional experience, public projects and downloadable CV."', 'content="Valerio Di Zio, Cloud Developer a Cesena. Google Cloud, Python e FastAPI. Esperienza professionale, progetti pubblici e CV scaricabile."')
      .replace('content="Google Cloud, Python and FastAPI. Experience, public projects and CV."', 'content="Google Cloud, Python e FastAPI. Esperienza, progetti pubblici e CV."');
    await mkdir("dist/it", { recursive: true });
  }
  await writeFile(language === "it" ? "dist/it/index.html" : "dist/index.html", html);
}
await writeFile("dist/.nojekyll", "");
console.log("Prerendered English and Italian: content and CV links are readable without JavaScript.");
