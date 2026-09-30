import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rakhlo.xyz"),
  title: {
    default: "Rakhlo — Buy it. Save it. Remember it.",
    template: "%s | Rakhlo",
  },
  description:
    "Rakhlo is a simple, India-first way to remember what you bought, keep your receipts and payment proofs, and never miss an important date.",
  applicationName: "Rakhlo",
  keywords: [
    "Rakhlo",
    "purchase memory",
    "receipt manager",
    "warranty reminders",
    "India",
    "PWA",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rakhlo — Buy it. Save it. Remember it.",
    description:
      "Keep purchases, proof, memories and important dates in one simple place.",
    url: "https://rakhlo.xyz",
    siteName: "Rakhlo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakhlo — Buy it. Save it. Remember it.",
    description:
      "Keep purchases, proof, memories and important dates in one simple place.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
