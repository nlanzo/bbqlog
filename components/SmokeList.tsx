"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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

interface SmokeListProps {
  initialSmokes: Smoke[]
}

export default function SmokeList({ initialSmokes }: SmokeListProps) {
  const [smokes, setSmokes] = useState<Smoke[]>(initialSmokes)
  const [sortBy, setSortBy] = useState<"date" | "rating" | "weather">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterWeather, setFilterWeather] = useState<string>("all")

  useEffect(() => {
    fetchSmokes()
  }, [sortBy, sortOrder, filterWeather])

  const fetchSmokes = async () => {
    const params = new URLSearchParams({
      sortBy,
      sortOrder,
      ...(filterWeather !== "all" && { weather: filterWeather }),
    })
    const res = await fetch(`/api/smokes?${params}`)
    const data = await res.json()
    setSmokes(data)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const uniqueWeatherTypes = Array.from(
    new Set(initialSmokes.map((s) => s.weather))
  )

  return (
    <div>
      <div className="filters">
        <div>
          <label htmlFor="sortBy">Sort by: </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "rating" | "weather")
            }
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="weather">Weather</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder">Order: </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div>
          <label htmlFor="filterWeather">Weather: </label>
          <select
            id="filterWeather"
            value={filterWeather}
            onChange={(e) => setFilterWeather(e.target.value)}
          >
            <option value="all">All</option>
            {uniqueWeatherTypes.map((weather) => (
              <option key={weather} value={weather}>
                {weather}
              </option>
            ))}
          </select>
        </div>
      </div>

      {smokes.length === 0 ? (
        <div className="card">
          <p>No smokes found. Start logging your BBQ smokes!</p>
        </div>
      ) : (
        <div className="smoke-list">
          {smokes.map((smoke) => (
            <div key={smoke.id} className="card smoke-card">
              <h3>{smoke.recipeTitle}</h3>
              <p>{smoke.details}</p>
              <div className="smoke-meta">
                <span>
                  <strong>Date:</strong> {formatDate(smoke.date)}
                </span>
                <span>
                  <strong>Smoker:</strong> {smoke.smokerType}
                </span>
                <span>
                  <strong>Weather:</strong> {smoke.weather}
                </span>
                <span className="rating">
                  <strong>Rating:</strong> {smoke.rating}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
