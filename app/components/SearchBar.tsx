"use client"

import { useState } from "react"
import { useSearch } from "../hooks/useSearch"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const { searchSongs } = useSearch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchSongs(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar canciones..."
        className="flex-1 px-3 py-2 border rounded-xl bg-gray-800 text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
      >
        Buscar
      </button>
    </form>
  )
}
