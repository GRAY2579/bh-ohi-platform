-- ╔══════════════════════════════════════════════════════════════╗
-- ║  BH-OHI Email System — Supabase Tables                     ║
-- ║  Run this in the Supabase SQL Editor                        ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Project emails (drafts, scheduled, sent)
CREATE TABLE IF NOT EXISTS ohi_project_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  engagement_id UUID REFERENCES ohi_engagements(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient_filter TEXT DEFAULT 'all',       -- all | pending | in_progress
  status TEXT DEFAULT 'draft',               -- draft | scheduled | sent
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Per-recipient tracking for project emails
CREATE TABLE IF NOT EXISTS ohi_project_email_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_email_id UUID REFERENCES ohi_project_emails(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES ohi_respondents(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT,
  survey_url TEXT,
  status TEXT DEFAULT 'queued',              -- queued | sent | failed
  sent_at TIMESTAMPTZ,
  error TEXT
);

-- SendGrid event tracking (delivery, bounce, open, click)
CREATE TABLE IF NOT EXISTS ohi_email_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  engagement_id UUID,
  email TEXT,
  event TEXT NOT NULL,                       -- delivered | bounce | dropped | open | click | deferred
  sg_message_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Add email tracking columns to ohi_respondents if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ohi_respondents' AND column_name = 'email_sent_at') THEN
    ALTER TABLE ohi_respondents ADD COLUMN email_sent_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ohi_respondents' AND column_name = 'reminder_sent_at') THEN
    ALTER TABLE ohi_respondents ADD COLUMN reminder_sent_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ohi_respondents' AND column_name = 'reminder_count') THEN
    ALTER TABLE ohi_respondents ADD COLUMN reminder_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE ohi_project_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE ohi_project_email_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ohi_email_events ENABLE ROW LEVEL SECURITY;

-- Policies (permissive for anon — matches existing OHI table pattern)
CREATE POLICY "ohi_project_emails_all" ON ohi_project_emails FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "ohi_project_email_recipients_all" ON ohi_project_email_recipients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "ohi_email_events_all" ON ohi_email_events FOR ALL USING (true) WITH CHECK (true);
