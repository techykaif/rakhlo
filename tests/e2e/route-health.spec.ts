import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/status",
  "/support",
  "/privacy",
  "/terms",
  "/guidelines",
  "/disclaimer",
];

const protectedRoutes = [
  "/dashboard",
  "/purchases",
  "/purchases/new",
  "/purchases/not-a-real-purchase",
  "/purchases/not-a-real-purchase/edit",
  "/purchases/not-a-real-purchase/print",
  "/reminders",
  "/account",
];

test.describe("route health", () => {
  for (const route of publicRoutes) {
    test("public route " + route + " responds successfully", async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
    });
  }

  for (const route of protectedRoutes) {
    test("protected route " + route + " redirects unauthenticated visitors", async ({ request }) => {
      const response = await request.get(route, { maxRedirects: 0 });
      expect([302, 307, 308]).toContain(response.status());
      expect(response.headers().location).toContain("/login");
    });
  }

  test("unknown public route returns Rakhlo's custom 404", async ({ page }) => {
    const response = await page.goto("/this-rakhlo-route-does-not-exist", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(404);
    await expect(page.getByText("404", { exact: true }).first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /this place isn't in your rakhlo memory|यह जगह आपकी Rakhlo याद में नहीं है/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /back home|होम पर जाएँ/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /support|सहायता/i }),
    ).toBeVisible();
  });

  test("robots and sitemap are available", async ({ request }) => {
    const [robots, sitemap] = await Promise.all([
      request.get("/robots.txt"),
      request.get("/sitemap.xml"),
    ]);

    expect(robots.status()).toBe(200);
    expect(sitemap.status()).toBe(200);
    expect(robots.headers()["content-type"]).toContain("text/plain");
    expect(sitemap.headers()["content-type"]).toContain("xml");
  });

  test("unauthenticated purchase API stays protected", async ({ request }) => {
    const response = await request.get("/api/purchases");
    expect(response.status()).toBe(401);
  });
});
