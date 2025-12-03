'use client'

import { useState, useEffect } from 'react'
import { Playlist } from '../hooks/usePlaylists'
import { Song } from '../hooks/usePlayer'
import { X, Edit2, Trash2, Save, Shuffle, Play, Trash } from 'lucide-react'
import ConfirmModal from './ConfirmModal'

interface PlaylistDetailModalProps {
  playlist: Playlist | null
  isOpen: boolean
  onClose: () => void
  onRename: (newName: string) => void
  onDelete: () => void
  onRemoveSong: (songId: string) => void
  onShufflePlay: () => void
  onPlaySong: (song: Song, index: number, queue: Song[]) => void
}

export default function PlaylistDetailModal({
  playlist,
  isOpen,
  onClose,
  onRename,
  onDelete,
  onRemoveSong,
  onShufflePlay,
  onPlaySong,
}: PlaylistDetailModalProps) {

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(playlist?.name || '')

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  useEffect(() => {
    if (playlist) {
      setName(playlist.name)
    }
    setIsEditing(false)
    setIsConfirmOpen(false)
  }, [playlist, isOpen])

  if (!isOpen || !playlist) return null

  const handleRename = () => {
    if (isEditing) {
      onRename(name)
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleDeletePlaylist = () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    onDelete()
    onClose()
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 rounded-lg shadow-xl w-full max-w-lg h-[80vh] flex flex-col"
      >
        <div className="p-6 border-b border-neutral-700 flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="text-white text-2xl font-bold bg-neutral-800 border border-neutral-600 rounded-md px-2 -ml-2"
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
          ) : (
            <h2 className="text-white text-2xl font-bold">{playlist.name}</h2>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleRename}
              className="text-neutral-400 hover:text-white cursor-pointer"
              title={isEditing ? "Guardar" : "Renombrar"}
            >
              {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
            </button>
            <button
              onClick={handleDeletePlaylist}
              className="text-neutral-400 hover:text-red-500 cursor-pointer"
              title="Borrar playlist"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white cursor-pointer"
              title="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={onShufflePlay}
            disabled={playlist.songs.length === 0}
            className="
              w-full flex items-center justify-center gap-2 
              bg-green-500 text-black font-bold py-3 rounded-full 
              transition hover:scale-105 
              disabled:opacity-50 
              cursor-pointer disabled:cursor-not-allowed
            "
          >
            <Shuffle size={20} />
            Reproducir aleatoriamente
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {playlist.songs.length > 0 ? (
            <ul className="space-y-2">
              {playlist.songs.map((song, index) => (
                <li
                  key={song.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800 group"
                >
                  <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{song.title}</p>
                    <p className="text-neutral-400 text-xs truncate">{song.author}</p>
                  </div>
                  <button
                    onClick={() => onPlaySong(song, index, playlist.songs)}
                    className="text-neutral-400 hover:text-white ml-auto opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Reproducir"
                  >
                    <Play size={18} />
                  </button>
                  <button
                    onClick={() => onRemoveSong(song.id)}
                    className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Quitar de la playlist"
                  >
                    <Trash size={18} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 text-center mt-10">Agregá canciones a esta playlist.</p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar playlist"
        message={`¿Seguro que querés borrar la playlist "${playlist.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}