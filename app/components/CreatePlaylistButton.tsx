// Archivo: app/components/CreatePlaylistButton.tsx
'use client'

import { Plus } from 'lucide-react'

interface CreatePlaylistButtonProps {
  onClick: () => void
}

export default function CreatePlaylistButton({ onClick }: CreatePlaylistButtonProps) {
  return (
    // ✅ Usamos exactamente las mismas clases que la tarjeta de playlist
    <div 
      onClick={onClick} 
      className="
        group 
        relative 
        bg-neutral-900/70 
        hover:bg-neutral-800 
        transition 
        rounded-xl 
        p-2 
        shadow-md
        flex flex-col 
        cursor-pointer
      "
    >
      {/* 1. El "hueco" (la portada) */}
      <div className="
        relative 
        w-full 
        aspect-square 
        rounded-lg 
        bg-neutral-800 
        flex 
        items-center 
        justify-center 
        overflow-hidden 
        mb-2
        transition
        group-hover:bg-neutral-700
      ">
        {/* El ícono de Más (+) */}
        <Plus size={48} className="text-gray-500 group-hover:text-white transition" />
      </div>

      {/* 2. El texto */}
      <div className="mt-2 cursor-pointer px-1">
        <div className="text-sm text-white truncate font-medium">Crear nueva playlist</div>
        <div className="text-xs text-neutral-400 truncate">&nbsp;</div> {/* Espacio vacío para alinear */}
      </div>
    </div>
  )
}