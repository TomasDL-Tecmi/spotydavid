// Archivo: page.tsx
'use client'

import React, { useState, useRef } from 'react'
import SongGrid from './components/SongGrid'
import PlayerBar from './components/PlayerBar'
import { usePlayer, Song } from './hooks/usePlayer'
import CreatePlaylistButton from './components/CreatePlaylistButton'
import SkeletonCard from './components/SkeletonCard'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const player = usePlayer()
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSearch = async () => {
    const query = searchTerm.trim()
    if (!query) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller
    setLoading(true)
    setSongs([])

    try {
      const res = await fetch(
        `/api/search/streaming?q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      )

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
      const data = await res.json()

      if (!controller.signal.aborted) {
        setSongs(data)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('🔸 Búsqueda cancelada')
      } else {
        console.error('❌ Error al buscar:', err)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4 pb-28">
      <div className="max-w-5xl mx-auto">
        {/* 🔍 Input de búsqueda */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar canciones y presiona Enter..."
          className="w-full p-4 rounded-lg shadow-sm border border-gray-700 bg-[#282828] text-[#e1e1e1] focus:outline-none focus:ring-2 focus:ring-[#1db954]"
        />

        {/* 🟩 Pantalla inicial sin búsqueda */}
        {!loading && songs.length === 0 && searchTerm.trim() === '' && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <CreatePlaylistButton onClick={() => console.log('Crear playlist')} />
          </div>
        )}

        {/* 🎵 Mostrar resultados o Skeleton */}
        {loading ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : songs.length > 0 ? (
          <SongGrid
            songs={songs}
            estimatedResults={songs.length}
            onSelect={(song, i) => player.playSong(song, i, songs)}
          />
        ) : (
          searchTerm.trim() !== '' && !loading && (
            <p className="text-center text-gray-500 mt-12">Sin resultados</p>
          )
        )}
      </div>

      {/* 🎶 Player */}
      <PlayerBar
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        isLoadingSong={player.isLoadingSong} 
        togglePlay={player.togglePlay}
        playNext={player.playNext}
        playPrevious={player.playPrevious}
        audioRef={player.audioRef}
        onTimeUpdate={player.handleTimeUpdate}
        onEnded={player.onEnded}
      />

      {/* 🎧 El tag de audio (invisible) */}
      <audio
        ref={player.audioRef}
        onTimeUpdate={player.handleTimeUpdate}
        onEnded={player.onEnded}
        onError={player.handleAudioError}
      />
    </div>
  )
}