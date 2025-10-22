'use client'

import React from 'react'
import { Plus } from 'lucide-react'

interface CreatePlaylistButtonProps {
  onClick?: () => void
}

export default function CreatePlaylistButton({ onClick }: CreatePlaylistButtonProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer aspect-square w-full sm:w-44 md:w-48 bg-[#181818] hover:bg-[#282828] border border-[#2a2a2a] rounded-lg flex flex-col items-center justify-center transition-all duration-200 hover:scale-[1.02] shadow-md"
    >
      <div className="flex flex-col items-center justify-center text-center text-gray-400 group-hover:text-white transition-colors duration-200">
        <div className="bg-[#1db954] text-black p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </div>
        <p className="font-semibold">Crear playlist</p>
      </div>
    </div>
  )
}
