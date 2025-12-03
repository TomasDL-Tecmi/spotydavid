'use client'

import * as Slider from '@radix-ui/react-slider'

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

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

  const handleSeek = (value: number[]) => {
    onSeek(value[0])
  }

  const isDisabled = !duration || duration === 0

  return (
    <div className="w-full flex items-center gap-3">
      <span className="text-xs text-neutral-400 w-10 text-right">
        {formatTime(currentTime)}
      </span>

      <Slider.Root
        className="
          relative flex items-center select-none touch-action-none 
          w-full h-5 cursor-pointer group
        "
        value={[currentTime]}
        onValueChange={handleSeek}
        max={duration || 1}
        step={1}
        disabled={isDisabled}
      >
        <Slider.Track className="
          bg-neutral-600 relative grow rounded-full 
          h-1 group-hover:h-1.5 transition-all
        ">
          <Slider.Range className="
            absolute bg-green-500 rounded-full h-full
          " />
        </Slider.Track>

        <Slider.Thumb
          className="
            block w-3 h-3 bg-white rounded-full 
            shadow-md 
            opacity-0 group-hover:opacity-100 
            transition-opacity 
            focus:outline-none focus:ring-2 focus:ring-green-400
            disabled:opacity-0
          "
          aria-label="Barra de progreso"
        />
      </Slider.Root>

      <span className="text-xs text-neutral-400 w-10 text-left">
        {formatTime(duration)}
      </span>
    </div>
  )
}