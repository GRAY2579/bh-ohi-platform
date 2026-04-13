/**
 * Blue Hen BH-DISC Behavioral Assessment Constants
 * Contains question groups, scoring functions, style definitions, and overview data
 */

// 24 forced-choice phrase groups from BH-DISC v3
export const DISC_QUESTION_GROUPS = [
  { num: 1, d: "Take charge of the situation", i: "Get everyone excited and on board", s: "Keep things running smoothly", c: "Make sure we have all the facts first" },
  { num: 2, d: "Push through obstacles to get results", i: "Build relationships that open doors", s: "Create a calm, stable environment", c: "Develop a detailed plan before acting" },
  { num: 3, d: "Make quick, decisive calls", i: "Inspire others with a bold vision", s: "Support the team through the process", c: "Analyze every option before committing" },
  { num: 4, d: "Challenge the way things have always been done", i: "Bring energy and optimism to the room", s: "Listen carefully before responding", c: "Hold myself and others to a high standard" },
  { num: 5, d: "Set ambitious goals and drive toward them", i: "Connect with people on a personal level", s: "Follow through on every commitment", c: "Identify risks before they become problems" },
  { num: 6, d: "Take the lead when no one else will", i: "Persuade others to see my point of view", s: "Stay patient even when progress is slow", c: "Organize information so nothing is missed" },
  { num: 7, d: "Compete to win, not just to participate", i: "Keep the mood positive when things get hard", s: "Put the needs of the team before my own", c: "Double-check my work before moving forward" },
  { num: 8, d: "Demand results, even when it is uncomfortable", i: "Celebrate progress and recognize effort", s: "Provide a steady, reliable presence", c: "Ask the tough questions others avoid" },
  { num: 9, d: "Focus on the bottom line above all else", i: "Make the experience enjoyable for everyone", s: "Ensure everyone feels heard and valued", c: "Verify accuracy before presenting anything" },
  { num: 10, d: "Act boldly even without complete information", i: "Talk through ideas out loud with others", s: "Wait for the right moment to act", c: "Research thoroughly before making a move" },
  { num: 11, d: "Confront problems head-on, directly", i: "Use humor and warmth to ease tension", s: "Avoid unnecessary conflict when possible", c: "Document what happened and why" },
  { num: 12, d: "Delegate tasks and hold people accountable", i: "Motivate the team with enthusiasm and praise", s: "Do the work myself to make sure it gets done", c: "Create systems that prevent future mistakes" },
  { num: 13, d: "Want authority to make the final call", i: "Want recognition for my contributions", s: "Want stability and a predictable routine", c: "Want clear expectations and defined processes" },
  { num: 14, d: "Move fast and figure it out along the way", i: "Brainstorm creative solutions with the group", s: "Stick with what has worked before", c: "Evaluate all outcomes before choosing a path" },
  { num: 15, d: "Speak up and state my position firmly", i: "Share stories and examples to make my point", s: "Agree to keep the peace, even when I disagree", c: "Present data and evidence to support my case" },
  { num: 16, d: "Win the argument", i: "Win the crowd", s: "Win trust over time", c: "Win with the facts" },
  { num: 17, d: "Am impatient with slow progress", i: "Am easily distracted by new ideas", s: "Am reluctant to change direction quickly", c: "Am overly critical of imperfect work" },
  { num: 18, d: "Tell people what I need from them", i: "Ask people how they are doing first", s: "Wait for someone to ask how I can help", c: "Send a detailed message with clear instructions" },
  { num: 19, d: "Becoming more forceful and directive", i: "Becoming louder and more expressive", s: "Becoming quieter and withdrawing", c: "Becoming more rigid and rule-focused" },
  { num: 20, d: "The one who makes things happen", i: "The one who keeps everyone together", s: "The one you can always count on", c: "The one who catches what others miss" },
  { num: 21, d: "Achieve results that others said were impossible", i: "Be known as someone people love working with", s: "Build something that lasts and endures", c: "Produce work that is flawless and respected" },
  { num: 22, d: "Rules exist to be challenged when they do not work", i: "Rules are less important than relationships", s: "Rules create fairness and should be followed", c: "Rules exist for good reason and must be respected" },
  { num: 23, d: "I trust my instincts over the data", i: "I trust my ability to read people", s: "I trust the process we have in place", c: "I trust verified information over opinions" },
  { num: 24, d: "What are we trying to accomplish?", i: "Who else should be involved in this?", s: "How will this affect the people involved?", c: "What could go wrong if we move forward?" },
];

// Three-graph scoring algorithm functions
export const DISC_SCORING = {
  /**
   * Tally the "Most like me" and "Least like me" selections
   * @param {Array} selections - Array of 24 objects with most/least keys
   * @returns {Object} { mostCounts, leastCounts } with D, I, S, C counts
   */
  tallySelections(selections) {
    const mostCounts = { D: 0, I: 0, S: 0, C: 0 };
    const leastCounts = { D: 0, I: 0, S: 0, C: 0 };

    selections.forEach((selection) => {
      if (selection.most) {
        mostCounts[selection.most]++;
      }
      if (selection.least) {
        leastCounts[selection.least]++;
      }
    });

    return { mostCounts, leastCounts };
  },

  /**
   * Calculate the three graph scores from tallied selections
   * @param {Object} mostCounts - Counts for "Most like me"
   * @param {Object} leastCounts - Counts for "Least like me"
   * @returns {Object} { core, context, conflict } with D, I, S, C scores
   */
  calculateScores(mostCounts, leastCounts) {
    const core = {};
    const context = {};
    const conflict = {};

    ['D', 'I', 'S', 'C'].forEach((dimension) => {
      // Context: ((Most_count / 24) × 16) − 8
      context[dimension] = ((mostCounts[dimension] / 24) * 16) - 8;

      // Conflict: (((24 − Least_count) / 24) × 16) − 8
      conflict[dimension] = (((24 - leastCounts[dimension]) / 24) * 16) - 8;

      // Core: ((Most_count − Least_count) / 24) × 8
      core[dimension] = ((mostCounts[dimension] - leastCounts[dimension]) / 24) * 8;
    });

    return { core, context, conflict };
  },

  /**
   * Determine primary and secondary DISC styles from core scores
   * @param {Object} coreScores - Core scores with D, I, S, C values
   * @returns {Object} { primary, secondary } dimension letters
   */
  determineStyle(coreScores) {
    const sorted = Object.entries(coreScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    return {
      primary: sorted[0][0],
      secondary: sorted[1][0],
    };
  },

  /**
   * Convert graph scores from -8 to +8 range to 0-100 percentile scale
   * @param {Object} graphScores - Scores with D, I, S, C values in range [-8, +8]
   * @returns {Object} Scores converted to 0-100 scale
   */
  toPercentScale(graphScores) {
    const result = {};
    ['D', 'I', 'S', 'C'].forEach((dimension) => {
      result[dimension] = ((graphScores[dimension] + 8) / 16) * 100;
    });
    return result;
  },
};

// DISC style name mappings
export const DISC_STYLE_NAMES = {
  D: 'Dominant',
  I: 'Influencing',
  S: 'Steady',
  C: 'Conscientious',
};

// DISC style colors (hex codes)
export const DISC_COLORS = {
  D: '#C0392B',
  I: '#F39C12',
  S: '#27AE60',
  C: '#2980B9',
};

// Short descriptions of each primary DISC style
export const DISC_STYLE_DESCRIPTIONS = {
  D: "Dominant individuals are results-focused and decisive. They thrive on challenges, take charge quickly, and drive teams toward ambitious goals with confidence and directness.",
  I: "Influencing individuals are energetic and people-focused. They inspire others, build strong relationships, and bring enthusiasm and optimism to every interaction and initiative.",
  S: "Steady individuals are reliable and harmony-focused. They support their teams, follow through on commitments, and create stable, predictable environments where others feel valued.",
  C: "Conscientious individuals are accurate and process-focused. They analyze thoroughly, verify details, hold high standards, and ensure quality and accuracy in all their work.",
};

// 14-row DISC behavioral overview table
export const DISC_OVERVIEW_ROWS = [
  { label: "Pace", D: "FAST", I: "FAST", S: "STEADY", C: "CAREFUL" },
  { label: "Focus", D: "RESULTS", I: "PEOPLE", S: "HARMONY", C: "ACCURACY" },
  { label: "Approach", D: "DIRECT", I: "OPEN", S: "PATIENT", C: "PRECISE" },
  { label: "Strength", D: "DRIVING RESULTS", I: "ENGAGING OTHERS", S: "SUPPORTING TEAM", C: "ENSURING QUALITY" },
  { label: "Wants", D: "AUTHORITY", I: "RECOGNITION", S: "STABILITY", C: "CLEAR EXPECTATIONS" },
  { label: "Fears", D: "LOSING CONTROL", I: "BEING IGNORED", S: "SUDDEN CHANGE", C: "CRITICISM" },
  { label: "Under Stress", D: "BECOMES DEMANDING", I: "BECOMES SCATTERED", S: "BECOMES WITHDRAWN", C: "BECOMES RIGID" },
  { label: "Motivates Others Via", D: "RESULTS & GOALS", I: "ENTHUSIASM & PRAISE", S: "LOYALTY & SUPPORT", C: "DATA & SYSTEMS" },
  { label: "Values", D: "EFFICIENCY", I: "RELATIONSHIPS", S: "COOPERATION", C: "ACCURACY" },
  { label: "Communication Style", D: "COMMANDING", I: "EXPRESSIVE", S: "LISTENING", C: "DETAILED" },
  { label: "Decision Making", D: "QUICK & BOLD", I: "GROUP INPUT", S: "CONSENSUS", C: "THOROUGH ANALYSIS" },
  { label: "Risk Tolerance", D: "HIGH", I: "HIGH", S: "LOW", C: "LOW" },
  { label: "Change Readiness", D: "EMBRACES", I: "EMBRACES", S: "RESISTS", C: "QUESTIONS" },
  { label: "Leadership View", D: "COMMANDING", I: "INSPIRING", S: "SUPPORTIVE", C: "TECHNICAL EXPERT" },
];
