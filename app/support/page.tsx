import { PublicPageContent } from "@/components/public/public-page";
import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function SupportPage() {
  return (
    <PublicSiteShell page="support">
      <PublicPageContent page="support" />
    </PublicSiteShell>
  );
}
