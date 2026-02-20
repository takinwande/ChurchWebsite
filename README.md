# RCCG Covenant Assembly — Website

**The Redeemed Christian Church of God Covenant Assembly**
755 North 114th Avenue, Avondale, AZ 85323
[admin@covenantassembly.org](mailto:admin@covenantassembly.org)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| CMS | Sanity v3 (studio at `/studio`) |
| Fonts | Inter (via `next/font`) |
| Deploy | Vercel |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Sanity project

1. Go to [sanity.io](https://sanity.io) and sign in (or create a free account).
2. Click **"New project"** → name it `rccg-covenant-assembly` → choose dataset `production`.
3. Copy your **Project ID** from the project dashboard.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### 5. Open Sanity Studio

Navigate to [http://localhost:3000/studio](http://localhost:3000/studio).

**On first run**, Studio will prompt you to add `localhost:3000` as a CORS origin:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project → **API** tab → **CORS Origins**
3. Add `http://localhost:3000` (and your Vercel URL when deployed)

### 6. Add seed content

In Sanity Studio, add the following to get started:

**Site Settings** (required — controls navbar, footer, and homepage)
- Church Name: `The Redeemed Christian Church of God Covenant Assembly`
- Tagline: e.g. `A place of worship, community, and growth`
- Address: `755 North 114th Avenue`, `Avondale`, `AZ`, `85323`
- Phone: `623-419-5650`
- Email: `admin@covenantassembly.org`
- Add at least one Service Time (e.g. "Sunday Service" / Sunday / 10:00 AM)

**Speakers** → Add at least one speaker (e.g. Lead Pastor's name)

**Sermon Series** → Add a series before adding sermons

**Sermons** → Add a sermon with a YouTube URL

**Events** → Add an upcoming event

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial church website"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.
2. Vercel auto-detects Next.js — no build config needed.
3. Add your environment variables under **Settings → Environment Variables**:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

4. Click **Deploy**.

### 3. Update Sanity CORS

After deploy, add your Vercel domain to Sanity CORS origins:
- [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS Origins** → add `https://your-vercel-url.vercel.app`

---

## Enabling the Contact Form Email

The contact form currently logs submissions to the server console. To send real emails:

1. Create a [Resend](https://resend.com) account (free tier available).
2. Verify your sending domain (or use the `onboarding@resend.dev` address for testing).
3. Add `RESEND_API_KEY=re_xxxx` to your environment variables.
4. Edit [app/api/contact/route.ts](app/api/contact/route.ts) and follow the `TODO` instructions inside.

---

## Project Structure

```
app/
  (site)/            — All public pages (home, sermons, events, etc.)
  studio/            — Embedded Sanity Studio
  api/contact/       — Contact form POST handler
components/
  layout/            — Navbar, Footer, AnnouncementBanner
  home/              — Hero, ServiceTimes, LatestSermon, etc.
  sermons/           — SermonCard, SermonFilters, AudioPlayer
  events/            — EventCard
  contact/           — ContactForm
  portable-text/     — Rich text renderer
  ui/                — shadcn/ui primitives
lib/
  sanity/            — client, queries, image helper
  types.ts           — TypeScript interfaces
  utils.ts           — cn(), formatDate(), etc.
sanity/
  schemaTypes/       — All Sanity content schemas
  sanity.config.ts   — Studio configuration
```

---

## Content Management

All content is managed in Sanity Studio at `/studio`:

| Document | Purpose |
|---|---|
| **Site Settings** | Church name, address, service times, social links, giving URL |
| **Announcement Banner** | Global dismissible banner (toggle on/off) |
| **Plan a Visit Page** | What to expect, FAQ accordion |
| **About Page** | Mission, vision, beliefs, leadership team |
| **Contact Page** | Address, hours, map embed URL |
| **Sermons** | Title, speaker, series, YouTube/audio URL, notes |
| **Sermon Series** | Group sermons by series |
| **Speakers** | Speaker profiles used in sermons |
| **Events** | Title, date/time, location, registration link |

---

## Verification Checklist

### Local
- [ ] `npm install` completes without errors
- [ ] `.env.local` created with Sanity project ID
- [ ] `npm run dev` starts at localhost:3000
- [ ] `/studio` loads Sanity Studio
- [ ] Site Settings saved in Studio
- [ ] Home page shows service times, latest sermon, upcoming events
- [ ] `/sermons` page lists sermons; filters work
- [ ] `/sermons/[slug]` shows YouTube embed or audio player
- [ ] `/events/[slug]` shows event detail
- [ ] `/contact` form submits (check terminal for console.log)
- [ ] Announcement banner appears / disappears based on `enabled` toggle
- [ ] Mobile nav opens and closes correctly
- [ ] All pages load without TypeScript errors

### Vercel
- [ ] Build succeeds (no type errors)
- [ ] Env vars added in Vercel dashboard
- [ ] CORS origin added in Sanity manage
- [ ] Live URL loads correctly
- [ ] Lighthouse score: 90+ performance, 100 accessibility (aim)
