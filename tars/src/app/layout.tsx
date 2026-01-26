import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Provider } from "@/components/Provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "TARS",
  description: "TARS is a browser-based IDE inspired by Cursor AI, combining real-time collaborative code editing with a tethered AI runtime. It features AI-powered code suggestions and quick edits (Cmd+K), a conversational assistant, in-browser code execution via WebContainers, GitHub import/export, and multi-file project management.Resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>

      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${inter} ${plexMono} antialiased`}>
          <Provider>
            {children}
          </Provider>
        </body>
      </html>

    </>
  );
}
