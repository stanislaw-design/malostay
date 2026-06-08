import { createClient } from 'jsr:@supabase/supabase-js@2'

const PENDING_TTL_MINUTES = 15

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const cutoff = new Date(Date.now() - PENDING_TTL_MINUTES * 60_000).toISOString()

  const { data: deleted, error } = await supabase
    .from('reservations')
    .delete()
    .eq('status', 'pending')
    .lt('created_at', cutoff)
    .select('id')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ deleted: deleted?.length ?? 0 }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
