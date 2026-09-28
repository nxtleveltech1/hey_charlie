import { test, expect } from "@playwright/test";

for (const width of [390, 768, 1440]) {
  test(`Private Charters is the main card at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("https://heycharliecharters.com/packages", { waitUntil: "domcontentloaded" });
    const card = page.getByTestId("package-card").first();
    await expect(card.getByTestId("package-detail-link")).toHaveAttribute("href", "/packages/private-celebration");
    const prices = card.getByLabel("Private charter prices");
    await expect(prices).toContainText(/1 hour.*R\s*950/);
    await expect(prices).toContainText(/3 hours.*R\s*1\s*350/);
    await expect(prices).toContainText(/Full day.*R\s*2\s*000/);
    await expect(prices).toContainText("Add lunch — R500 per person");
    await expect(prices).toContainText("Add drinks — R500 per person");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  });
}

