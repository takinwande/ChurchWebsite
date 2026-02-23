import { groq } from 'next-sanity'

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    _id, name, tagline, logo, address, phone, email,
    serviceTimes, socialLinks, givingUrl, livestreamUrl,
    heroImages, notificationEmail
  }
`

export const ANNOUNCEMENT_QUERY = groq`
  *[_type == "announcement"][0]{
    _id, enabled, text, link, linkText
  }
`

export const LATEST_SERMON_QUERY = groq`
  *[_type == "sermon"] | order(date desc)[0]{
    _id, title, slug, date, youtubeUrl, audioUrl,
    summary[0...1],
    "speaker": speaker->{ name, title, slug },
    "series": series->{ title, slug }
  }
`

export const UPCOMING_EVENTS_QUERY = groq`
  *[_type == "event" && startDateTime > $now] | order(startDateTime asc)[0...3]{
    _id, title, slug, startDateTime, endDateTime, location,
    "imageUrl": image.asset->url
  }
`

export const SERMONS_QUERY = groq`
  *[_type == "sermon"
    && (!defined($series) || series->slug.current == $series)
    && (!defined($speaker) || speaker->slug.current == $speaker)
  ] | order(date desc){
    _id, title, slug, date, youtubeUrl, audioUrl,
    summary[0...1],
    "speaker": speaker->{ name, title, slug },
    "series": series->{ title, slug }
  }
`

export const ALL_SERIES_QUERY = groq`
  *[_type == "sermonSeries"] | order(title asc){ _id, title, slug }
`

export const ALL_SPEAKERS_QUERY = groq`
  *[_type == "speaker"] | order(name asc){ _id, name, title, slug }
`

export const SERMON_BY_SLUG_QUERY = groq`
  *[_type == "sermon" && slug.current == $slug][0]{
    _id, title, slug, date, youtubeUrl, audioUrl,
    summary, scriptureRefs, resources, featured,
    "speaker": speaker->{
      _id, name, title, slug, photo,
      bio[0...3]
    },
    "series": series->{
      _id, title, slug, description, coverImage,
      "sermons": *[_type == "sermon" && series._ref == ^._id] | order(date desc)[0...6]{
        _id, title, slug, date,
        "speaker": speaker->{ name }
      }
    }
  }
`

export const EVENTS_QUERY = groq`
  *[_type == "event"] | order(startDateTime asc){
    _id, title, slug, startDateTime, endDateTime,
    location, registrationUrl, featured,
    "imageUrl": image.asset->url
  }
`

export const EVENT_BY_SLUG_QUERY = groq`
  *[_type == "event" && slug.current == $slug][0]{
    _id, title, slug, startDateTime, endDateTime,
    location, description, registrationUrl, featured,
    image, "imageUrl": image.asset->url
  }
`

export const PLAN_VISIT_QUERY = groq`
  *[_type == "planVisitPage"][0]{
    heroText, heroSubtext, whatToExpectBody, faq, contactCta
  }
`

export const ABOUT_QUERY = groq`
  *[_type == "aboutPage"][0]{
    mission, vision, beliefs, leadership
  }
`

export const CONTACT_QUERY = groq`
  *[_type == "contactPage"][0]{
    address, phone, email, officeHours, mapEmbedUrl
  }
`

export const GIVE_QUERY = groq`
  *[_type == "siteSettings"][0]{ givingUrl, name, tagline }
`

export const MINISTRIES_QUERY = groq`
  *[_type == "ministry"] | order(order asc, name asc){
    _id, name, slug, tagline, description
  }
`

export const GALLERY_ALBUMS_QUERY = groq`
  *[_type == "galleryAlbum"] | order(date desc) {
    _id, title, slug, date, description,
    "coverImageUrl": coverImage.asset->url,
    "photoCount": count(photos)
  }
`

export const GALLERY_ALBUM_QUERY = groq`
  *[_type == "galleryAlbum" && slug.current == $slug][0] {
    _id, title, slug, date, description,
    coverImage,
    "coverImageUrl": coverImage.asset->url,
    "photos": photos[]{ ..., "url": asset->url }
  }
`

export const SITEMAP_QUERY = groq`
  {
    "sermons": *[_type == "sermon"]{ slug, date },
    "events": *[_type == "event"]{ slug, startDateTime },
    "galleryAlbums": *[_type == "galleryAlbum"]{ slug, date }
  }
`
