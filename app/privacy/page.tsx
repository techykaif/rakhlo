import { PublicPageContent } from "@/components/public/public-page";
import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function PrivacyPage() {
  return (
    <PublicSiteShell page="privacy">
      <PublicPageContent page="privacy" />
    </PublicSiteShell>
  );
}
