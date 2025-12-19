"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
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

export default function ComparePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [recipes, setRecipes] = useState<string[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<string>("")
  const [smokes, setSmokes] = useState<Smoke[]>([])
  const [selectedSmokes, setSelectedSmokes] = useState<string[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchRecipes()
    }
  }, [status, router])

  useEffect(() => {
    if (selectedRecipe && status === "authenticated") {
      fetchSmokesForRecipe(selectedRecipe)
    }
  }, [selectedRecipe, status])

  const fetchRecipes = async () => {
    if (!session?.user?.id) return
    const res = await fetch(`/api/recipes?userId=${session.user.id}`)
    const data = await res.json()
    setRecipes(data)
  }

  const fetchSmokesForRecipe = async (recipeTitle: string) => {
    if (!session?.user?.id) return
    const res = await fetch(
      `/api/smokes?recipeTitle=${encodeURIComponent(recipeTitle)}&userId=${
        session.user.id
      }`
    )
    const data = await res.json()
    setSmokes(data)
    setSelectedSmokes([])
  }

  const toggleSmoke = (smokeId: string) => {
    setSelectedSmokes((prev) =>
      prev.includes(smokeId)
        ? prev.filter((id) => id !== smokeId)
        : [...prev, smokeId]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const comparisonSmokes = smokes.filter((s) => selectedSmokes.includes(s.id))

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
        <h2>Compare Smokes</h2>

        <div
          className="form-group"
          style={{ maxWidth: "400px", marginTop: "2rem" }}
        >
          <label htmlFor="recipeSelect">Select Recipe:</label>
          <select
            id="recipeSelect"
            value={selectedRecipe}
            onChange={(e) => setSelectedRecipe(e.target.value)}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            <option value="">-- Choose a recipe --</option>
            {recipes.map((recipe) => (
              <option key={recipe} value={recipe}>
                {recipe}
              </option>
            ))}
          </select>
        </div>

        {selectedRecipe && smokes.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Select smokes to compare (select 2 or more):</h3>
            <div className="smoke-list" style={{ marginTop: "1rem" }}>
              {smokes.map((smoke) => (
                <div
                  key={smoke.id}
                  className="card"
                  style={{
                    cursor: "pointer",
                    border: selectedSmokes.includes(smoke.id)
                      ? "2px solid #8b4513"
                      : "1px solid #ddd",
                  }}
                  onClick={() => router.push(`/smokes/${smoke.id}`)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSmoke(smoke.id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSmokes.includes(smoke.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggleSmoke(smoke.id)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4>{smoke.recipeTitle}</h4>
                      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                        {formatDate(smoke.date)} • Rating: {smoke.rating}/10
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedRecipe && smokes.length === 0 && (
          <div className="card" style={{ marginTop: "2rem" }}>
            <p>No smokes found for this recipe.</p>
          </div>
        )}

        {comparisonSmokes.length >= 2 && (
          <div style={{ marginTop: "3rem" }}>
            <h3>Comparison</h3>
            <div className="comparison-grid">
              {comparisonSmokes.map((smoke) => (
                <div
                  key={smoke.id}
                  className="card comparison-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/smokes/${smoke.id}`)}
                >
                  <h4>{smoke.recipeTitle}</h4>
                  <div style={{ marginTop: "1rem" }}>
                    <p>
                      <strong>Date:</strong> {formatDate(smoke.date)}
                    </p>
                    <p>
                      <strong>Smoker:</strong> {smoke.smokerType}
                    </p>
                    <p>
                      <strong>Weather:</strong> {smoke.weather}
                    </p>
                    <p>
                      <strong>Rating:</strong>{" "}
                      <span className="rating">{smoke.rating}/10</span>
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                      <strong>Details:</strong>
                      <p
                        style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}
                      >
                        {smoke.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedRecipe &&
          selectedSmokes.length > 0 &&
          selectedSmokes.length < 2 && (
            <div
              className="card"
              style={{ marginTop: "2rem", background: "#fff3cd" }}
            >
              <p>Select at least 2 smokes to compare.</p>
            </div>
          )}
      </main>
    </div>
  )
}
