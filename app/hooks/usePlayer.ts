// Archivo: hooks/usePlayer.ts
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
 const [currentQueue, setCurrentQueue] = useState<Song[]>([])
 const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null)

 // 1. Asegura que el elemento <audio> exista en el DOM
 const ensureAudio = () => {
  if (!audioRef.current) {
   // Si no existe (raro, pero por si acaso), lo creamos
   const audio = new Audio()
   audioRef.current = audio
   console.log('Audio element creado')
  }
  return audioRef.current
 }

 // 2. Función interna para buscar el stream y reproducir
 const getAudioAndPlay = async (song: Song) => {
  try {
   // 🚀 ¡AQUÍ ESTÁ EL ARREGLO! Llamamos a la API de audio correcta
   const res = await fetch(`/api/audio?id=${song.id}`)
   const data = await res.json()

   if (!data?.audioUrl) throw new Error('No se encontró la URL del stream')

   const audio = ensureAudio()
   audio.src = data.audioUrl
   await audio.play()
   setIsPlaying(true)
  } catch (err) {
   console.error('Error reproduciendo canción:', err)
   setIsPlaying(false)
   setCurrentSong(null) // Limpiamos si falla
  }
 }

 // 3. Función principal que llama la UI
 const playSong = (song: Song, index: number, songs: Song[]) => {
  setCurrentSong(song)
  setCurrentQueue(songs) // Guardamos la lista de resultados actual
  setCurrentSongIndex(index) // Guardamos la posición
  getAudioAndPlay(song) // Empezamos a reproducir
 }

 // 4. Play/Pause
 const togglePlay = () => {
  const audio = audioRef.current
  if (!audio || !currentSong) return

  if (isPlaying) {
   audio.pause()
   setIsPlaying(false)
  } else {
   audio.play()
   setIsPlaying(true)
  }
 }

  // 5. Siguiente canción
  const playNext = () => {
    if (currentQueue.length === 0 || currentSongIndex === null) return

    const nextIndex = (currentSongIndex + 1) % currentQueue.length
    const nextSong = currentQueue[nextIndex]

    setCurrentSong(nextSong)
    setCurrentSongIndex(nextIndex)
    getAudioAndPlay(nextSong)
  }

  // 6. Canción anterior
  const playPrevious = () => {
    if (currentQueue.length === 0 || currentSongIndex === null) return

    const prevIndex =
      (currentSongIndex - 1 + currentQueue.length) % currentQueue.length
    const prevSong = currentQueue[prevIndex]

    setCurrentSong(prevSong)
    setCurrentSongIndex(prevIndex)
    getAudioAndPlay(prevSong)
  }

  // 7. Hooks del <audio> (por ahora vacíos, pero listos para la barra de progreso)
  const handleTimeUpdate = () => {
    // Lógica para actualizar la barra de progreso (TODO)
  }

  // 8. Cuando la canción termina, pasa a la siguiente
  const onEnded = () => {
    playNext()
  }

  return {
    currentSong,
    isPlaying,
    audioRef, // Exponemos la ref para que PlayerBar la use
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    handleTimeUpdate,
    onEnded, // Pasamos esta función al <audio>
  }
}