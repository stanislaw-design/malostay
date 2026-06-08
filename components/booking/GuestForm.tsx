'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { t, type Locale } from '@/lib/i18n/t'
import { guestSchema } from '@/lib/booking/guest-schema'

export interface GuestFormValues {
  guestName: string
  guestEmail: string
  guestPhone: string
  guestCount: number
  notes?: string
}

interface Props {
  maxGuests: number
  locale: Locale
  onSubmit: (values: GuestFormValues) => void
  onBack: () => void
  loading: boolean
}

export function GuestForm({ maxGuests, locale, onSubmit, onBack, loading }: Props) {
  const schema = guestSchema.extend({
    guestCount: z.number().int().min(1).max(maxGuests),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guestCount: 2 },
  })

  const inputClass =
    'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600'
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1'
  const errorClass = 'mt-1 text-xs text-red-600'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900">{t(locale, 'guest.formTitle')}</h2>

      <div>
        <label className={labelClass}>{t(locale, 'guest.name')}</label>
        <input
          {...register('guestName')}
          placeholder={t(locale, 'guest.namePlaceholder')}
          className={inputClass}
          autoComplete="name"
        />
        {errors.guestName && <p className={errorClass}>{t(locale, 'guest.nameError')}</p>}
      </div>

      <div>
        <label className={labelClass}>{t(locale, 'guest.email')}</label>
        <input
          {...register('guestEmail')}
          type="email"
          placeholder={t(locale, 'guest.emailPlaceholder')}
          className={inputClass}
          autoComplete="email"
        />
        {errors.guestEmail && <p className={errorClass}>{t(locale, 'guest.emailError')}</p>}
      </div>

      <div>
        <label className={labelClass}>{t(locale, 'guest.phone')}</label>
        <input
          {...register('guestPhone')}
          type="tel"
          placeholder={t(locale, 'guest.phonePlaceholder')}
          className={inputClass}
          autoComplete="tel"
        />
        {errors.guestPhone && <p className={errorClass}>{t(locale, 'guest.phoneError')}</p>}
      </div>

      <div>
        <label className={labelClass}>{t(locale, 'guest.guestCount')}</label>
        <input
          {...register('guestCount', { valueAsNumber: true })}
          type="number"
          min={1}
          max={maxGuests}
          className={inputClass}
        />
        {errors.guestCount && (
          <p className={errorClass}>{t(locale, 'guest.guestCountError', { max: maxGuests })}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t(locale, 'guest.notes')}</label>
        <textarea
          {...register('notes')}
          placeholder={t(locale, 'guest.notesPlaceholder')}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          {t(locale, 'booking.back')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
        >
          {loading ? t(locale, 'payment.processing') : t(locale, 'guest.submitLabel')}
        </button>
      </div>
    </form>
  )
}
