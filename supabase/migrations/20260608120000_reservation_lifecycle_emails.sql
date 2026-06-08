-- Tracks whether the pre-arrival ("what to bring") and post-stay (review request)
-- emails have already been sent for a reservation, so the daily cron job can
-- safely run repeatedly without sending duplicates.
alter table public.reservations
  add column pre_arrival_email_sent_at timestamptz,
  add column review_email_sent_at      timestamptz;
