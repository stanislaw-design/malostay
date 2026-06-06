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
    .from('external_bookings')
    .select('*')
    .eq('property_id', propertyId)
    .eq('source', 'manual')
    .order('start_date')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { property_id: string; start_date: string; end_date: string; note?: string }
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('external_bookings')
    .insert({
      property_id: body.property_id,
      start_date: body.start_date,
      end_date: body.end_date,
      source: 'manual',
      external_uid: body.note ?? null,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('external_bookings')
    .delete()
    .eq('id', id)
    .eq('source', 'manual')

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return new Response(null, { status: 204 })
}
