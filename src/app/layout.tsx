import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Aura: Mood & Productivity Dashboard",
  description: "An AI-powered dashboard to track mood and productivity, with personalized insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* REMOVED: Inline script for theme */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // FIX: Added backticks here
      >
        {children}
      </body>
    </html>
  );
}
