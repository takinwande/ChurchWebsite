import { Card, CardContent } from '@/components/ui/card'
import type { Ministry } from '@/lib/types'

interface MinistryCardProps {
  ministry: Ministry
}

export function MinistryCard({ ministry }: MinistryCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-semibold text-foreground">{ministry.name}</h3>
        {ministry.tagline && (
          <p className="mt-1 text-sm font-medium text-primary">{ministry.tagline}</p>
        )}
        {ministry.description && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{ministry.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
