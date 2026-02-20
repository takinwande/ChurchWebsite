import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AudioPlayer } from '@/components/sermons/AudioPlayer'

// Mock HTMLMediaElement play/pause since jsdom does not implement audio playback
beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: jest.fn().mockResolvedValue(undefined),
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: jest.fn(),
  })
})

describe('AudioPlayer', () => {
  it('renders the play button initially', () => {
    render(<AudioPlayer src="https://cdn.example.com/sermon.mp3" />)
    expect(screen.getByRole('button', { name: 'Play audio' })).toBeInTheDocument()
  })

  it('renders the title when title prop is provided', () => {
    render(<AudioPlayer src="https://cdn.example.com/sermon.mp3" title="Sunday Sermon Audio" />)
    expect(screen.getByText('Sunday Sermon Audio')).toBeInTheDocument()
  })

  it('does not render title when title prop is absent', () => {
    render(<AudioPlayer src="https://cdn.example.com/sermon.mp3" />)
    expect(screen.queryByText('Sunday Sermon Audio')).not.toBeInTheDocument()
  })

  it('shows "0:00" for both current time and duration initially', () => {
    render(<AudioPlayer src="https://cdn.example.com/sermon.mp3" />)
    const timeDisplays = screen.getAllByText('0:00')
    expect(timeDisplays).toHaveLength(2)
  })

  it('toggles to "Pause audio" button after play button is clicked', async () => {
    render(<AudioPlayer src="https://cdn.example.com/sermon.mp3" />)
    await userEvent.click(screen.getByRole('button', { name: 'Play audio' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pause audio' })).toBeInTheDocument()
    })
  })

  it('toggles back to "Play audio" button when pause button is clicked', async () => {
    render(<AudioPlayer src="https://cdn.example.com/sermon.mp3" />)
    await userEvent.click(screen.getByRole('button', { name: 'Play audio' }))
    await waitFor(() => screen.getByRole('button', { name: 'Pause audio' }))
    await userEvent.click(screen.getByRole('button', { name: 'Pause audio' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Play audio' })).toBeInTheDocument()
    })
  })

  it('renders the progress range slider', () => {
    render(<AudioPlayer src="https://cdn.example.com/sermon.mp3" />)
    expect(screen.getByRole('slider', { name: 'Audio progress' })).toBeInTheDocument()
  })
})
