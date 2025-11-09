'use client'
import Image from 'next/image'
import { Song } from '../hooks/usePlayer'
import { Plus } from 'lucide-react'

interface SongCardProps {
 song: Song
 onClick: () => void
 onAddToPlaylist: () => void // ✅ AÑADIR ESTA LÍNEA
}

export default function SongCard({ song, onClick, onAddToPlaylist }: SongCardProps) { 
  
  const handleAddClick = (e: React.MouseEvent) => {
     e.stopPropagation() // Esto evita que se reproduzca la canción
      onAddToPlaylist()
    }

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
        <button
          title="Agregar a playlist"
          onClick={handleAddClick}
          className="
            absolute 
            top-2 right-2  
            bg-green-500 
            text-black 
            p-2
            rounded-full 
            transition 
            hover:scale-110
            hover:bg-green-400
            cursor-pointer
            opacity-0 
            group-hover:opacity-100 
            z-10
          "
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="mt-2 text-sm text-white truncate font-medium">{song.title}</div>
      <div className="text-xs text-neutral-400 truncate">{song.author}</div>
    </div>
  )
}
