// Archivo: app/hooks/usePlaylists.ts
'use client'
import { useState, useEffect } from 'react'
import { Song } from './usePlayer' // Reutilizamos la interfaz de Song

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

// Esta es la "llave" donde se guardan los datos en el navegador
const STORAGE_KEY = 'spotidavid_playlists'

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  // 1. Cargar playlists desde localStorage (sólo 1 vez, al inicio)
  useEffect(() => {
    try {
      const storedPlaylists = localStorage.getItem(STORAGE_KEY)
      if (storedPlaylists) {
        setPlaylists(JSON.parse(storedPlaylists))
      }
    } catch (err) {
      console.error("Error cargando playlists:", err)
      localStorage.removeItem(STORAGE_KEY) // Limpiar si está corrupto
    }
  }, [])

  // 2. Guardar en localStorage (cada vez que 'playlists' cambie)
  useEffect(() => {
    try {
      // No guardar si 'playlists' está vacío al inicio (para evitar sobreescribir)
      if (playlists.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
      }
    } catch (err) {
      console.error("Error guardando playlists:", err)
    }
  }, [playlists])

  // 3. Función para crear una nueva playlist
  const createPlaylist = (name: string) => {
    if (!name.trim()) return // No crear si no tiene nombre

    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}`, // ID único basado en la fecha
      name: name,
      songs: [],
    }
    setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist])
  }

  // 4. Función para agregar una canción a una playlist
  const addSongToPlaylist = (song: Song, playlistId: string) => {
    let playlistName = ''
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) => {
        // Si no es la playlist correcta, no la toques
        if (playlist.id !== playlistId) {
          return playlist
        }
        
        playlistName = playlist.name // Guardamos el nombre para el alert

        // Evitar duplicados
        const songExists = playlist.songs.some((s) => s.id === song.id)
        if (songExists) {
          console.log(`La canción "${song.title}" ya está en "${playlist.name}"`)
          return playlist // Devolver la playlist sin cambios
        }

        // Agregar la canción
        return {
          ...playlist,
          songs: [...playlist.songs, song],
        }
      })
    )
    
    // Damos feedback al usuario
    if (playlistName) {
      alert(`"${song.title}" se agregó a "${playlistName}"`)
    }
  }

  return { playlists, createPlaylist, addSongToPlaylist }
}