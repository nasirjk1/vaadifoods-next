import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vaadi Foods Admin",
  description: "Admin panel for Vaadi Foods",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
