import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rakhlo",
    short_name: "Rakhlo",
    description:
      "Remember what you bought, where you bought it, and the dates that matter.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f2",
    theme_color: "#171713",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
