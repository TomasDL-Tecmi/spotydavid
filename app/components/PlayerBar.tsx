'use client'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Song } from '../hooks/usePlayer'

interface PlayerBarProps {
  currentSong: Song | null
  isPlaying: boolean
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
  togglePlay,
  playNext,
  playPrevious,
  audioRef,
  onTimeUpdate,
  onEnded,
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
        <button onClick={playPrevious} className="text-gray-300 hover:text-white transition">
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="bg-white text-black rounded-full p-2 hover:scale-105 transition">
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button onClick={playNext} className="text-gray-300 hover:text-white transition">
          <SkipForward size={20} />
        </button>
      </div>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />
    </div>
  )
}
