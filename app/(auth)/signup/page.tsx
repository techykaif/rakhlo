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
      variant="signup"
      visualKicker={{ en: "START YOUR MEMORY", hi: "अपनी याद शुरू करें" }}
      visualTitle={{ en: "A calmer place for the things you own.", hi: "अपनी चीज़ों के लिए एक शांत जगह।" }}
      visualText={{ en: "Save what you bought now. Add proof and reminders whenever they become useful.", hi: "अभी जो खरीदा है उसे सहेजें। जरूरत पड़ने पर सबूत और रिमाइंडर जोड़ें।" }}
    >
      <AuthForm mode="signup" />
    </AuthCard>
  );
}
