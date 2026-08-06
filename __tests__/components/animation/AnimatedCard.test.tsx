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

  // Regression: this wrapper sits between a stretched grid item and a card that
  // sets h-full. Without a height of its own it collapsed to content height, so
  // the card's h-full resolved against that instead of the grid row — leaving
  // cards in a row visibly different heights.
  describe('grid height pass-through', () => {
    it('fills its grid cell', () => {
      const { container } = renderWithProvider(<AnimatedCard>Content</AnimatedCard>)
      expect(container.firstChild).toHaveClass('h-full')
    })

    it('still fills its cell when reduced motion is preferred', () => {
      mockUseReducedMotion.mockReturnValue(true)
      const { container } = renderWithProvider(<AnimatedCard>Content</AnimatedCard>)
      expect(container.firstChild).toHaveClass('h-full')
    })

    it('keeps h-full alongside a caller-supplied className', () => {
      const { container } = renderWithProvider(
        <AnimatedCard className="rounded-xl">Content</AnimatedCard>
      )
      expect(container.firstChild).toHaveClass('h-full')
      expect(container.firstChild).toHaveClass('rounded-xl')
    })
  })
})
