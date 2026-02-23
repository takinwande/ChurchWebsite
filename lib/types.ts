import type { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  _type: 'image'
  _key?: string
  alt?: string
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; width: number; height: number }
}

export interface ServiceTime {
  name: string
  day: string
  time: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  tiktok?: string
}

export interface Address {
  street?: string
  city?: string
  state?: string
  zip?: string
}

export interface SiteSettings {
  _id: string
  name: string
  tagline?: string
  logo?: SanityImage
  address?: Address
  phone?: string
  email?: string
  serviceTimes?: ServiceTime[]
  socialLinks?: SocialLinks
  givingUrl?: string
  livestreamUrl?: string
}

export interface Announcement {
  _id: string
  enabled: boolean
  text: string
  link?: string
  linkText?: string
}

export interface Speaker {
  _id: string
  name: string
  slug: { current: string }
  title?: string
  photo?: SanityImage
  bio?: PortableTextBlock[]
}

export interface SermonSeries {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  coverImage?: SanityImage
}

export interface SermonResource {
  title: string
  url: string
}

export interface Sermon {
  _id: string
  title: string
  slug: { current: string }
  date: string
  speaker?: Pick<Speaker, 'name' | 'slug' | 'title' | 'photo'>
  series?: Pick<SermonSeries, 'title' | 'slug'>
  youtubeUrl?: string
  audioUrl?: string
  summary?: PortableTextBlock[]
  scriptureRefs?: string[]
  resources?: SermonResource[]
  featured?: boolean
}

export interface SermonDetail extends Sermon {
  speaker?: Speaker
  series?: SermonSeries & {
    sermons?: Pick<Sermon, 'title' | 'slug' | 'date' | 'speaker'>[]
  }
}

export interface Event {
  _id: string
  title: string
  slug: { current: string }
  startDateTime: string
  endDateTime?: string
  location?: string
  description?: PortableTextBlock[]
  registrationUrl?: string
  featured?: boolean
  image?: SanityImage
  imageUrl?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface PlanVisitPage {
  heroText?: string
  heroSubtext?: string
  whatToExpectBody?: PortableTextBlock[]
  faq?: FaqItem[]
  contactCta?: string
}

export interface LeadershipMember {
  name: string
  title?: string
  photo?: SanityImage
  bio?: string
}

export interface AboutPage {
  mission?: string
  vision?: string
  beliefs?: PortableTextBlock[]
  leadership?: LeadershipMember[]
}

export interface ContactPage {
  address?: string
  phone?: string
  email?: string
  officeHours?: string
  mapEmbedUrl?: string
}

export interface Ministry {
  _id: string
  name: string
  slug: { current: string }
  tagline?: string
  description?: string
  order?: number
}

export interface GalleryPhoto extends SanityImage {
  url?: string
}

export interface GalleryAlbum {
  _id: string
  title: string
  slug: { current: string }
  date: string
  description?: string
  coverImage?: SanityImage
  coverImageUrl?: string
  photos?: GalleryPhoto[]
  photoCount?: number
}
