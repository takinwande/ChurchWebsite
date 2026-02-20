'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface FormFields {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ContactForm() {
  const [fields, setFields] = useState<FormFields>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!fields.name.trim()) e.name = 'Name is required.'
    if (!fields.email.trim()) {
      e.email = 'Email is required.'
    } else if (!validateEmail(fields.email)) {
      e.email = 'Please enter a valid email address.'
    }
    if (!fields.subject.trim()) e.subject = 'Subject is required.'
    if (!fields.message.trim()) e.message = 'Message is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setFields({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center rounded-xl border border-green-200 bg-green-50 p-8 text-center" role="alert">
        <CheckCircle className="mb-3 h-10 w-10 text-green-600" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-foreground">Message Sent!</h3>
        <p className="mt-1 text-sm text-muted-foreground">Thanks for reaching out. We&apos;ll get back to you soon.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Contact form">
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            autoComplete="name"
          />
          {errors.name && <p id="name-error" className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email && <p id="email-error" className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={fields.subject}
          onChange={handleChange}
          placeholder="How can we help?"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && <p id="subject-error" className="text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          value={fields.message}
          onChange={handleChange}
          placeholder="Write your message here…"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && <p id="message-error" className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
