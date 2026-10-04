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
