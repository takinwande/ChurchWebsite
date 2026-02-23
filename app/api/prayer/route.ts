import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Prayer request error]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
