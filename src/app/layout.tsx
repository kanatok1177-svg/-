import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "イベントカウントダウン",
  description: "大切なイベントまでの残り日数をシンプルに管理できるカウントダウンアプリ",
};

// Applies a saved light/dark choice before first paint to avoid a flash.
// "system" (nothing saved) leaves <html> untouched so prefers-color-scheme decides.
const themeInitScript = `try{var t=localStorage.getItem("event-countdown:theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
