'use client'

import { useRef, useState, useEffect } from 'react'

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
  const [isLoadingSong, setIsLoadingSong] = useState(false)
  const [currentQueue, setCurrentQueue] = useState<Song[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!currentSong || !audio) {
      if (audio) {
        audio.pause()
        audio.src = ''
      }
      setIsPlaying(false)
      setIsLoadingSong(false)
      setDuration(0)
      setCurrentTime(0)
      return
    }

    const playStream = async () => {
      try {
        audio.src = `/api/stream?id=${currentSong.id}`
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        console.error('Error al intentar .play()', err)
        setIsPlaying(false)
        setCurrentSong(null)
      } finally {
        setIsLoadingSong(false)
      }
    }

    playStream()

  }, [currentSong])

  const playSong = (song: Song, index: number, songs: Song[]) => {
    if (isLoadingSong) return;
    if (currentSong?.id === song.id) {
      togglePlay()
      return
    }

    setIsLoadingSong(true)
    setCurrentQueue(songs)
    setCurrentSongIndex(index)
    setCurrentSong(song)
  }

  const togglePlay = () => {
    if (isLoadingSong) return
    const audio = audioRef.current
    if (!audio || !currentSong) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      audio.play().catch(async (err) => {
        console.warn("Fallo al reanudar, forzando recarga de src...", err);
        setIsLoadingSong(true);
        const song = currentSong;
        setCurrentSong(null);
        setTimeout(() => setCurrentSong(song), 10);
      })
    }
  }

  const handleAudioError = () => {
    if (!currentSong || isLoadingSong) return;
    console.error("Error posta en <audio> (ej. /api/stream dio 500)");
    setIsLoadingSong(false);
    setIsPlaying(false);
    setCurrentSong(null);
  }

  const playNext = () => {
    if (isLoadingSong || currentQueue.length === 0 || currentSongIndex === null) return
    const nextIndex = (currentSongIndex + 1) % currentQueue.length
    const nextSong = currentQueue[nextIndex]
    setIsLoadingSong(true)
    setCurrentSongIndex(nextIndex)
    setCurrentSong(nextSong)
  }

  const playPrevious = () => {
    if (isLoadingSong || currentQueue.length === 0 || currentSongIndex === null) return
    const prevIndex = (currentSongIndex - 1 + currentQueue.length) % currentQueue.length
    const prevSong = currentQueue[prevIndex]
    setIsLoadingSong(true)
    setCurrentSongIndex(prevIndex)
    setCurrentSong(prevSong)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio && !isNaN(audio.duration) && isFinite(audio.duration)) {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration)
    }
  }

  const onEnded = () => {
    playNext()
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setCurrentTime(time)
    }
  }

  return {
    currentSong,
    isPlaying,
    isLoadingSong,
    audioRef,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    handleTimeUpdate,
    onEnded,
    handleAudioError,

    // ✅ Exportar todo esto para el reproductor grande:
    currentQueue,
    currentTime,
    duration,
    seek,
    setCurrentSong,
    setCurrentSongIndex,
  }
}