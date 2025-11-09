// Archivo: app/hooks/usePlaylists.ts
'use client'
import { useState, useEffect } from 'react'
import { Song } from './usePlayer' // Reutilizamos la interfaz de Song

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

const STORAGE_KEY = 'spotidavid_playlists'

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  // Cargar playlists desde localStorage
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

  // Guardar en localStorage
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
    }
  }, [playlists])

  // 3. Función para crear una nueva playlist (MODIFICADA)
  const createPlaylist = (name: string): string => { // <-- Devuelve string (el ID)
    if (!name.trim()) return "" // No crear si no tiene nombre

    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}`,
      name: name,
      songs: [],
    }
    setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist])
    
    return newPlaylist.id // ✅ ¡DEVOLVEMOS EL ID!
  }

  // 4. Función para agregar una canción a una playlist
  const addSongToPlaylist = (song: Song, playlistId: string) => {
    let playlistName = ''
    let songAdded = false

    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist
        }
        
        playlistName = playlist.name
        const songExists = playlist.songs.some((s) => s.id === song.id)
        
        if (songExists) {
          console.log(`La canción "${song.title}" ya está en "${playlist.name}"`)
          return playlist 
        }

        songAdded = true // Marcamos que se agregó
        return {
          ...playlist,
          songs: [...playlist.songs, song],
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

  return { playlists, createPlaylist, addSongToPlaylist }
}