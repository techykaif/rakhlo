export function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n]/.test(value)) {
    return "/dashboard";
  }

  try {
    const url = new URL(value, "https://rakhlo.invalid");
    if (url.origin !== "https://rakhlo.invalid") return "/dashboard";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/dashboard";
  }
}
