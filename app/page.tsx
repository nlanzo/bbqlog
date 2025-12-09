import Link from "next/link"
import { prisma } from "@/lib/prisma"
import SmokeList from "@/components/SmokeList"

export default async function Home() {
  // TODO: Filter by authenticated user once auth is implemented
  const smokes = await prisma.smoke.findMany({
    orderBy: { date: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>🔥 BBQ Log</h1>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/new">Log New Smoke</Link>
            <Link href="/compare">Compare Smokes</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2>Your BBQ Smokes</h2>
          <Link href="/new" className="btn">
            + Log New Smoke
          </Link>
        </div>

        <SmokeList initialSmokes={smokes} />
      </main>
    </div>
  )
}
