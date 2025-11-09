// Archivo: app/page.tsx
'use client'

import React, { useState, useRef } from 'react'
import SongGrid from './components/SongGrid'
import PlayerBar from './components/PlayerBar'
import { usePlayer, Song } from './hooks/usePlayer'
import { usePlaylists, Playlist } from './hooks/usePlaylists'
import CreatePlaylistButton from './components/CreatePlaylistButton'
import SkeletonCard from './components/SkeletonCard'
import { ListMusic, Play, Home as HomeIcon } from 'lucide-react' 
import CreatePlaylistModal from './components/CreatePlaylistModal'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const player = usePlayer()
  const playlistsHook = usePlaylists()
  const abortControllerRef = useRef<AbortController | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingSong, setPendingSong] = useState<Song | null>(null) // Para "recordar" la canción
  const isAtHome = !loading && songs.length === 0 && searchTerm.trim() === ''

  // ✅ 2. MODIFICAR LA FUNCIÓN 'handleGoHome'
  const handleGoHome = () => {
    // Si ya estamos en home, no hacer nada
    if (isAtHome) return 

    setSearchTerm('')
    setSongs([])
    setLoading(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleSearch = async () => {
    // ... (la función de búsqueda queda igual) ...
    const query = searchTerm.trim()
    if (!query) return
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller
    setLoading(true)
    setSongs([]) 
    try {
      const res = await fetch(
        `/api/search/streaming?q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      )
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`)
      const data = await res.json()
      if (!controller.signal.aborted) {
        setSongs(data)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('🔸 Búsqueda cancelada')
      } else {
        console.error('❌ Error al buscar:', err)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

// ✅ 4. MODIFICADA (Botón "Crear Playlist" de la Home)
  // Ahora solo abre el modal
  const handleCreatePlaylist = () => {
    setPendingSong(null) // Nos aseguramos de que no haya canción pendiente
    setIsModalOpen(true)
  }

  // ✅ 5. MODIFICADA (Botón "+" en una canción)
  // Ahora abre el modal si no hay playlists, o agrega directo si ya hay
  const handleAddToPlaylist = (song: Song) => {
    if (playlistsHook.playlists.length === 0) {
      // No hay playlists, abrimos el modal "recordando" qué canción es
      setPendingSong(song)
      setIsModalOpen(true)
    } else {
      // Ya hay playlists, (lógica simple) agregamos a la primera
      const firstPlaylistId = playlistsHook.playlists[0].id
      playlistsHook.addSongToPlaylist(song, firstPlaylistId)
      setPendingSong(null) // Limpiamos por si acaso
    }
  }
  
  // ✅ NUEVA (Función que llama el Modal al "Crear")
  const handleConfirmCreatePlaylist = (name: string) => {
    // 1. Creamos la playlist y obtenemos su ID
    const newPlaylistId = playlistsHook.createPlaylist(name)
    
    // 2. Si estábamos "recordando" una canción, la agregamos
    if (pendingSong) {
      playlistsHook.addSongToPlaylist(pendingSong, newPlaylistId)
      setPendingSong(null) // Limpiamos la canción pendiente
    }
    
    // 3. Cerramos el modal
    setIsModalOpen(false)
  }
  
  const playPlaylist = (playlist: Playlist) => {
    // ... (la función queda igual) ...
    if (playlist.songs.length === 0) {
      alert("¡Esta playlist está vacía! Agregá canciones.")
      return;
    }
    player.playSong(playlist.songs[0], 0, playlist.songs)
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4 pb-28 relative">
      
      {/* ✅ 3. BOTÓN DE HOME (SIEMPRE VISIBLE, ESTILO DINÁMICO) */}
      {/* Ya no tiene el 'if' que lo oculta */}
      <button
        onClick={handleGoHome}
        title="Volver al inicio"
        disabled={isAtHome} // Deshabilitado si ya estamos en home
        className={`
          absolute 
          top-6 left-6 
          p-3 
          rounded-full 
          flex 
          items-center 
          justify-center 
          transition 
          z-20
          ${isAtHome
            ? 'bg-neutral-800 text-neutral-500 cursor-default' // Estilo INACTIVO (gris)
            : 'bg-green-500 text-black hover:scale-110 hover:bg-green-400 cursor-pointer' // Estilo ACTIVO (verde)
          }
        `}
      >
        <HomeIcon size={24} strokeWidth={2.5} /> 
      </button>

      <div className="max-w-5xl mx-auto">
        {/* 🔍 Input de búsqueda (ya tiene el padding 'pl-16', está perfecto) */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar canciones y presiona Enter..."
          className="w-full p-4 pl-16 rounded-lg shadow-sm border border-gray-700 bg-[#282828] text-[#e1e1e1] focus:outline-none focus:ring-2 focus:ring-[#1db954]"
        />

        {/* ... (El resto del archivo queda exactamente igual) ... */}
        
        {/* PANTALLA INICIAL (Playlists) */}
        {/* Usamos la variable 'isAtHome' para mostrar esto */}
        {isAtHome && (
          <div className="mt-10">
            <h2 className="text-white text-2xl font-bold mb-5 px-2">Tus Playlists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 px-2">
            <CreatePlaylistButton onClick={handleCreatePlaylist} />
                          
              {/* Listar Playlists Existentes */}
              {playlistsHook.playlists.map(playlist => (
                <div 
                  key={playlist.id} 
                  className="group relative bg-neutral-900/70 hover:bg-neutral-800 transition rounded-xl p-2 shadow-md"
                >
                  <div 
                    onClick={() => playPlaylist(playlist)}
                    className="absolute bottom-[6.5rem] right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:bottom-[7rem] transition-all duration-300 transform cursor-pointer z-10"
                  >
                    <Play size={24} className="text-black ml-0.5" />
                  </div>
                  <div className="relative w-full aspect-square rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden mb-2">
                    <ListMusic size={48} className="text-gray-500" />
                  </div>
                  <div className="mt-2 text-sm text-white truncate font-medium">{playlist.name}</div>
                  <div className="text-xs text-neutral-400 truncate">{playlist.songs.length} canciones</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🎵 Mostrar resultados de búsqueda o Skeletons */}
        {loading ? (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 px-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : songs.length > 0 ? (
          <SongGrid
            songs={songs}
            estimatedResults={songs.length}
            onSelect={(song, i) => player.playSong(song, i, songs)}
            onAddToPlaylist={handleAddToPlaylist}
          />
        ) : (
          !isAtHome && !loading && ( // Modificado para que no se muestre en home
            <p className="text-center text-gray-500 mt-12">Sin resultados para "{searchTerm}"</p>
          )
        )}
      </div>

      {/* 🎶 Player */}
      <PlayerBar
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        isLoadingSong={player.isLoadingSong} 
        togglePlay={player.togglePlay}
        playNext={player.playNext}
        playPrevious={player.playPrevious}
        audioRef={player.audioRef}
        onTimeUpdate={player.handleTimeUpdate}
        onEnded={player.onEnded}
      />

      {/* 🎧 El tag de audio (invisible) */}
      <audio
        ref={player.audioRef}
        onTimeUpdate={player.handleTimeUpdate}
        onEnded={player.onEnded}
        onError={player.handleAudioError}
      />
      {/* ✅ AÑADIR EL MODAL AL FINAL DEL TODO */}
      <CreatePlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConfirmCreatePlaylist}
      />
    </div>
  )
}