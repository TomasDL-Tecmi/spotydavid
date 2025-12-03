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
  onOpenFullScreen: () => void
}

export default function PlayerBar({
  currentSong,
  isPlaying,
  isLoadingSong,
  togglePlay,
  playNext,
  playPrevious,
  onOpenFullScreen,
}: PlayerBarProps) {
  if (!currentSong) return null

  return (
    <div className="
      fixed bottom-6 left-1/2 transform -translate-x-1/2 
      bg-[#181818]/95 backdrop-blur-md 
      border border-[#333] shadow-lg rounded-3xl 
      px-5 py-3 
      flex items-center justify-between gap-4 
      w-[90%] sm:w-[380px]
    ">

      <div
        className="flex items-center gap-3 min-w-0 cursor-pointer"
        onClick={onOpenFullScreen}
      >
        <img
          src={currentSong.thumbnail}
          alt={currentSong.title}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium truncate">{currentSong.title}</h4>
          <p className="text-gray-400 text-xs truncate">{currentSong.author}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={playPrevious}
          className="text-gray-300 hover:text-white transition"
          disabled={isLoadingSong}
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlay}
          className="
            bg-white text-black 
            rounded-full 
            w-9 h-9 
            flex items-center justify-center 
            hover:scale-110 transition 
            disabled:opacity-50 disabled:scale-100
          "
          disabled={isLoadingSong}
        >
          {isLoadingSong ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-0.5" />
          )}
        </button>

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