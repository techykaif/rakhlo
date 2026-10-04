import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: "https://rakhlo.xyz/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["status", "support", "guidelines", "privacy", "disclaimer", "terms"].map((path) => ({
      url: `https://rakhlo.xyz/${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
