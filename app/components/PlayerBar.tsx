// Archivo: components/PlayerBar.tsx
'use client'
// ⚠️ ¡IMPORTA UN ICONO DE CARGA!
import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react'
import { Song } from '../hooks/usePlayer'

interface PlayerBarProps {
  currentSong: Song | null
  isPlaying: boolean
  isLoadingSong: boolean // 👈 AÑADIDO
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  onTimeUpdate: () => void
  onEnded: () => void
}

export default function PlayerBar({
  currentSong,
  isPlaying,
  isLoadingSong, // 👈 AÑADIDO
  togglePlay,
  playNext,
  playPrevious,
}: PlayerBarProps) {
  
  if (!currentSong) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#181818]/95 backdrop-blur-md border border-[#333] shadow-lg rounded-3xl px-5 py-3 flex items-center gap-4 w-[90%] sm:w-[380px]">
      <img src={currentSong.thumbnail} alt={currentSong.title} className="w-12 h-12 rounded-xl object-cover" />
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-sm font-medium truncate">{currentSong.title}</h4>
        <p className="text-gray-400 text-xs truncate">{currentSong.author}</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={playPrevious} 
          className="text-gray-300 hover:text-white transition"
          disabled={isLoadingSong} // 👈 AÑADIDO
        >
          <SkipBack size={20} />
        </button>

        {/* 🚀 CAMBIO: Botón de Play o Spinner */}
        <div className="bg-white text-black rounded-full p-2 w-[34px] h-[34px] flex items-center justify-center">
          {isLoadingSong ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <button onClick={togglePlay} className="flex items-center justify-center">
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
          )}
        </div>

        <button 
          onClick={playNext} 
          className="text-gray-300 hover:text-white transition"
          disabled={isLoadingSong} // 👈 AÑADIDO
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* (El <audio> ya no está aquí, está en page.tsx) */}
    </div>
  )
}