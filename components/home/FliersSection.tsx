import { FliersCarousel } from './FliersCarousel'
import type { ProgramFlier } from '@/lib/types'

interface FliersSectionProps {
  fliers: ProgramFlier[]
}

export function FliersSection({ fliers }: FliersSectionProps) {
  if (!fliers || fliers.length === 0) return null

  return (
    <section className="py-20 bg-white" aria-label="Program fliers">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Special Events
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Upcoming Programs
            </h2>
            <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary" aria-hidden="true" />
          </div>
          <div
            className="rounded-3xl overflow-hidden
                       shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.08)]"
          >
            <FliersCarousel fliers={fliers} />
          </div>
        </div>
      </div>
    </section>
  )
}
