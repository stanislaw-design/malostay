import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdminUser } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const status = searchParams.get('status')
  const propertyId = searchParams.get('property_id')

  const supabase = createServiceClient()
  let query = supabase
    .from('reservations')
    .select('*, properties(name_pl, slug)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (propertyId) query = query.eq('property_id', propertyId)

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
