# BH-OHI™ Platform — Deployment Checklist (Tuesday Launch)

## Pre-Launch (Monday)

### 1. Infrastructure Setup
- [ ] Supabase project created (or confirmed active)
- [ ] Database schema deployed via SQL Editor
  - Run `/supabase/schema.sql` in Supabase dashboard
  - Verify all tables created: engagements, respondents, responses, demographics
  - Verify RLS policies enabled with anon access
- [ ] Environment variables set:
  - `VITE_SUPABASE_URL` (from Settings > API)
  - `VITE_SUPABASE_ANON_KEY` (public anon key, NOT service role)

### 2. Build & Deploy
- [ ] Build locally: `npm install && npm run build`
- [ ] Test build output in `/dist` directory
- [ ] Deploy to production hosting:
  - Vercel, Netlify, or your preferred platform
  - Configure environment variables in hosting dashboard
  - Ensure `npm run build` and `npm run preview` work
- [ ] Test survey URL: `https://your-domain.com/survey/test-token`

### 3. Assets & Branding
- [ ] Blue Hen horse logo added: `/public/bh-horse-white.png` (40x40px recommended)
  - If not available, update header to use placeholder emoji (currently 🐴)
- [ ] Verify Inter font loads from Google Fonts (in index.html)
- [ ] Test on mobile (iPhone 12, Samsung Galaxy) at 320px width

### 4. Test Survey Flow (QA)
Create a test respondent with manual token (e.g., `test-token-001`):

```sql
-- Supabase SQL Editor
INSERT INTO engagements (name, client_name, org_unit, survey_open, survey_close)
VALUES (
  'Test Engagement',
  'Alcorn State University',
  'School of Nursing',
  '2026-04-12'::date,
  '2026-04-30'::date
) RETURNING id;

-- Copy the engagement_id from above
INSERT INTO respondents (engagement_id, token, status)
VALUES ('{engagement_id}', 'test-token-001', 'pending');
```

Then test:
- [ ] Navigate to `/survey/test-token-001`
- [ ] Welcome section displays
- [ ] "Begin Assessment" button advances to Demographics
- [ ] Fill in demographics (all 4 fields required for next)
- [ ] Advance through all 5 pillar sections
  - Each section shows pillar icon, name, definition
  - Likert buttons render with correct colors
  - Buttons change color on selection
- [ ] Sentinels section shows 6 questions (5 sentinels + 1 anchor)
- [ ] Open-ended section shows 5 textareas
- [ ] Review section shows completion checklist
  - All items should be green (completed)
- [ ] Click "Submit Survey"
- [ ] Redirects to `/survey/complete` confirmation page
- [ ] Database check: respondent status = 'completed', responses table populated

### 5. Edge Case Testing
- [ ] Invalid token (`/survey/invalid-token`): Shows error message
- [ ] Expired token (mark respondent status='completed' first): Shows "already completed" message
- [ ] Page reload mid-survey: Restores draft answers
- [ ] Back button works on all sections except welcome
- [ ] Progress bar advances smoothly
- [ ] Network error during save: Gracefully logs to console (doesn't block UX)

### 6. Performance & Security
- [ ] Lighthouse audit: Aim for 90+ on performance
- [ ] Check console for errors: Should be clean
- [ ] Verify Supabase RLS policies allow token-based access only
- [ ] Test with network throttling (3G): Should load in < 5 seconds
- [ ] Security check: No sensitive data in URL (only token)

## Launch Day (Tuesday)

### 7. Production Verification
- [ ] Supabase production environment confirmed
- [ ] DNS/domain pointing to live app
- [ ] SSL certificate valid (HTTPS only)
- [ ] Health check: `GET https://your-domain.com/` returns HTML
- [ ] Verify environment variables are set in production

### 8. Respondent Distribution
- [ ] Survey tokens generated for all faculty/staff
  - Generate via admin dashboard or bulk insert
  - Format: `https://ohi.bluehenhealth.com/survey/{token}`
- [ ] Emails sent to participants with survey links
- [ ] SMS reminders configured (optional)
- [ ] Slack/Teams notification with survey link (optional)

### 9. Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, or similar)
- [ ] Monitor Supabase dashboard for:
  - Real-time API calls
  - Database size growth
  - Auth/RLS policy violations
- [ ] Watch for unusual patterns:
  - Straight-line responses (all 5s)
  - Suspiciously fast completion times
  - High error rates

### 10. Support & Communication
- [ ] IT help desk briefed on survey URL format
- [ ] Clear instructions provided to participants:
  - "Do NOT share your survey link; it's unique to you"
  - "Estimated time: 15–20 minutes"
  - "All responses confidential and anonymous in aggregate"
- [ ] Point of contact for technical issues identified

## Post-Launch Monitoring

### Week 1
- [ ] Daily check-in on response volume
- [ ] Monitor for technical errors in logs
- [ ] Watch Supabase for performance degradation
- [ ] Test on various devices/browsers as people respond
- [ ] Review data quality (watch for straight-liners, speed-throughs)

### Ongoing
- [ ] Keep environment variables fresh (rotate keys if needed)
- [ ] Monitor database size; plan for archival after survey closes
- [ ] Track completion rate vs. invites sent
- [ ] Plan report generation workflow (post-survey close)

## Rollback Plan (If Critical Issues)

### If survey is down or broken:
1. Switch DNS to cached version or temporary holding page
2. Notify IT and participants via email/Slack
3. Fix the issue in development
4. Re-deploy to production
5. Verify with test token
6. Send "Survey is back up" notification

### If data is corrupted:
1. Restore from Supabase backup (automatic daily backups)
2. Check backup timestamp in Supabase dashboard (Settings > Backups)
3. Contact Supabase support if manual restore needed

## Success Criteria

- [ ] 100% of tokens distributed without errors
- [ ] >= 90% completion rate by survey close date
- [ ] Zero critical bugs reported in first 24 hours
- [ ] Response data quality acceptable (no obvious spam)
- [ ] All respondents receive confirmation page on submit
- [ ] Report generation workflow ready to start at survey_close date

## Post-Survey (After Close Date)

1. Mark engagement status = 'closed' in Supabase
2. Disable new responses (optional RLS policy update)
3. Run data quality checks (validate anchor question, detect anomalies)
4. Generate comprehensive OHI report using report skill
5. Schedule presentation to Alcorn State leadership
6. Archive respondent tokens/emails if required

---

**Deployment Owner:** [Name]  
**Launch Date:** Tuesday, April 12, 2026  
**Go/No-Go Decision:** ⚠️ Pending final QA sign-off
