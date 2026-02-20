'use client'

import { useRef, useState, useCallback } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  src: string
  title?: string
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      setLoading(true)
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        // playback blocked or failed
      } finally {
        setLoading(false)
      }
    }
  }, [playing])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="rounded-xl border border-border bg-slate-50 p-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
      />

      {title && (
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="font-medium text-foreground truncate">{title}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={togglePlay}
          size="icon"
          aria-label={playing ? 'Pause audio' : 'Play audio'}
          disabled={loading}
          className="h-10 w-10 shrink-0 rounded-full"
        >
          {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
        </Button>

        <div className="flex flex-1 flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Audio progress"
            className={cn(
              'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border',
              '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5',
              '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary',
              '[&::-webkit-slider-runnable-track]:rounded-full',
            )}
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--border)) ${progress}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
