import React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { EVENT } from "@/lib/content"
import "@fontsource-variable/archivo/standard.css"
import "./globals.css"

/*
 * Archivo carries the whole page. It is a variable family with a width axis,
 * which the display styles in globals.css use to set headlines expanded while
 * body copy stays at normal width. It is self-hosted through the fontsource
 * package rather than fetched from Google Fonts at build time, so a deploy
 * never depends on a third-party request succeeding.
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://thunderhacks.algomau.ca"),
  title: EVENT.metaTitle,
  description: EVENT.metaDescription,
  keywords: [
    "ThunderHacks",
    "ThunderHacks II",
    "Algoma University",
    "hackathon",
    "ALCOMS",
    "Brampton",
    "Sault Ste. Marie",
    "Fall 2026",
  ],
  openGraph: {
    title: "ThunderHacks II | October 14-16, 2026",
    description: EVENT.metaDescription,
    url: "https://thunderhacks.algomau.ca",
    siteName: "ThunderHacks II",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/th-logo.png",
        width: 1200,
        height: 630,
        alt: "ThunderHacks II, October 14-16, 2026, Algoma University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThunderHacks II | October 14-16, 2026",
    description: EVENT.metaDescription,
    images: ["/images/th-logo.png"],
  },
  icons: {
    icon: "/images/th-logo.png",
    apple: "/images/th-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--bolt)] focus:px-4 focus:py-2 focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
