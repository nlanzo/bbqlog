"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/Navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push("/login?registered=true")
      } else {
        setError(data.error || "Failed to create account")
      }
    } catch (error) {
      console.error("Error registering:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navigation />

      <main className="container">
        <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
          <h2>Create Account</h2>

          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fee",
                color: "#c33",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="johndoe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                minLength={6}
              />
              <small style={{ color: "#666", fontSize: "0.875rem" }}>
                Must be at least 6 characters
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#0070f3" }}>
              Login here
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
