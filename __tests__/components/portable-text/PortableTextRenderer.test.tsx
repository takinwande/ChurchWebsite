import React from 'react'
import { render, screen } from '@testing-library/react'
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer'
import type { PortableTextBlock } from '@portabletext/react'

const paragraphBlock: PortableTextBlock = {
  _type: 'block',
  _key: 'block-1',
  style: 'normal',
  children: [{ _type: 'span', _key: 'span-1', text: 'Hello church family', marks: [] }],
  markDefs: [],
}

describe('PortableTextRenderer', () => {
  it('returns null for an empty array', () => {
    const { container } = render(<PortableTextRenderer value={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null for null value (cast for test)', () => {
    const { container } = render(
      <PortableTextRenderer value={null as unknown as PortableTextBlock[]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null for undefined value (cast for test)', () => {
    const { container } = render(
      <PortableTextRenderer value={undefined as unknown as PortableTextBlock[]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders paragraph block text content', () => {
    render(<PortableTextRenderer value={[paragraphBlock]} />)
    expect(screen.getByText('Hello church family')).toBeInTheDocument()
  })

  it('wraps content in a div element', () => {
    const { container } = render(<PortableTextRenderer value={[paragraphBlock]} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('applies optional className to the wrapping div', () => {
    const { container } = render(
      <PortableTextRenderer value={[paragraphBlock]} className="prose" />
    )
    expect(container.firstChild).toHaveClass('prose')
  })

  it('renders multiple blocks', () => {
    const secondBlock: PortableTextBlock = {
      _type: 'block',
      _key: 'block-2',
      style: 'normal',
      children: [{ _type: 'span', _key: 'span-2', text: 'Second paragraph', marks: [] }],
      markDefs: [],
    }
    render(<PortableTextRenderer value={[paragraphBlock, secondBlock]} />)
    expect(screen.getByText('Hello church family')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
  })
})
