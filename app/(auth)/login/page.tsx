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
      eyebrow="Rakhlo"
      title={copy.en.auth.signInTitle}
      subtitle={copy.en.auth.signInSubtitle}
    >
      <AuthForm mode="signin" />
    </AuthCard>
  );
}
