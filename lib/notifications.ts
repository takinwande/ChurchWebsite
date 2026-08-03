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

/** Recipient for form notifications, configurable in Sanity Site Settings. */
export async function getNotificationEmail(): Promise<string> {
  try {
    const settings = await getReadClient().fetch<{ notificationEmail?: string }>(
      `*[_type == "siteSettings"][0]{ notificationEmail }`
    )
    return settings?.notificationEmail?.trim() || FALLBACK_EMAIL
  } catch {
    return FALLBACK_EMAIL
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
  to: string
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
