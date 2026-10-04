import { createRakhloIcon } from "@/components/metadata/metadata-images";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return createRakhloIcon(size.width);
}
