// Archivo: app/components/Toast.tsx
'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  // Un "hack": cambiamos este número para re-disparar el toast
  // si el mensaje es el mismo
  trigger: number 
}

export default function Toast({ message, trigger }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      
      // Timer para ocultar el toast
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2500) // 2.5 segundos

      return () => clearTimeout(timer)
    }
  }, [message, trigger]) // Se re-dispara si el mensaje o el trigger cambian

  return (
    <div
      className={`
        fixed 
        bottom-28 
        left-1/2 -translate-x-1/2 
        bg-neutral-800 
        text-white 
        px-5 py-2.5 
        rounded-full 
        shadow-lg 
        z-[100]
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      // Evita que el usuario haga click "a través" del toast invisible
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {message}
    </div>
  )
}