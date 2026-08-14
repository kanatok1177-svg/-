import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyTime - 今日の自由時間",
  description: "今日、自分にはあとどれくらい自由な時間があるのか？をひと目で確認できるアプリ。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#101213" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="min-h-dvh font-sans antialiased">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
