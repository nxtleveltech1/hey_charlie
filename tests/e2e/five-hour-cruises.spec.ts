import { test, expect } from "@playwright/test";

const packages = [
  ["sundowner-cruise", "Hout Bay Sundowner Cruise"],
  ["beach-hopper", "Beach Hopper"],
  ["cape-wildlife-explorer", "Cape Wildlife Explorer"],
] as const;
const origin = process.env.VERIFY_ORIGIN ?? "http://127.0.0.1:3005";

for (const width of [390, 768, 1440]) {
  test(`five-hour cruise cards agree at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/packages`, { waitUntil: "domcontentloaded" });
    for (const [slug, name] of packages) {
      const card = page.getByRole("main").getByTestId("package-card").filter({ has: page.locator(`a[href="/packages/${slug}"]`) });
      await expect(card).toContainText(name);
      await expect(card).toContainText("5 hours");
      await expect(card).toContainText(/R\s*1\s*750/);
      await expect(card).not.toContainText(/Atlantic/);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  });
}

test("cruise detail pages agree with their cards", async ({ page }) => {
  test.setTimeout(90_000);
  for (const [slug, name] of packages) {
    await page.goto(`${origin}/packages/${slug}`, { waitUntil: "domcontentloaded" });
    const hero = page.getByRole("main").getByTestId("package-detail-hero");
    await expect(hero).toContainText(name);
    await expect(hero).toContainText("5 hours");
    await expect(hero).toContainText(/R\s*1\s*750/);
    await expect(page.getByRole("main")).toContainText("Houtbay Harbor");
    const image = hero.locator("img").first();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  }
});

