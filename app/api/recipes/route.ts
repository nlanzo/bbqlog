import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    const where: any = {}
    if (userId) {
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
