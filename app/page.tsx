import Link from "next/link"
import { prisma } from "@/lib/prisma"
import SmokeList from "@/components/SmokeList"
import Navigation from "@/components/Navigation"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const smokes = await prisma.smoke.findMany({
    where: {
      userId: user.id,
    },
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
      <Navigation />

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
