'use client'
import SongCard from './SongCard'
import SkeletonCard from './SkeletonCard'
import { Song } from '../hooks/usePlayer'

interface SongGridProps {
  songs: Song[]
  estimatedResults: number
  onSelect: (song: Song, index: number) => void
  onAddToPlaylist: (song: Song) => void
}

export default function SongGrid({
  songs,
  estimatedResults,
  onSelect,
  onAddToPlaylist
}: SongGridProps) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 px-2">
      {Array.from({ length: estimatedResults }).map((_, i) =>
        songs[i] ? (
          <SongCard
            key={songs[i].id}
            song={songs[i]}
            onClick={() => onSelect(songs[i], i)}
            onAddToPlaylist={() => onAddToPlaylist(songs[i])}
          />
        ) : (
          <SkeletonCard key={`sk-${i}`} />
        )
      )}
    </div>
  )
}