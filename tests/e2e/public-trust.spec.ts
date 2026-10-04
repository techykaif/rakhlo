import { expect, test } from "@playwright/test";

test.describe("public trust and support routes", () => {
  test("landing footer exposes support, status and policy links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Status" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Support" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Feedback" })).toHaveAttribute("href", "/support#feedback");
    await expect(footer.getByRole("link", { name: "Guidelines" })).toHaveAttribute("href", "/guidelines");
    await expect(footer.getByRole("link", { name: /Privacy & data/i })).toHaveAttribute("href", "/privacy");
    await expect(footer.getByRole("link", { name: "Disclaimer" })).toHaveAttribute("href", "/disclaimer");
    await expect(footer.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test("support page uses the contact form without direct mail links", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: /tell us what’s wrong/i })).toBeVisible();
    await expect(page.getByRole("combobox", { name: /what can we help with/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Email delivery unavailable" })).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test("status page exposes service state", async ({ page }) => {
    await page.goto("/status");
    await expect(page.getByRole("heading", { name: /everything looks operational|some services need attention/i })).toBeVisible();
    await expect(page.getByText("Authentication service")).toBeVisible();
  });

  test("public policy pages render", async ({ page }) => {
    for (const path of ["/guidelines", "/privacy", "/disclaimer", "/terms"]) {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();
    }
  });
});
