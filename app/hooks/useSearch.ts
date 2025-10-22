import { useState } from "react"

export function useSearch() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const searchSongs = async (query: string) => {
    if (!query) return
    setLoading(true)
    try {
      const res = await fetch(`/api/search/streaming?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error("Error al buscar canciones:", error)
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, searchSongs }
}
