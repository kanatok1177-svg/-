import { ImageResponse } from "next/og";

// ブラウザタブ等で使われるアプリアイコン。
// MyTime のアクセントカラーを背景に、シンプルな時計モチーフを描く。
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "4.5px solid #f2fffa",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              width: 5,
              height: 15,
              marginLeft: -2.5,
              borderRadius: 3,
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
              width: 4,
              height: 19,
              marginLeft: -2,
              borderRadius: 3,
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
              width: 7,
              height: 7,
              marginLeft: -3.5,
              marginTop: -3.5,
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
