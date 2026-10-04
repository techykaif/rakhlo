import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppNav } from "../components/app/app-nav";

const usePathname = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  usePathname,
}));

describe("app navigation", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/purchases/new");
  });

  it("marks Add active on the new purchase route without also activating Purchases", () => {
    render(<AppNav language="en" mobile />);

    expect(screen.getByRole("link", { name: "Add" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Purchases" }).getAttribute("aria-current")).toBeNull();
    expect(screen.queryByRole("link", { name: "Status" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Support" })).toBeNull();
  });
});
