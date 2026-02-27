import { render, screen } from '@testing-library/react'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { ReducedMotionProvider } from '@/components/animation/ReducedMotionProvider'
import { useReducedMotion } from 'framer-motion'

jest.mock('framer-motion')

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>

function renderWithProvider(ui: React.ReactElement) {
  return render(<ReducedMotionProvider>{ui}</ReducedMotionProvider>)
}

describe('StaggerContainer', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders children', () => {
    renderWithProvider(
      <StaggerContainer>
        <span>Child 1</span>
        <span>Child 2</span>
      </StaggerContainer>
    )
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('passes className to wrapper element', () => {
    const { container } = renderWithProvider(
      <StaggerContainer className="grid gap-4">Content</StaggerContainer>
    )
    expect(container.firstChild).toHaveClass('grid', 'gap-4')
  })

  it('accepts staggerDelay and delayStart props without error', () => {
    renderWithProvider(
      <StaggerContainer staggerDelay={0.06} delayStart={0.1}>
        Content
      </StaggerContainer>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders a plain div when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = renderWithProvider(
      <StaggerContainer className="grid">Content</StaggerContainer>
    )
    expect(container.querySelector('div')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
