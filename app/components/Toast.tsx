'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  trigger: number
}

export default function Toast({ message, trigger }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [message, trigger])

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
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {message}
    </div>
  )
}