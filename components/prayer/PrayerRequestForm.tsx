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
  request: string
  isAnonymous: boolean
}

interface FormErrors {
  name?: string
  email?: string
  request?: string
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function PrayerRequestForm() {
  const [fields, setFields] = useState<FormFields>({
    name: '',
    email: '',
    request: '',
    isAnonymous: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!fields.name.trim()) e.name = 'Name is required.'
    if (fields.email.trim() && !validateEmail(fields.email)) {
      e.email = 'Please enter a valid email address.'
    }
    if (!fields.request.trim()) e.request = 'Please share your prayer request.'
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

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, isAnonymous: e.target.checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setFields({ name: '', email: '', request: '', isAnonymous: false })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="flex flex-col items-center rounded-xl border border-green-200 bg-green-50 p-8 text-center"
        role="alert"
      >
        <CheckCircle className="mb-3 h-10 w-10 text-green-600" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-foreground">Prayer Request Received</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We will be praying for you. Thank you for trusting us with your request.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setStatus('idle')}>
          Submit another request
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Prayer request form">
      {status === 'error' && (
        <div
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Something went wrong. Please try again.
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
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="For pastoral follow-up"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="request">Prayer Request</Label>
        <Textarea
          id="request"
          name="request"
          value={fields.request}
          onChange={handleChange}
          placeholder="Share what's on your heart…"
          rows={6}
          aria-invalid={!!errors.request}
          aria-describedby={errors.request ? 'request-error' : undefined}
        />
        {errors.request && (
          <p id="request-error" className="text-xs text-destructive">
            {errors.request}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isAnonymous"
          name="isAnonymous"
          type="checkbox"
          checked={fields.isAnonymous}
          onChange={handleCheckbox}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        <Label htmlFor="isAnonymous" className="cursor-pointer font-normal text-sm text-muted-foreground">
          Keep my name anonymous
        </Label>
      </div>

      <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {status === 'loading' ? 'Submitting…' : 'Submit Prayer Request'}
      </Button>
    </form>
  )
}
