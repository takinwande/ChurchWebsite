import { render, screen } from '@testing-library/react'
import { FadeIn } from '@/components/animation/FadeIn'
import { ReducedMotionProvider } from '@/components/animation/ReducedMotionProvider'
import { useReducedMotion } from 'framer-motion'

jest.mock('framer-motion')

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>

function renderWithProvider(ui: React.ReactElement) {
  return render(<ReducedMotionProvider>{ui}</ReducedMotionProvider>)
}

describe('FadeIn', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders children', () => {
    renderWithProvider(<FadeIn>Hello world</FadeIn>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('passes className to wrapper element', () => {
    const { container } = renderWithProvider(<FadeIn className="test-class">Content</FadeIn>)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('renders a plain div when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = renderWithProvider(<FadeIn className="test-class">Content</FadeIn>)
    expect(container.querySelector('div')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
