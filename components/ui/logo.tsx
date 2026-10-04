import Image from "next/image";
import { BRAND } from "@/lib/brand";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "on-light" | "on-dark" | "mono";
  compact?: boolean;
};

const markSources = {
  "on-light": "/brand/rakhlo-mark.svg",
  "on-dark": "/brand/rakhlo-mark-light.svg",
  mono: "/brand/rakhlo-mark.svg",
} as const;

const markClasses = {
  sm: "inline-flex shrink-0 overflow-hidden rounded-[9px] h-7 w-7",
  md: "inline-flex shrink-0 overflow-hidden rounded-[10px] h-8 w-8",
  lg: "inline-flex shrink-0 overflow-hidden rounded-[13px] h-10 w-10",
  xl: "inline-flex shrink-0 overflow-hidden rounded-[34px] h-40 w-40",
} as const;

const logoClasses = {
  sm: "inline-flex items-center gap-2.5 font-extrabold tracking-[-0.02em] text-base",
  md: "inline-flex items-center gap-2.5 font-extrabold tracking-[-0.02em] text-[19px]",
  lg: "inline-flex items-center gap-2.5 font-extrabold tracking-[-0.02em] text-[23px]",
  xl: "inline-flex items-center gap-2.5 font-extrabold tracking-[-0.02em]",
} as const;

const variantClasses = {
  "on-light": "text-[#141512]",
  "on-dark": "text-[#F7F6F1]",
  mono: "text-[#141512]",
} as const;

function markPixels(size: LogoProps["size"]) {
  if (size === "sm") return 28;
  if (size === "lg") return 40;
  if (size === "xl") return 160;
  return 32;
}

export function RakhloMark({
  size = "md",
  variant = "on-light",
}: Pick<LogoProps, "size" | "variant">) {
  const pixels = markPixels(size);

  return (
    <span className={markClasses[size]} aria-hidden="true">
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
      className={logoClasses[size] + " " + variantClasses[variant]}
      aria-label={BRAND.name}
    >
      <RakhloMark size={size} variant={variant} />
      {compact ? null : <span className="leading-none">{BRAND.wordmark}</span>}
    </span>
  );
}
