import { expect, test } from "@playwright/test";

test("sign up validates mismatched passwords", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel(/email address|ईमेल पता/i).fill("test@example.com");
  await page.getByLabel(/^password$|^पासवर्ड$/i).fill("secret1");
  await page.getByLabel(/confirm password|पासवर्ड फिर से लिखें/i).fill("secret2");
  await page.getByRole("button", { name: /create account|खाता बनाएँ/i }).click();
  await expect(page.getByText("Passwords do not match.", { exact: true })).toBeVisible();
});

test("sign in validates required password", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email address|ईमेल पता/i).fill("test@example.com");
  await page.getByRole("button", { name: /sign in|साइन इन करें/i }).click();
  await expect(page.getByText("Please enter your password.", { exact: true })).toBeVisible();
});


test("sign up opens terms and privacy without leaving the form", async ({ page }) => {
  await page.goto("/signup");

  const termsConsent = page.getByRole("button", { name: "Terms", exact: true }).first();
  await termsConsent.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "A simple baseline for using Rakhlo." })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Privacy Policy", exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "What Rakhlo stores and how it is protected." })).toBeVisible();
  await dialog.getByRole("button", { name: "Got it", exact: true }).click();
  await expect(dialog).toBeHidden();
});
