import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://thunderhacks.algomau.ca'),
  title: 'ThunderHacks II | Fall 2026 | Algoma University Hackathon',
  description:
    "ThunderHacks II is Algoma University's flagship hackathon, running October 14-16, 2026 across two campuses: Brampton (GTA) and Sault Ste. Marie (Northern Ontario). 3 Days. 2 Campuses. 1 Competition.",
  generator: 'v0.app',
  keywords: [
    'ThunderHacks',
    'ThunderHacks II',
    'Algoma University',
    'hackathon',
    'ALCOMS',
    'Brampton',
    'Sault Ste. Marie',
    'Fall 2026',
  ],
  openGraph: {
    title: 'ThunderHacks II | Fall 2026',
    description:
      '3 Days. 2 Campuses. 1 Competition. Algoma University\'s flagship hackathon returns October 14-16, 2026 across Brampton and Sault Ste. Marie.',
    url: 'https://thunderhacks.algomau.ca',
    siteName: 'ThunderHacks II',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/images/th-logo.png',
        width: 1200,
        height: 630,
        alt: 'ThunderHacks II, Fall 2026, Algoma University flagship hackathon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThunderHacks II | Fall 2026',
    description:
      '3 Days. 2 Campuses. 1 Competition. Algoma University\'s flagship hackathon, October 14-16, 2026.',
    images: ['/images/th-logo.png'],
  },
  icons: {
    icon: [
      {
        url: '/images/th-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/th-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/images/th-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
