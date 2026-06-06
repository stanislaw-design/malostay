import { Resend } from 'resend'

let client: Resend | null = null

export function getResend(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not set')
    client = new Resend(key)
  }
  return client
}

export const FROM = process.env.RESEND_FROM ?? 'noreply@example.com'
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''
