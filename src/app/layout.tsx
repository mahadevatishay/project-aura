import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Remove DataProvider and ThemeProvider imports from here
// import { DataProvider } from './context/DataContext';
// import { ThemeProvider, useTheme } from './context/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata MUST be exported from a Server Component
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
    // The <html> tag must be returned directly by the root layout
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Children will be wrapped by ThemeProvider and DataProvider in page.tsx or a wrapper */}
        {children}
      </body>
    </html>
  );
}
