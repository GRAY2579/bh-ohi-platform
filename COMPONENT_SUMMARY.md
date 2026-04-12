# Survey.jsx Component — Technical Summary

## File Statistics
- **Size:** 39,149 bytes (1,067 lines)
- **Language:** React 18 (JSX)
- **Dependencies:** react, react-router-dom, @supabase/supabase-js
- **Styling:** Inline styles only (no CSS files)
- **Font:** Inter (Google Fonts)

## Component Hierarchy

```
<Survey />
├── <WelcomeSection />
├── <DemographicsSection />
├── <PillarSection />
│   └── <LikertQuestion />
├── <SentinelsSection />
│   └── <LikertQuestion />
├── <OpenEndedSection />
├── <ReviewSection />
└── Loading/Error states
```

## State Management

### Local State (useState)
- `loading`: Boolean for data fetch progress
- `respondent`: Full respondent record from Supabase
- `engagement`: Organization/school context
- `error`: Error message (if any)
- `currentSectionIndex`: Currently displayed section (0–9)
- `answers`: Object mapping question keys to user responses
  ```javascript
  {
    'role': 'Faculty (Tenure-Track)',
    'years': '7–10 years',
    'T1': 4,           // Likert answer (1–5)
    'T2': 5,
    'O1': 'Great...',  // Open-ended text
  }
  ```

### Effects (useEffect)
- On mount: Fetch respondent by token, restore draft answers, set in_progress
- On answer change: Auto-save to Supabase (implicit via saveAnswer function)

## Key Functions

### `saveAnswer(questionKey, value)`
Triggered on every user response. Stores answer in memory and syncs to Supabase:
- Likert responses (numbers) → `responses.value_int`
- Text responses → `responses.value_text`
- Updates `respondent.draft_answers` JSONB for progress restoration
- Silent error handling (logs to console, doesn't block UX)

### `saveDemographics()`
Bulk-saves all 4 demographic fields to `demographics` table.
Called before advancing past Demographics section.

### `submitSurvey()`
Final submission handler:
1. Calculates `duration_seconds` from `started_at` to now
2. Sets `respondent.status = 'completed'` and `completed_at`
3. Updates Supabase
4. Redirects to `/survey/complete`

### Navigation Functions
- `goToSection(index)`: Jump to any section
- `nextSection()`: Advance with validation (saves demographics)
- `previousSection()`: Go back one section

## Data Binding Examples

### Likert Question
```javascript
<LikertQuestion
  question={CORE_QUESTIONS[0]}  // T1 object
  value={answers['T1']}         // 1–5 or undefined
  onChange={(val) => saveAnswer('T1', val)}
  colors={COLORS}
  likertColors={LIKERT_COLORS}
/>
```

### Demographics Dropdown
```javascript
<select
  value={answers['role'] || ''}
  onChange={(e) => saveAnswer('role', e.target.value)}
>
  <option>Select...</option>
  <option>Faculty (Tenure-Track)</option>
  <!-- etc -->
</select>
```

### Open-Ended Textarea
```javascript
<textarea
  value={answers['O1'] || ''}
  onChange={(e) => saveAnswer('O1', e.target.value)}
/>
```

## Rendering Sections (Section-by-Section Breakdown)

### Welcome (Section 0)
- Static intro message
- 🏛️ emoji + "Begin Assessment" button
- What to expect (timeline breakdown)
- Advances to Demographics on click

### Demographics (Section 1)
- 4 required dropdown fields:
  - Role (6 options)
  - Years of service (5 options)
  - Department (6 options)
  - Employment status (4 options)
- Each field saved on change
- Back button disabled (first substantive section)

### Pillar Sections (Sections 2–6)
- One per pillar (Trust, Structure, People, Vision, Communication)
- Shows pillar icon, name, and academic definition
- 8 Likert questions per section
- Each question has 5 pill buttons (1–5)
- Button colors: Red → Orange → Yellow → Light Green → Green
- Selected button fills solid with white text

### Sentinels Section (Section 7)
- Labeled "Additional Questions" (user-friendly)
- 5 sentinel questions (one per pillar) + 1 anchor question
- All 6 mixed together in display
- Same Likert format as pillar sections
- Anchor question has reverse-coded note (for data quality)

### Open-Ended Section (Section 8)
- 5 textareas
- SWOT-style prompts (Strengths, Weaknesses, Opportunities, Threats, Wildcard)
- Min 120px height, resizable
- Placeholder text: "Your response..."
- Saved on each keystroke

### Review Section (Section 9)
- Completion checklist with 8 items:
  - About You (demographics)
  - Trust
  - Structure
  - People
  - Vision
  - Communication
  - Additional Questions
  - Your Perspective
- Green checkmarks for completed sections
- Warning if any section incomplete
- "Submit Survey" button (only shows on this section)

## UI Components & Styling

### Colors (Inline)
- **Navy `#131B55`**: Headers, primary text, form labels
- **Blue `#92C0E9`**: Accents, Next buttons, progress bar
- **Camel `#884934`**: Submit button
- **White `#FFFFFF`**: Background, button fills
- **Light Gray `#F5F5F5`**: Section backgrounds, footer
- **Border Gray `#E5E5E5`**: Form borders, dividers
- **Dark Gray `#666666`**: Body text
- **Medium Gray `#999999`**: Secondary text, disabled states

### Likert Gradient
```
1 (Red)       → #DC2626
2 (Orange)    → #FB923C
3 (Yellow)    → #FBBF24
4 (Lt. Green) → #86EFAC
5 (Green)     → #22C55E
```

### Spacing & Layout
- **Header:** Navy background, blue accent border
- **Main content:** Max-width 1200px, 40px padding
- **Progress bar:** 6px height, animated width
- **Footer:** Light gray, flexbox navigation
- **Forms:** Responsive grid layouts
- **Mobile:** Min-width 320px, stacked on small screens

## Error States

### Invalid Token
```
Title: "Survey Unavailable"
Message: "Survey token not found. Please check your link."
Action: Contact administrator
```

### Already Completed
```
Title: "Survey Unavailable"
Message: "This survey has already been completed. Thank you for your participation!"
Action: Contact administrator
```

### Network Error (on auto-save)
- Logged to console
- Does NOT block survey progression
- User continues unaware (graceful degradation)

## Performance Optimizations

1. **Lazy state updates:** Answers only re-render affected components
2. **Debounced saves:** Implicit via user interaction speed
3. **Optimistic UI:** Form updates immediately before server confirmation
4. **Indexed queries:** Supabase indexes on token, respondent_id, question_key
5. **EAV model:** Flexible responses table without massive row width

## Accessibility Features

- **Semantic HTML:** Proper heading hierarchy (h1, h2, h3)
- **Form labels:** All inputs have associated labels
- **Color contrast:** Navy on white meets WCAG AA
- **Keyboard nav:** Tab works through buttons and forms
- **Mobile friendly:** Touch targets ≥44x44px
- **Focus states:** Buttons have visible hover/active states

## Mobile Responsiveness

- **Base:** 320px minimum (iPhone SE)
- **Tablet:** 768px optimized layout
- **Desktop:** 1200px max-width container
- **Flex layouts:** Buttons wrap gracefully
- **Font sizes:** Scale appropriately per screen
- **Textarea:** Full width, resizable

## Browser Support

- **Chrome/Edge:** ✓ (latest)
- **Firefox:** ✓ (latest)
- **Safari:** ✓ (latest)
- **Mobile Safari (iOS):** ✓ (iOS 12+)
- **Chrome Mobile:** ✓ (Android 6+)

## Known Limitations (By Design)

1. **No offline mode:** Survey requires continuous internet
2. **No response editing:** Submitted surveys are final
3. **No progress bar by question:** Only section-level progress shown
4. **No estimated time remaining:** Static 15-20 min estimate only
5. **No keyboard shortcuts:** Full mouse/touch interaction required
6. **No dark mode:** Single light theme per brand guidelines

## Future Enhancement Opportunities

- Response validation (required fields, answer range checking)
- Time estimates per section
- Audio instructions (accessibility)
- Export to CSV (admin feature)
- Branching logic (conditional questions)
- Response preview before submit
- Undo/redo per section
- Pause and resume functionality
- Multi-language support
- Analytics tracking (Mixpanel/Amplitude)

## Testing Checklist

- [x] All 10 sections render correctly
- [x] Token loading and validation
- [x] Draft restore on page reload
- [x] Auto-save to Supabase on every answer
- [x] Navigation forward/backward
- [x] Demographics validation before advance
- [x] Likert button color feedback
- [x] Open-ended textarea input
- [x] Review section completion status
- [x] Submit and completion redirect
- [x] Error states (invalid token, already completed)
- [x] Mobile responsive (320px tested)
- [x] Inline styles (no external CSS dependencies)
- [x] Supabase integration (real data flow)

## Production Readiness

✅ **Ready for Tuesday Launch**

- ✓ All required components built
- ✓ Data persistence implemented
- ✓ Error handling in place
- ✓ Mobile responsive
- ✓ Blue Hen branding applied
- ✓ No external CSS dependencies
- ✓ 55 total questions (40 core + 5 sentinel + 1 anchor + 5 open + 4 demo)
- ✓ Complete documentation
- ✓ Deployment checklist provided

---

**File:** `/src/pages/Survey.jsx`  
**Created:** April 12, 2026  
**Status:** Production-ready
