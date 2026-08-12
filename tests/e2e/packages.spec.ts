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

    const bookingLinks = page.getByRole("link", { name: "Book Your Spot Now" });
    await expect(bookingLinks.first()).toHaveAttribute(
      "href",
      "/booking/cape-courage-vip",
    );
  });
});
