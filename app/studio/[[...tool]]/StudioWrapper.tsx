'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioWrapper() {
  return <NextStudio config={config} />
}
