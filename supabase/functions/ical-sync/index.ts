import { createClient } from 'jsr:@supabase/supabase-js@2'
import { parseIcal } from '../_shared/ical-parser.ts'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: feeds, error: feedsError } = await supabase
    .from('ical_feeds')
    .select('id, property_id, url, source_name')
    .eq('active', true)

  if (feedsError) {
    return new Response(JSON.stringify({ error: feedsError.message }), { status: 500 })
  }

  const results: { feed_id: string; synced: number; deleted: number; error?: string }[] = []

  for (const feed of feeds ?? []) {
    try {
      const response = await fetch(feed.url, { signal: AbortSignal.timeout(15_000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const content = await response.text()
      const allEvents = parseIcal(content)

      // Separate active from cancelled — cancelled ones should be removed from our DB
      const activeEvents = allEvents.filter(e => !e.cancelled)

      // Build rows for upsert; generate a synthetic UID when the feed omits one
      // (PostgreSQL UNIQUE treats NULL != NULL, causing duplicate inserts on each sync)
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

      // Delete bookings that have been removed from the feed (cancelled or simply gone).
      // We compare the set of UIDs we just synced against everything stored for this feed.
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
        // Feed returned no active events — remove everything we had stored for it
        const { count, error: deleteError } = await supabase
          .from('external_bookings')
          .delete({ count: 'exact' })
          .eq('feed_id', feed.id)

        if (deleteError) throw new Error(deleteError.message)
        deleted = count ?? 0
      }

      await supabase
        .from('ical_feeds')
        .update({
          last_synced_at: new Date().toISOString(),
          sync_status: 'ok',
          last_error: null,
        })
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

  return new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
