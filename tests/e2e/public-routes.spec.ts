import { expect, test } from "@playwright/test";

test.describe("public routes", () => {
  test("landing page is usable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("You bought it.")).toBeVisible();
    await expect(page.getByText("Rakhlo remembers.")).toBeVisible();
    await expect(page.getByRole("link", { name: /log in/i }).first()).toHaveAttribute("href", "/login");
    await expect(page.getByRole("link", { name: /get started/i }).first()).toHaveAttribute("href", "/signup");
  });

  test("sign up page renders", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create your rakhlo account/i })).toBeVisible();
    await expect(page.getByLabel(/email address|ईमेल पता/i)).toBeVisible();
    await expect(page.getByLabel(/^password$|^पासवर्ड$/i)).toBeVisible();
  });

  test("sign in page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back|वापस स्वागत है/i })).toBeVisible();
    await expect(page.getByLabel(/email address|ईमेल पता/i)).toBeVisible();
  });

  test("password recovery page renders", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByRole("heading", { name: /reset your password|पासवर्ड रीसेट करें/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /send reset link|रीसेट लिंक भेजें/i })).toBeVisible();
  });

  test("language toggle changes auth copy", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "हिंदी" }).click();
    await expect(page.getByRole("heading", { name: /वापस स्वागत है/i })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });
});
