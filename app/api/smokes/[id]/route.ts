import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    const smoke = await prisma.smoke.findUnique({
      where: {
        id,
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

    if (!smoke) {
      return NextResponse.json({ error: "Smoke not found" }, { status: 404 })
    }

    // Ensure users can only access their own smokes
    if (smoke.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(smoke)
  } catch (error) {
    console.error("Error fetching smoke:", error)
    return NextResponse.json(
      { error: "Failed to fetch smoke" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // First check if smoke exists and belongs to user
    const existingSmoke = await prisma.smoke.findUnique({
      where: { id },
    })

    if (!existingSmoke) {
      return NextResponse.json({ error: "Smoke not found" }, { status: 404 })
    }

    if (existingSmoke.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { recipeTitle, date, smokerType, weather, details, rating } = body

    if (
      !recipeTitle ||
      !date ||
      !smokerType ||
      !weather ||
      !details ||
      rating === undefined
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

    const smoke = await prisma.smoke.update({
      where: { id },
      data: {
        recipeTitle,
        date: new Date(date),
        smokerType,
        weather,
        details,
        rating: parseInt(rating),
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

    return NextResponse.json(smoke)
  } catch (error) {
    console.error("Error updating smoke:", error)
    return NextResponse.json(
      { error: "Failed to update smoke" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // First check if smoke exists and belongs to user
    const existingSmoke = await prisma.smoke.findUnique({
      where: { id },
    })

    if (!existingSmoke) {
      return NextResponse.json({ error: "Smoke not found" }, { status: 404 })
    }

    if (existingSmoke.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.smoke.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Smoke deleted successfully" })
  } catch (error) {
    console.error("Error deleting smoke:", error)
    return NextResponse.json(
      { error: "Failed to delete smoke" },
      { status: 500 }
    )
  }
}
