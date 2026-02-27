import { render, screen } from '@testing-library/react'
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper'
import { useReducedMotion } from 'framer-motion'

jest.mock('framer-motion')
jest.mock('next/navigation')

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>

describe('PageTransitionWrapper', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders children', () => {
    render(
      <PageTransitionWrapper>
        <div>Page content</div>
      </PageTransitionWrapper>
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('renders children when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <PageTransitionWrapper>
        <div>Page content</div>
      </PageTransitionWrapper>
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })
})
