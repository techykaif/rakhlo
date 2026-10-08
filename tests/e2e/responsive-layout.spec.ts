import { expect, test } from "@playwright/test";

const narrowViewports = [320, 375, 390, 430];

test.describe("desktop auth one-page fit", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  for (const route of ["/login", "/signup"]) {
    test(`${route} fits in one viewport without page scrolling`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main section > div").first()).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(() => {
            const root = document.documentElement;
            const body = document.body;
            return Math.max(root.scrollHeight, body.scrollHeight) - window.innerHeight;
          }),
        )
        .toBeLessThanOrEqual(1);
    });
  }
});

for (const width of narrowViewports) {
  test.describe(`responsive public/auth layout at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test("landing page does not overflow horizontally", async ({ page }) => {
      await page.goto("/");
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
        .toBeLessThanOrEqual(1);
    });

    test("auth fields keep readable sizing and spacing", async ({ page }) => {
      for (const route of ["/login", "/signup"]) {
        await page.goto(route);
        const email = page.getByLabel(/email address|ईमेल पता/i);
        const box = await email.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThanOrEqual(48);

        const field = email.locator("..");
        await expect(field).toHaveCSS("gap", "4px");
      }
    });

    test("sign-in card stays inside the viewport", async ({ page }) => {
      await page.goto("/login");
      const card = page.locator("main section > div").first();
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
