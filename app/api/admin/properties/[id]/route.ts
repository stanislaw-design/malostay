import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdminUser } from '@/lib/admin/auth'
import type { TablesUpdate } from '@/types/database'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Ctx) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*, property_settings(deposit_percent), pricing_rules(*), ical_feeds(*)')
    .eq('id', id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 404 })
  return Response.json(data)
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json() as Record<string, unknown>
  const { deposit_percent, ...propertyData } = body

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('properties')
    .update(propertyData as TablesUpdate<'properties'>)
    .eq('id', id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })

  await supabase
    .from('property_settings')
    .upsert({ property_id: id, deposit_percent: deposit_percent as number | null ?? null })

  return Response.json(data)
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createServiceClient()

  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return new Response(null, { status: 204 })
}
