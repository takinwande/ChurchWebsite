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

// $todayStart is midnight today in the church's time zone, so an event still
// running this afternoon is counted as upcoming rather than dropping off the
// moment its start time passes.
export const UPCOMING_EVENTS_QUERY = groq`
  *[_type == "event" && startDateTime >= $todayStart] | order(startDateTime asc)[0...3]{
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

const EVENT_LIST_FIELDS = `
  _id, title, slug, startDateTime, endDateTime,
  location, registrationUrl, featured,
  "imageUrl": image.asset->url
`

/**
 * Splits events into the two groups the page renders, filtered in GROQ rather
 * than in JS so events older than the window are never fetched at all.
 *
 * Upcoming runs soonest-first; past runs most-recent-first, which is the more
 * useful order when looking back.
 */
export const EVENTS_QUERY = groq`
  {
    "upcoming": *[_type == "event" && startDateTime >= $todayStart]
      | order(startDateTime asc){ ${EVENT_LIST_FIELDS} },
    "past": *[_type == "event" && startDateTime < $todayStart && startDateTime >= $pastCutoff]
      | order(startDateTime desc){ ${EVENT_LIST_FIELDS} }
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

export const ACTIVE_FLIERS_QUERY = groq`
  *[_type == "programFlier" && expiresAt > $now]
  | order(order asc, expiresAt asc)
  [0...10]{
    _id, title, image, "imageUrl": image.asset->url, expiresAt, order
  }
`

export const SITEMAP_QUERY = groq`
  {
    "sermons": *[_type == "sermon"]{ slug, date },
    "events": *[_type == "event"]{ slug, startDateTime },
    "galleryAlbums": *[_type == "galleryAlbum"]{ slug, date }
  }
`
