import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationSettings } from "../components/reminders/notification-settings";
import { LanguageProvider } from "../components/ui/language-provider";

describe("NotificationSettings", () => {
  const requestPermission = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("Notification", { permission: "denied", requestPermission });
    vi.stubGlobal("PushManager", class {});
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { ready: Promise.resolve({ pushManager: { getSubscription: vi.fn().mockResolvedValue(null) } }) },
    });
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: { query: vi.fn().mockRejectedValue(new Error("unsupported")) },
    });
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ preferences: { enabled: true } }))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not request permission from How to allow", async () => {
    render(<LanguageProvider><NotificationSettings /></LanguageProvider>);
    const help = await screen.findByRole("button", { name: "How to allow" });
    fireEvent.click(help);
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("does not request permission while the browser still reports denied", async () => {
    render(<LanguageProvider><NotificationSettings /></LanguageProvider>);
    const retry = await screen.findByRole("button", { name: "I've allowed it — check again" });
    fireEvent.click(retry);
    expect(requestPermission).not.toHaveBeenCalled();
  });
});
