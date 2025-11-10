// Archivo: app/components/FullScreenPlayer.tsx
'use client'

import { X, SkipBack, SkipForward, Play, Pause, Loader2 } from 'lucide-react'
import { Song } from '../hooks/usePlayer'
import ProgressBar from './ProgressBar'

// (Los tipos de Props e Interfaces se mantienen igual)
type PlayerControls = {
  currentSong: Song | null
  isPlaying: boolean
  isLoadingSong: boolean
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  currentQueue: Song[]
  currentTime: number
  duration: number
  seek: (time: number) => void
  playSong: (song: Song, index: number, queue: Song[]) => void
}

interface FullScreenPlayerProps {
  isOpen: boolean
  onClose: () => void
  player: PlayerControls
}

export default function FullScreenPlayer({ isOpen, onClose, player }: FullScreenPlayerProps) {
  if (!isOpen || !player.currentSong) return null

  const handleQueueClick = (song: Song, index: number) => {
    if (player.currentSong?.id === song.id) return
    player.playSong(song, index, player.currentQueue)
  }

  return (
    // Contenedor principal
    <div
      className="
        fixed inset-0 
        z-50 
        animate-fadeIn
      "
    >
      {/* 1. Fondo de Portada Borroso */}
      <img
        src={player.currentSong.thumbnail}
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110"
      />

      {/* 2. Superposición Oscura + "Glassmorphism" */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />

      {/* 3. Contenedor del Contenido */}
      <div
        className="
          relative z-10 
          w-full h-full 
          p-6 md:p-12 
          flex flex-col
        "
      >
        {/* 1. Botón de Cerrar */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={onClose}
            className="
              text-neutral-300 hover:text-white 
              bg-black/20 hover:bg-black/40 
              rounded-full p-2 transition 
              cursor-pointer
            "
            title="Cerrar"
          >
            <X size={28} />
          </button>
        </div>

        {/* 2. Contenido Principal */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-12 overflow-hidden">
          {/* --- Columna Izquierda (Portada y Controles) --- */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {/* Portada */}
            <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-2xl">
              <img
                src={player.currentSong.thumbnail}
                alt={player.currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Título y Autor */}
            <div className="mt-6 text-center">
              <h2 className="text-3xl font-bold text-white">{player.currentSong.title}</h2>
              <p className="text-lg text-neutral-300">{player.currentSong.author}</p>
            </div>

            {/* Barra de Progreso */}
            <div className="w-full max-w-md mt-6">
              <ProgressBar
                currentTime={player.currentTime}
                duration={player.duration}
                onSeek={player.seek}
              />
            </div>

            {/* Controles Principales (Con el diseño que pediste) */}
            <div className="flex items-center gap-8 mt-6">
              <button
                onClick={player.playPrevious}
                className="
                  text-neutral-300 transition p-4 rounded-full
                  hover:text-white hover:bg-white/10 
                  active:bg-white/20
                  cursor-pointer
                "
              >
                <SkipBack size={30} />
              </button>

              <button
                onClick={player.togglePlay}
                className="
                  bg-white text-black rounded-full p-4 transition 
                  w-16 h-16 
                  flex items-center justify-center 
                  hover:scale-105 active:scale-100
                  cursor-pointer
                "
              >
                {player.isLoadingSong ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : player.isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={player.playNext}
                className="
                  text-neutral-300 transition p-4 rounded-full
                  hover:text-white hover:bg-white/10 
                  active:bg-white/20
                  cursor-pointer
                "
              >
                <SkipForward size={30} />
              </button>
            </div>

          </div>

          {/* --- Columna Derecha (Cola de Reproducción) --- */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h3 className="text-neutral-200 text-2xl font-bold mb-4">Siguiente en la cola</h3>
            
            <div className="flex-1 overflow-y-auto bg-black/30 backdrop-blur-sm rounded-lg">
              <ul className="divide-y divide-white/10">
                {player.currentQueue.map((song, index) => {
                  const isThisSongPlaying = player.currentSong?.id === song.id

                  return (
                    <li
                      key={`${song.id}-${index}`}
                      onClick={() => handleQueueClick(song, index)}
                      
                      // ===== CORRECCIÓN DE ERROR =====
                      // Aquí es donde estaba el 'D:' en lugar de ':'
                      className={`
                        flex items-center gap-3 p-4 transition
                        ${
                          isThisSongPlaying
                            ? 'bg-green-500/20'
                            : 'hover:bg-white/10 cursor-pointer'
                        }
                      `}
                    >
                      <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded" />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isThisSongPlaying ? 'text-green-400' : 'text-white'
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">{song.author}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}