# BH-OHI™ Platform — Implementation Guide

## Overview
This is the employee-facing React application for the Alcorn State University School of Nursing OHI (Organizational Health Index) assessment. Respondents access the survey via a unique token URL: `/survey/:token`

## Architecture

### Tech Stack
- **React 18** with React Router 6
- **Supabase** for data persistence (PostgreSQL + PostgREST)
- **Vite** for build tooling
- **Inter font family** with inline styles (no CSS framework)

### Project Structure
```
src/
  lib/
    constants.js       # Survey questions, pillars, scale definitions
    supabase.js        # Supabase client initialization
  pages/
    Survey.jsx         # Main survey component (8 sections)
    CompletionPage.jsx # Post-submission confirmation
  main.jsx            # React app root + routing
```

## Component Architecture

### Survey.jsx
The primary component managing the entire survey flow:

1. **Initialization Phase**
   - Loads respondent by token from `respondents` table
   - Fetches associated engagement (organization) data
   - Restores draft answers from `draft_answers` JSONB
   - Sets respondent status to `in_progress` with `started_at` timestamp

2. **Section Navigation**
   - 9 sections total: Welcome → Demographics → 5 Pillars → Sentinels → Open-Ended → Review & Submit
   - Progress bar shows current position
   - Back/Next buttons with validation
   - Window scroll resets on section change

3. **Answer Storage & Auto-Save**
   - All answers stored in component state (`answers` object)
   - Every answer change triggers auto-save to Supabase
   - Likert responses (1–5) saved to `responses.value_int`
   - Open-ended text saved to `responses.value_text`
   - Demographic answers saved to `demographics` table
   - Draft state synced to `respondents.draft_answers` JSONB for progress restoration

4. **Section Components**
   - `WelcomeSection`: Introduction with "Begin Assessment" button
   - `DemographicsSection`: 4 dropdown fields (role, years, department, employment_status)
   - `PillarSection`: 8 Likert questions per pillar with pillar definition
   - `SentinelsSection`: 5 sentinel questions + 1 anchor (labeled "Additional Questions")
   - `OpenEndedSection`: 5 text areas for SWOT-style reflections
   - `ReviewSection`: Completion status checklist with validation warnings
   - `LikertQuestion`: Reusable pill-button component (1–5 with color gradient)

5. **Submission Flow**
   - ReviewSection validates all sections are complete
   - On submit: marks respondent `status='completed'`, sets `completed_at`, calculates `duration_seconds`
   - Redirects to `/survey/complete`

### CompletionPage.jsx
Post-submission confirmation page with:
- Success messaging
- Brief outline of next steps (report generation)
- Privacy assurance
- Clean close instruction

## Supabase Schema

### Tables Used
- **respondents**: token, status, draft_answers (JSONB), started_at, completed_at, duration_seconds
- **responses**: EAV model — one row per question per respondent (value_int for Likert, value_text for open-ended)
- **demographics**: one row per demographic field per respondent
- **engagements**: organization/school context (name, client_name, org_unit, etc.)

### Auto-Save Logic
Every time a user answers a question:
1. Answer stored in React state
2. Upserted to `responses` table using `(respondent_id, question_key)` unique constraint
3. Draft snapshot synced to `respondent.draft_answers` JSONB

On page reload:
- Fetch respondent by token
- Restore `draft_answers` to populate the form

## Styling & Branding

### Color Palette
- **Navy**: `#131B55` (primary text, headers)
- **Blue**: `#92C0E9` (accents, buttons, progress bar)
- **Camel**: `#884934` (submit button)
- **White**: `#FFFFFF` (background)
- **Light Gray**: `#F5F5F5` (sections, footer)
- **Border Gray**: `#E5E5E5` (form borders)

### Likert Scale Colors (Pill Buttons)
- **1 (Strongly Disagree)**: Red `#DC2626`
- **2 (Disagree)**: Orange `#FB923C`
- **3 (Neutral)**: Yellow `#FBBF24`
- **4 (Agree)**: Light Green `#86EFAC`
- **5 (Strongly Agree)**: Green `#22C55E`

### Responsive Design
- Mobile-first: min-width 320px
- All inline styles with `boxSizing: 'border-box'`
- Flex layouts for responsive navigation
- Textarea/select elements adapt to screen size

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

### Run Locally
```bash
npm run dev
# Vite dev server on http://localhost:5173
# Access survey via: http://localhost:5173/survey/:token
```

### Build for Production
```bash
npm run build
# Output in dist/
npm run preview
```

## Token Generation & Deployment

### Creating Survey Tokens
On the admin/client-facing dashboard (out of scope for this component):
1. Create an engagement in Supabase
2. Generate unique respondent records with tokens
3. Distribute survey URLs like: `https://ohi.bluehenhealth.com/survey/abc123token`

### Environment Deployment
- **Dev**: Supabase dev instance
- **Prod**: Supabase production instance with Row-Level Security (RLS) enabled
- All API keys are anon-key (not service-role) — RLS policies ensure token-based access

## Error Handling

### Token Not Found
Shows: "Survey token not found. Please check your link."

### Already Completed
Shows: "This survey has already been completed. Thank you for your participation!"

### Network Errors
Auto-save errors are logged to console but don't block the UX (graceful degradation)

## Data Integrity & Validation

### Anchor Question
The ANCHOR_QUESTION (`reverseCoded: true`) is used post-survey for data quality validation:
- Detects straight-line answering (all same score)
- Validates response patterns
- Note: Component displays it but doesn't reverse-score (scoring happens server-side)

### Sentinel Questions
5 cross-pillar questions to detect conflict hotspots (e.g., "authority paralysis", "relational erosion")

## Performance Notes

- No external CSS dependencies — all inline styles
- Supabase RLS policies allow anon access (security via URL token + single respondent access)
- Draft saves are debounced implicitly by user interaction speed
- Component re-renders only on state changes (React 18 optimizations)

## Testing Checklist

- [ ] Survey loads with valid token
- [ ] All 8 sections render correctly
- [ ] Likert pill buttons work (color feedback, hover states)
- [ ] Demographics dropdowns populate
- [ ] Open-ended textareas accept input
- [ ] Back/Next navigation works
- [ ] Progress bar advances smoothly
- [ ] Answers persist across section changes
- [ ] Page reload restores draft answers
- [ ] Submit button only appears on review section
- [ ] Completion page shows after submit
- [ ] Invalid token shows error page
- [ ] Already-completed token shows error page
- [ ] Mobile responsive (test at 320px, 768px, 1200px)

## Tuesday Launch Checklist

- [ ] Supabase project created and schema deployed
- [ ] Environment variables set in production
- [ ] Blue Hen horse logo added to `/public/bh-horse-white.png`
- [ ] Survey URLs generated and distributed to faculty/staff
- [ ] Admin dashboard ready to view real-time responses
- [ ] Auto-save tested with actual network latency
- [ ] Mobile tested on iOS/Android devices
- [ ] Dark mode optional (not in MVP scope)

## Future Enhancements

- Add response validation (required fields, min/max responses per section)
- Implement time estimates per section
- Add progress indicators (X of Y questions answered)
- Language localization support
- Accessibility improvements (WCAG 2.1 AA)
- Keyboard navigation (Tab, Enter, Arrow keys)
- Response preview before final submit
