import { LoginForm } from '@/components/admin/LoginForm'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900 mb-6">Panel admina</h1>
        <LoginForm />
      </div>
    </div>
  )
}
