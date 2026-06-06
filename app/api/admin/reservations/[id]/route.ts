import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdminUser } from '@/lib/admin/auth'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Ctx) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('reservations')
    .select('*, properties(name_pl, name_en, slug)')
    .eq('id', id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 404 })
  return Response.json(data)
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json() as { status: string }

  const ALLOWED_STATUSES = ['confirmed', 'cancelled', 'pending']
  if (!ALLOWED_STATUSES.includes(body.status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('reservations')
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}
