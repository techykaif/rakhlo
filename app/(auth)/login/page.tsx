import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { copy } from "@/lib/i18n";

export const metadata = {
  title: "Sign in",
  description: "Sign in to Rakhlo.",
};

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow={{ en: "Rakhlo", hi: "Rakhlo" }}
      title={{ en: copy.en.auth.signInTitle, hi: copy.hi.auth.signInTitle }}
      subtitle={{ en: copy.en.auth.signInSubtitle, hi: copy.hi.auth.signInSubtitle }}
    >
      <AuthForm mode="signin" />
    </AuthCard>
  );
}
