# Launch Checklist

Everything required to move the site from the current Vercel preview onto the
church's real domain. Ordered by dependency — later sections assume earlier ones
are done.

Status as of the last audit is noted inline. Verify rather than trust: some of
these may have been done since.

---

## 1. Environment variables

| Variable | In Vercel? | Action |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | — |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | — |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ✅ | — |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ **wrong**, not just placeholder | **Fix — see below** |
| `SANITY_API_WRITE_TOKEN` | ✅ Production only | Add to Preview/Development too if you use PR previews |
| `RESEND_API_KEY` | ❌ | Required for notification emails |
| `RESEND_FROM_EMAIL` | ❌ | Required for emails to actually arrive (§3) |

Local `.env.local` is *not* carried over — each var must be added to Vercel
separately, per environment. Redeploy after changing any of them; they're baked
in at build time, not read at request time.

- [ ] **`NEXT_PUBLIC_SITE_URL` is actively wrong in production**, not just a
      placeholder. It's set to `rccgcovenantassembly.vercel.app` (no hyphens) —
      that host 404s. The real deployment is at
      `rccg-covenant-assembly.vercel.app`. Because this value feeds `sitemap.xml`,
      `robots.txt`, and every `og:image` URL, **link previews are broken right
      now**: sharing the site to Facebook or iMessage shows no picture, since the
      image URL points at a host that doesn't exist. Set this to the real church
      domain when it's ready, or to the correct `.vercel.app` host in the
      meantime, and redeploy.
- [ ] **`SANITY_API_WRITE_TOKEN`** — confirmed present and working in
      Production (seeded the August 2026 calendar through it). Still absent from
      Preview and Development, so a PR preview deploy will 500 on form
      submission. Add it there too if previews get used.

      Whenever a new token is issued, verify it can actually write before
      trusting it — a read-only token authenticates and queries fine and only
      fails at the moment it tries to write, so it looks correct right up until
      a visitor submits a form:

      ```bash
      curl -s -X POST -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"mutations":[],"dryRun":true}' \
        "https://<projectId>.api.sanity.io/v2024-01-01/data/mutate/production"
      ```
- [ ] **`RESEND_API_KEY`** — reuse the existing send-only restricted key.
      Without it, submissions still save to Sanity but nobody is emailed —
      `new Resend(undefined)` throws, the routes catch it, log
      `Submission saved but email notification FAILED`, and still return
      success to the visitor. That's the intended degradation, not a crash.

```bash
vercel env add NEXT_PUBLIC_SITE_URL production --force   # overwrite the wrong value
vercel env add RESEND_API_KEY production
vercel env ls          # confirm
```

---

## 2. Domain and DNS

- [ ] Add the domain in Vercel → Project → Settings → Domains
- [ ] Point nameservers / A / CNAME records as Vercel instructs
- [ ] Confirm SSL certificate issues successfully
- [ ] Decide whether `www` redirects to apex or vice versa, and set it

---

## 3. Resend — verified sending domain

Until this is done, mail sends from `onboarding@resend.dev`, Resend's shared
test sender. That address **only delivers to the Resend account owner's own
address** — every other recipient is rejected. Submissions still save to Sanity
and the failure is logged, but no one is notified.

> **Use a subdomain: `send.covenantassembly.org`, not the root domain.**
>
> `admin@covenantassembly.org` is a live mailbox — it's on the contact page and
> is the Zelle and PayPal giving address. Verifying the root domain adds Resend's
> SPF record to the same DNS zone that carries real church mail, and a mistake
> there can disrupt delivery of actual correspondence. A subdomain isolates
> sending reputation and leaves the existing mail setup untouched.

- [ ] [resend.com/domains](https://resend.com/domains) → Add Domain →
      `send.covenantassembly.org`
- [ ] Add the 3 DNS records Resend provides (MX, SPF `TXT`, DKIM `TXT`)
      - If the DNS host auto-appends the domain, enter the name as `send`, not
        `send.covenantassembly.org` — otherwise you get
        `send.covenantassembly.org.covenantassembly.org`
- [ ] Click **Verify** (usually minutes; can take up to 48h)
- [ ] Set `RESEND_FROM_EMAIL=noreply@send.covenantassembly.org` in Vercel.
      The mailbox does not need to exist — it only needs to be on the verified
      domain.

---

## 4. Sanity

- [ ] **CORS origin** — [sanity.io/manage](https://sanity.io/manage) → API →
      CORS Origins → add the production domain **with credentials allowed**.
      Studio is embedded at `/studio` on your own domain, so it will fail to
      load without this.
- [ ] **Site Settings → Notification Email** is currently `takinwande@gmail.com`
      — a developer's personal address from testing. Change it to the inbox the
      church actually monitors. It's the recipient for both forms, deliberately
      not an env var so staff can change it without a redeploy.
- [ ] **Delete the test submissions** under **Contact Submissions** and
      **Prayer Requests** from development testing.
- [ ] **Site Settings** — confirm church name, address, phone, email, service
      times and social links are all populated and current. (Verified 2026-09-21:
      these are.)
- [ ] **Announcement Banner** — currently disabled with placeholder text
      (`<blank announcement>`). Fine as-is if there's nothing to announce; set a
      real message and enable it otherwise.
- [ ] **Program Fliers** — all 3 have expired; that section is hidden on the
      homepage. Add current ones if there's anything to promote.

See §8 for content that needs a human read before launch, not just a settings
check.

---

## 5. Recommended before launch

Not blockers, but each is visible to visitors or search engines.

- [x] ~~Favicon~~ / ~~OpenGraph image~~ — done ([#26](https://github.com/takinwande/ChurchWebsite/pull/26), [#30](https://github.com/takinwande/ChurchWebsite/pull/30)). One follow-up: the OG card has the Sunday service times (`9:30 AM Sunday School · 10:00 AM Worship`) written directly into `app/opengraph-image.tsx` rather than read from Site Settings. Matches today's schedule but won't update if it changes — worth wiring to `SITE_SETTINGS_QUERY` at some point.
- [x] ~~`/ministries` missing from `sitemap.ts`~~ — done ([#31](https://github.com/takinwande/ChurchWebsite/pull/31)), and the same page was also missing from the footer's Quick Links, fixed in the same PR.
- [ ] **Structured data (JSON-LD)** — still none on the site. `Church` /
      `LocalBusiness` markup carrying address, geo, phone and service times is
      the single highest-ROI SEO addition for a local congregation, and feeds
      Google's knowledge panel and Maps. `Event` and `VideoObject` markup for
      events and sermons would follow.

---

## 6. Post-launch verification

- [ ] Submit the **contact form** on the live domain → appears in Studio under
      **Contact Submissions**, *and* an email arrives at the notification address
- [ ] Submit the **prayer form** → same, under **Prayer Requests**
- [ ] If no email arrives, check the Vercel function logs — the routes log
      `Submission saved but email notification FAILED` with the specific Resend
      error, which names the cause
- [ ] `/studio` loads and content can be edited
- [ ] `https://<domain>/sitemap.xml` shows the real domain in every URL, not a
      dead or placeholder host (see §1 — this failed silently for a while)
- [ ] Share the homepage link somewhere (a text to yourself is enough) and
      confirm a preview image actually shows up
- [ ] `https://<domain>/robots.txt` resolves and disallows `/studio/`
- [ ] Dark mode toggle works; reload in dark mode shows no white flash
- [ ] Mobile nav opens, and tapping several links in a row navigates every time
- [ ] Run Lighthouse — target 90+ performance, 100 accessibility

---

## 8. Content audit (2026-09-21)

Pulled directly from the production dataset. Everything below needs a Studio
edit, not code — no PR attached to any of these.

### Wrong — fix before launch

- [ ] **Two names for the same youth ministry.** The Ministries page lists
      **"The Chosen Vessels"**; the church's own August calendar (and the event
      seeded from it) says **"The Covenant Vessels (YAYA)"**. Both now appear on
      the live site. The calendar looks authoritative here — check which name is
      actually current and fix the other.
- [ ] **Two titles for Pastor Timothy.** His speaker record says **"Parish
      Pastor"**; the About page leadership section says **"Lead Pastor"**. The
      speaker title isn't visible yet only because there are no sermons — it
      will appear the moment one is added.
- [ ] **"There is no dress code" is live, unreviewed.** The Plan a Visit page
      has no content in Sanity at all, so `app/(site)/plan-a-visit/page.tsx`
      falls back to placeholder copy written directly in code, including that
      specific claim. Confirm it reflects the church's actual practice, or fill
      in the page in Studio so the real content overrides the fallback.
- [ ] **Notification Email and test submissions** — see §4.

### Empty on day one

- [ ] **No sermons at all.** The one that existed ("Brand New Beginning",
      Aug 2026) was deleted outright, not unpublished — confirm that was
      intentional. Until a sermon is added, `/sermons` is empty and the
      homepage's "Latest Message" section doesn't render
      (`if (!sermon) return null`).
- [ ] **No upcoming or recent events.** The August 2026 calendar is the most
      recent content; every event in it is now outside the 10-day past window.
      `/events` will show "No upcoming events" and the homepage's events section
      won't render. Seed September/October the same way as August
      (`scripts/seed-events-august-2026.mjs` as a template) before or right
      after launch.

### Only the church can verify

- [ ] **Give page payment details are hardcoded**, not stored in Sanity:
      Zelle/PayPal to `admin@covenantassembly.org`, Cash App `$RCCGCAAZ`, and the
      Givelify link in `app/(site)/give/page.tsx`. Money moves through these —
      whoever handles church finances should confirm each one before launch.
- [ ] **`siteSettings.givingUrl` is set to a GoFundMe building-fund link**, but
      no page on the site reads or displays that field — it's invisible to
      visitors. Either wire it into the Give page, or clear it so no one assumes
      it's live somewhere it isn't.
- [ ] **AI-drafted prose deserves a read, not just a settings check.** The
      mission, vision, belief statements, and all 8 ministry descriptions came
      from a seed script authored with an AI assistant
      (`scripts/seed-church-content.mjs`). Someone has clearly edited parts of
      it already (a later commit fixed a capitalization issue), but the
      specific factual claims haven't been independently verified end to end.
      One example worth a second look: Outreach's description says the church
      provides "medical services" — the food outreach and backpack giveaway are
      backed by real events and photos, but nothing else in the dataset
      corroborates a medical services claim.

### Already checked and fine

Hero carousel and gallery album are real church photos (the earlier
`seed-test-images.mjs` stock-photo placeholders are gone). Site Settings —
address, phone, service times, and all four social links — match reality.

---

## 9. Known outstanding work

| Item | State |
|---|---|
| [#22](https://github.com/takinwande/ChurchWebsite/pull/22) Vercel Speed Insights | Open — opt-in decision. Needs enabling in the Vercel dashboard to report anything |
| `feature/pastors-desk` | **Do not merge as-is.** Reads as a finished feature, but `pastorsDesk` is never added to the Studio sidebar in `sanity/sanity.config.ts`, so editors cannot create a post. Also ships no tests. Nothing fails at build or test time to warn you |
