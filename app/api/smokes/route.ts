import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const weather = searchParams.get("weather")
    const recipeTitle = searchParams.get("recipeTitle")
    const userId = searchParams.get("userId")

    const where: any = {}
    if (weather) {
      where.weather = weather
    }
    if (recipeTitle) {
      where.recipeTitle = recipeTitle
    }
    if (userId) {
      where.userId = userId
    }

    const orderBy: any = {}
    if (sortBy === "date") {
      orderBy.date = sortOrder
    } else if (sortBy === "rating") {
      orderBy.rating = sortOrder
    } else if (sortBy === "weather") {
      orderBy.weather = sortOrder
    }

    const smokes = await prisma.smoke.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(smokes)
  } catch (error) {
    console.error("Error fetching smokes:", error)
    return NextResponse.json(
      { error: "Failed to fetch smokes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipeTitle, date, smokerType, weather, details, rating, userId } =
      body

    if (
      !recipeTitle ||
      !date ||
      !smokerType ||
      !weather ||
      !details ||
      !rating ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 10" },
        { status: 400 }
      )
    }

    const smoke = await prisma.smoke.create({
      data: {
        recipeTitle,
        date: new Date(date),
        smokerType,
        weather,
        details,
        rating: parseInt(rating),
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(smoke, { status: 201 })
  } catch (error) {
    console.error("Error creating smoke:", error)
    return NextResponse.json(
      { error: "Failed to create smoke" },
      { status: 500 }
    )
  }
}
