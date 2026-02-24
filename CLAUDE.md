# CLAUDE.md — ChurchWebsite Project Context

## Role
You are a Senior Full-stack Software Engineer with strong design sensibility, working on a church website for RCCG Covenant Assembly.

---

## Ground Rules (always follow these)

1. **Feature branches** — Always create a new git branch before starting any feature (`git checkout -b feature/<name>`)
2. **Write tests** — Every new feature must have corresponding tests. Follow the existing Jest + React Testing Library patterns
3. **No regressions** — Run the full test suite (`npm test`) before considering a task complete
4. **Ask first** — If any requirement is ambiguous, ask clarifying questions before writing code

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| CMS | Sanity v3 (headless, cloud-hosted) |
| Email | Resend |
| Icons | Lucide React |
| Date utils | date-fns |
| Testing | Jest 30 + React Testing Library |
| Deployment | Vercel |

---

## Project Structure

```
app/
  (site)/              # Public-facing pages (route group)
  api/                 # API routes (contact, prayer)
  studio/              # Embedded Sanity Studio
components/
  layout/              # Navbar, Footer, AnnouncementBanner, MobileMenu
  home/                # Hero, ServiceTimesSection, LatestSermon, UpcomingEvents, AboutTeaser
  sermons/             # SermonCard, SermonFilters, AudioPlayer
  events/              # EventCard
  gallery/             # AlbumCard
  contact/             # ContactForm
  prayer/              # PrayerRequestForm
  give/                # GivingMethodCard
  ministries/          # MinistryCard
  portable-text/       # PortableTextRenderer
  ui/                  # shadcn/ui primitives (accordion, button, card, dialog, etc.)
lib/
  sanity/
    client.ts          # Sanity client config
    queries.ts         # All GROQ queries (centralized here)
    image.ts           # Image URL builder
  types.ts             # All TypeScript interfaces (centralized here)
  utils.ts             # Utility functions (formatDate, formatPhone, getYouTubeEmbedUrl)
sanity/
  schemaTypes/         # 13 Sanity document schemas
__tests__/             # Jest test files (mirrors src structure)
__mocks__/             # Jest mocks (Next.js Image, Link, Navigation)
```

---

## Architectural Patterns

### Server vs. Client Components
- **Page files** (`page.tsx`) are Server Components — they `async` fetch data via GROQ
- Interactive components (forms, state, event handlers) are marked `'use client'`
- Data flows down: Server Component fetches → passes props to Client Component

### Adding a New Feature (standard flow)
1. **Sanity schema** → `sanity/schemaTypes/<name>.ts` + register in `sanity/schemaTypes/index.ts`
2. **Sanity Studio sidebar** → add the new type to the `structureTool` structure in `sanity/sanity.config.ts` — the sidebar is manually defined and does **not** auto-populate from registered schemas
3. **TypeScript type** → add interface to `lib/types.ts`
4. **GROQ query** → add to `lib/sanity/queries.ts`
5. **Page/Component** → create in `app/(site)/<name>/page.tsx` and/or `components/<name>/`
6. **API route** (if form submission needed) → `app/api/<name>/route.ts`
7. **Tests** → `__tests__/components/<name>/` and/or `__tests__/api/<name>.test.ts`
8. **Navigation** → add link to `components/layout/Navbar.tsx` and `MobileMenu.tsx`

### Form Pattern
- Client-side validation (instant feedback) + server-side validation (security)
- Success/error state managed locally in the component
- POST to `/api/<name>` route, which validates → stores in Sanity → emails via Resend

### Singleton Sanity Documents
- `siteSettings`, `announcement`, `planVisitPage`, `aboutPage`, `contactPage`
- Queried with `[0]` (single document, always)

### Slug-based Dynamic Routes
- Pattern: `app/(site)/[category]/[slug]/page.tsx`
- Slugs come from `slug.current` in Sanity

---

## Key Files to Know

| File | Purpose |
|---|---|
| `lib/sanity/queries.ts` | All GROQ queries — always add new ones here |
| `lib/types.ts` | All TypeScript interfaces — always add new types here |
| `lib/utils.ts` | Shared utility functions |
| `sanity/schemaTypes/index.ts` | Register new Sanity schemas here |
| `sanity/sanity.config.ts` | Sanity Studio configuration |
| `app/(site)/layout.tsx` | Site layout (Navbar, Footer, AnnouncementBanner) |
| `tailwind.config.ts` | Custom theme (primary color palette, CSS variables) |
| `jest.config.js` | Jest configuration |
| `jest.setup.ts` | Global mocks (matchMedia, IntersectionObserver, etc.) |
| `__mocks__/` | Module-level mocks for Next.js and style imports |

---

## Sanity Schemas (14 document types)

| Schema | Type | Key Fields |
|---|---|---|
| `siteSettings` | singleton | church name, logo, address, service times, social links, notification email |
| `announcement` | singleton | enabled toggle, text, link |
| `sermon` | document | title, slug, date, speaker (ref), series (ref), YouTube URL, audio URL |
| `sermonSeries` | document | title, slug, description, cover image |
| `speaker` | document | name, slug, title, photo, bio |
| `event` | document | title, slug, start/end dates, location, description, registration URL |
| `programFlier` | document | title (internal), image, expiresAt (datetime), order — homepage rotating fliers |
| `galleryAlbum` | document | title, slug, cover image, photos array |
| `ministry` | document | name, slug, tagline, description, order |
| `prayerRequest` | document | name, email, request, anonymous flag, status |
| `planVisitPage` | singleton | hero text, "what to expect" body, FAQ items |
| `aboutPage` | singleton | mission, vision, beliefs, leadership array |
| `contactPage` | singleton | address, phone, email, office hours, map embed URL |

---

## Testing Conventions

```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

- Test files live in `__tests__/` mirroring the component/API structure
- Use `@testing-library/react` for component tests, `jest` for API route tests
- Mock external modules (Sanity, Resend, Next.js) — see `__mocks__/` and `jest.setup.ts`
- Mock `next/navigation` for components that use `useRouter`, `useSearchParams`, etc.
- Test user interactions with `@testing-library/user-event`

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=       # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=          # production
NEXT_PUBLIC_SANITY_API_VERSION=      # e.g. 2024-01-01
NEXT_PUBLIC_SITE_URL=                # Full URL (for metadata/sitemap)

# Server-only
SANITY_API_WRITE_TOKEN=              # For writing to Sanity (forms)
RESEND_API_KEY=                      # Resend email API key
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `PrayerRequestForm.tsx` |
| Pages/routes | kebab-case | `/plan-a-visit`, `/[slug]` |
| GROQ queries | UPPER_SNAKE_CASE | `SERMON_BY_SLUG_QUERY` |
| Types/Interfaces | PascalCase | `Sermon`, `SiteSettings` |
| Utilities | camelCase | `formatDate`, `getYouTubeEmbedUrl` |
| Test files | `<Component>.test.tsx` | `PrayerRequestForm.test.tsx` |
| Feature branches | `feature/<name>` | `feature/sermon-notes` |

---

## npm Scripts

```bash
npm run dev             # Dev server (localhost:3000)
npm run build          # Production build
npm run lint           # ESLint
npm test               # Jest (all tests)
npm run test:watch    # Jest watch mode
npm run test:coverage # Jest coverage
```

---

## Styling Notes

- Tailwind utility-first; use semantic tokens (`bg-background`, `text-foreground`, `border-border`) for theme-aware colors
- Primary color palette: `primary-50` through `primary-900` (blue scale, defined in `tailwind.config.ts`)
- Dark mode supported via `dark:` prefix (class-based)
- Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for conditional classes
- Prefer Tailwind classes over inline styles; no new CSS files unless truly necessary
