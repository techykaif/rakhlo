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


test("signup keeps terms and privacy inside accessible dialogs", async ({ page }) => {
  await page.goto("/signup");

  await page.getByRole("button", { name: "Terms", exact: true }).click();
  const termsDialog = page.getByRole("dialog");
  await expect(termsDialog).toBeVisible();
  await expect(termsDialog.getByRole("heading", { level: 2 })).toContainText("Rakhlo");
  await expect(termsDialog.locator("section")).toHaveCount(3);
  await expect(termsDialog.getByRole("link", { name: /Read full Terms/i })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(termsDialog).toBeHidden();

  await page.getByRole("button", { name: "Terms", exact: true }).click();
  await expect(termsDialog).toBeVisible();
  await page.mouse.click(8, 8);
  await expect(termsDialog).toBeHidden();

  await page.getByRole("button", { name: "Privacy Policy", exact: true }).click();
  const privacyDialog = page.getByRole("dialog");
  await expect(privacyDialog).toBeVisible();
  await expect(privacyDialog.locator("section")).toHaveCount(5);
  await expect(privacyDialog.getByRole("heading", { level: 2 })).toContainText("What Rakhlo stores");
  await privacyDialog.getByRole("button", { name: /Close document/i }).click();
  await expect(privacyDialog).toBeHidden();
});
