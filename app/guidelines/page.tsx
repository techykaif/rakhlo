import { PublicPageContent } from "@/components/public/public-page";
import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function GuidelinesPage() {
  return (
    <PublicSiteShell page="guidelines">
      <PublicPageContent page="guidelines" />
    </PublicSiteShell>
  );
}
