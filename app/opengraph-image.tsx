import { ImageResponse } from "next/og";

export const alt = "Mar Kevin Alcantara — Data Analyst Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 84px",
        background: "#050505",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 5 }}>
        <span style={{ width: 14, height: 14, borderRadius: 99, background: "#ffffff" }} />
        DATA ANALYST // PORTFOLIO
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, lineHeight: 0.95 }}>
          <span>Mar Kevin</span>
          <span>Alcantara</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#b8b8b8" }}>
          SQL · Python · Power BI · Automation · ETL
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8d8d8d" }}>
        <span>Turning raw data into reliable decisions.</span>
        <span>Taguig City, Philippines</span>
      </div>
    </div>,
    size,
  );
}
