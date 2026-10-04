import { ImageResponse } from "next/og";

function Mark({ size }: { size: number }) {
  const corner = Math.round(size * 0.22);
  const bookmarkW = Math.round(size * 0.36);
  const bookmarkH = Math.round(size * 0.52);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: corner,
        background: "#141512",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          width: bookmarkW,
          height: bookmarkH,
          background: "#F7F6F1",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
          position: "absolute",
          top: Math.round(size * 0.18),
          left: Math.round((size - bookmarkW) / 2),
        }}
      />
      <div
        style={{
          width: Math.round(size * 0.2),
          height: Math.round(size * 0.2),
          borderRadius: 999,
          background: "#C8F76A",
          position: "absolute",
          top: Math.round(size * 0.14),
          right: Math.round(size * 0.14),
        }}
      />
    </div>
  );
}

export function createRakhloIcon(size: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F6F1" }}>
        <Mark size={Math.round(size * 0.72)} />
      </div>
    ),
    { width: size, height: size },
  );
}

export function createRakhloShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#141512",
          color: "#F7F6F1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <Mark size={72} />
          <span style={{ fontSize: 34, fontWeight: 800 }}>rakhlo</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: "980px" }}>
          <span style={{ fontSize: 20, letterSpacing: "0.16em", fontWeight: 800, color: "#C8F76A" }}>
            YOUR THINGS, REMEMBERED.
          </span>
          <span style={{ marginTop: "18px", fontSize: 76, lineHeight: 0.96, fontWeight: 800, letterSpacing: "-0.045em" }}>
            Remember what you bought. Keep the proof. Stay ahead.
          </span>
          <span style={{ marginTop: "26px", fontSize: 24, lineHeight: 1.4, color: "#A7A8A0" }}>
            Purchases, proof, warranties, reminders and the details that matter, kept together.
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
