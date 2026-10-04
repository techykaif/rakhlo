import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));
const { redirect } = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock("../lib/supabase/server", () => ({ createClient }));
vi.mock("next/navigation", () => ({ redirect }));

import { redirectIfAuthenticated } from "../lib/auth/guest";

describe("guest route protection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects authenticated users to the dashboard", async () => {
    createClient.mockResolvedValue({ auth: { getClaims: vi.fn().mockResolvedValue({ data: { claims: { sub: "user-123" } } }) } });
    await redirectIfAuthenticated();
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("does not redirect anonymous users", async () => {
    createClient.mockResolvedValue({ auth: { getClaims: vi.fn().mockResolvedValue({ data: { claims: null } }) } });
    await expect(redirectIfAuthenticated()).resolves.toBeUndefined();
    expect(redirect).not.toHaveBeenCalled();
  });
});
