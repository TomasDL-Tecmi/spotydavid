// Archivo: app/components/ProgressBar.tsx
'use client'

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

// Función para formatear segundos a "mm:ss"
function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds === Infinity) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
}

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: ProgressBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value))
  }

  return (
    <div className="w-full flex items-center gap-3">
      {/* Tiempo actual */}
      <span className="text-xs text-neutral-400 w-10 text-right">
        {formatTime(currentTime)}
      </span>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleChange}
        className="
          w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer 
          accent-green-500
        "
      />

      {/* Duración total */}
      <span className="text-xs text-neutral-400 w-10 text-left">
        {formatTime(duration)}
      </span>
    </div>
  )
}