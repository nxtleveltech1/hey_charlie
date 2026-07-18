import { chromium } from "@playwright/test";

const out = process.argv[2] ?? "about.png";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  colorScheme: "light",
});
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("#about").waitFor({ state: "visible", timeout: 60000 });
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.locator("#about").screenshot({ path: out });
console.log("saved", out);
await browser.close();
