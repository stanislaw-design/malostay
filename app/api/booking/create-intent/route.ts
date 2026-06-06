import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { createStripe } from '@/lib/stripe/server'
import { calculatePrice } from '@/lib/pricing'
import type { Tables } from '@/types/database'

const bodySchema = z.object({
  propertyId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guestName: z.string().min(2).max(200),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(9).max(30),
  guestCount: z.number().int().min(1).max(50),
  notes: z.string().max(1000).optional(),
  locale: z.enum(['pl', 'en']),
})

function err(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) return err('Invalid request body', 400)

  const { propertyId, checkIn, checkOut, guestName, guestEmail, guestPhone, guestCount, notes, locale } =
    parsed.data

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  if (checkOutDate <= checkInDate) return err('Check-out must be after check-in', 400)

  const service = createServiceClient()

  const { data: property } = await service
    .from('properties')
    .select('id, slug, min_nights, max_guests, active')
    .eq('id', propertyId)
    .single()

  if (!property || !property.active) return err('Property not found', 404)
  if (guestCount > property.max_guests) return err('Too many guests', 400)

  const { data: pricingRules } = await service
    .from('pricing_rules')
    .select('*')
    .eq('property_id', propertyId)
    .eq('active', true)

  const { data: settings } = await service
    .from('property_settings')
    .select('deposit_percent')
    .eq('property_id', propertyId)
    .single()

  if (!process.env.STRIPE_SECRET_KEY) return err('Payment not configured', 503)

  const rules = (pricingRules ?? []) as Tables<'pricing_rules'>[]
  const { nights, totalPrice, depositAmount } = calculatePrice(
    checkInDate,
    checkOutDate,
    rules,
    settings?.deposit_percent ?? null
  )

  if (nights < property.min_nights) return err(`Minimum stay is ${property.min_nights} nights`, 400)
  if (totalPrice <= 0) return err('Could not calculate price', 400)

  // Pessimistic lock: check availability with service role (bypasses RLS)
  const { data: conflicts } = await service
    .from('reservations')
    .select('id')
    .eq('property_id', propertyId)
    .in('status', ['pending', 'confirmed'])
    .lt('check_in', checkOut)
    .gt('check_out', checkIn)

  const { data: externalConflicts } = await service
    .from('external_bookings')
    .select('id')
    .eq('property_id', propertyId)
    .lt('start_date', checkOut)
    .gt('end_date', checkIn)

  if ((conflicts?.length ?? 0) > 0 || (externalConflicts?.length ?? 0) > 0) {
    return err('dates_unavailable', 409)
  }

  const amountToPay = depositAmount ?? totalPrice
  const stripe = createStripe()

  // Insert reservation first, then create PaymentIntent
  const { data: reservation, error: reservationError } = await service
    .from('reservations')
    .insert({
      property_id: propertyId,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      guest_count: guestCount,
      notes: notes ?? null,
      check_in: checkIn,
      check_out: checkOut,
      total_nights: nights,
      total_price: totalPrice,
      deposit_amount: depositAmount,
      status: 'pending',
      language: locale,
    })
    .select('id')
    .single()

  if (reservationError || !reservation) return err('Failed to create reservation', 500)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountToPay * 100),
    currency: 'pln',
    automatic_payment_methods: { enabled: true },
    metadata: {
      reservation_id: reservation.id,
      property_id: propertyId,
      check_in: checkIn,
      check_out: checkOut,
    },
  })

  await service
    .from('reservations')
    .update({ stripe_payment_intent_id: paymentIntent.id })
    .eq('id', reservation.id)

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    reservationId: reservation.id,
    amountToPay,
    isDeposit: depositAmount != null,
    depositPercent: settings?.deposit_percent ?? null,
  })
}
