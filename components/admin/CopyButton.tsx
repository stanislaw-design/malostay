'use client'

import { useState } from 'react'

interface Props {
  value: string
  label?: string
}

export function CopyButton({ value, label = 'Kopiuj' }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
    >
      {copied ? 'Skopiowano ✓' : label}
    </button>
  )
}
