import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "1分スタート - 脱スマホ勉強スイッチ",
    short_name: "1分スタート",
    description:
      "スマホを開いた瞬間、1タップで勉強を始めるための着手ハードル最小化アプリ。",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
