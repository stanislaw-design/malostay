import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { createStripe } from '@/lib/stripe/server'
import { sendBookingEmails } from '@/lib/email/send-booking-emails'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) return Response.json({ error: 'No signature' }, { status: 400 })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return Response.json({ error: 'Webhook secret not configured' }, { status: 500 })

  let event: Stripe.Event
  try {
    event = createStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent
  const reservationId = paymentIntent.metadata?.reservation_id

  if (!reservationId) return Response.json({ received: true })

  const service = createServiceClient()

  if (event.type === 'payment_intent.canceled' || event.type === 'payment_intent.payment_failed') {
    await service
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
      .eq('status', 'pending')

    return Response.json({ received: true })
  }

  if (event.type !== 'payment_intent.succeeded') {
    return Response.json({ received: true })
  }

  const { data: reservation } = await service
    .from('reservations')
    .select('id, status')
    .eq('id', reservationId)
    .single()

  if (!reservation || reservation.status === 'confirmed') {
    return Response.json({ received: true })
  }

  const pi = await createStripe().paymentIntents.retrieve(paymentIntent.id)
  if (pi.status !== 'succeeded') return Response.json({ received: true })

  await service
    .from('reservations')
    .update({ status: 'confirmed' })
    .eq('id', reservationId)

  // Fire-and-forget — webhook must return quickly; email failure doesn't block confirmation
  sendBookingEmails(reservationId).catch((err) =>
    console.error('[email] Failed to send booking emails:', err)
  )

  return Response.json({ received: true })
}
