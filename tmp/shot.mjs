import { chromium } from "@playwright/test";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = process.argv[2] || "map.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/destinations", { waitUntil: "networkidle", timeout: 90000 });
const map = page.locator('svg[aria-label*="Cape Peninsula"]');
await map.waitFor({ timeout: 30000 });
await map.scrollIntoViewIfNeeded();
await page.addStyleTag({ content: "header, nav { display: none !important; }" });
await page.waitForTimeout(1000);
const container = page.locator('svg[aria-label*="Cape Peninsula"]').locator("..");
await container.screenshot({ path: out });
await browser.close();
console.log("saved", out);
