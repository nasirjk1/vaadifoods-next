import "./globals.css"

export const metadata = {
  title: "Vaadi Foods",
  description: "Premium Kashmiri Brand",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}


