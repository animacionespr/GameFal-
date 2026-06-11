import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "App Evolution — AI-Powered App Analysis & Generation",
    template: "%s | App Evolution",
  },
  description:
    "Analyze any application and generate a superior version with AI. Extract patterns, fix UX issues, and get production-ready code in minutes.",
  keywords: [
    "app analysis",
    "AI code generation",
    "UX analysis",
    "product strategy",
    "Next.js",
    "startup tools",
  ],
  authors: [{ name: "App Evolution" }],
  creator: "App Evolution",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "App Evolution",
    title: "App Evolution — AI-Powered App Analysis & Generation",
    description:
      "Analyze any app and generate a superior version with production-ready code in minutes.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "App Evolution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "App Evolution — AI-Powered App Analysis & Generation",
    description: "Analyze any app and generate a superior version in minutes.",
    creator: "@appevolution",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
