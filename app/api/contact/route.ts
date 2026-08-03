import { NextResponse } from 'next/server'
import { getWriteClient, getNotificationEmail, sendNotificationEmail } from '@/lib/notifications'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

interface ContactBody {
  name: string
  email: string
  subject: string
  message: string
  /** Honeypot — must stay empty; only bots fill it. */
  website?: string
}

export async function POST(req: Request) {
  try {
    const body: ContactBody = await req.json()
    const { name, email, subject, message, website } = body

    // Honeypot: report success so the bot has nothing to tune against.
    if (website?.trim()) {
      return NextResponse.json({ success: true })
    }

    const { allowed, retryAfterSeconds } = rateLimit(`contact:${getClientIp(req)}`)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      )
    }

    // Basic server-side validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Persist first: once the submission is stored it cannot be lost to a
    // failed email, and staff can always recover it from the Studio.
    await getWriteClient().create({
      _type: 'contactSubmission',
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'new',
    })

    const notificationEmail = await getNotificationEmail()
    const { sent, error } = await sendNotificationEmail({
      to: notificationEmail,
      replyTo: email.trim(),
      subject: `[Contact] ${subject.trim()}`,
      text: [
        `New contact form submission from ${name.trim()}`,
        ``,
        `From: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Subject: ${subject.trim()}`,
        ``,
        `Message:`,
        message.trim(),
      ].join('\n'),
    })

    if (!sent) {
      // The submission is safely stored, so this is not fatal for the sender —
      // but the notification pipeline is broken and needs attention.
      console.error(
        `[Contact form] Submission saved but email notification FAILED to ${notificationEmail}: ${error}`
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Contact form error]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
