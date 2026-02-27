import { render, screen } from '@testing-library/react'
import { StaggerItem } from '@/components/animation/StaggerItem'
import { ReducedMotionProvider } from '@/components/animation/ReducedMotionProvider'
import { useReducedMotion } from 'framer-motion'

jest.mock('framer-motion')

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>

function renderWithProvider(ui: React.ReactElement) {
  return render(<ReducedMotionProvider>{ui}</ReducedMotionProvider>)
}

describe('StaggerItem', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders children', () => {
    renderWithProvider(<StaggerItem>Card content</StaggerItem>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('passes className to wrapper element', () => {
    const { container } = renderWithProvider(
      <StaggerItem className="col-span-1">Content</StaggerItem>
    )
    expect(container.firstChild).toHaveClass('col-span-1')
  })

  it('renders a plain div when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = renderWithProvider(<StaggerItem>Content</StaggerItem>)
    expect(container.querySelector('div')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
