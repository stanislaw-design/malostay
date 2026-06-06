-- Allow feed_id to be NULL for manually blocked dates (source = 'manual').
-- iCal-synced rows still require a feed_id — enforced by the check constraint below.

ALTER TABLE public.external_bookings
  ALTER COLUMN feed_id DROP NOT NULL;

ALTER TABLE public.external_bookings
  ADD CONSTRAINT feed_id_required_for_synced
    CHECK (feed_id IS NOT NULL OR source = 'manual');
