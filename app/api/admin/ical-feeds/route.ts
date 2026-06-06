import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdminUser } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const propertyId = request.nextUrl.searchParams.get('property_id')
  if (!propertyId) return Response.json({ error: 'property_id required' }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('ical_feeds')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('ical_feeds')
    .insert({ ...body, active: true })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data, { status: 201 })
}
