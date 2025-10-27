// Archivo: hooks/usePlayer.ts
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
  const lastTimeRef = useRef(0)

  // Efecto que se dispara cuando 'currentSong' cambia
  useEffect(() => {
    const audio = audioRef.current
    if (!currentSong || !audio) {
      if (audio) {
        audio.pause()
        audio.src = '' // Esto es lo que causa el error al inicio
      }
      setIsPlaying(false)
      setIsLoadingSong(false)
      return
    }

    const playStream = async () => {
      try {
        audio.src = `/api/stream?id=${currentSong.id}`
        audio.currentTime = lastTimeRef.current
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

  // Función principal
  const playSong = (song: Song, index: number, songs: Song[]) => {
    if (isLoadingSong) return; 
    if (currentSong?.id === song.id) {
      togglePlay()
      return
    }
  
    setIsLoadingSong(true)
  	setCurrentQueue(songs)
  	setCurrentSongIndex(index)
  	lastTimeRef.current = 0
  	setCurrentSong(song)
  }

  // Play/Pause
  const togglePlay = () => {
    if (isLoadingSong) return
  
  	const audio = audioRef.current
  	if (!audio || !currentSong) return

  	if (isPlaying) {
      audio.pause()
      lastTimeRef.current = audio.currentTime
      setIsPlaying(false)
  	} else {
      setIsPlaying(true)
      audio.play().catch((err) => {
        console.warn("Fallo al reanudar, forzando recarga de src...", err);
        setIsLoadingSong(true);
    	  const song = currentSong;
  	  setCurrentSong(null); 
  	  setTimeout(() => setCurrentSong(song), 10);
      })
    }
  }
  
  // ✅ ¡AQUÍ ESTÁ EL ARREGLO!
  const handleAudioError = () => {
    // Si no hay canción O ya estamos cargando, ignoramos el error.
    // Esto evita que el error "src vacío" del inicio se muestre.
    if (!currentSong || isLoadingSong) return; 

    console.error("Error posta en <audio> (ej. /api/stream dio 500)");
    setIsLoadingSong(false);
    setIsPlaying(false);
    setCurrentSong(null); // Resetea la barra
  }

  // Siguiente canción
  const playNext = () => {
    if (isLoadingSong || currentQueue.length === 0 || currentSongIndex === null) return
    const nextIndex = (currentSongIndex + 1) % currentQueue.length
    const nextSong = currentQueue[nextIndex]
  	setIsLoadingSong(true)
  	setCurrentSongIndex(nextIndex)
  	lastTimeRef.current = 0
  	setCurrentSong(nextSong)
  }

  // Canción anterior
  const playPrevious = () => {
  	if (isLoadingSong || currentQueue.length === 0 || currentSongIndex === null) return
  	const prevIndex = (currentSongIndex - 1 + currentQueue.length) % currentQueue.length
  	const prevSong = currentQueue[prevIndex]
  	setIsLoadingSong(true)
  	setCurrentSongIndex(prevIndex)
  	lastTimeRef.current = 0
  	setCurrentSong(prevSong)
  }

  // Hooks del <audio>
  const handleTimeUpdate = () => {
  	if (audioRef.current && !isLoadingSong) {
  	  lastTimeRef.current = audioRef.current.currentTime
  	}
}
  const onEnded = () => {
  	playNext()
  }

  return {
  	currentSong, isPlaying, isLoadingSong, audioRef,
  	playSong, togglePlay, playNext, playPrevious,
  	handleTimeUpdate, onEnded, handleAudioError
  }
}