'use client'

import React from 'react'
import { Song } from '../hooks/usePlayer'
import SongGrid from './SongGrid'
import SkeletonCard from './SkeletonCard'

interface SearchResultsViewProps {
  loading: boolean
  songs: Song[]
  searchTerm: string
  onSelectSong: (song: Song, index: number, queue: Song[]) => void
  onAddToPlaylist: (song: Song) => void
}

export default function SearchResultsView({
  loading,
  songs,
  searchTerm,
  onSelectSong,
  onAddToPlaylist,
}: SearchResultsViewProps) {

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 px-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (songs.length > 0) {
    return (
      <SongGrid
        songs={songs}
        estimatedResults={songs.length}
        onSelect={(song, i) => onSelectSong(song, i, songs)}
        onAddToPlaylist={onAddToPlaylist}
      />
    )
  }

  if (searchTerm.trim() !== '' && !loading) {
    return (
      <p className="text-center text-gray-500 mt-12">
        Sin resultados para "{searchTerm}"
      </p>
    )
  }

  return null
}