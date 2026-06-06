-- ============================================================
-- iCal hardening: per-feed tracking + error logging
-- ============================================================

-- 1. Track which feed produced each external booking
ALTER TABLE public.external_bookings
  ADD COLUMN feed_id uuid REFERENCES public.ical_feeds(id) ON DELETE CASCADE;

-- 2. Existing data has no feed_id — truncate (local dev, no real data)
TRUNCATE TABLE public.external_bookings;

-- 3. Enforce NOT NULL now that table is empty
ALTER TABLE public.external_bookings
  ALTER COLUMN feed_id SET NOT NULL;

-- 4. Drop old constraint (property_id + external_uid — breaks on NULL uid and cross-feed)
ALTER TABLE public.external_bookings
  DROP CONSTRAINT no_duplicate_uid;

-- 5. New constraint: uid is unique within a single feed
ALTER TABLE public.external_bookings
  ADD CONSTRAINT no_duplicate_uid_per_feed UNIQUE (feed_id, external_uid);

-- 6. Index for stale-deletion query (WHERE feed_id = X AND uid NOT IN ...)
CREATE INDEX ON public.external_bookings (feed_id);

-- 7. Error tracking on feeds
ALTER TABLE public.ical_feeds
  ADD COLUMN sync_status text NOT NULL DEFAULT 'pending'
    CHECK (sync_status IN ('ok', 'error', 'pending')),
  ADD COLUMN last_error text;
