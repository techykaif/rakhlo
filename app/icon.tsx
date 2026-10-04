import { createRakhloIcon } from "@/components/metadata/metadata-images";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return createRakhloIcon(size.width);
}
