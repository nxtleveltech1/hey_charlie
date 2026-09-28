import { test, expect } from "@playwright/test";

test("public pages use the Houtbay departure", async ({ page }) => {
  for (const path of ["/", "/about", "/packages", "/packages/sundowner-cruise", "/destinations", "/destinations/hout-bay", "/terms"]) {
    await page.goto(path);
    await expect(page.locator("body")).not.toContainText(/V&A|Waterfront|Victoria & Alfred/i);
    expect(await page.locator("head").textContent()).not.toMatch(/V&A Waterfront|Victoria & Alfred/i);
  }
});

test("Sundowner image loads and departure copy matches Houtbay", async ({ page }) => {
  await page.goto("/packages/sundowner-cruise");
  const hero = page.getByRole("main").getByTestId("package-detail-hero");
  await expect(hero).toContainText("Houtbay Harbor");
  const image = hero.locator("img").first();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await expect(page.getByRole("main")).toContainText("We return to Houtbay Harbor");
});
