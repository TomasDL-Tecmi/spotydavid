'use client'
import Image from 'next/image'
import { Song } from '../hooks/usePlayer'

interface SongCardProps {
  song: Song
  onClick: () => void
}

export default function SongCard({ song, onClick }: SongCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        group
        cursor-pointer
        bg-neutral-900/70 
        hover:bg-neutral-800 
        transition 
        rounded-xl 
        p-2
        shadow-md
      "
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <Image
          src={song.thumbnail}
          alt={song.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="mt-2 text-sm text-white truncate font-medium">{song.title}</div>
      <div className="text-xs text-neutral-400 truncate">{song.author}</div>
    </div>
  )
}
