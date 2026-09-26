import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brushFont = Permanent_Marker({
  weight: "400",
  variable: "--font-brush",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Legalens — Make Yourself Legally Educated",
  description:
    "Legalens is a GenAI-powered legal literacy and document intelligence platform for India. Analyze contracts, detect risks, translate to vernacular languages, and get actionable legal insights — all powered by Google Gemini.",
  keywords: [
    "legal AI",
    "contract analysis",
    "legal literacy India",
    "document intelligence",
    "GenAI legal",
    "DPDPA 2023",
    "Google Gemini",
  ],
  authors: [{ name: "Visionary Code Studio" }],
  icons: {
    icon: "/logo_updated.png",
    shortcut: "/logo_updated.png",
    apple: "/logo_updated.png",
  },
  openGraph: {
    title: "Legalens — Make Yourself Legally Educated",
    description:
      "AI-powered legal document analysis, risk detection, and vernacular translation for India.",
    type: "website",
    locale: "en_IN",
    siteName: "Legalens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${brushFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Accessibility: Skip to main content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
