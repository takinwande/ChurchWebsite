import { Clock } from 'lucide-react'
import type { ServiceTime } from '@/lib/types'

interface ServiceTimesSectionProps {
  serviceTimes: ServiceTime[]
}

export function ServiceTimesSection({ serviceTimes }: ServiceTimesSectionProps) {
  const times = serviceTimes.length > 0
    ? serviceTimes
    : [{ name: 'Sunday Worship Service', day: 'Sunday', time: '10:00 AM' }]

  return (
    <section className="bg-primary py-12 text-white" aria-label="Service times">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12 lg:gap-20">
          <div className="flex items-center gap-3 text-white/80">
            <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-wider">Join Us</span>
          </div>
          {times.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">{s.name}</p>
              <p className="mt-1 text-lg font-semibold">
                {s.day} &middot; {s.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
