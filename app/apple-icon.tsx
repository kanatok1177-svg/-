import { ImageResponse } from "next/og";

// iOS ホーム画面用アイコン。角丸は iOS 側で自動適用されるため、
// ここでは端まで塗りつぶした正方形として描く。
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1cc99a 0%, #0a8a68 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 118,
            height: 118,
            borderRadius: "50%",
            border: "13px solid #f2fffa",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              width: 14,
              height: 42,
              marginLeft: -7,
              borderRadius: 8,
              background: "#f2fffa",
              transform: "rotate(-58deg)",
              transformOrigin: "bottom center",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              width: 12,
              height: 54,
              marginLeft: -6,
              borderRadius: 8,
              background: "#f2fffa",
              transform: "rotate(58deg)",
              transformOrigin: "bottom center",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
              borderRadius: "50%",
              background: "#f2fffa",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
