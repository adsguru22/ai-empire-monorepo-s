import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Empire - Command Center',
  description: 'AI Empire Command Center Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mono">{children}</body>
    </html>
  )
}