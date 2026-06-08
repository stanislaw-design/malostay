import { z } from 'zod'

// Letters (incl. Polish diacritics), spaces, apostrophes, hyphens and dots only —
// blocks HTML/script-like input (<, >, &, /, etc.) at the source.
const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u

// Polish landline/mobile format: optional +48 prefix, 9 digits, optionally
// grouped in 3s with spaces or hyphens (e.g. "+48 123 456 789", "123-456-789").
const PHONE_PATTERN = /^(?:\+48[\s-]?)?(?:\d{3}[\s-]?){2}\d{3}$/

export const guestSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(NAME_PATTERN),
  guestEmail: z.string().trim().toLowerCase().max(254).email(),
  guestPhone: z
    .string()
    .trim()
    .max(30)
    .regex(PHONE_PATTERN),
  notes: z.string().trim().max(1000).optional(),
})
