import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/admin/Sidebar'

export const metadata = { title: 'Panel admina' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Middleware handles redirect to /admin/login when no user.
  // Layout must not redirect here — /admin/login is also under this layout,
  // and redirecting would cause an infinite loop.
  if (!user) return <>{children}</>

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
    </div>
  )
}
