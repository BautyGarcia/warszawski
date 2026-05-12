import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Warszawski — Anteojos de diseño";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadPlayfair(): Promise<ArrayBuffer | null> {
  try {
    // Serve Playfair Display Black 900 via Google's static fonts CDN.
    const res = await fetch(
      "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.ttf",
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const fontData = await loadPlayfair();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAF8",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 80,
            fontSize: 16,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#4A3A1F",
            fontWeight: 500,
          }}
        >
          Modelaje exclusivo
        </div>

        <div
          style={{
            fontFamily: fontData ? "Playfair" : "Georgia, serif",
            fontSize: 220,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#0A0A0A",
            lineHeight: 1,
            display: "flex",
          }}
        >
          WARSZAWSKI
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            fontWeight: 300,
            color: "#2C2C2C",
            letterSpacing: "-0.01em",
            display: "flex",
          }}
        >
          Anteojos de diseño
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 16,
            color: "#4A3A1F",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span>Mayoristas · Distribuidores</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#C4A265",
              }}
            />
            See Beyond
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Playfair", data: fontData, style: "normal", weight: 900 }]
        : undefined,
    },
  );
}
