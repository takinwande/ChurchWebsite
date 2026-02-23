import { NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactBody {
  name: string
  email: string
  subject: string
  message: string
}

const ADMIN_EMAIL = 'admin@covenantassembly.org'

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

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'RCCG Covenant Assembly <noreply@covenantassembly.org>',
      to: ADMIN_EMAIL,
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
