"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navigation from "@/components/Navigation"

interface Smoke {
  id: string
  recipeTitle: string
  date: string
  smokerType: string
  weather: string
  details: string
  rating: number
  userId: string
  user?: {
    id: string
    username: string
  }
}

export default function SmokeDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [smoke, setSmoke] = useState<Smoke | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    recipeTitle: "",
    date: "",
    smokerType: "",
    weather: "",
    details: "",
    rating: 5,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && params?.id) {
      fetchSmoke()
    }
  }, [status, params?.id, router])

  const fetchSmoke = async () => {
    if (!params?.id) return

    try {
      const smokeId = Array.isArray(params.id) ? params.id[0] : params.id
      const res = await fetch(`/api/smokes/${smokeId}`)
      if (res.ok) {
        const data = await res.json()
        setSmoke(data)
        setFormData({
          recipeTitle: data.recipeTitle,
          date: new Date(data.date).toISOString().split("T")[0],
          smokerType: data.smokerType,
          weather: data.weather,
          details: data.details,
          rating: data.rating,
        })
      } else if (res.status === 404) {
        router.push("/")
      } else {
        alert("Failed to load smoke details")
        router.push("/")
      }
    } catch (error) {
      console.error("Error fetching smoke:", error)
      alert("Error loading smoke details")
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (!params?.id) {
      alert("Invalid smoke ID")
      setSaving(false)
      return
    }

    try {
      const smokeId = Array.isArray(params.id) ? params.id[0] : params.id
      const res = await fetch(`/api/smokes/${smokeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      })

      if (res.ok) {
        const updatedSmoke = await res.json()
        setSmoke(updatedSmoke)
        setIsEditing(false)
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Failed to update smoke: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating smoke:", error)
      alert("Error updating smoke")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this smoke? This action cannot be undone."
      )
    ) {
      return
    }

    if (!params?.id) {
      alert("Invalid smoke ID")
      return
    }

    setDeleting(true)

    try {
      const smokeId = Array.isArray(params.id) ? params.id[0] : params.id
      const res = await fetch(`/api/smokes/${smokeId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/")
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Failed to delete smoke: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error deleting smoke:", error)
      alert("Error deleting smoke")
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (status === "loading" || loading) {
    return (
      <div>
        <Navigation />
        <main className="container">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  if (!smoke) {
    return (
      <div>
        <Navigation />
        <main className="container">
          <p>Smoke not found.</p>
          <Link href="/" className="btn">
            Back to Smoke Log
          </Link>
        </main>
      </div>
    )
  }

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
          <h2>Smoke Details</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="btn">
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-secondary"
                  disabled={deleting}
                  style={{ background: "#dc3545" }}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form
            onSubmit={handleSave}
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
                  setFormData({
                    ...formData,
                    rating: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/" className="btn btn-secondary">
                Back to Smoke Log
              </Link>
            </div>
          </form>
        ) : (
          <div className="card" style={{ maxWidth: "800px" }}>
            <h3 style={{ color: "#8b4513", marginBottom: "1rem" }}>
              {smoke.recipeTitle}
            </h3>

            <div style={{ marginTop: "1.5rem" }}>
              <p>
                <strong>Date:</strong> {formatDate(smoke.date)}
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Smoker:</strong> {smoke.smokerType}
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Weather:</strong> {smoke.weather}
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Rating:</strong>{" "}
                <span className="rating">{smoke.rating}/10</span>
              </p>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <strong>Details:</strong>
              <p
                style={{
                  marginTop: "0.5rem",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                }}
              >
                {smoke.details}
              </p>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Link href="/" className="btn btn-secondary">
                Back to Smoke Log
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
