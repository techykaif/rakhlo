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
      eyebrow={{ en: "Rakhlo", hi: "Rakhlo" }}
      title={{ en: copy.en.auth.forgotTitle, hi: copy.hi.auth.forgotTitle }}
      subtitle={{ en: copy.en.auth.forgotSubtitle, hi: copy.hi.auth.forgotSubtitle }}
    >
      <RecoveryForm />
    </AuthCard>
  );
}
