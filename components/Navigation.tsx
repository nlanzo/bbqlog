"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navigation() {
  const { data: session, status } = useSession()

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1>🔥 BBQ Log</h1>
          <nav>
            <Link href="/">Home</Link>
            {status === "authenticated" ? (
              <>
                <Link href="/new">Log New Smoke</Link>
                <Link href="/compare">Compare Smokes</Link>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
        {status === "authenticated" && (
          <div className="header-user">
            <span className="username">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
