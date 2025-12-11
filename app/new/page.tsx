"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navigation from "@/components/Navigation"

export default function NewSmoke() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    recipeTitle: "",
    date: new Date().toISOString().split("T")[0],
    smokerType: "",
    weather: "",
    details: "",
    rating: 5,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!session?.user?.id) {
      alert("You must be logged in to create a smoke")
      router.push("/login")
      return
    }

    try {
      const res = await fetch("/api/smokes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
          userId: session.user.id,
        }),
      })

      if (res.ok) {
        router.push("/")
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Failed to create smoke: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error creating smoke:", error)
      alert("Error creating smoke")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div>
        <Navigation />
        <main className="container">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Navigation />

      <main className="container">
        <h2>Log New BBQ Smoke</h2>

        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: "600px", marginTop: "2rem" }}
        >
          <div className="form-group">
            <label htmlFor="recipeTitle">Recipe Title *</label>
            <input
              id="recipeTitle"
              type="text"
              required
              value={formData.recipeTitle}
              onChange={(e) =>
                setFormData({ ...formData, recipeTitle: e.target.value })
              }
              placeholder="e.g., Texas Brisket"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="smokerType">Type of Smoker *</label>
            <input
              id="smokerType"
              type="text"
              required
              value={formData.smokerType}
              onChange={(e) =>
                setFormData({ ...formData, smokerType: e.target.value })
              }
              placeholder="e.g., Weber Smokey Mountain, Offset, Pellet Grill"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weather">Weather Conditions *</label>
            <input
              id="weather"
              type="text"
              required
              value={formData.weather}
              onChange={(e) =>
                setFormData({ ...formData, weather: e.target.value })
              }
              placeholder="e.g., Sunny, 75°F, Light Wind"
            />
          </div>

          <div className="form-group">
            <label htmlFor="details">Smoking Process Details *</label>
            <textarea
              id="details"
              required
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              placeholder="Describe what you did during the smoking process..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1-10) *</label>
            <input
              id="rating"
              type="number"
              min="1"
              max="10"
              required
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Saving..." : "Save Smoke"}
            </button>
            <Link href="/" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
