import { createClient, type SanityClient } from '@sanity/client'
import { Resend } from 'resend'

const FALLBACK_EMAIL = 'admin@covenantassembly.org'

/**
 * Resend only delivers from a verified domain. Until one is configured, this
 * falls back to Resend's shared test sender, which can *only* deliver to the
 * Resend account owner's own address — every other recipient is rejected.
 * Set RESEND_FROM_EMAIL once a domain is verified.
 */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Read-only client for pulling settings inside API routes (never cached). */
export function getReadClient(): SanityClient {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion,
    useCdn: false,
  })
}

/** Authenticated client for persisting form submissions. */
export function getWriteClient(): SanityClient {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.SANITY_API_WRITE_TOKEN,
    apiVersion,
    useCdn: false,
  })
}

/**
 * Recipients for form notifications, configurable in Sanity Site Settings.
 *
 * The field stays a plain single-line string in Studio rather than switching
 * to an array field — editors just comma-separate multiple addresses in the
 * same text box they already know, instead of learning an "add item" control
 * for something that used to be one value. This is where that string gets
 * split, trimmed, and filtered down to addresses that are actually usable.
 *
 * Always returns at least one address: a malformed or blank field falls back
 * to FALLBACK_EMAIL rather than sending nowhere.
 */
export async function getNotificationEmail(): Promise<string[]> {
  try {
    const settings = await getReadClient().fetch<{ notificationEmail?: string }>(
      `*[_type == "siteSettings"][0]{ notificationEmail }`
    )
    const raw = settings?.notificationEmail?.trim()
    if (!raw) return [FALLBACK_EMAIL]

    const candidates = raw.split(',').map((a) => a.trim()).filter(Boolean)
    const valid = candidates.filter((a) => EMAIL_RE.test(a))
    const invalid = candidates.filter((a) => !EMAIL_RE.test(a))

    if (invalid.length > 0) {
      // A single admin typo shouldn't silently swallow every other recipient
      // or crash the send — drop it and say so, so it gets noticed and fixed.
      console.warn(
        `[notifications] Ignoring malformed entries in Notification Email: ${invalid.join(', ')}`
      )
    }

    return valid.length > 0 ? valid : [FALLBACK_EMAIL]
  } catch {
    return [FALLBACK_EMAIL]
  }
}

export interface SendResult {
  sent: boolean
  error?: string
}

/**
 * Sends a notification email.
 *
 * The Resend SDK resolves with `{ data, error }` rather than throwing on API
 * failures, so the error field must be inspected explicitly — otherwise a
 * rejected send is indistinguishable from a delivered one.
 */
export async function sendNotificationEmail(options: {
  to: string | string[]
  subject: string
  text: string
  replyTo?: string
}): Promise<SendResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
    })

    if (error) {
      return { sent: false, error: error.message ?? String(error) }
    }
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) }
  }
}
