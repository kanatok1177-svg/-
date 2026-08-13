import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1分スタート | 脱スマホ・勉強スイッチ",
  description:
    "スマホを開いた瞬間、1タップで勉強を始めるための着手ハードル最小化アプリ。",
  applicationName: "1分スタート",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "1分スタート",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0c",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body className="min-h-screen bg-surface font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
