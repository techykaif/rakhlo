import { validateAuthInput } from "../lib/validation/auth";

const messages = {
  emailRequired: "email required",
  passwordRequired: "password required",
  passwordTooShort: "password too short",
  passwordMismatch: "password mismatch",
};

describe("auth validation", () => {
  it("normalizes a valid sign-in email", () => {
    expect(
      validateAuthInput(
        { email: "  USER@EXAMPLE.COM ", password: "secret1" },
        "signin",
        messages,
      ),
    ).toEqual({ ok: true, email: "user@example.com" });
  });

  it("rejects an empty email", () => {
    expect(
      validateAuthInput({ email: " ", password: "secret1" }, "signin", messages),
    ).toEqual({ ok: false, error: messages.emailRequired });
  });

  it("rejects an empty password", () => {
    expect(
      validateAuthInput({ email: "user@example.com", password: "" }, "signin", messages),
    ).toEqual({ ok: false, error: messages.passwordRequired });
  });

  it("rejects a short password", () => {
    expect(
      validateAuthInput({ email: "user@example.com", password: "123" }, "signin", messages),
    ).toEqual({ ok: false, error: messages.passwordTooShort });
  });

  it("requires matching passwords when signing up", () => {
    expect(
      validateAuthInput(
        { email: "user@example.com", password: "secret1", confirmation: "secret2" },
        "signup",
        messages,
      ),
    ).toEqual({ ok: false, error: messages.passwordMismatch });
  });
});
