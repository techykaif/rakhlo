import { PublicPageContent } from "@/components/public/public-page";
import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function TermsPage() {
  return (
    <PublicSiteShell page="terms">
      <PublicPageContent page="terms" />
    </PublicSiteShell>
  );
}
