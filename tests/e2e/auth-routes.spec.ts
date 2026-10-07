import { expect, test } from "@playwright/test";

test("sign up page renders", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /create your rakhlo account/i })).toBeVisible();
  await expect(page.getByLabel(/email address|ईमेल पता/i)).toBeVisible();
  await expect(page.getByLabel(/^password$|^पासवर्ड$/i)).toBeVisible();
  await expect(page.getByRole("checkbox")).toBeVisible();
  await expect(page.getByRole("link", { name: "Terms" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
});


test("signup requires consent before email or Google account creation", async ({ page }) => {
  await page.goto("/signup");
  const email = page.getByLabel(/email address|ईमेल पता/i);
  const password = page.getByLabel(/^password$|^पासवर्ड$/i);

  await email.fill("test@example.com");
  await password.fill("valid-password-123");
  await page.getByLabel(/confirm password|पासवर्ड की पुष्टि/i).fill("valid-password-123");

  await page.getByRole("button", { name: /create account|खाता बनाएं/i }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /terms|privacy|सहमत/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: /continue with google|google के साथ जारी रखें/i }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /terms|privacy|सहमत/i }),
  ).toBeVisible();
});

test("sign in page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back|वापस स्वागत है/i })).toBeVisible();
  await expect(page.getByLabel(/email address|ईमेल पता/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
});

test("password recovery page renders", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { name: /reset your password|पासवर्ड रीसेट करें/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /send reset link|रीसेट लिंक भेजें/i })).toBeVisible();
});
