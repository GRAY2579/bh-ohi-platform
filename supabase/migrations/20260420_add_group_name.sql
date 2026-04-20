-- ============================================================
-- BH-OHI™ — Add group_name to ohi_respondents
-- ============================================================
-- Adds a simple admin/faculty/student tag to each respondent so
-- we can filter the respondent table, send emails by group, and
-- roll up response rate per group.
--
-- Safe to run on a live engagement:
--   - Column is NULLABLE — existing rows become NULL (treated as "ungrouped")
--   - CHECK constraint only fires on INSERT/UPDATE of group_name
--   - No existing columns, tables, or policies are touched
--   - Completely reversible (see ROLLBACK at bottom)
-- ============================================================

-- 1. Column + CHECK constraint
ALTER TABLE ohi_respondents
  ADD COLUMN IF NOT EXISTS group_name TEXT
  CHECK (group_name IS NULL OR group_name IN ('admin', 'faculty', 'student'));

-- 2. Index so filtering the respondent table stays fast
CREATE INDEX IF NOT EXISTS idx_ohi_respondents_group
  ON ohi_respondents(engagement_id, group_name);

-- 3. View: completion rollup per engagement × group
CREATE OR REPLACE VIEW ohi_completion_by_group AS
SELECT
  e.id            AS engagement_id,
  e.name          AS engagement_name,
  e.client_name,
  COALESCE(r.group_name, 'ungrouped') AS group_name,
  COUNT(r.id)                                                  AS total,
  COUNT(r.id) FILTER (WHERE r.status = 'completed')            AS completed,
  COUNT(r.id) FILTER (WHERE r.status = 'in_progress')          AS in_progress,
  COUNT(r.id) FILTER (WHERE r.status = 'pending')              AS pending,
  ROUND(
    (COUNT(r.id) FILTER (WHERE r.status = 'completed'))::NUMERIC
    / NULLIF(COUNT(r.id), 0) * 100, 1
  ) AS completion_pct
FROM ohi_engagements e
LEFT JOIN ohi_respondents r ON r.engagement_id = e.id
GROUP BY e.id, e.name, e.client_name, COALESCE(r.group_name, 'ungrouped');

-- ============================================================
-- ROLLBACK (only if needed — keep commented out by default)
-- ============================================================
-- DROP VIEW IF EXISTS ohi_completion_by_group;
-- DROP INDEX IF EXISTS idx_ohi_respondents_group;
-- ALTER TABLE ohi_respondents DROP COLUMN IF EXISTS group_name;

