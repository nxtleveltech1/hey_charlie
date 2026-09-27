import { expect, test } from "@playwright/test";

test.describe("Package discovery", () => {
  test("every package card opens a product detail page", async ({ page, request }) => {
    await page.goto("/packages");

    const cards = page.getByTestId("package-card");
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);
    await expect(page.getByTestId("package-detail-link")).toHaveCount(cardCount);

    const detailHrefs = await page
      .getByTestId("package-detail-link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));

    for (const href of new Set(detailHrefs)) {
      const response = await request.get(href);
      expect(response.ok(), `${href} should render`).toBeTruthy();
    }

    const firstDetailLink = page.getByTestId("package-detail-link").first();
    const expectedHref = await firstDetailLink.getAttribute("href");
    await firstDetailLink.click();

    await expect(page).toHaveURL(expectedHref!);
    await expect(page.getByTestId("package-detail-hero")).toBeVisible();
  });

  test("Cape Courage uses the shared theme palette", async ({ page }) => {
    await page.goto("/packages/cape-courage-vip");

    const hero = page.getByTestId("package-detail-hero");
    await expect(hero).toBeVisible();
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText(
      "The Dungeons Seven Big Wave Invitational",
    );
    await expect(hero).toHaveAttribute("data-theme-surface", "true");
    await expect(hero).not.toHaveClass(/bg-navy-deep/);

    await expect(hero.getByText("Cancelled", { exact: true })).toBeVisible();
    await expect(hero).toContainText("water conditions did not deliver the waves required");
    await expect(page.locator('a[href="/booking/cape-courage-vip"]')).toHaveCount(0);
  });
});

for (const width of [390, 768, 1440]) {
  test(`cancelled event card at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/packages");
    const card = page.getByTestId("package-card").filter({ hasText: "The Dungeons Seven Big Wave Invitational" });
    await expect(card.getByText("Cancelled", { exact: true }).first()).toBeVisible();
    await expect(card).toContainText("ready for the next one");
    await expect(card.getByRole("link", { name: "Event Update" })).toHaveAttribute("href", "/packages/cape-courage-vip");
    await expect(card.getByRole("link", { name: "Book Now" })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
    await card.screenshot({ path: `test-results/cancelled-event-${width}.png` });
  });
}
