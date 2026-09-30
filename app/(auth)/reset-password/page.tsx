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
      eyebrow={{ en: "Rakhlo", hi: "Rakhlo" }}
      title={{ en: copy.en.auth.resetTitle, hi: copy.hi.auth.resetTitle }}
      subtitle={{ en: copy.en.auth.resetSubtitle, hi: copy.hi.auth.resetSubtitle }}
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
