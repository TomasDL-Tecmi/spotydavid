'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface CreatePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName('')
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-800 rounded-lg shadow-xl w-full max-w-sm p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-white text-lg font-semibold mb-4">Crear playlist</h2>
        <p className="text-neutral-300 text-sm mb-4">
          Dale un nombre a tu nueva playlist
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mi playlist"
            autoFocus
            className="w-full p-3 rounded-md bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md text-white hover:bg-neutral-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-green-500 text-black font-medium hover:bg-green-400 transition disabled:opacity-50"
              disabled={!name.trim()}
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}