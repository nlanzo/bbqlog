import type { Metadata } from "next"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"

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
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
