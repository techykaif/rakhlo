import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { copy } from "@/lib/i18n";

export const metadata = {
  title: "Choose a new password",
  description: "Choose a new Rakhlo password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="Rakhlo"
      title={copy.en.auth.resetTitle}
      subtitle={copy.en.auth.resetSubtitle}
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
