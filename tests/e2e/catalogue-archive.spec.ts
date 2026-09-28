import { expect, test } from "@playwright/test";
import { ARCHIVED_PACKAGE_SLUGS } from "../../src/lib/archived-packages";
import { ARCHIVED_WILDLIFE_SLUGS } from "../../src/lib/wildlife-packages";

for (const width of [390, 768, 1440]) {
  test(`consolidated wildlife listing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/packages");
    const card = page.getByTestId("package-card").filter({ hasText: "Cape Wildlife Explorer" });
    await expect(card).toHaveCount(1);
    await expect(card).toContainText(/R\s*1\s*750/);
    await expect(card.getByRole("link", { name: "Book Now" })).toHaveAttribute("href", "/booking/cape-wildlife-explorer");
    for (const slug of ARCHIVED_PACKAGE_SLUGS) {
      await expect(page.locator(`a[href="/packages/${slug}"]`)).toHaveCount(0);
    }
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator("img")).toBeVisible();
    await expect.poll(() => card.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    await card.screenshot({ path: `test-results/wildlife-explorer-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.goto("/packages/cape-wildlife-explorer");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cape Wildlife Explorer");
    await expect(page.getByRole("main").getByTestId("package-detail-hero")).toContainText(/R\s*1\s*750/);
    await expect(page.locator("main")).toContainText("sightings are natural, seasonal and never guaranteed");
  });
}

test("old wildlife URLs lead to the consolidated listing", async ({ page }) => {
  for (const slug of ARCHIVED_WILDLIFE_SLUGS) {
    await page.goto(`/packages/${slug}`);
    await expect(page).toHaveURL(/\/packages\/cape-wildlife-explorer$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cape Wildlife Explorer");
  }
});

test("other archived product pages are unavailable", async ({ page }) => {
  for (const slug of ARCHIVED_PACKAGE_SLUGS.filter((slug) => !ARCHIVED_WILDLIFE_SLUGS.includes(slug))) {
    await page.goto(`/packages/${slug}`);
    await expect(page.getByRole("heading", { name: "This page has set sail" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  }
});

