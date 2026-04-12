-- ============================================================
-- BH-OHI™ Organizational Health Index — Supabase Schema
-- ============================================================
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Creates all tables, indexes, RLS policies, views, and functions.
-- ============================================================

-- 0. HELPER: auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. ENGAGEMENTS
-- One row per client OHI engagement
CREATE TABLE ohi_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                              -- "Alcorn State SON — Spring 2026"
  client_name TEXT NOT NULL,                       -- "Alcorn State University"
  org_unit TEXT,                                   -- "School of Nursing"
  industry_code TEXT DEFAULT 'education',           -- NAICS-based tag
  size_band TEXT DEFAULT '30-75',                   -- employee count band
  survey_open DATE NOT NULL,
  survey_close DATE NOT NULL,
  access_code TEXT,                                 -- client dashboard access code
  client_dashboard_url TEXT,                        -- URL to client-facing dashboard
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  contact_name TEXT,
  contact_title TEXT,
  contact_email TEXT,
  terminology_variant TEXT DEFAULT 'academic',       -- academic | healthcare | business | general
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER ohi_engagements_updated_at
  BEFORE UPDATE ON ohi_engagements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. RESPONDENTS
-- One row per person taking the OHI survey
CREATE TABLE ohi_respondents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES ohi_engagements(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,                       -- unique survey URL token
  email TEXT,                                       -- optional; for invitation tracking only
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_seconds INT,
  validity_flags JSONB DEFAULT '[]'::jsonb,         -- ["straight_line", "speed_through", etc.]
  draft_answers JSONB,                              -- auto-save in progress
  invited_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ohi_respondents_engagement ON ohi_respondents(engagement_id);
CREATE INDEX idx_ohi_respondents_token ON ohi_respondents(token);
CREATE INDEX idx_ohi_respondents_status ON ohi_respondents(status);

-- 3. RESPONSES
-- One row per question per respondent (EAV model for flexibility)
CREATE TABLE ohi_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  respondent_id UUID NOT NULL REFERENCES ohi_respondents(id) ON DELETE CASCADE,
  engagement_id UUID NOT NULL REFERENCES ohi_engagements(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,                       -- "T1", "T2", ..., "S_T", "O1", etc.
  value_int INT CHECK (value_int BETWEEN 1 AND 5), -- Likert responses
  value_text TEXT,                                  -- Open-ended responses
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ohi_responses_respondent ON ohi_responses(respondent_id);
CREATE INDEX idx_ohi_responses_engagement ON ohi_responses(engagement_id);
CREATE INDEX idx_ohi_responses_question ON ohi_responses(question_key);
CREATE UNIQUE INDEX idx_ohi_responses_unique ON ohi_responses(respondent_id, question_key);

-- 4. DEMOGRAPHICS
-- One row per demographic answer per respondent
CREATE TABLE ohi_demographics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  respondent_id UUID NOT NULL REFERENCES ohi_respondents(id) ON DELETE CASCADE,
  engagement_id UUID NOT NULL REFERENCES ohi_engagements(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,                          -- "role", "department", "years", etc.
  field_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ohi_demographics_respondent ON ohi_demographics(respondent_id);
CREATE INDEX idx_ohi_demographics_engagement ON ohi_demographics(engagement_id);
CREATE UNIQUE INDEX idx_ohi_demographics_unique ON ohi_demographics(respondent_id, field_key);

-- 5. CONFLICT HOTSPOTS (computed after survey closes)
CREATE TABLE ohi_conflict_hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES ohi_engagements(id) ON DELETE CASCADE,
  intersection_key TEXT NOT NULL,                   -- "authority_paralysis", "relational_erosion", etc.
  severity_zone TEXT NOT NULL
    CHECK (severity_zone IN ('red_zone', 'watch_zone', 'pressure_point', 'clear')),
  pillar_a TEXT NOT NULL,
  pillar_b TEXT NOT NULL,
  pillar_a_score NUMERIC(4,2),
  pillar_b_score NUMERIC(4,2),
  computed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ohi_hotspots_engagement ON ohi_conflict_hotspots(engagement_id);

-- 6. BENCHMARKS (Phase 2 — schema from Day 1)
CREATE TABLE ohi_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_key TEXT NOT NULL,
  pillar TEXT,
  industry TEXT,
  size_band TEXT,
  mean NUMERIC(4,2),
  std_dev NUMERIC(4,2),
  n INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ohi_benchmarks_question ON ohi_benchmarks(question_key);
CREATE INDEX idx_ohi_benchmarks_industry ON ohi_benchmarks(industry);

-- 7. ROW LEVEL SECURITY
ALTER TABLE ohi_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ohi_respondents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ohi_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ohi_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ohi_conflict_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ohi_benchmarks ENABLE ROW LEVEL SECURITY;

-- For MVP: anon key access (admin URL is security layer, same as bh360)
CREATE POLICY "Allow all for anon" ON ohi_engagements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ohi_respondents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ohi_responses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ohi_demographics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ohi_conflict_hotspots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ohi_benchmarks FOR ALL USING (true) WITH CHECK (true);

-- 8. HELPER VIEW: Completion summary
CREATE OR REPLACE VIEW ohi_completion_summary AS
SELECT
  e.id AS engagement_id,
  e.name AS engagement_name,
  e.client_name,
  COUNT(r.id) AS total_respondents,
  COUNT(r.id) FILTER (WHERE r.status = 'completed') AS completed,
  COUNT(r.id) FILTER (WHERE r.status = 'in_progress') AS in_progress,
  COUNT(r.id) FILTER (WHERE r.status = 'pending') AS pending,
  ROUND(
    (COUNT(r.id) FILTER (WHERE r.status = 'completed'))::NUMERIC / NULLIF(COUNT(r.id), 0) * 100, 1
  ) AS completion_pct
FROM ohi_engagements e
LEFT JOIN ohi_respondents r ON r.engagement_id = e.id
GROUP BY e.id, e.name, e.client_name;

-- 9. HELPER VIEW: Pillar scores per engagement
CREATE OR REPLACE VIEW ohi_pillar_scores AS
SELECT
  r.engagement_id,
  CASE
    WHEN resp.question_key LIKE 'T%' AND resp.question_key NOT LIKE 'T_S' THEN 'Trust'
    WHEN resp.question_key LIKE 'S%' AND resp.question_key NOT LIKE 'S_S' AND resp.question_key NOT LIKE 'ST%' THEN 'Structure'
    WHEN resp.question_key LIKE 'P%' AND resp.question_key NOT LIKE 'P_S' THEN 'People'
    WHEN resp.question_key LIKE 'V%' AND resp.question_key NOT LIKE 'V_S' THEN 'Vision'
    WHEN resp.question_key LIKE 'C%' AND resp.question_key NOT LIKE 'C_S' THEN 'Communication'
    ELSE NULL
  END AS pillar,
  ROUND(AVG(resp.value_int)::NUMERIC, 2) AS avg_score,
  COUNT(DISTINCT r.id) AS respondent_count
FROM ohi_respondents r
JOIN ohi_responses resp ON resp.respondent_id = r.id
WHERE r.status = 'completed'
  AND resp.value_int IS NOT NULL
  AND resp.question_key NOT LIKE '%_S'    -- exclude sentinels
  AND resp.question_key != 'ANCHOR'       -- exclude anchor
GROUP BY r.engagement_id,
  CASE
    WHEN resp.question_key LIKE 'T%' AND resp.question_key NOT LIKE 'T_S' THEN 'Trust'
    WHEN resp.question_key LIKE 'S%' AND resp.question_key NOT LIKE 'S_S' AND resp.question_key NOT LIKE 'ST%' THEN 'Structure'
    WHEN resp.question_key LIKE 'P%' AND resp.question_key NOT LIKE 'P_S' THEN 'People'
    WHEN resp.question_key LIKE 'V%' AND resp.question_key NOT LIKE 'V_S' THEN 'Vision'
    WHEN resp.question_key LIKE 'C%' AND resp.question_key NOT LIKE 'C_S' THEN 'Communication'
    ELSE NULL
  END
HAVING CASE
    WHEN resp.question_key LIKE 'T%' AND resp.question_key NOT LIKE 'T_S' THEN 'Trust'
    WHEN resp.question_key LIKE 'S%' AND resp.question_key NOT LIKE 'S_S' AND resp.question_key NOT LIKE 'ST%' THEN 'Structure'
    WHEN resp.question_key LIKE 'P%' AND resp.question_key NOT LIKE 'P_S' THEN 'People'
    WHEN resp.question_key LIKE 'V%' AND resp.question_key NOT LIKE 'V_S' THEN 'Vision'
    WHEN resp.question_key LIKE 'C%' AND resp.question_key NOT LIKE 'C_S' THEN 'Communication'
    ELSE NULL
  END IS NOT NULL;
