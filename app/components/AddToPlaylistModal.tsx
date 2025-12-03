'use client'

import { Playlist } from '../hooks/usePlaylists'
import { Song } from '../hooks/usePlayer'
import { X, ListMusic, Check } from 'lucide-react'
import Image from 'next/image'

interface AddToPlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  playlists: Playlist[]
  song: Song | null
  onSelectPlaylist: (playlistId: string) => void
  onShowToast: (message: string) => void
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  playlists,
  song,
  onSelectPlaylist,
  onShowToast,
}: AddToPlaylistModalProps) {

  if (!isOpen || !song) return null

  const handleSelect = (playlistId: string) => {
    onSelectPlaylist(playlistId)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Agregar a playlist</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex items-center gap-3 bg-neutral-900/50">
          <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{song.title}</p>
            <p className="text-neutral-400 text-xs truncate">{song.author}</p>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          <ul className="divide-y divide-neutral-700">
            {playlists.map((playlist) => {
              const firstSongImage = playlist.songs.length > 0 ? playlist.songs[0].thumbnail : null;
              const songExists = playlist.songs.some(s => s.id === song.id);

              return (
                <li
                  key={playlist.id}
                  onClick={() => {
                    if (songExists) {
                      onShowToast("Esta canción ya está en la playlist")
                    } else {
                      handleSelect(playlist.id)
                    }
                  }}
                  className={`
                    w-full 
                    flex 
                    items-center 
                    gap-3 
                    p-4 
                    text-left 
                    transition
                    ${songExists
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-neutral-700 cursor-pointer'
                    }
                  `}
                >
                  {firstSongImage ? (
                    <div className="w-10 h-10 rounded overflow-hidden relative flex-shrink-0">
                      <Image
                        src={firstSongImage}
                        alt={playlist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-neutral-700 rounded flex-shrink-0 flex items-center justify-center">
                      <ListMusic size={20} className="text-neutral-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{playlist.name}</p>
                    <p className="text-neutral-400 text-xs truncate">{playlist.songs.length} canciones</p>
                  </div>

                  {songExists && (
                    <div className="ml-auto flex items-center gap-1 text-green-400">
                      <Check size={16} />
                    </div>
                  )}

                </li>
              )
            })}
          </ul>
        </div>

        <div className="p-2 border-t border-neutral-700">
        </div>
      </div>
    </div>
  )
}