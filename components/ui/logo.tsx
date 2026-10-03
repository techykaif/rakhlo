import Image from "next/image";
import { tw } from "@/components/ui/styles";
import { BRAND } from "@/lib/brand";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "on-light" | "on-dark" | "mono";
  compact?: boolean;
};

const markSources = {
  "on-light": "/brand/rakhlo-mark.svg",
  "on-dark": "/brand/rakhlo-mark-light.svg",
  mono: "/brand/rakhlo-mark.svg",
} as const;

function markPixels(size: LogoProps["size"]) {
  if (size === "sm") return 28;
  if (size === "lg") return 40;
  return 32;
}

export function RakhloMark({
  size = "md",
  variant = "on-light",
}: Pick<LogoProps, "size" | "variant">) {
  const pixels = markPixels(size);

  return (
    <span className={tw(`brand-mark brand-mark--${size}`)} aria-hidden="true">
      <Image
        src={markSources[variant]}
        alt=""
        width={pixels}
        height={pixels}
        priority={size !== "sm"}
      />
    </span>
  );
}

export function Logo({
  size = "md",
  variant = "on-light",
  compact = false,
}: LogoProps) {
  return (
    <span
      className={tw(`brand-logo brand-logo--${size} brand-logo--${variant}`)}
      aria-label={BRAND.name}
    >
      <RakhloMark size={size} variant={variant} />
      {compact ? null : <span className={tw("brand-logo__name")}>{BRAND.wordmark}</span>}
    </span>
  );
}
