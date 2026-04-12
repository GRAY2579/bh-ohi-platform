// ═══════════════════════════════════════════════════════════
// BH-OHI™ — Organizational Health Index Instrument
// Academic Variant (Higher Education)
// ═══════════════════════════════════════════════════════════
// 51 items: 40 core (8 × 5 pillars) + 1 anchor + 5 sentinels + 5 open-ended
// Likert scale: 1 (Strongly Disagree) to 5 (Strongly Agree)
// ═══════════════════════════════════════════════════════════

export const LIKERT_SCALE = [
  { value: 1, label: 'Strongly Disagree', short: 'SD' },
  { value: 2, label: 'Disagree', short: 'D' },
  { value: 3, label: 'Neutral', short: 'N' },
  { value: 4, label: 'Agree', short: 'A' },
  { value: 5, label: 'Strongly Agree', short: 'SA' },
]

// ── Five Pillars ──────────────────────────────────────────
export const PILLARS = [
  {
    key: 'trust',
    name: 'Trust',
    icon: 'T',
    color: '#2563EB',
    definition: 'The degree to which faculty and staff believe leadership acts with integrity, transparency, and genuine concern for their well-being.',
    basis: 'Lencioni, Edmondson, Covey',
  },
  {
    key: 'structure',
    name: 'Structure',
    icon: 'S',
    color: '#7C3AED',
    definition: 'The clarity and effectiveness of organizational design — roles, responsibilities, processes, decision rights, and accountability systems.',
    basis: 'Galbraith, Mintzberg, McKinsey 7-S',
  },
  {
    key: 'people',
    name: 'People',
    icon: 'P',
    color: '#059669',
    definition: 'The school\'s investment in its human capital — hiring practices, development, collaboration quality, and whether the right people are in the right roles.',
    basis: 'Buckingham/Coffman, Collins',
  },
  {
    key: 'vision',
    name: 'Vision',
    icon: 'V',
    color: '#D97706',
    definition: 'The degree to which the school\'s direction, strategy, and purpose are clearly articulated, understood, and aligned across all levels.',
    basis: 'Senge, Kaplan/Norton, Collins/Porras',
  },
  {
    key: 'communication',
    name: 'Communication',
    icon: 'C',
    color: '#DC2626',
    definition: 'The quality, consistency, and transparency of information flow — vertically between leadership and faculty/staff, and horizontally across programs and departments.',
    basis: 'Groysberg/Slind, Edmondson, Lencioni',
  },
]

// ── Core Questions (40 = 8 per pillar) ────────────────────
// Academic variant: "organization" → "school", "employees" → "faculty and staff",
// "leadership" → "school leadership/administration", "supervisor" → "direct supervisor"
export const CORE_QUESTIONS = [
  // ── TRUST (T1–T8) ──────────────────────────────────────
  { key: 'T1', pillar: 'trust', text: 'I feel comfortable bringing creative or unconventional ideas forward for discussion.' },
  { key: 'T2', pillar: 'trust', text: 'School leadership embraces a "what\'s best for us" approach rather than "what\'s in it for me."' },
  { key: 'T3', pillar: 'trust', text: 'I am not afraid to question or challenge leadership decisions in an effort to find the best solution.' },
  { key: 'T4', pillar: 'trust', text: 'I am fairly compensated for my role and contributions.' },
  { key: 'T5', pillar: 'trust', text: 'School leadership considers the best interests of faculty and staff when making decisions.' },
  { key: 'T6', pillar: 'trust', text: 'Our school invests time and energy into building diverse and inclusive teams.' },
  { key: 'T7', pillar: 'trust', text: 'The process for career advancement and promotion is transparent to all faculty and staff.' },
  { key: 'T8', pillar: 'trust', text: 'I feel respected by my colleagues.' },

  // ── STRUCTURE (ST1–ST8) ─────────────────────────────────
  { key: 'ST1', pillar: 'structure', text: 'Reporting relationships are clear and effective across programs, departments, and committees.' },
  { key: 'ST2', pillar: 'structure', text: 'Accountability for projects and tasks is clearly defined.' },
  { key: 'ST3', pillar: 'structure', text: 'My role and expectations are clearly defined.' },
  { key: 'ST4', pillar: 'structure', text: 'The structure of my department allows for easy access to the information I need to do my job.' },
  { key: 'ST5', pillar: 'structure', text: 'Our key processes and procedures are clearly articulated and followed consistently.' },
  { key: 'ST6', pillar: 'structure', text: 'I have the authority to make decisions appropriate to my role.' },
  { key: 'ST7', pillar: 'structure', text: 'We find common ground to address conflict and competing priorities.' },
  { key: 'ST8', pillar: 'structure', text: 'Our current leadership has the skills needed to achieve long-term success.' },

  // ── PEOPLE (P1–P8) ─────────────────────────────────────
  { key: 'P1', pillar: 'people', text: 'We focus on collaboration, preferring cooperation over competition.' },
  { key: 'P2', pillar: 'people', text: 'Leaders in our school are effective listeners.' },
  { key: 'P3', pillar: 'people', text: 'I would highly recommend our school to a colleague as a great place to work.' },
  { key: 'P4', pillar: 'people', text: 'We value and make use of one another\'s unique strengths and abilities.' },
  { key: 'P5', pillar: 'people', text: 'Leaders demonstrate the interpersonal skills needed for effective collaboration.' },
  { key: 'P6', pillar: 'people', text: 'We are able to work through differences of opinion without damaging relationships.' },
  { key: 'P7', pillar: 'people', text: 'Training and professional development are available to equip faculty and staff with skills for long-term success.' },
  { key: 'P8', pillar: 'people', text: 'My direct supervisor listens to what I have to say.' },

  // ── VISION (V1–V8) ─────────────────────────────────────
  { key: 'V1', pillar: 'vision', text: 'It is clear where we are headed as a school.' },
  { key: 'V2', pillar: 'vision', text: 'We focus on big-picture goals and strategies as much as on day-to-day activities.' },
  { key: 'V3', pillar: 'vision', text: 'I have access to timely and accurate information concerning our school\'s goals and strategies.' },
  { key: 'V4', pillar: 'vision', text: 'Our reward and recognition systems reinforce the behaviors the school is trying to produce.' },
  { key: 'V5', pillar: 'vision', text: 'Faculty and staff understand the short-term priorities of the school.' },
  { key: 'V6', pillar: 'vision', text: 'Decisions are made based on facts or data, not just perceptions or assumptions.' },
  { key: 'V7', pillar: 'vision', text: 'Faculty and staff understand how day-to-day responsibilities connect to long-range school goals.' },
  { key: 'V8', pillar: 'vision', text: 'Each department or program has clearly defined goals that support the overall strategy.' },

  // ── COMMUNICATION (C1–C8) ───────────────────────────────
  { key: 'C1', pillar: 'communication', text: 'I receive consistent, clear, and transparent feedback on my performance.' },
  { key: 'C2', pillar: 'communication', text: 'School leadership keeps faculty and staff informed about what is happening in the school.' },
  { key: 'C3', pillar: 'communication', text: 'After meetings, I know exactly what was decided and who is accountable.' },
  { key: 'C4', pillar: 'communication', text: 'I always have the information I need, when I need it, to do my job effectively.' },
  { key: 'C5', pillar: 'communication', text: 'School leadership thinks ahead, plans for the future, and communicates that to faculty and staff.' },
  { key: 'C6', pillar: 'communication', text: 'During meetings, the most important and difficult issues are put on the table to be resolved.' },
  { key: 'C7', pillar: 'communication', text: 'All departments and programs share information and work collaboratively to address challenges.' },
  { key: 'C8', pillar: 'communication', text: 'My direct supervisor communicates with me in a transparent and respectful manner.' },
]

// ── Anchor Item (reverse-coded for data integrity) ────────
export const ANCHOR_QUESTION = {
  key: 'ANCHOR',
  text: 'I feel that the leadership in our school does NOT have the best interests of faculty and staff in mind.',
  note: '(This item is reverse-scored for data quality validation.)',
  reverseCoded: true,
}

// ── Sentinel Questions (1 per pillar — cross-pillar conflict detection) ──
export const SENTINEL_QUESTIONS = [
  { key: 'S_T', pillar: 'trust', text: 'When mistakes happen in our school, the response focuses on learning rather than blame.' },
  { key: 'S_ST', pillar: 'structure', text: 'The way our school is organized helps rather than hinders my ability to do my best work.' },
  { key: 'S_P', pillar: 'people', text: 'I believe our school genuinely develops its people rather than just expecting them to perform.' },
  { key: 'S_V', pillar: 'vision', text: 'Our school\'s stated priorities are reflected in how time and resources are actually allocated.' },
  { key: 'S_C', pillar: 'communication', text: 'Information flows freely across departments and programs — I rarely feel out of the loop on things that affect my work.' },
]

// ── Open-Ended Strategic Context Questions (O1–O5) ────────
export const OPEN_ENDED_QUESTIONS = [
  { key: 'O1', text: 'What do you believe are the greatest strengths of our school?', swotCategory: 'Strengths' },
  { key: 'O2', text: 'What internal challenges or weaknesses do you believe are holding our school back?', swotCategory: 'Weaknesses' },
  { key: 'O3', text: 'What opportunities do you see for our school to grow, improve, or innovate?', swotCategory: 'Opportunities' },
  { key: 'O4', text: 'What external threats or risks concern you most about the future of our school?', swotCategory: 'Threats' },
  { key: 'O5', text: 'If you could change one thing about how our school operates, what would it be and why?', swotCategory: 'Wildcard' },
]

// ── Demographic Fields (academic variant) ──────────────────
export const DEMOGRAPHIC_FIELDS = [
  {
    key: 'role',
    label: 'Which best describes your primary role?',
    options: ['Faculty (Tenure-Track)', 'Faculty (Clinical/Non-Tenure)', 'Administrative Staff', 'Support Staff', 'Adjunct Faculty', 'Other'],
  },
  {
    key: 'years',
    label: 'How long have you been with the School of Nursing?',
    options: ['Less than 1 year', '1–3 years', '4–6 years', '7–10 years', '11+ years'],
  },
  {
    key: 'department',
    label: 'Which program or department are you primarily associated with?',
    options: ['BSN Program', 'MSN Program', 'DNP Program', 'Administration', 'Student Services', 'Other'],
  },
  {
    key: 'employment_status',
    label: 'What is your employment status?',
    options: ['Full-time', 'Part-time', 'Adjunct/Per-course', 'Contract'],
  },
]

// ── Conflict Hotspot Definitions ──────────────────────────
export const CONFLICT_HOTSPOTS = [
  { key: 'authority_paralysis', name: 'Authority Paralysis', pillarA: 'trust', pillarB: 'structure', description: 'When trust is low and structure is unclear, people stop making decisions. Everyone waits for permission that never comes.' },
  { key: 'relational_erosion', name: 'Relational Erosion', pillarA: 'trust', pillarB: 'people', description: 'When trust breaks down between people, collaboration becomes performative. Teams go through the motions without genuine engagement.' },
  { key: 'cynical_compliance', name: 'Cynical Compliance', pillarA: 'trust', pillarB: 'communication', description: 'When communication exists but trust doesn\'t, people comply without buy-in. They do what\'s asked but don\'t believe in it.' },
  { key: 'information_hoarding', name: 'Information Hoarding', pillarA: 'structure', pillarB: 'communication', description: 'When structural silos combine with poor communication, information becomes currency. People withhold to maintain power.' },
  { key: 'talent_misalignment', name: 'Talent Misalignment', pillarA: 'structure', pillarB: 'people', description: 'When structural roles don\'t match people\'s capabilities, frustration builds. The right people are in the wrong seats.' },
  { key: 'strategic_drift', name: 'Strategic Drift', pillarA: 'vision', pillarB: 'communication', description: 'When vision exists but isn\'t communicated effectively, the school drifts. Different departments pull in different directions.' },
  { key: 'process_theater', name: 'Process Theater', pillarA: 'structure', pillarB: 'vision', description: 'When processes exist without strategic alignment, compliance becomes theater. People follow procedures that don\'t serve the mission.' },
  { key: 'capability_direction_gap', name: 'Capability-Direction Gap', pillarA: 'people', pillarB: 'vision', description: 'When the school\'s vision outpaces its people\'s capabilities, ambition creates frustration. The strategy is right but execution capacity isn\'t there.' },
  { key: 'manager_breakdown', name: 'Manager Breakdown', pillarA: 'people', pillarB: 'communication', description: 'When leaders can\'t or won\'t communicate effectively with their people, the relationship breaks down at the most critical level.' },
  { key: 'strategy_disconnect', name: 'Strategy Disconnect', pillarA: 'vision', pillarB: 'trust', description: 'When vision exists but faculty and staff don\'t trust the people driving it, strategic plans die on arrival.' },
]

// ── Scoring Bands ─────────────────────────────────────────
export const SCORE_BANDS = [
  { name: 'Critical', min: 1.00, max: 1.99, color: '#991B1B', bgColor: '#FEF2F2', description: 'Severe dysfunction. Immediate intervention required.' },
  { name: 'At-Risk', min: 2.00, max: 2.79, color: '#C2410C', bgColor: '#FFF7ED', description: 'Health deteriorating. Trust or clarity breaking down.' },
  { name: 'Developing', min: 2.80, max: 3.49, color: '#CA8A04', bgColor: '#FEFCE8', description: 'Mixed signals. Foundations exist but gaps need focus.' },
  { name: 'Strong', min: 3.50, max: 4.19, color: '#15803D', bgColor: '#F0FDF4', description: 'Healthy foundations. Targeted improvements sustain momentum.' },
  { name: 'Excellent', min: 4.20, max: 5.00, color: '#0F766E', bgColor: '#ECFDF5', description: 'Outstanding health. Protect and replicate.' },
]

export function getScoreBand(score) {
  if (score == null || isNaN(score)) return null
  for (const band of SCORE_BANDS) {
    if (score >= band.min && score <= band.max) return band
  }
  return SCORE_BANDS[SCORE_BANDS.length - 1]
}

// ── All survey sections in order ──────────────────────────
export const SURVEY_SECTIONS = [
  { key: 'welcome', name: 'Welcome', type: 'welcome' },
  { key: 'demographics', name: 'About You', type: 'demographics' },
  { key: 'trust', name: 'Trust', type: 'pillar', pillar: 'trust' },
  { key: 'structure', name: 'Structure', type: 'pillar', pillar: 'structure' },
  { key: 'people', name: 'People', type: 'pillar', pillar: 'people' },
  { key: 'vision', name: 'Vision', type: 'pillar', pillar: 'vision' },
  { key: 'communication', name: 'Communication', type: 'pillar', pillar: 'communication' },
  { key: 'sentinels', name: 'Additional Questions', type: 'sentinels' },
  { key: 'open_ended', name: 'Your Perspective', type: 'open_ended' },
  { key: 'review', name: 'Review & Submit', type: 'review' },
]
