// Archivo: app/hooks/usePlaylists.ts
'use client'
import { useState, useEffect } from 'react'
import { Song } from './usePlayer'

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

const STORAGE_KEY = 'spotidavid_playlists'

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  // 1. Cargar playlists desde localStorage
  useEffect(() => {
    try {
      const storedPlaylists = localStorage.getItem(STORAGE_KEY)
      if (storedPlaylists) {
        setPlaylists(JSON.parse(storedPlaylists))
      }
    } catch (err) {
      console.error("Error cargando playlists:", err)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // 2. Guardar en localStorage cada vez que 'playlists' cambia
  useEffect(() => {
    // Evita guardar un array vacío al inicio si localStorage ya tenía algo
    if (playlists.length > 0 || localStorage.getItem(STORAGE_KEY)) {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
    }
  }, [playlists])

  // 3. Función para crear una nueva playlist
  const createPlaylist = (name: string): string => {
    if (!name.trim()) return "" 

    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}`,
      name: name,
      songs: [],
    }
    setPlaylists((prev) => [...prev, newPlaylist])
    return newPlaylist.id
  }

  // 4. Función para agregar una canción a una playlist
  const addSongToPlaylist = (song: Song, playlistId: string) => {
    let playlistName = ''
    let songAdded = false

    setPlaylists((prev) =>
      prev.map((playlist) => {
        // Si no es la playlist correcta, no la toques
        if (playlist.id !== playlistId) {
          return playlist
        }
        
        playlistName = playlist.name // Guardamos el nombre para el alert

        // --- ✅ LÓGICA ANTI-DUPLICADOS ---
        const songExists = playlist.songs.some((s) => s.id === song.id)
        if (songExists) {
          console.log(`La canción "${song.title}" ya está en "${playlist.name}"`)
          return playlist // Devuelve la playlist sin cambios
        }
        // --- Fin de la lógica ---

        songAdded = true // Marcamos que se agregó
        return {
          ...playlist,
          songs: [...playlist.songs, song], // Agrega la canción
        }
      })
    )
    
    // Damos feedback al usuario
    if (songAdded && playlistName) {
      alert(`"${song.title}" se agregó a "${playlistName}"`)
    } else if (playlistName) {
      alert(`"${song.title}" ya estaba en "${playlistName}"`)
    }
  }

  // 5. Función para borrar una playlist
  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter(p => p.id !== playlistId))
  }

  // 6. Función para renombrar una playlist
  const renamePlaylist = (playlistId: string, newName: string) => {
    if (!newName.trim()) return
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, name: newName.trim() } : p))
    )
  }

  // 7. Función para quitar canción de una playlist
  const removeSongFromPlaylist = (songId: string, playlistId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p
        // Devolvemos la playlist pero con la canción filtrada
        return {
          ...p,
          songs: p.songs.filter(s => s.id !== songId),
        }
      })
    )
  }

  // 8. Exportar todas las funciones
  return { 
    playlists, 
    createPlaylist, 
    addSongToPlaylist,
    deletePlaylist,
    renamePlaylist,
    removeSongFromPlaylist
  }
}