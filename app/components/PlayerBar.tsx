// Archivo: app/components/PlayerBar.tsx
'use client'
import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react'
import { Song } from '../hooks/usePlayer'

interface PlayerBarProps {
  currentSong: Song | null
  isPlaying: boolean
  isLoadingSong: boolean
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  onTimeUpdate: () => void
  onEnded: () => void
  onOpenFullScreen: () => void // ✅ 1. Nueva prop
}

export default function PlayerBar({
  currentSong,
  isPlaying,
  isLoadingSong,
  togglePlay,
  playNext,
  playPrevious,
  onOpenFullScreen, // ✅ 2. Recibir la prop
}: PlayerBarProps) { // (Las props 'audioRef', 'onTimeUpdate', 'onEnded' se reciben pero no se usan aquí)
  
  if (!currentSong) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#181818]/95 backdrop-blur-md border border-[#333] shadow-lg rounded-3xl px-5 py-3 flex items-center gap-4 w-[90%] sm:w-[380px]">
      
      {/* ✅ 3. Hacemos la imagen clicable */}
      <img 
        src={currentSong.thumbnail} 
        alt={currentSong.title} 
        className="w-12 h-12 rounded-xl object-cover cursor-pointer" 
        onClick={onOpenFullScreen}
      />
      
      {/* ✅ 4. Hacemos el texto clicable */}
      <div 
        className="flex-1 min-w-0 cursor-pointer" 
        onClick={onOpenFullScreen}
      >
        <h4 className="text-white text-sm font-medium truncate">{currentSong.title}</h4>
        <p className="text-gray-400 text-xs truncate">{currentSong.author}</p>
      </div>

      {/* Los botones no abren el modal */}
      <div className="flex items-center gap-3">
        <button 
          onClick={playPrevious} 
          className="text-gray-300 hover:text-white transition"
          disabled={isLoadingSong}
        >
          <SkipBack size={20} />
        </button>

        <div className="bg-white text-black rounded-full p-2 w-[30px] h-[30px] flex items-center justify-center">
          {isLoadingSong ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <button onClick={togglePlay} className="flex items-center justify-center">
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
          )}
        </div>

        <button 
          onClick={playNext} 
          className="text-gray-300 hover:text-white transition"
          disabled={isLoadingSong}
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  )
}