import { NextResponse } from 'next/server'
import { getWriteClient, getNotificationEmail, sendNotificationEmail } from '@/lib/notifications'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

interface PrayerRequestBody {
  name: string
  email?: string
  request: string
  isAnonymous: boolean
  /** Honeypot — must stay empty; only bots fill it. */
  website?: string
}

export async function POST(req: Request) {
  try {
    const body: PrayerRequestBody = await req.json()
    const { name, email, request, isAnonymous, website } = body

    // Honeypot: report success so the bot has nothing to tune against.
    if (website?.trim()) {
      return NextResponse.json({ success: true })
    }

    const { allowed, retryAfterSeconds } = rateLimit(`prayer:${getClientIp(req)}`)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      )
    }

    if (!name?.trim() || !request?.trim()) {
      return NextResponse.json({ error: 'Name and prayer request are required.' }, { status: 400 })
    }

    if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const displayName = isAnonymous ? 'Anonymous' : name.trim()

    // Persist first: once the request is stored it cannot be lost to a failed
    // email, and the pastoral team can always recover it from the Studio.
    await getWriteClient().create({
      _type: 'prayerRequest',
      name: displayName,
      email: email?.trim() || undefined,
      request: request.trim(),
      isAnonymous: Boolean(isAnonymous),
      submittedAt: new Date().toISOString(),
      status: 'new',
    })

    const notificationEmail = await getNotificationEmail()
    const { sent, error } = await sendNotificationEmail({
      to: notificationEmail,
      subject: `[Prayer Request] New request from ${displayName}`,
      text: [
        `New prayer request received`,
        ``,
        `From: ${displayName}`,
        email?.trim() ? `Email: ${email.trim()}` : `Email: not provided`,
        `Anonymous: ${isAnonymous ? 'Yes' : 'No'}`,
        ``,
        `Prayer Request:`,
        request.trim(),
      ].join('\n'),
    })

    if (!sent) {
      // The request is safely stored, so this is not fatal for the sender —
      // but the notification pipeline is broken and needs attention.
      console.error(
        `[Prayer request] Request saved but email notification FAILED to ${notificationEmail}: ${error}`
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Prayer request error]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
