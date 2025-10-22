'use client'

import { useRef, useState } from 'react'

export interface Song {
  id: string
  title: string
  author: string
  thumbnail: string
  duration: string
}

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const ensureAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio()
      audioRef.current = audio
      return audio
    }
    return audioRef.current
  }

  const playSong = async (song: Song) => {
    try {
      const res = await fetch(`/api/play/${song.id}`)
      const data = await res.json()

      if (!data?.audioUrl) throw new Error('No streaming URL found')

      const audio = ensureAudio()
      audio.src = data.audioUrl
      await audio.play()
      setCurrentSong(song)
      setIsPlaying(true)
    } catch (err) {
      console.error('Error reproduciendo canción:', err)
      setIsPlaying(false)
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return { currentSong, isPlaying, playSong, pause }
}
