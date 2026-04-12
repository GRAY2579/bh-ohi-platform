# BH-OHI™ Organizational Health Index — Survey Platform

**Status:** Production-ready for Tuesday, April 12, 2026 launch  
**Target:** Alcorn State University School of Nursing faculty & staff OHI assessment

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account with active project

### Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in your Supabase credentials
# Edit .env.local and add:
#   VITE_SUPABASE_URL=https://your-project.supabase.co
#   VITE_SUPABASE_ANON_KEY=your-anon-key-here

# 4. Deploy database schema (one-time)
# Log into Supabase dashboard → SQL Editor → paste contents of /supabase/schema.sql

# 5. Run locally
npm run dev
# Opens http://localhost:5173
```

### Test the Survey

1. Create a test engagement in Supabase SQL Editor:
```sql
INSERT INTO engagements (name, client_name, org_unit, survey_open, survey_close)
VALUES (
  'Test Engagement',
  'Alcorn State University',
  'School of Nursing',
  '2026-04-12'::date,
  '2026-04-30'::date
) RETURNING id;
```

2. Create a test respondent (copy the engagement_id from above):
```sql
INSERT INTO respondents (engagement_id, token, status)
VALUES ('{engagement_id}', 'test-token-001', 'pending');
```

3. Visit: http://localhost:5173/survey/test-token-001

## Project Structure

```
bh-ohi-platform/
├── src/
│   ├── pages/
│   │   ├── Survey.jsx           # Main survey component (40.3 KB)
│   │   └── CompletionPage.jsx   # Post-submit confirmation
│   ├── lib/
│   │   ├── constants.js         # Questions, pillars, scale definitions
│   │   └── supabase.js          # Supabase client setup
│   └── main.jsx                 # React Router entry point
├── supabase/
│   └── schema.sql               # Database schema (deploy once)
├── public/
│   └── bh-horse-white.png       # Blue Hen logo (40x40px)
├── index.html                   # Entry point
├── package.json
└── vite.config.js
```

## Component Architecture

### Survey.jsx (1,067 lines)
The main survey component with:

- **8 sections:** Welcome → Demographics → 5 Pillars → Sentinels → Open-Ended → Review & Submit
- **Auto-save:** Every answer auto-saves to Supabase (responses table)
- **Progress restoration:** Draft answers saved to respondent.draft_answers JSONB
- **Token-based security:** One token per respondent, one-time use
- **Responsive design:** Mobile-first (320px+), inline styles only
- **Accessibility:** Semantic HTML, color contrast compliant

### Survey Sections

| Section | Type | Questions | Input |
|---------|------|-----------|-------|
| Welcome | Intro | — | Button |
| Demographics | Dropdown | 4 fields | Select |
| Trust | Likert | 8 questions | 1–5 pill buttons |
| Structure | Likert | 8 questions | 1–5 pill buttons |
| People | Likert | 8 questions | 1–5 pill buttons |
| Vision | Likert | 8 questions | 1–5 pill buttons |
| Communication | Likert | 8 questions | 1–5 pill buttons |
| Additional Questions | Likert | 6 questions (5 sentinels + 1 anchor) | 1–5 pill buttons |
| Your Perspective | Text | 5 open-ended | Textarea |
| Review & Submit | Checklist | Completion status | Button |

## Data Model

### respondents table
```
id (UUID)
engagement_id (FK)
token (UNIQUE) — one per person
status (pending → in_progress → completed)
started_at, completed_at
duration_seconds
draft_answers (JSONB) — auto-restored on page reload
```

### responses table (EAV model)
```
id (UUID)
respondent_id (FK)
engagement_id (FK)
question_key (T1, T2, ..., O1, O2, ANCHOR, etc.)
value_int (1–5 for Likert)
value_text (open-ended responses)
```

### demographics table
```
id (UUID)
respondent_id (FK)
engagement_id (FK)
field_key (role, department, years, employment_status)
field_value (text)
```

## Build for Production

```bash
# Build optimized bundle
npm run build

# Test production build locally
npm run preview

# Deploy to hosting (Vercel, Netlify, etc.)
# Upload /dist folder or connect GitHub for auto-deploy
```

## Styling & Colors

All styles are **inline** (no external CSS). Colors use Blue Hen branding:

- **Navy:** `#131B55` (headers, text)
- **Blue:** `#92C0E9` (accents, progress)
- **Camel:** `#884934` (submit button)
- **White:** `#FFFFFF` (background)

Likert scale uses a gradient:
- Red (1) → Orange (2) → Yellow (3) → Light Green (4) → Green (5)

## Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get these from Supabase dashboard → Settings → API

## Error Handling

### Survey Not Found
Shows a friendly error: "Survey token not found. Please check your link."

### Already Completed
Shows: "This survey has already been completed. Thank you for your participation!"

### Network Issues
Auto-save errors are logged to console but don't block the UX (graceful degradation).

## Performance

- **Bundle size:** ~180 KB (gzipped)
- **Load time:** < 2 seconds on 3G
- **Survey completion time:** 15–20 minutes
- **Database queries:** Optimized with indexes on token, status, respondent_id

## Testing

Run through all 9 sections with test data:
- ✓ Welcome screen
- ✓ Demographics (all 4 required)
- ✓ All 5 pillar sections
- ✓ Sentinels + Anchor
- ✓ Open-ended text input
- ✓ Review & completion status
- ✓ Submission
- ✓ Confirmation page

Mobile test:
- ✓ Touch-friendly buttons (min 44x44px)
- ✓ Responsive layout at 320px, 768px, 1200px
- ✓ Portrait/landscape orientation

## Documentation

- **IMPLEMENTATION.md** — Detailed technical reference
- **DEPLOYMENT.md** — Tuesday launch checklist
- **README.md** — This file

## Support

### Local Development Issues
1. Check environment variables are set: `cat .env.local`
2. Verify Supabase connection: Check browser console (F12)
3. Clear cache: `npm run build && npm run preview`
4. Reset dependencies: `rm -rf node_modules && npm install`

### Production Issues
See **DEPLOYMENT.md** for monitoring and rollback procedures.

## License

© 2026 Blue Hen Health. All rights reserved.

---

**Next Steps:**
1. Run `npm install`
2. Set up `.env.local` with Supabase credentials
3. Deploy schema to Supabase
4. Run `npm run dev` and test `/survey/test-token-001`
5. Deploy to production when ready
6. Follow **DEPLOYMENT.md** launch checklist

**Questions?** Contact your tech lead or see IMPLEMENTATION.md for architecture details.
