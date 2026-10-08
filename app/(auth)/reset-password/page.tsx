import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { copy } from "@/lib/i18n";

import { BRAND } from "@/lib/brand";
export const metadata = {
  title: "Choose a new password",
  description: `Choose a new ${BRAND.name} password.`,
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow={{ en: BRAND.name, hi: BRAND.name }}
      title={{ en: copy.en.auth.resetTitle, hi: copy.hi.auth.resetTitle }}
      subtitle={{ en: copy.en.auth.resetSubtitle, hi: copy.hi.auth.resetSubtitle }}
      mode="signin"
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
