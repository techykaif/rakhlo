import { tw } from "@/components/ui/styles";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
};

export function Logo({ size = "md", inverted = false }: LogoProps) {
  return (
    <span
      className={tw(`brand-logo brand-logo--${size}${inverted ? "brand-logo--inverted" : ""}`)}
      aria-label="Rakhlo"
    >
      <span className={tw("brand-logo__mark")} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className={tw("brand-logo__name")}>rakhlo</span>
    </span>
  );
}
