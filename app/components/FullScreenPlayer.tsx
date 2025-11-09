// Archivo: app/components/FullScreenPlayer.tsx
'use client'

import { X, SkipBack, SkipForward, Play, Pause, Loader2 } from 'lucide-react'
import { Song } from '../hooks/usePlayer'
import ProgressBar from './ProgressBar' 

// Definimos los tipos de props que vamos a recibir.
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
  // ✅ 1. CAMBIO: Renombramos 'setCurrentSong' a 'playSong' 
  //    y le damos el tipo correcto (acepta 3 argumentos)
  playSong: (song: Song, index: number, queue: Song[]) => void 
}

interface FullScreenPlayerProps {
  isOpen: boolean
  onClose: () => void
  player: PlayerControls // Recibimos el objeto 'player' completo
}

export default function FullScreenPlayer({ isOpen, onClose, player }: FullScreenPlayerProps) {
  if (!isOpen || !player.currentSong) return null
  
  // Función para cuando se hace clic en una canción de la cola
  const handleQueueClick = (song: Song, index: number) => {
    // Si la canción ya es la actual, no hacer nada
    if (player.currentSong?.id === song.id) return
    
    // ✅ 2. CAMBIO: Llamamos a 'playSong' con todos los argumentos
    //    'player.currentQueue' es la cola actual que ya tenemos
    player.playSong(song, index, player.currentQueue)
  }

  return (
    // Contenedor principal (fondo oscuro)
    <div 
      className="
        fixed inset-0 
        bg-neutral-900 
        z-50 
        p-6 
        flex 
        flex-col
        animate-fadeIn
      "
    >
      {/* 1. Botón de Cerrar */}
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition cursor-pointer"
          title="Cerrar"
        >
          <X size={32} />
        </button>
      </div>

      {/* 2. Contenido Principal (Portada + Controles + Cola) */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">

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
            <p className="text-lg text-neutral-400">{player.currentSong.author}</p>
          </div>

          {/* Barra de Progreso */}
          <div className="w-full max-w-md mt-6">
            <ProgressBar 
              currentTime={player.currentTime}
              duration={player.duration}
              onSeek={player.seek}
            />
          </div>

          {/* Controles Principales */}
          <div className="flex items-center gap-6 mt-6">
            <button 
              onClick={player.playPrevious} 
              className="text-neutral-300 hover:text-white transition"
            >
              <SkipBack size={32} fill="currentColor" />
            </button>

            <button 
              onClick={player.togglePlay} 
              className="bg-white text-black rounded-full p-4 hover:scale-105 transition w-20 h-20 flex items-center justify-center"
            >
              {player.isLoadingSong ? (
                <Loader2 size={30} className="animate-spin" />
              ) : player.isPlaying ? (
                <Pause size={30} fill="currentColor" />
              ) : (
                <Play size={30} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button 
              onClick={player.playNext} 
              className="text-neutral-300 hover:text-white transition"
            >
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* --- Columna Derecha (Cola de Reproducción) --- */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h3 className="text-white text-xl font-semibold mb-4">Siguiente en la cola</h3>
          
          <div className="flex-1 overflow-y-auto bg-neutral-800/50 rounded-lg">
            <ul className="divide-y divide-neutral-700/50">
              {player.currentQueue.map((song, index) => {
                const isThisSongPlaying = player.currentSong?.id === song.id
                
                return (
                  <li 
                    key={`${song.id}-${index}`}
                    onClick={() => handleQueueClick(song, index)} // ✅ 3. handleQueueClick ahora llama a playSong
                    className={`
                      flex items-center gap-3 p-3 transition
                      ${isThisSongPlaying 
                        ? 'bg-green-500/20' // Resaltado si está sonando
                        : 'hover:bg-neutral-700/60 cursor-pointer'
                      }
                    `}
                  >
                    <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isThisSongPlaying ? 'text-green-400' : 'text-white'}`}>
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
  )
}