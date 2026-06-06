import pl from '@/messages/pl.json'
import en from '@/messages/en.json'

const messages = { pl, en } as const

export type Locale = keyof typeof messages

type Messages = typeof pl
type Flatten<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Flatten<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`
}[keyof T]

export type MessageKey = Flatten<Messages>

export function t(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  const parts = key.split('.')
  let value: unknown = messages[locale]
  for (const part of parts) {
    if (typeof value === 'object' && value !== null) {
      value = (value as Record<string, unknown>)[part]
    } else {
      value = undefined
      break
    }
  }
  const str = typeof value === 'string' ? value : key
  if (!vars) return str
  return str.replace(/\{(\w+)[^}]*\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`))
}
