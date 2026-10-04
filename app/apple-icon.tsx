import { createRakhloIcon } from "@/components/metadata/metadata-images";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return createRakhloIcon(size.width);
}
