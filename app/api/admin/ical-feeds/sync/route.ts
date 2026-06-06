import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { requireAdminUser } from '@/lib/admin/auth'

// POST /api/admin/ical-feeds/sync
// Triggers iCal sync immediately — for manual refresh from admin panel and for testing.
// Optional body: { feed_id: string } to sync a single feed; omit to sync all active feeds.
export async function POST(request: NextRequest) {
  // Dev bypass: x-service-key header allows calling without a browser session.
  // Uses the existing service role key — no new secret needed.
  const serviceKey = request.headers.get('x-service-key')
  const isServiceKeyValid = serviceKey && serviceKey === process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!isServiceKeyValid) {
    const user = await requireAdminUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const body = await request.json().catch(() => ({})) as { feed_id?: string }

  const query = supabase
    .from('ical_feeds')
    .select('id, property_id, url, source_name')
    .eq('active', true)

  if (body.feed_id) {
    query.eq('id', body.feed_id)
  }

  const { data: feeds, error: feedsError } = await query
  if (feedsError) return Response.json({ error: feedsError.message }, { status: 500 })

  const results: { feed_id: string; synced: number; deleted: number; error?: string }[] = []

  for (const feed of feeds ?? []) {
    try {
      const response = await fetch(feed.url, { signal: AbortSignal.timeout(15_000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const { parseIcal } = await import('@/lib/ical/parser')
      const content = await response.text()
      const allEvents = parseIcal(content)

      const activeEvents = allEvents.filter(e => !e.cancelled)

      const rows = activeEvents.map((e) => ({
        property_id: feed.property_id,
        feed_id: feed.id,
        start_date: e.start_date,
        end_date: e.end_date,
        source: feed.source_name,
        external_uid: e.external_uid ?? `synthetic-${feed.id}-${e.start_date}-${e.end_date}`,
        synced_at: new Date().toISOString(),
      }))

      if (rows.length > 0) {
        const { error: upsertError } = await supabase
          .from('external_bookings')
          .upsert(rows, { onConflict: 'feed_id,external_uid', ignoreDuplicates: false })

        if (upsertError) throw new Error(upsertError.message)
      }

      const currentUids = rows.map(r => r.external_uid)
      let deleted = 0

      if (currentUids.length > 0) {
        const { count, error: deleteError } = await supabase
          .from('external_bookings')
          .delete({ count: 'exact' })
          .eq('feed_id', feed.id)
          .not('external_uid', 'in', `(${currentUids.join(',')})`)

        if (deleteError) throw new Error(deleteError.message)
        deleted = count ?? 0
      } else {
        const { count, error: deleteError } = await supabase
          .from('external_bookings')
          .delete({ count: 'exact' })
          .eq('feed_id', feed.id)

        if (deleteError) throw new Error(deleteError.message)
        deleted = count ?? 0
      }

      await supabase
        .from('ical_feeds')
        .update({ last_synced_at: new Date().toISOString(), sync_status: 'ok', last_error: null })
        .eq('id', feed.id)

      results.push({ feed_id: feed.id, synced: rows.length, deleted })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      await supabase
        .from('ical_feeds')
        .update({ sync_status: 'error', last_error: message })
        .eq('id', feed.id)

      results.push({ feed_id: feed.id, synced: 0, deleted: 0, error: message })
    }
  }

  return Response.json({ results })
}
