import { PublicPageContent } from "@/components/public/public-page";
import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function DisclaimerPage() {
  return (
    <PublicSiteShell page="disclaimer">
      <PublicPageContent page="disclaimer" />
    </PublicSiteShell>
  );
}
