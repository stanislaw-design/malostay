import Link from 'next/link'
import { PropertyForm } from '@/components/admin/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/domki" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Domki
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-neutral-900">Nowy domek</h1>
      <PropertyForm />
    </div>
  )
}
