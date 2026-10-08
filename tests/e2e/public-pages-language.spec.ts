import { expect, test } from "@playwright/test";

const publicPages = [
  { path: "/privacy", english: "What Rakhlo stores and how it is protected.", hindi: "Rakhlo क्या सेव करता है और उसे कैसे सुरक्षित रखा जाता है।" },
  { path: "/terms", english: "A simple baseline for using Rakhlo.", hindi: "Rakhlo इस्तेमाल करने के लिए एक सरल आधार।" },
  { path: "/support", english: "Tell us what's wrong, confusing or worth improving.", hindi: "जो गलत, confusing या बेहतर करने लायक है, हमें बताएं।" },
  { path: "/guidelines", english: "Keep Rakhlo safe, private and useful.", hindi: "Rakhlo को सुरक्षित, निजी और उपयोगी रखें।" },
  { path: "/disclaimer", english: "Rakhlo is a memory and organization tool, not your source of truth.", hindi: "Rakhlo याद रखने और व्यवस्थित रखने का tool है, अंतिम सत्य का स्रोत नहीं।" },
  { path: "/status", english: "Everything looks operational.", hindi: "सब कुछ सामान्य दिख रहा है।" },
] as const;

test.describe("public page language switching", () => {
  for (const pageCase of publicPages) {
    test(`${pageCase.path} switches between English and Hindi`, async ({ page }) => {
      await page.goto(pageCase.path);
      await expect(page.getByText(pageCase.english, { exact: true })).toBeVisible();

      await page.getByRole("button", { name: "हिंदी" }).click();

      await expect(page.getByText(pageCase.hindi, { exact: true })).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", "hi");

      await page.getByRole("button", { name: "English" }).click();
      await expect(page.getByText(pageCase.english, { exact: true })).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  }
});
