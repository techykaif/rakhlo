import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { LanguageProvider } from "@/components/ui/language-provider";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL("https://rakhlo.xyz"),
  title: {
    default: `${BRAND.name} | Buy it. Save it. Remember it.`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [BRAND.name, "purchase memory", "receipt manager", "warranty reminders", "India", "PWA"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BRAND.name} | Buy it. Save it. Remember it.`,
    description: "Keep purchases, proof, memories and important dates in one simple place.",
    url: "https://rakhlo.xyz",
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | Buy it. Save it. Remember it.`,
    description: "Keep purchases, proof, memories and important dates in one simple place.",
  },
  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: BRAND.colors.ink,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f7f6f2] font-sans text-[#171713] antialiased">
        <LanguageProvider>
          {children}
          <RegisterServiceWorker />
        </LanguageProvider>
      </body>
    </html>
  );
}
