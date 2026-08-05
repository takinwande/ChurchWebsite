# Launch Checklist

Everything required to move the site from the current Vercel preview onto the
church's real domain. Ordered by dependency — later sections assume earlier ones
are done.

Status as of the last audit is noted inline. Verify rather than trust: some of
these may have been done since.

---

## 1. Environment variables

Vercel currently has **only the four `NEXT_PUBLIC_*` variables**. The three
server-only ones are absent from every environment, which is why the contact and
prayer forms return 500 on the deployed preview.

Local `.env.local` is *not* carried over. Each must be added to Vercel
separately, per environment.

| Variable | In Vercel? | Action |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | — |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | — |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ✅ | — |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ set to placeholder | **Change to the real domain** |
| `SANITY_API_WRITE_TOKEN` | ❌ | **Required — forms 500 without it** |
| `RESEND_API_KEY` | ❌ | Required for notification emails |
| `RESEND_FROM_EMAIL` | ❌ | Required for emails to actually arrive (§3) |

- [ ] **`NEXT_PUBLIC_SITE_URL`** — currently the literal string
      `https://your-domain.com`, locally and in Vercel. It feeds `sitemap.xml`,
      `robots.txt` and OpenGraph tags, so shipping as-is publishes
      `your-domain.com` URLs to crawlers.
- [ ] **`SANITY_API_WRITE_TOKEN`** — create at
      [sanity.io/manage](https://sanity.io/manage) → API → Tokens, permission
      **Editor**. Shown once; copy immediately. Both form routes persist to
      Sanity before emailing, so without this every submission fails.
- [ ] **`RESEND_API_KEY`** — reuse the existing send-only restricted key.
- [ ] Add each to **Production, Preview and Development**.
- [ ] Redeploy — env vars only apply to *new* deployments.

```bash
vercel env add SANITY_API_WRITE_TOKEN production
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
- [ ] **Site Settings → Notification Email** — change from the development
      address to the address the church actually monitors. This is the recipient
      for both forms, and it is deliberately *not* an env var so staff can change
      it without a redeploy.
- [ ] **Site Settings** — confirm church name, address, phone, email, service
      times and social links are all populated and current.
- [ ] **Announcement Banner** — set to the intended state (enabled/disabled).
- [ ] **Program Fliers** — check `expiresAt` dates; expired fliers vanish from
      the homepage automatically.

---

## 5. Recommended before launch

Not blockers, but each is visible to visitors or search engines.

- [ ] **Favicon** — none exists. `public/` contains only `logo.jpg`, and there
      is no `app/icon.*`. Browsers will show a blank tab icon.
- [ ] **OpenGraph image** — none exists. `app/layout.tsx` declares
      `twitter: { card: 'summary_large_image' }` but no image is provided, so
      links shared on Facebook — where this church has an active presence — will
      render as a bare box with no picture. This is the highest-visibility item
      in this section.
- [ ] **`/ministries` missing from `sitemap.ts`** — the page is live and linked
      from both the nav and the About page, but is absent from the sitemap.
- [ ] **Structured data (JSON-LD)** — none on the site. `Church` /
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
- [ ] `https://<domain>/sitemap.xml` shows real URLs, not `your-domain.com`
- [ ] `https://<domain>/robots.txt` resolves and disallows `/studio/`
- [ ] Dark mode toggle works; reload in dark mode shows no white flash
- [ ] Mobile nav opens, and tapping several links in a row navigates every time
- [ ] Run Lighthouse — target 90+ performance, 100 accessibility

---

## 7. Known outstanding work

| Item | State |
|---|---|
| [#22](https://github.com/takinwande/ChurchWebsite/pull/22) Vercel Speed Insights | Open — opt-in decision. Needs enabling in the Vercel dashboard to report anything |
| [#23](https://github.com/takinwande/ChurchWebsite/pull/23) `.env.example` server vars | Open — docs only |
| `feature/pastors-desk` | **Do not merge as-is.** Reads as a finished feature, but `pastorsDesk` is never added to the Studio sidebar in `sanity/sanity.config.ts`, so editors cannot create a post. Also ships no tests. Nothing fails at build or test time to warn you |
