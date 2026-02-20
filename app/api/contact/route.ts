import { NextResponse } from 'next/server'

interface ContactBody {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(req: Request) {
  try {
    const body: ContactBody = await req.json()

    const { name, email, subject, message } = body

    // Basic server-side validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TODO: Wire up a real email provider here.
    //
    // Option A — Resend (recommended):
    //   1. npm install resend
    //   2. Add RESEND_API_KEY to .env.local
    //   3. Replace the console.log below with:
    //
    //   import { Resend } from 'resend'
    //   const resend = new Resend(process.env.RESEND_API_KEY)
    //   await resend.emails.send({
    //     from: 'website@yourdomain.com',          // must match a verified Resend domain
    //     to: 'admin@covenantassembly.org',
    //     replyTo: email,
    //     subject: `[Website] ${subject}`,
    //     text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    //   })
    //
    // Option B — Nodemailer via SMTP:
    //   npm install nodemailer @types/nodemailer
    //   Use SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.
    // ─────────────────────────────────────────────────────────────────────────

    console.log('[Contact form submission]', { name, email, subject, message })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Contact form error]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
