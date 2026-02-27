import { render, screen } from '@testing-library/react'
import { SlideUp } from '@/components/animation/SlideUp'
import { ReducedMotionProvider } from '@/components/animation/ReducedMotionProvider'
import { useReducedMotion } from 'framer-motion'

jest.mock('framer-motion')

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>

function renderWithProvider(ui: React.ReactElement) {
  return render(<ReducedMotionProvider>{ui}</ReducedMotionProvider>)
}

describe('SlideUp', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders children', () => {
    renderWithProvider(<SlideUp>Hello world</SlideUp>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('passes className to wrapper element', () => {
    const { container } = renderWithProvider(<SlideUp className="test-class">Content</SlideUp>)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('accepts delay and duration props without error', () => {
    renderWithProvider(<SlideUp delay={0.2} duration={0.5} distance={24}>Content</SlideUp>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders a plain div when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = renderWithProvider(<SlideUp className="test-class">Content</SlideUp>)
    expect(container.querySelector('div')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
