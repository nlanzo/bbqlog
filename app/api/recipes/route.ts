import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || session.user.id

    // Ensure users can only access their own recipes
    const where: any = {
      userId: session.user.id,
    }
    // Override userId only if it matches the authenticated user
    if (userId && userId === session.user.id) {
      where.userId = userId
    }

    const smokes = await prisma.smoke.findMany({
      where,
      select: {
        recipeTitle: true,
      },
      distinct: ["recipeTitle"],
      orderBy: {
        recipeTitle: "asc",
      },
    })

    const recipes = smokes.map((smoke) => smoke.recipeTitle)
    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    )
  }
}
