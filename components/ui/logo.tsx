type LogoProps = {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
};

export function Logo({ size = "md", inverted = false }: LogoProps) {
  return (
    <span
      className={`brand-logo brand-logo--${size}${inverted ? " brand-logo--inverted" : ""}`}
      aria-label="Rakhlo"
    >
      <span className="brand-logo__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-logo__name">rakhlo</span>
    </span>
  );
}
