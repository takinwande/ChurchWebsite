import dynamic from 'next/dynamic'

const StudioWrapper = dynamic(() => import('./StudioWrapper'), { ssr: false })

export default function StudioPage() {
  return <StudioWrapper />
}
