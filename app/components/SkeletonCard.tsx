'use client'
import React from 'react'

export default function SkeletonCard() {
  return (
    <div
      className="
        bg-neutral-900/70 
        rounded-xl 
        p-2 
        shadow-md 
        animate-pulse
      "
    >
      {/* Imagen cuadrada */}
      <div className="relative w-full aspect-square rounded-lg bg-neutral-800" />

      {/* Texto simulado */}
      <div className="mt-2 h-3 w-3/4 bg-neutral-800 rounded" />
      <div className="mt-1 h-2.5 w-1/2 bg-neutral-800 rounded" />
    </div>
  )
}
