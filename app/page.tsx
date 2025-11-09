// Archivo: app/page.tsx
'use client'

import React, { useState, useRef } from 'react'
import PlaylistView from './components/PlaylistView'
import SearchResultsView from './components/SearchResultsView'
import PlayerBar from './components/PlayerBar'
import { usePlayer, Song } from './hooks/usePlayer' // ✅ Importa el hook actualizado
import { usePlaylists, Playlist } from './hooks/usePlaylists'
import { ListMusic, Play, Home as HomeIcon } from 'lucide-react' 
import CreatePlaylistModal from './components/CreatePlaylistModal'
import PlaylistDetailModal from './components/PlaylistDetailModal' 
import AddToPlaylistModal from './components/AddToPlaylistModal'
import Toast from './components/Toast' 
import FullScreenPlayer from './components/FullScreenPlayer'

export default function Home() {
  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  
  const player = usePlayer() // ✅ Tu hook 'player' ahora tiene todo
  const playlistsHook = usePlaylists()

  const [isModalOpen, setIsModalOpen] = useState(false) 
  const [pendingSong, setPendingSong] = useState<Song | null>(null)
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null) 
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false)
  const [songToAdd, setSongToAdd] = useState<Song | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastTrigger, setToastTrigger] = useState(0)
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false)

  // --- VARIABLES DERIVADAS ---
  const isAtHome = !searchSubmitted
  const editingPlaylist = playlistsHook.playlists.find(p => p.id === editingPlaylistId) || null

  // --- HANDLERS (Toast, Búsqueda, Home) ---
  const showToast = (message: string) => {
    setToastMessage(message)
    setToastTrigger(Date.now())
  }

  const handleGoHome = () => {
    if (isAtHome) return 
    setSearchTerm('')
    setSongs([])
    setLoading(false)
    setSearchSubmitted(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleSearch = async () => {
    const query = searchTerm.trim()
    if (!query) return
    setSearchSubmitted(true) 
    
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
        console.log('Busqueda cancelada')
      } else {
        console.error('Error al buscar:', err)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  // --- HANDLERS (Playlists) ---
  const handleCreatePlaylist = () => {
    setPendingSong(null) 
    setIsModalOpen(true)
  }

  const handleAddToPlaylist = (song: Song) => {
    if (playlistsHook.playlists.length === 0) {
      setPendingSong(song)
      setIsModalOpen(true)
    } else {
      setSongToAdd(song)
      setIsAddToPlaylistModalOpen(true)
    }
  }
  
  const handleConfirmCreatePlaylist = (name: string) => {
    const newPlaylistId = playlistsHook.createPlaylist(name)
    if (pendingSong) {
      playlistsHook.addSongToPlaylist(pendingSong, newPlaylistId)
      setPendingSong(null)
    }
    setIsModalOpen(false)
  }
  
  const handleSelectPlaylist = (playlistId: string) => {
    if (songToAdd) {
      playlistsHook.addSongToPlaylist(songToAdd, playlistId)
    }
    setIsAddToPlaylistModalOpen(false)
    setSongToAdd(null)
  }

  const playPlaylist = (playlist: Playlist) => {
    if (playlist.songs.length === 0) {
      showToast("¡Esta playlist está vacía! Agregá canciones.")
      return;
    }
    player.playSong(playlist.songs[0], 0, playlist.songs)
  }

  const handleShufflePlay = (playlist: Playlist) => {
    if (playlist.songs.length === 0) {
      showToast("¡Esta playlist está vacía!")
      return;
    }
    const shuffledSongs = [...playlist.songs];
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
    }
    player.playSong(shuffledSongs[0], 0, shuffledSongs);
  }

  // --- RENDERIZADO (JSX) ---
  return (
    <div className="min-h-screen bg-[#121212] p-4 pb-28 relative">
      
      {/* Contenido Principal */}
      <div className="max-w-5xl mx-auto">
        
        {/* Bloque de Home + Búsqueda */}
        <div className="relative w-full">
          {/* Botón de Home */}
          <button
            onClick={handleGoHome}
            title="Volver al inicio"
            disabled={isAtHome}
            className={`
              absolute top-1/2 left-1.25 -translate-y-1/2 p-3 rounded-lg flex 
              items-center justify-center transition z-20
              ${isAtHome
                ? 'bg-neutral-800 text-neutral-500 cursor-default'
                : 'bg-green-500 text-black hover:scale-110 hover:bg-green-400 cursor-pointer'
              }
            `}
          >
            <HomeIcon size={24} strokeWidth={2.5} /> 
          </button>
          {/* Input de búsqueda */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar canciones y presiona Enter..."
            className="w-full p-4 pl-16 rounded-lg shadow-sm border border-gray-700 bg-[#282828] text-[#e1e1e1] focus:outline-none focus:ring-2 focus:ring-[#1db954]"
          />
        </div>

        {/* Lógica de Vistas */}
        {isAtHome ? (
          <PlaylistView 
            playlists={playlistsHook.playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onPlayPlaylist={playPlaylist}
            onOpenPlaylistDetails={(id) => setEditingPlaylistId(id)}
          />
        ) : (
          <SearchResultsView
            loading={loading}
            songs={songs}
            searchTerm={searchTerm}
            onSelectSong={player.playSong}
            onAddToPlaylist={handleAddToPlaylist}
          />
        )}
      </div>

      {/* Player Bar (Fuera del contenido principal) */}
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
        onOpenFullScreen={() => setIsFullScreenPlayerOpen(true)}
      />

      {/* Audio Tag (Invisible) */}
      <audio
        ref={player.audioRef}
        onTimeUpdate={player.handleTimeUpdate} // ✅ Se conecta al hook
        onEnded={player.onEnded} // ✅ Se conecta al hook
        onError={player.handleAudioError}
      />

      {/* --- LOS MODALS + TOAST --- */}
      <CreatePlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleConfirmCreatePlaylist}
      />

      <PlaylistDetailModal
        isOpen={!!editingPlaylist}
        onClose={() => setEditingPlaylistId(null)}
        playlist={editingPlaylist}
        onRename={(newName) => {
          if (editingPlaylist) playlistsHook.renamePlaylist(editingPlaylist.id, newName)
        }}
        onDelete={() => {
          if (editingPlaylist) playlistsHook.deletePlaylist(editingPlaylist.id)
          setEditingPlaylistId(null)
        }}
        onRemoveSong={(songId) => {
          if (editingPlaylist) playlistsHook.removeSongFromPlaylist(songId, editingPlaylist.id)
        }}
        onShufflePlay={() => {
          if (editingPlaylist) handleShufflePlay(editingPlaylist)
        }}
        onPlaySong={(song, index, queue) => {
          player.playSong(song, index, queue)
        }}
      />
      
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        song={songToAdd}
        playlists={playlistsHook.playlists}
        onSelectPlaylist={handleSelectPlaylist}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} trigger={toastTrigger} />
      
      {/* ✅ Reproductor Grande (ahora recibe todo el objeto 'player') */}
      <FullScreenPlayer
        isOpen={isFullScreenPlayerOpen}
        onClose={() => setIsFullScreenPlayerOpen(false)}
        player={{
          currentSong: player.currentSong,
          isPlaying: player.isPlaying,
          isLoadingSong: player.isLoadingSong,
          togglePlay: player.togglePlay,
          playNext: player.playNext,
          playPrevious: player.playPrevious,
          currentQueue: player.currentQueue,
          currentTime: player.currentTime,
          duration: player.duration,
          seek: player.seek,
          // ✅ CAMBIO: Renombramos 'setCurrentSong' a 'playSong'
          playSong: player.playSong,
          // (Ya no necesitamos pasar setCurrentSongIndex)
        }}
      />
    </div>
  )
}