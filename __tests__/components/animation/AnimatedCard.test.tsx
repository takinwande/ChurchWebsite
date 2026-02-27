import { render, screen } from '@testing-library/react'
import { AnimatedCard } from '@/components/animation/AnimatedCard'
import { ReducedMotionProvider } from '@/components/animation/ReducedMotionProvider'
import { useReducedMotion } from 'framer-motion'

jest.mock('framer-motion')

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>

function renderWithProvider(ui: React.ReactElement) {
  return render(<ReducedMotionProvider>{ui}</ReducedMotionProvider>)
}

describe('AnimatedCard', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders children', () => {
    renderWithProvider(<AnimatedCard>Card content</AnimatedCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('passes className to wrapper element', () => {
    const { container } = renderWithProvider(
      <AnimatedCard className="rounded-xl">Content</AnimatedCard>
    )
    expect(container.firstChild).toHaveClass('rounded-xl')
  })

  it('renders a plain div when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = renderWithProvider(<AnimatedCard>Content</AnimatedCard>)
    expect(container.querySelector('div')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
