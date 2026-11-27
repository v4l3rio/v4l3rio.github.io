import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getContent } from "../src/content";

for (const language of ["en", "it"] as const) {
  const data = getContent(language);
  const path = language === "it" ? "/it/" : "/";

  test(`${language}: every technology filter highlights at least one entry and links to it`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(path);
    const group = page.getByRole("radiogroup", { name: data.text.filterByTech });
    await expect(group).toBeVisible();
    for (const term of data.filters!) {
      await group.getByRole("radio", { name: term, exact: true }).click();
      await expect(page.locator("main mark").first()).toBeAttached();
      const links = page.locator(".tech-filter-status a");
      expect(await links.count()).toBeGreaterThan(0);
      await expect(page.locator(".tech-filter-status")).toContainText(term);
      // matching entries stay untouched, the others are de-emphasised
      expect(await page.locator(".is-dim mark").count()).toBe(0);
      expect(await page.locator("article:not(.is-dim) mark").count()).toBeGreaterThan(0);
    }
    await group.getByRole("radio", { name: data.filters!.at(-1)!, exact: true }).click();
    await expect(page.locator("main mark")).toHaveCount(0);
    await expect(page.locator(".is-dim")).toHaveCount(0);
  });

  test(`${language}: Google Cloud reaches the Go Reply bullet and stack, and links jump to entries`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(path);
    await page.getByRole("radio", { name: "Google Cloud", exact: true }).click();
    await expect(page.locator("#work-go-reply .job-details mark")).toHaveText("Google Cloud");
    await expect(page.locator("#work-go-reply .job-stack h4 mark")).toHaveText("Google Cloud");
    await expect(page.locator("#work-visup")).toHaveClass(/is-dim/);
    await expect(page.locator("#work-go-reply")).not.toHaveClass(/is-dim/);
    await page.getByRole("radio", { name: "PyTorch", exact: true }).click();
    await page.locator('.tech-filter-status a[href="#project-nesgen"]').click();
    await expect(page).toHaveURL(/#project-nesgen$/);
    await expect(page.locator("#project-nesgen")).toBeInViewport();
  });

  test(`${language}: the filter column stays sticky on desktop and the dimmed text stays accessible`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    const heading = page.locator(".experience-main > .section-heading");
    await page.getByRole("radio", { name: "Python", exact: true }).click();
    await page.locator("#work-visup").scrollIntoViewIfNeeded();
    expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(0);
    expect((await heading.boundingBox())!.y).toBeLessThan(120);
    for (const mode of ["light", "dark"]) {
      if (mode === "dark") await page.getByRole("button", { name: data.text.themeDark }).click();
      await page.waitForTimeout(500); // let the colour transitions settle before measuring contrast
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    }
  });

  for (const width of [900, 1440]) {
    test(`${language}: at ${width}px the sticky heading never rides over the toolkit`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.locator(".tech-filter")).toBeVisible();
      const toolkit = page.locator(".toolkit");
      for (const offset of [600, 300, 80]) {
        await toolkit.evaluate((el, gap) => scrollTo(0, el.getBoundingClientRect().top + scrollY - gap), offset);
        const overlap = await page.evaluate(() => {
          const heading = document.querySelector(".experience-main > .section-heading")!.getBoundingClientRect();
          return heading.bottom - document.querySelector(".toolkit")!.getBoundingClientRect().top;
        });
        expect(overlap).toBeLessThanOrEqual(0);
      }
    });
  }

  test(`${language}: at 375px the filter sits above the jobs and every target is 44px`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(path);
    await page.getByRole("radio", { name: "Python", exact: true }).click();
    const sticky = await page.locator(".experience-main > .section-heading").evaluate(el => getComputedStyle(el).position);
    expect(sticky).toBe("static");
    const filterBox = (await page.locator(".tech-filter").boundingBox())!;
    expect(filterBox.y).toBeLessThan((await page.locator(".experience-list").boundingBox())!.y);
    const small = await page.locator(".tech-filter a, .tech-filter button").evaluateAll(els => els.filter(e => e.getBoundingClientRect().height < 43.9).map(e => e.textContent));
    expect(small).toEqual([]);
  });
}

test("without JavaScript there is no filter and the Go Reply stack is still readable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  for (const path of ["/", "/it/"]) {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4173${path}`);
    await expect(page.locator(".tech-filter")).toHaveCount(0);
    await expect(page.locator("mark")).toHaveCount(0);
    await expect(page.locator("#work-go-reply .job-stack dt")).toHaveCount(7);
    await page.close();
  }
  await context.close();
});

test("the stack cannot list a service that the skills do not", async () => {
  const { resumeSchema } = await import("../src/resume-schema");
  const data = structuredClone(getContent("en"));
  data.experience[0].stack!.groups[0].items.push("Cloud Spanner");
  expect(resumeSchema.safeParse(data).success).toBe(false);
  expect(resumeSchema.safeParse(getContent("en")).success).toBe(true);
});
