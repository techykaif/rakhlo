import { ImageResponse } from "next/og";

const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="18" fill="#141512"/><path d="M18 18.5C18 12.701 22.701 8 28.5 8H35.5C41.299 8 46 12.701 46 18.5V49L32 39L18 49V18.5Z" fill="#F7F6F1"/><circle cx="46" cy="18" r="7" fill="#C8F76A"/></svg>`;
const MARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(MARK_SVG)}`;

export function createRakhloIcon(size: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F6F1" }}>
        <img src={MARK_DATA_URI} alt="" width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} />
      </div>
    ),
    { width: size, height: size },
  );
}

export function createRakhloShareImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px", background: "#141512", color: "#F7F6F1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <img src={MARK_DATA_URI} alt="" width="72" height="72" />
          <span style={{ fontSize: 34, fontWeight: 800 }}>rakhlo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "980px" }}>
          <span style={{ fontSize: 20, letterSpacing: "0.16em", fontWeight: 800, color: "#C8F76A", textTransform: "uppercase" }}>Your things, remembered.</span>
          <span style={{ marginTop: "18px", fontSize: 76, lineHeight: 0.96, fontWeight: 800, letterSpacing: "-0.045em" }}>Remember what you bought. Keep the proof. Stay ahead.</span>
          <span style={{ marginTop: "26px", fontSize: 24, lineHeight: 1.4, color: "#A7A8A0" }}>Purchases, proof, warranties, reminders and the details that matter, kept together.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
