import { expect, test } from "@playwright/test";

test.describe("public trust and support routes", () => {

  test("public pages share the same header and language toggle", async ({ page }) => {
    await page.goto("/status");
    const header = page.locator("header").first();
    await expect(header.getByRole("link", { name: /Why Rakhlo/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /How it works/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /Features/i })).toBeVisible();
    await expect(header.getByRole("link", { name: "Status" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Support" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Get started" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Log in" })).toBeVisible();

    await header.getByRole("button", { name: "हिंदी" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await expect(header.getByRole("link", { name: /कैसे काम करता है/i })).toBeVisible();

    await header.getByRole("button", { name: "English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("landing footer exposes product links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Status" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Support" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Feedback" })).toHaveAttribute("href", "/support#feedback");
  });

  test("landing footer exposes policy links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Guidelines" })).toHaveAttribute("href", "/guidelines");
    await expect(footer.getByRole("link", { name: /Privacy & data/i })).toHaveAttribute("href", "/privacy");
    await expect(footer.getByRole("link", { name: "Disclaimer" })).toHaveAttribute("href", "/disclaimer");
    await expect(footer.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  test("landing footer does not expose direct mail links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(0);
  });

  test("support page uses the disabled contact form without direct mail links", async ({ page }) => {
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

  test("guidelines page renders", async ({ page }) => {
    await page.goto("/guidelines");
    await expect(page.locator("main")).toBeVisible();
  });

  test("privacy page renders", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("main")).toBeVisible();
  });

  test("disclaimer page renders", async ({ page }) => {
    await page.goto("/disclaimer");
    await expect(page.locator("main")).toBeVisible();
  });

  test("terms page renders", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("main")).toBeVisible();
  });
});
