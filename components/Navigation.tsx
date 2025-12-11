"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navigation() {
  const { data: session, status } = useSession()

  return (
    <header className="header">
      <div className="container">
        <h1>🔥 BBQ Log</h1>
        <nav>
          <Link href="/">Home</Link>
          {status === "authenticated" ? (
            <>
              <Link href="/new">Log New Smoke</Link>
              <Link href="/compare">Compare Smokes</Link>
              <span style={{ color: "#666" }}>{session?.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0070f3",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
