'use client'

import React from 'react'
import { Playlist } from '../hooks/usePlaylists'
import CreatePlaylistButton from './CreatePlaylistButton'
import { ListMusic, Play } from 'lucide-react'
import Image from 'next/image'

interface PlaylistViewProps {
  playlists: Playlist[]
  onPlayPlaylist: (playlist: Playlist) => void
  onCreatePlaylist: () => void
  onOpenPlaylistDetails: (playlistId: string) => void
}

export default function PlaylistView({
  playlists,
  onPlayPlaylist,
  onCreatePlaylist,
  onOpenPlaylistDetails,
}: PlaylistViewProps) {
  return (
    <div className="mt-10">
      <h2 className="text-shimmer-green text-2xl font-bold mb-5 px-2">
        Playlists de la Comunidad
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 px-2">

        <CreatePlaylistButton onClick={onCreatePlaylist} />

        {playlists.map(playlist => {
          const firstSongImage = playlist.songs.length > 0 ? playlist.songs[0].thumbnail : null;

          return (
            <div
              key={playlist.id}
              onClick={() => onOpenPlaylistDetails(playlist.id)}
              className="
                group relative bg-neutral-900/70 hover:bg-neutral-800 
                transition rounded-xl p-2 shadow-md
                flex flex-col cursor-pointer
              "
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPlaylist(playlist);
                }}
                className="relative w-full aspect-square rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden mb-2 cursor-pointer"
              >
                {firstSongImage ? (
                  <Image
                    src={firstSongImage}
                    alt={playlist.name}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <ListMusic size={48} className="text-gray-500" />
                )}

                {/* Overlay difuminado */}
                {firstSongImage && (
                  <div className="
                    absolute inset-0 
                    flex items-center justify-center 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    cursor-pointer z-10 
                    bg-black/60 backdrop-blur-sm
                  ">
                    <Image
                      src={firstSongImage}
                      alt=""
                      fill
                      className="object-cover blur-md scale-110 -z-10"
                    />
                    <div className="absolute inset-0 bg-black/40 -z-10"></div>
                    <Play
                      size={48}
                      className="text-white relative z-20"
                      fill="white"
                    />
                  </div>
                )}
              </div>

              <div className="mt-2 cursor-pointer px-1">
                <div className="text-sm text-white truncate font-medium">{playlist.name}</div>
                <div className="text-xs text-neutral-400 truncate">{playlist.songs.length} canciones</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}