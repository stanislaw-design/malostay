import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdminUser } from '@/lib/admin/auth'
import type { TablesInsert } from '@/types/database'

export async function GET() {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_settings(deposit_percent)')
    .order('name_pl')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const user = await requireAdminUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as Record<string, unknown>
  const { deposit_percent, ...propertyData } = body

  const supabase = createServiceClient()

  const { data: property, error: propError } = await supabase
    .from('properties')
    .insert(propertyData as TablesInsert<'properties'>)
    .select()
    .single()

  if (propError) return Response.json({ error: propError.message }, { status: 400 })

  await supabase
    .from('property_settings')
    .insert({ property_id: property.id, deposit_percent: deposit_percent as number | null ?? null })

  return Response.json(property, { status: 201 })
}
