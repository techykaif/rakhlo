import { createRakhloShareImage } from "@/components/metadata/metadata-images";

export const alt = "Rakhlo - Your things, remembered.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createRakhloShareImage();
}
