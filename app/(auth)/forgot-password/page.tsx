import { AuthCard } from "@/components/auth/auth-card";
import { RecoveryForm } from "@/components/auth/recovery-form";
import { copy } from "@/lib/i18n";

export const metadata = {
  title: "Reset password",
  description: "Reset your Rakhlo password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Rakhlo"
      title={copy.en.auth.forgotTitle}
      subtitle={copy.en.auth.forgotSubtitle}
    >
      <RecoveryForm />
    </AuthCard>
  );
}
