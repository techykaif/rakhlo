import { describe, expect, it } from "vitest";
import {
  getReturnedAuthErrorMessage,
  getUnexpectedAuthErrorMessage,
} from "../lib/auth/errors";

const messages = {
  config: "config",
  network: "network",
  googleConfig: "google-config",
  fallback: "fallback",
};

describe("auth error classification", () => {
  it("maps disabled Google providers to the configuration message", () => {
    expect(
      getReturnedAuthErrorMessage("Unsupported provider: google", messages),
    ).toBe("google-config");
    expect(
      getUnexpectedAuthErrorMessage(
        new Error("Google provider is not enabled"),
        messages,
      ),
    ).toBe("google-config");
  });

  it("keeps network failures distinct", () => {
    expect(
      getReturnedAuthErrorMessage("Failed to fetch", messages),
    ).toBe("network");
  });
});
