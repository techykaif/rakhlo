import { expect, test } from "@playwright/test";

const narrowViewports = [320, 375, 390, 430];

for (const width of narrowViewports) {
  test.describe(`responsive public/auth layout at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test("landing page does not overflow horizontally", async ({ page }) => {
      await page.goto("/");
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
        .toBeLessThanOrEqual(1);
    });

    test("sign-in card stays inside the viewport", async ({ page }) => {
      await page.goto("/login");
      const card = page.locator("main > section > div").first();
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
        .toBeLessThanOrEqual(1);
    });

    test("sign-up card stays inside the viewport", async ({ page }) => {
      await page.goto("/signup");
      const card = page.locator("main > section > div").first();
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
        .toBeLessThanOrEqual(1);
    });
  });
}
