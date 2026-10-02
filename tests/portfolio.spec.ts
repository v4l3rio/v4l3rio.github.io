import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { copy, links } from "../src/content";

for (const language of ["en", "it"] as const) {
  for (const width of [320, 375, 768, 1440]) {
    test(`${language}: layout and accessibility at ${width}px in both themes`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(language === "it" ? "/it/" : "/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".hero-profile")).toHaveText(copy[language].profile);
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      for (const mode of ["light", "dark"] as const) {
        if (mode === "dark") await page.getByRole("button", { name: copy[language].themeDark }).click();
        await expect(page.locator("html")).toHaveAttribute("data-mode", mode);
        const geometry = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          page: document.documentElement.scrollWidth,
          escaped: [...document.querySelectorAll("body *")].filter(element => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
          }).map(element => element.tagName + "." + element.className),
          tinyTargets: [...document.querySelectorAll("a, button")].filter(element => {
            const r = element.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && !element.classList.contains("skip-link") && r.height < 43.9;
          }).map(element => element.textContent),
        }));
        expect(geometry.page).toBe(geometry.viewport);
        expect(geometry.escaped).toEqual([]);
        expect(geometry.tinyTargets).toEqual([]);
        const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
        if (width === 375 || width === 1440) await page.screenshot({ path: `.qa/${language}-${width}-${mode}.png`, fullPage: true });

        const archive = page.locator(".project-archive");
        const trigger = archive.getByRole("button", { name: copy[language].archive, exact: true });
        await trigger.click();
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await expect.poll(() => archive.evaluate(root => {
          const panel = root.querySelector('[data-slot="accordion-item"]')!.getBoundingClientRect();
          const lastRow = root.querySelector("li:last-child")!.getBoundingClientRect();
          return panel.bottom - lastRow.bottom;
        })).toBeGreaterThanOrEqual(19);
        const archiveLayout = await archive.evaluate(root => {
          const panel = root.querySelector('[data-slot="accordion-item"]')!.getBoundingClientRect();
          const content = root.querySelector('[data-slot="accordion-content-inner"]')!;
          const intro = content.querySelector("p")!.getBoundingClientRect();
          const list = content.querySelector("ul")!.getBoundingClientRect();
          const header = root.querySelector('[data-slot="accordion-trigger"]')!;
          return {
            left: intro.left - panel.left,
            right: panel.right - list.right,
            headerInset: parseFloat(getComputedStyle(header).paddingLeft),
            introWidth: intro.width,
            columnGap: list.left - intro.right,
            stackedGap: list.top - intro.bottom,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          };
        });
        expect(archiveLayout.left).toBeGreaterThanOrEqual(19);
        expect(archiveLayout.right).toBeGreaterThanOrEqual(19);
        expect(archiveLayout.headerInset).toBeCloseTo(archiveLayout.left, 0);
        expect(archiveLayout.overflow).toBeFalsy();
        if (width >= 761) {
          expect(archiveLayout.introWidth).toBeGreaterThanOrEqual(219);
          expect(archiveLayout.columnGap).toBeGreaterThanOrEqual(39);
        } else {
          expect(archiveLayout.stackedGap).toBeGreaterThanOrEqual(23);
        }
        const openResult = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(openResult.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
        if (width === 375 || width === 1440) await archive.screenshot({ path: `.qa/archive-${language}-${width}-${mode}.png` });
        await trigger.click();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
      }
      expect(errors).toEqual([]);
    });
  }

  test(`${language}: every control has a working action`, async ({ page, context }) => {
    const t = copy[language];
    await page.goto(language === "it" ? "/it/" : "/");
    await page.setViewportSize({ width: 1440, height: 1000 });

    await page.keyboard.press("Tab");
    await expect(page.getByText(t.skip, { exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);

    for (const id of ["experience", "projects", "about", "contact"]) {
      await page.locator(`nav a[href="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    await page.getByRole("link", { name: t.viewWork, exact: true }).click();
    await expect(page).toHaveURL(/#projects$/);

    for (const [label, file] of [[t.download, links.cv[language]], [t.italianCV, links.cv.it], [t.englishCV, links.cv.en]]) {
      const promise = page.waitForEvent("download");
      await page.getByRole("link", { name: label, exact: true }).click();
      const download = await promise;
      expect(download.suggestedFilename()).toBe(file.split("/").pop());
      expect(await download.failure()).toBeNull();
    }

    const archive = page.getByRole("button", { name: t.archive, exact: true });
    await archive.focus();
    await page.keyboard.press("Enter");
    await expect(archive).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Flowers iOS Application", { exact: true })).toBeVisible();

    // Verify the exact popup address and click behaviour, without asserting external service availability.
    await context.route("https://**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<title>External destination test</title>" }));
    const destinations = page.locator('a[target="_blank"]');
    const count = await destinations.count();
    for (let index = 0; index < count; index++) {
      const link = destinations.nth(index);
      const href = await link.getAttribute("href");
      const popupPromise = page.waitForEvent("popup");
      await link.click();
      const popup = await popupPromise;
      await popup.waitForLoadState("domcontentloaded");
      expect(popup.url().replace(/\/$/, "")).toBe(href!.replace(/\/$/, ""));
      await popup.close();
    }
    expect(count).toBe(14);
    expect(await page.locator(".email-link").getAttribute("href")).toBe(links.email);
    await page.locator(".email-link").click({ noWaitAfter: true });
    await archive.focus();
    await page.keyboard.press("Space");
    await expect(archive).toHaveAttribute("aria-expanded", "false");

    const dark = page.getByRole("button", { name: t.themeDark });
    await dark.focus();
    expect(await dark.evaluate(e => getComputedStyle(e).outlineStyle)).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await page.reload();
    await expect(page.getByRole("button", { name: t.themeLight })).toBeVisible();
    await page.getByRole("button", { name: t.themeLight }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "light");

    await page.setViewportSize({ width: 320, height: 900 });
    const menu = page.locator(".menu-button");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("nav")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await menu.click();
    await page.locator('nav a[href="#experience"]').click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    await page.locator(".wordmark").click();
    await expect(page).toHaveURL(language === "it" ? /\/it\/$/ : /4173\/$/);
    await page.locator(".language-link").click();
    await expect(page.locator("html")).toHaveAttribute("lang", language === "it" ? "en" : "it");
    await expect(page.locator(".hero-profile")).toHaveText(copy[language === "it" ? "en" : "it"].profile);
  });
}

test("prerendered content remains useful without JavaScript", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  for (const path of ["/", "/it/"]) {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4173${path}`);
    for (const name of ["Go Reply", "FairLib", "PositionPal", "NesGen", "Scooby"]) await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(page.locator(".language-link")).toBeVisible();
    await expect(page.locator(".menu-button")).toBeHidden();
    await page.close();
  }
  for (const url of Object.values(links.cv)) {
    const response = await request.get(url);
    expect(response.ok()).toBeTruthy();
    const bytes = await response.body();
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(10_000);
  }
  await context.close();
});

test("zoom and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/it/");
  await page.evaluate(() => document.documentElement.style.zoom = "2");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBeFalsy();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});
