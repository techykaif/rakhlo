import { redirectIfAuthenticated } from "@/lib/auth/guest";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";
import { copy } from "@/lib/i18n";

import { BRAND } from "@/lib/brand";
export const metadata = {
  title: "Sign in",
  description: `Sign in to ${BRAND.name}.`,
};

export default async function LoginPage() {
  await redirectIfAuthenticated();
  return (
    <AuthCard
      eyebrow={{ en: BRAND.name, hi: BRAND.name }}
      title={{ en: copy.en.auth.signInTitle, hi: copy.hi.auth.signInTitle }}
      subtitle={{ en: copy.en.auth.signInSubtitle, hi: copy.hi.auth.signInSubtitle }}
      variant="signin"
      visualKicker={{ en: "WELCOME BACK", hi: "फिर स्वागत है" }}
      visualTitle={{ en: "Keep what you bought close.", hi: "जो खरीदा है, उसे संभालकर रखें।" }}
      visualText={{ en: "Rakhlo keeps the useful details after the payment: the purchase, the proof and the dates that matter.", hi: "Rakhlo भुगतान के बाद की काम की जानकारी — खरीदारी, सबूत और जरूरी तारीखें — एक जगह रखता है।" }}
    >
      <AuthForm mode="signin" />
    </AuthCard>
  );
}
