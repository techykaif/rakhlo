import { redirectIfAuthenticated } from "@/lib/auth/guest";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { copy } from "@/lib/i18n";

import { BRAND } from "@/lib/brand";
export const metadata = {
  title: "Create account",
  description: `Create your ${BRAND.name} account.`,
};

export default async function SignUpPage() {
  await redirectIfAuthenticated();
  return (
    <AuthCard
      eyebrow={{ en: BRAND.name, hi: BRAND.name }}
      title={{ en: copy.en.auth.signUpTitle, hi: copy.hi.auth.signUpTitle }}
      subtitle={{ en: copy.en.auth.signUpSubtitle, hi: copy.hi.auth.signUpSubtitle }}
      mode="signup"
    >
      <AuthForm mode="signup" />
    </AuthCard>
  );
}
