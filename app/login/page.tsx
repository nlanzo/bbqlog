"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Navigation from "@/components/Navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please log in.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Error logging in:", error)
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
          <h2>Login</h2>

          {success && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#efe",
                color: "#3c3",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              {success}
            </div>
          )}

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
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#0070f3" }}>
              Register here
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
