import { SupabaseConfigError } from "@/lib/supabase/config";

type AuthErrorMessages = {
  config: string;
  network: string;
  googleConfig?: string;
  fallback: string;
};

export function getUnexpectedAuthErrorMessage(
  error: unknown,
  messages: AuthErrorMessages,
) {
  if (/unsupported provider|provider.*not.*enabled|google.*not.*enabled|google.*not.*configured/i.test(error instanceof Error ? error.message : "")) {
    return messages.googleConfig || messages.fallback;
  }

  if (error instanceof SupabaseConfigError) {
    console.error("[Rakhlo auth] Supabase configuration error:", error.message);
    return messages.config;
  }

  const message = error instanceof Error ? error.message : "";
  if (/unsupported provider|provider.*not.*enabled|google.*not.*enabled|google.*not.*configured/i.test(message)) {
    return messages.googleConfig || message;
  }
  if (/failed to fetch|fetch failed|network error|load failed/i.test(message)) {
    return messages.network;
  }

  console.error(
    "[Rakhlo auth] Unexpected authentication error:",
    message || "Unknown error",
  );
  return messages.fallback;
}

export function getReturnedAuthErrorMessage(
  message: string | undefined,
  messages: Pick<AuthErrorMessages, "network" | "googleConfig">,
) {
  if (!message) return undefined;
  if (/unsupported provider|provider.*not.*enabled|google.*not.*enabled|google.*not.*configured/i.test(message)) {
    return messages.googleConfig || message;
  }
  if (/failed to fetch|fetch failed|network error|load failed/i.test(message)) {
    return messages.network;
  }
  return message;
}
