import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight : ["400","500","600","700"]
});

export const metadata: Metadata = {
  title: "TARS - Tethered AI Runtime Shell",
  description: "TARS is a browser-based IDE inspired by Cursor AI, combining real-time collaborative code editing with a tethered AI runtime. It features AI-powered code suggestions and quick edits (Cmd+K), a conversational assistant, in-browser code execution via WebContainers, GitHub import/export, and multi-file project management.Resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
    <>
    <ClerkProvider 
    appearance={{ 
      theme :dark,
      }}>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
        className={`${inter} ${plexMono} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            {children}
             <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          </ThemeProvider>
        </body>
      </html>
      </ClerkProvider>
    </>
  );
}
