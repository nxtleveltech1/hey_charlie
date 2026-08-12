import { test, expect } from "@playwright/test";

test.describe("Mobile smoke tests", () => {
  test("home page loads with navigation", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
  });

  test("homepage hero carousel promotes Cape Courage booking", async ({ page }) => {
    await page.goto("/");

    const hero = page.getByTestId("home-hero-carousel");
    await expect(hero).toBeVisible();
    await hero
      .getByRole("button", { name: "Show The Dungeons Seven Big Wave Invitational" })
      .click();

    const eventSlide = page.getByTestId("cape-courage-hero-slide");
    await expect(eventSlide).toBeVisible();
    await expect(eventSlide.getByRole("heading", { name: /Cape Courage, from the water/ })).toBeVisible();
    await expect(hero.getByRole("link", { name: "Book Your Spot" })).toHaveAttribute(
      "href",
      "/booking/cape-courage-vip",
    );
  });

  test("packages page loads without horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/packages");
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("weather page shows marine weather heading", async ({ page }) => {
    await page.goto("/weather");
    await expect(page.locator("h1")).toContainText("Marine", {
      timeout: 20_000,
    });
    await expect(page.locator("h1")).toContainText("Weather");
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("admin redirects non-authenticated users", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/sign-in/, { timeout: 20_000 });
    expect(page.url()).toMatch(/sign-in/);
  });

  test("dashboard redirects non-authenticated users", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/sign-in/, { timeout: 20_000 });
    expect(page.url()).toMatch(/sign-in/);
  });

  test("manifest is served", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.name).toContain("Hey Charlie");
  });
});
