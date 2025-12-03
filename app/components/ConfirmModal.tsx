'use client'

import { X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: React.ReactNode
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmModalProps) {

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-white text-lg font-semibold mb-2">{title}</h2>

        <div className="text-neutral-300 text-sm mb-6">{message}</div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-md text-white hover:bg-neutral-700 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 rounded-md bg-red-600 text-white font-medium hover:bg-red-500 transition cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}