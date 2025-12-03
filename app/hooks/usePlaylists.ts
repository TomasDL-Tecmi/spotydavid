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

  useEffect(() => {
    // Evita guardar un array vacío al inicio si localStorage ya tenía algo
    if (playlists.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
    }
  }, [playlists])

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

  const addSongToPlaylist = (song: Song, playlistId: string) => {
    let playlistName = ''
    let songAdded = false

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist
        }

        playlistName = playlist.name

        const songExists = playlist.songs.some((s) => s.id === song.id)
        if (songExists) {
          console.log(`La canción "${song.title}" ya está en "${playlist.name}"`)
          return playlist
        }

        songAdded = true
        return {
          ...playlist,
          songs: [...playlist.songs, song],
        }
      })
    )

    if (songAdded && playlistName) {
      alert(`"${song.title}" se agregó a "${playlistName}"`)
    } else if (playlistName) {
      alert(`"${song.title}" ya estaba en "${playlistName}"`)
    }
  }

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter(p => p.id !== playlistId))
  }

  const renamePlaylist = (playlistId: string, newName: string) => {
    if (!newName.trim()) return
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, name: newName.trim() } : p))
    )
  }

  const removeSongFromPlaylist = (songId: string, playlistId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p
        return {
          ...p,
          songs: p.songs.filter(s => s.id !== songId),
        }
      })
    )
  }

  return {
    playlists,
    createPlaylist,
    addSongToPlaylist,
    deletePlaylist,
    renamePlaylist,
    removeSongFromPlaylist
  }
}