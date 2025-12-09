import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BBQ Log - Track Your Barbecue Attempts",
  description:
    "A platform for logging and tracking your barbecue cooking attempts",
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
