import { AuthCard } from "@/components/auth/auth-card";
import { RecoveryForm } from "@/components/auth/recovery-form";
import { copy } from "@/lib/i18n";

import { BRAND } from "@/lib/brand";
export const metadata = {
  title: "Reset password",
  description: `Reset your ${BRAND.name} password.`,
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow={{ en: BRAND.name, hi: BRAND.name }}
      title={{ en: copy.en.auth.forgotTitle, hi: copy.hi.auth.forgotTitle }}
      subtitle={{ en: copy.en.auth.forgotSubtitle, hi: copy.hi.auth.forgotSubtitle }}
      mode="signin"
    >
      <RecoveryForm />
    </AuthCard>
  );
}
