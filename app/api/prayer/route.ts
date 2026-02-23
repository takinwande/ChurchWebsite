import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { Resend } from 'resend'

const ADMIN_EMAIL = 'admin@covenantassembly.org'

interface PrayerRequestBody {
  name: string
  email?: string
  request: string
  isAnonymous: boolean
}

export async function POST(req: Request) {
  try {
    const body: PrayerRequestBody = await req.json()
    const { name, email, request, isAnonymous } = body

    if (!name?.trim() || !request?.trim()) {
      return NextResponse.json({ error: 'Name and prayer request are required.' }, { status: 400 })
    }

    if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      token: process.env.SANITY_API_WRITE_TOKEN,
      apiVersion: '2024-01-01',
      useCdn: false,
    })

    await client.create({
      _type: 'prayerRequest',
      name: isAnonymous ? 'Anonymous' : name.trim(),
      email: email?.trim() || undefined,
      request: request.trim(),
      isAnonymous: Boolean(isAnonymous),
      submittedAt: new Date().toISOString(),
      status: 'new',
    })

    const resend = new Resend(process.env.RESEND_API_KEY)
    const displayName = isAnonymous ? 'Anonymous' : name.trim()

    await resend.emails.send({
      from: 'RCCG Covenant Assembly <noreply@covenantassembly.org>',
      to: ADMIN_EMAIL,
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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Prayer request error]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
