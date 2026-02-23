import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { Resend } from 'resend'

interface ContactBody {
  name: string
  email: string
  subject: string
  message: string
}

const FALLBACK_EMAIL = 'admin@covenantassembly.org'

async function getNotificationEmail(): Promise<string> {
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: '2024-01-01',
      useCdn: false,
    })
    const settings = await client.fetch<{ notificationEmail?: string }>(
      `*[_type == "siteSettings"][0]{ notificationEmail }`
    )
    return settings?.notificationEmail?.trim() || FALLBACK_EMAIL
  } catch {
    return FALLBACK_EMAIL
  }
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

    const [notificationEmail, resend] = await Promise.all([
      getNotificationEmail(),
      Promise.resolve(new Resend(process.env.RESEND_API_KEY)),
    ])

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: notificationEmail,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `New contact form submission from ${name}\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Contact form error]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
