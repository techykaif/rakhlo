import { expect, test } from "@playwright/test";

test("landing page is usable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("You bought it.")).toBeVisible();
  await expect(page.getByText("Rakhlo remembers.")).toBeVisible();
  await expect(page.getByRole("link", { name: /log in/i }).first()).toHaveAttribute("href", "/login");
  await expect(page.getByRole("link", { name: /get started/i }).first()).toHaveAttribute("href", "/signup");
});
