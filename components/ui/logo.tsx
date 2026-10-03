import { tw } from "@/components/ui/styles";
import { BRAND } from "@/lib/brand";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "mono";
};

type MarkProps = {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "mono";
};

export function RakhloMark({ size = "md", variant = "light" }: MarkProps) {
  return (
    <span
      className={tw(`brand-mark brand-mark--${size} brand-mark--${variant}`)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="62" height="62" rx="18" className={tw("brand-mark__bg")} />
        <path
          d="M18 18.5C18 12.701 22.701 8 28.5 8H35.5C41.299 8 46 12.701 46 18.5V49L32 39L18 49V18.5Z"
          className={tw("brand-mark__bookmark")}
        />
        {variant !== "mono" ? (
          <circle cx="46" cy="18" r="7" className={tw("brand-mark__accent")} />
        ) : null}
      </svg>
    </span>
  );
}

export function Logo({ size = "md", variant = "light" }: LogoProps) {
  return (
    <span className={tw(`brand-logo brand-logo--${size} brand-logo--${variant}`)} aria-label={BRAND.name}>
      <RakhloMark size={size} variant={variant} />
      <span className={tw("brand-logo__name")}>{BRAND.wordmark}</span>
    </span>
  );
}
