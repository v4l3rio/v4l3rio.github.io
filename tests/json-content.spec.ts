import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { getContent } from "../src/content";

async function pdfText(path: string) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const document = await getDocument({ data: new Uint8Array(await readFile(path)), useSystemFonts: true }).promise;
  const pages = await Promise.all(Array.from({ length: document.numPages }, async (_, index) => {
    const content = await (await document.getPage(index + 1)).getTextContent();
    return content.items.map(item => "str" in item ? item.str : "").join(" ");
  }));
  return { text: pages.join(" ").replace(/\s+/g, " "), pages: document.numPages };
}

for (const language of ["it", "en"] as const) {
  test(`${language}: editing JSON changes the page and generated PDF without a rebuild`, async ({ page }) => {
    const data = structuredClone(getContent(language));
    data.profile[0] = "Profilo JSON aggiornato in tempo reale.";
    data.experience.push({ company: "Azienda JSON", role: "Ruolo da JSON", date: "2026", details: ["Esperienza aggiunta nel file JSON."] });
    data.skills.push({ id: "json-test", label: "Competenza JSON", value: "Competenze modificate nel file JSON." });
    await page.route(`**/content/cv-${language}.json`, route => route.fulfill({ json: data }));
    await page.goto(language === "it" ? "/it/" : "/");
    await expect(page.locator(".hero-profile p")).toHaveText(data.profile);
    await expect(page.getByRole("heading", { name: "Azienda JSON" })).toBeVisible();
    await expect(page.locator(".toolkit dt").last()).toHaveText("Competenza JSON");
    const waiting = page.waitForEvent("download");
    await page.getByRole("link", { name: data.text.download, exact: true }).click();
    const download = await waiting;
    expect(download.url()).toMatch(/^blob:/);
    expect(download.suggestedFilename()).toBe(data.pdf.filename);
    const pdf = await pdfText((await download.path())!);
    for (const value of [data.profile[0], "Azienda JSON", "Competenza JSON", "Esperienza aggiunta nel file JSON."]) expect(pdf.text).toContain(value);
    expect(pdf.pages).toBeGreaterThanOrEqual(2);
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
}

test("long JSON content flows onto extra PDF pages and the other language download reads its own JSON", async ({ page }) => {
  const data = structuredClone(getContent("it"));
  data.profile = Array.from({ length: 35 }, (_, i) => `Paragrafo numero ${i + 1}: ` + "Contenuto aggiuntivo del curriculum per verificare la paginazione automatica. ".repeat(4));
  await page.route("**/content/cv-it.json", route => route.fulfill({ json: data }));
  await page.goto("/");
  const waiting = page.waitForEvent("download");
  await page.getByRole("link", { name: getContent("en").text.italianCV, exact: true }).click();
  const download = await waiting;
  const result = await pdfText((await download.path())!);
  expect(result.pages).toBeGreaterThan(2);
  expect(result.text).toContain("Paragrafo numero 35:");
  expect(result.text).toContain(data.skills[0].label);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("invalid JSON shows a clear error instead of downloading a stale CV", async ({ page }) => {
  await page.route("**/content/cv-en.json", route => route.fulfill({ json: { language: "en" } }));
  await page.goto("/");
  await expect(page.getByRole("status")).toHaveText(getContent("en").text.contentError);
  let downloaded = false;
  page.on("download", () => { downloaded = true; });
  await page.getByRole("link", { name: getContent("en").text.download, exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText(getContent("en").text.downloadError);
  expect(downloaded).toBe(false);
});
