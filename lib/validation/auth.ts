export type AuthValidation = {
  email: string;
  password: string;
  confirmation?: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateAuthInput(
  input: AuthValidation,
  mode: "signin" | "signup",
  messages: {
    emailRequired: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordMismatch: string;
  },
) {
  const email = normalizeEmail(input.email);

  if (!email) return { ok: false as const, error: messages.emailRequired };
  if (!input.password) return { ok: false as const, error: messages.passwordRequired };
  if (input.password.length < 6) return { ok: false as const, error: messages.passwordTooShort };

  if (mode === "signup" && input.password !== input.confirmation) {
    return { ok: false as const, error: messages.passwordMismatch };
  }

  return { ok: true as const, email };
}
