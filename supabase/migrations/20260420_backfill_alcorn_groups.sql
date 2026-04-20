-- ============================================================
-- BH-OHI Alcorn OHI group backfill (57 respondents)
-- Engagement: Alcorn State University SON - id e072bae6-396f-4afb-9801-96ba675d6cf4
-- Run AFTER the migration. Idempotent: re-running is a no-op.
-- ============================================================

BEGIN;

UPDATE ohi_respondents SET group_name = 'admin' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'slbarnes@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'admin' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'wcfleming@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'admin' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'mgeorge@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'admin' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'Lnesbitt@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'admin' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'kstampley1@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'qcalhoun@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'bcollins@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'godley@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'ayeshamuhammad@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'dvquinn@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'asamuel@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'isewell@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'lsearcy@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'ataylor@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'tntolliver@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'lcwhitehead@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'faculty' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'vmwilliams@alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'mekiya@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'otravis@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'justicewashington@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'alanaw@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'ewilliams@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'clandrum@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'bpolk@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'marlanad@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'lcoward@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'kelseybrown@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'eshell@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'ainslee@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'tparnell@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'demetricej@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'jcombs@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'qwuaeisha@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'chartesia@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'krystalj@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'mdbennett@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'qhardin@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'sheniya@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'kyram@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'fbuchanan-cooper@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'shigganbothan@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'rhanderson@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'mrsanders@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'gsthompson@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'akbanks@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'tinray@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'jamieya@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'ehandi@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'sydnib@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'jemecia@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'tavery@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'kymrie@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'makaylaw@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'jlallen@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'kguedon@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'jadal@students.alcorn.edu';
UPDATE ohi_respondents SET group_name = 'student' WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' AND email = 'breawna@students.alcorn.edu';

-- Sanity-check counts (run after commit):
-- SELECT group_name, COUNT(*) FROM ohi_respondents
--   WHERE engagement_id = 'e072bae6-396f-4afb-9801-96ba675d6cf4' GROUP BY group_name;
-- Expected: admin=5, faculty=12, student=40, NULL=0

COMMIT;

