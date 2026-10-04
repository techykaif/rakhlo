import { expect, test } from "@playwright/test";

test("language toggle changes sign-in copy", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "हिंदी" }).click();
  await expect(page.getByRole("heading", { name: /वापस स्वागत है/i })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
});

test("language persists from sign-in into sign-up", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "हिंदी" }).click();
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /अपना Rakhlo खाता बनाएँ/i })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
});

test("Hindi headings use non-negative tracking", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "हिंदी" }).click();
  const heading = page.getByRole("heading", { name: /वापस स्वागत है/i });
  const style = await heading.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return { letterSpacing: computed.letterSpacing, lineHeight: computed.lineHeight };
  });
  expect(style.letterSpacing).not.toMatch(/^-/);
  expect(style.lineHeight).not.toBe("normal");
});
