import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ThunderHacks 2026 | Algoma University Hackathon',
  description: 'Join ThunderHacks 2026 - Algoma University\'s premier hackathon event. Build, collaborate, and compete for amazing prizes!',
  generator: 'v0.app',
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
