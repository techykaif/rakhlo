import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { copy } from "@/lib/i18n";

export const metadata = {
  title: "Create account",
  description: "Create your Rakhlo account.",
};

export default function SignUpPage() {
  return (
    <AuthCard
      eyebrow="Rakhlo"
      title={copy.en.auth.signUpTitle}
      subtitle={copy.en.auth.signUpSubtitle}
    >
      <AuthForm mode="signup" />
    </AuthCard>
  );
}
