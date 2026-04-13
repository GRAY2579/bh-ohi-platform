/**
 * BH-DISC Report Content Data
 * Comprehensive style-specific narrative content for 20-page BH-DISC PDF reports
 * Extracted from Blue Hen Agency DISC assessment framework
 */

// ============================================================
// LEADERSHIP SCORES BY PRIMARY STYLE
// ============================================================
export const LEADERSHIP_SCORES = {
  D: {
    Influencing: 82,
    Directing: 95,
    Processing: 55,
    Detailing: 40,
    Creating: 68,
    Persisting: 88,
    Relating: 45,
  },
  I: {
    Influencing: 95,
    Directing: 58,
    Processing: 42,
    Detailing: 35,
    Creating: 88,
    Persisting: 50,
    Relating: 92,
  },
  S: {
    Influencing: 55,
    Directing: 35,
    Processing: 78,
    Detailing: 72,
    Creating: 48,
    Persisting: 90,
    Relating: 88,
  },
  C: {
    Influencing: 40,
    Directing: 45,
    Processing: 92,
    Detailing: 95,
    Creating: 58,
    Persisting: 82,
    Relating: 50,
  },
};

// ============================================================
// COMBO PROFILES
// ============================================================
export const COMBO_PROFILES = {
  DI: "Dominant-Influencing",
  ID: "Influencing-Dominant",
  IS: "Influencing-Steady",
  SI: "Steady-Influencing",
  SC: "Steady-Compliant",
  CS: "Compliant-Steady",
  CD: "Compliant-Dominant",
  DC: "Dominant-Compliant",
  DS: "Dominant-Steady",
  SD: "Steady-Dominant",
  IC: "Influencing-Compliant",
  CI: "Compliant-Influencing",
};

// ============================================================
// SIDEBAR QUOTES (10 total)
// ============================================================
export const SIDEBAR_QUOTES = [
  ["Know yourself and you will win all battles.", "Sun Tzu"],
  ["The greatest discovery is that a human being can alter their life by altering their attitude.", "William James"],
  ["Knowing others is intelligence; knowing yourself is true wisdom.", "Lao Tzu"],
  ["He who knows others is wise; he who knows himself is enlightened.", "Lao Tzu"],
  ["The privilege of a lifetime is to become who you truly are.", "Carl Jung"],
  ["Between stimulus and response there is a space. In that space is our freedom.", "Viktor Frankl"],
  ["Self-awareness is the ability to take an honest look at your life without attachment.", "Debbie Ford"],
  ["What lies behind us and what lies before us are tiny matters compared to what lies within us.", "Ralph Waldo Emerson"],
  ["The unexamined life is not worth living.", "Socrates"],
  ["People who know themselves are no longer aimless.", "Johann Wolfgang von Goethe"],
];

// ============================================================
// COMMUNICATION SNAPSHOT (per style)
// ============================================================
export const COMM_SNAPSHOT = {
  D: {
    pace: "Fast and urgent",
    tone: "Direct and commanding",
    focus: "Results and action",
    listens_for: "The bottom line",
    frustrated_by: "Indecision and small talk",
  },
  I: {
    pace: "Fast and social",
    tone: "Warm and enthusiastic",
    focus: "People and possibilities",
    listens_for: "Connection and excitement",
    frustrated_by: "Details and rigid structure",
  },
  S: {
    pace: "Steady and measured",
    tone: "Warm and patient",
    focus: "Harmony and teamwork",
    listens_for: "Sincerity and consistency",
    frustrated_by: "Sudden change and conflict",
  },
  C: {
    pace: "Careful and methodical",
    tone: "Precise and structured",
    focus: "Accuracy and quality",
    listens_for: "Facts and logic",
    frustrated_by: "Vagueness and shortcuts",
  },
};

// ============================================================
// ENERGIZES & DRAINS (per style)
// ============================================================
export const ENERGIZES_DRAINS = {
  D: {
    energizes: ["Clear objectives", "Autonomy to act", "Fast decisions", "Visible results"],
    drains: ["Micromanagement", "Drawn-out meetings", "Indecisive teams", "Excessive process"],
  },
  I: {
    energizes: ["Social interaction", "Creative brainstorming", "Recognition", "New opportunities"],
    drains: ["Working alone", "Detailed reports", "Rigid procedures", "Being ignored"],
  },
  S: {
    energizes: ["Stable relationships", "Clear expectations", "Team collaboration", "Consistent routines"],
    drains: ["Sudden change", "Conflict", "Ambiguity", "Working in isolation"],
  },
  C: {
    energizes: ["Deep analysis", "Clear standards", "Uninterrupted focus", "Verified data"],
    drains: ["Vague directions", "Rushed decisions", "Emotional appeals", "Sloppy work"],
  },
};

// ============================================================
// STRENGTH CARDS (4 per style with title + description)
// ============================================================
export const STRENGTH_CARDS = {
  D: [
    ["DECISIVENESS", "You cut through ambiguity and commit when others hesitate"],
    ["DRIVE", "You maintain intensity and momentum toward the finish line"],
    ["DIRECTNESS", "You communicate with clarity that eliminates guesswork"],
    ["ACCOUNTABILITY", "You own outcomes and hold others to the same standard"],
  ],
  I: [
    ["ENTHUSIASM", "You bring energy and optimism that lifts entire teams"],
    ["CONNECTION", "You build genuine relationships that open doors and create trust"],
    ["INSPIRATION", "You motivate others to reach beyond their self-imposed limits"],
    ["ADAPTABILITY", "You adjust your style instinctively to connect with anyone"],
  ],
  S: [
    ["RELIABILITY", "You follow through on every commitment without fail"],
    ["PATIENCE", "You give people the time and space to do their best work"],
    ["LOYALTY", "You stand by people and organizations through difficulty"],
    ["COMPOSURE", "You maintain calm and perspective when others lose theirs"],
  ],
  C: [
    ["PRECISION", "You catch errors and maintain quality others overlook"],
    ["ANALYSIS", "You see patterns and possibilities hidden in complex data"],
    ["THOROUGHNESS", "You ensure nothing important is missed or overlooked"],
    ["EXPERTISE", "You develop deep mastery that others rely on for critical decisions"],
  ],
};

// ============================================================
// WORK BEHAVIOR TABLE DATA (per style)
// ============================================================
export const WORK_BEHAVIOR = {
  D: {
    meeting_style: "Short, agenda-driven, decision-focused",
    decision_making: "Fast — trusts instinct, revisits if needed",
    feedback_pref: "Direct and immediate — no sugarcoating",
    conflict_approach: "Head-on — addresses issues quickly and moves on",
    under_deadline: "Thrives — increases focus and output",
  },
  I: {
    meeting_style: "Collaborative, energetic, idea-generating",
    decision_making: "Intuitive — goes with gut feeling and group energy",
    feedback_pref: "Positive first, constructive wrapped in encouragement",
    conflict_approach: "Avoids when possible — uses humor to defuse",
    under_deadline: "Energized but may lose focus on details",
  },
  S: {
    meeting_style: "Listening-focused, supportive, consensus-seeking",
    decision_making: "Deliberate — needs time to process and consider impact",
    feedback_pref: "Gentle, private, and specific with clear next steps",
    conflict_approach: "Avoids actively — may internalize frustration",
    under_deadline: "Steady but stressed — needs reassurance and support",
  },
  C: {
    meeting_style: "Structured, data-driven, agenda-required",
    decision_making: "Analytical — needs verified data before committing",
    feedback_pref: "Specific, factual, and tied to clear standards",
    conflict_approach: "Addresses with facts and logic — avoids emotion",
    under_deadline: "Anxious about quality — may resist cutting corners",
  },
};

// ============================================================
// PROFILES - FULL STYLE NARRATIVES & CONTENT
// ============================================================
export const PROFILES = {
  D: {
    name: "Dominant",
    letter: "D",
    tagline: "The Results-Focused Leader",
    narrative:
      "You are wired to take charge and drive results. In any situation, you naturally focus on the bottom line — what needs to happen, who will make it happen, and when. You prefer to lead rather than follow, and you move toward challenges that others avoid. You are direct, decisive, and focused on winning. You see obstacles as problems to solve, not reasons to stop. Your pace is fast, your standard is high, and your tolerance for excuses is low. When others are still talking about what to do, you have already started doing it. You bring clarity of purpose and a bias toward action that cuts through complexity. People know where they stand with you because you tell them — you say what needs to be said and expect others to do the same.",
    communication:
      "Direct and action-oriented. You lead with conclusions and expect others to keep up. You value brevity and decisiveness. Small talk frustrates you — you communicate to accomplish something, not to build rapport. You become impatient with discussions that do not lead to decisions. You ask pointed questions and expect clear answers. Your emails are short, your meetings have agendas, and your conversations have a point.",
    strengths:
      "You make tough decisions when others hesitate. You drive toward results with focus and intensity. You hold yourself and others accountable. You thrive in competitive, high-stakes environments. You inspire others through your confidence and decisiveness. You cut through ambiguity and provide clear direction. You recover quickly from setbacks and maintain forward momentum when others stall.",
    risk: "Your directness can feel harsh to those who process more slowly. You may run over people in your rush to move forward. You might skip relationship-building steps that would create buy-in. Your intensity under pressure can escalate rather than resolve conflict. You may decide too quickly without gathering necessary input, leading to avoidable mistakes.",
    motivation:
      "Results, winning, autonomy, and recognition for achievement. You want clear goals, the freedom to pursue them your way, and visible acknowledgment when you deliver. You are energized by challenges others consider impossible.",
    general_characteristics:
      "As a Dominant individual, you are naturally driven to control your environment and achieve measurable results. You are bottom-line oriented and prefer substance over small talk. You are competitive and thrive on challenge. You move quickly, make decisions with confidence, and expect others to do the same. You are not bound by tradition or convention — you look forward, not back. You are willing to take risks that others will not. You ask for forgiveness rather than permission. You see yourself as independent, self-reliant, and results-oriented. In a room full of people, you are the one most likely to say 'Let us stop talking and start doing.' This is both your greatest contribution and, at times, your greatest liability. Your directness cuts through confusion and creates momentum. But it can also cut through people's feelings and create resistance.",
    motivated_by:
      "You are motivated by results, recognition, and autonomy. You want clear objectives, the freedom to pursue them your way, and public acknowledgment of your accomplishments. You are driven by competition and the desire to win. You are energized by challenges that others see as impossible. You want to be in control of your own destiny and to chart your own course. Status and title matter to you because they represent achievement and recognition. You are motivated by the opportunity to lead, to decide, and to shape outcomes. You measure yourself by what you have accomplished, not by how people feel about you.",
    ideal_environment:
      "Your ideal environment is one where action is valued over analysis, where results matter more than relationships, where you have autonomy in decision-making, and where performance is recognized. You prefer working with competent people who can keep pace with you. You want clear expectations and the freedom to run your own show. You thrive in high-stakes, competitive environments. You appreciate directness and dislike bureaucracy or unnecessary procedures. You want an environment that moves as fast as you do — where decisions are made quickly, obstacles are removed promptly, and results are celebrated visibly.",
    greatest_fear:
      "Losing control or being taken advantage of. You fear situations where others make decisions for you, where your authority is undermined, or where you are forced to depend on people who do not meet your standards. Appearing weak or vulnerable is deeply uncomfortable for you.",
    under_pressure:
      "When stress escalates, your natural intensity amplifies. You become more demanding, more impatient, and more controlling. You may override others without listening, make rapid decisions without adequate input, and push people harder than the situation warrants. Others may stop offering feedback because they sense you are not open to hearing it — creating a cycle where you have less information at the exact moment you need more. Recognizing this pattern is the first step toward managing it.",
    blind_spots:
      "Your directness can come across as harsh or insensitive to those who are more relationship-focused. Your focus on results can cause you to overlook the impact of your words and actions on others. You may make decisions too quickly without gathering necessary input from people who have important perspectives. You might dismiss people who process information differently as slow or incompetent. Your competitive nature can turn collaboration into competition. You may not give others enough credit for their contributions because you are already focused on the next challenge.",
    value_to_team:
      "You bring clarity, decisiveness, and forward momentum to any team. When the team is stuck, you get it moving. When priorities are unclear, you establish them. When accountability is lacking, you create it. You are willing to make the tough calls that others avoid, and you accept the consequences of those decisions. You set a pace and a standard that elevates everyone around you. Your team may not always love your style, but they know exactly where they stand and what is expected. In high-pressure situations, you are the person people look to for direction and confidence.",
    growth_areas:
      "Practice asking for input before making decisions, even when you feel confident in your direction. Develop the habit of acknowledging people's contributions before moving to the next challenge. Work on moderating your intensity in one-on-one conversations — not every interaction needs to be a performance review. Invest time in relationships that do not have an immediate transactional purpose. Learn to distinguish between urgency and importance. Practice patience with people who process differently than you do — their pace does not indicate their value.",
    do_dont: [
      ["Be direct and specific", "Use vague or indirect language"],
      ["Focus on results and outcomes", "Get caught up in process or feelings"],
      ["Respect their decisiveness", "Question their judgment or authority"],
      ["Give them autonomy", "Micromanage or require approval for every decision"],
      ["Acknowledge their achievements", "Take credit for their work"],
      ["Move at their pace", "Waste time with lengthy meetings or small talk"],
      ["Challenge them with stretch goals", "Coddle them with easy tasks"],
      ["Be efficient with time", "Schedule long, drawn-out conversations"],
    ],
    horse: "Secretariat",
    horse_text:
      "Secretariat did not win by studying the competition. He won by running his own race so decisively that the field became irrelevant. His 31-length victory at the Belmont Stakes was not a strategy — it was an expression of who he was. Like Secretariat, your power comes from an internal engine that does not know how to run at anything less than full speed.",
    communicate_do:
      "Lead with the bottom line. Be clear about what you need. State conclusions first and back them up with data. Respect their time. Be direct about problems and expectations. Acknowledge their results. Challenge them with bigger goals.",
    communicate_dont:
      "Don't bury the lead in background and context. Don't waste their time with lengthy meetings. Don't question their judgment or authority publicly. Don't take credit for their work. Don't be indirect or vague. Don't give them busy work.",
    keywords: [
      ["DECISIVE", "Making firm decisions quickly; having the ability to decide and commit without hesitation"],
      ["DIRECT", "Straightforward and frank; not evasive, ambiguous, or overly diplomatic in communication"],
      ["DRIVEN", "Motivated by results; strongly and vigorously compelled toward goals with relentless intensity"],
      ["FORCEFUL", "Full of conviction and energy; powerful, vigorous, and persuasive in asserting a position"],
      ["RESULTS-ORIENTED", "Focused on achieving measurable outcomes; valuing production, delivery, and tangible progress"],
      ["FAST-PACED", "Moving with speed and urgency; preferring rapid action, quick decisions, and forward momentum"],
      ["COMPETITIVE", "Characterized by the determination to win; driven by rivalry and the desire to outperform"],
      ["COMMANDING", "Exercising natural authority; inspiring obedience and respect through presence and confidence"],
    ],
    communication_style:
      "Your communication style is direct, decisive, and results-focused. You do not waste words. You say what you think and expect others to do the same. You lead with conclusions and support them with facts when necessary. You prefer brief, focused conversations that move toward a decision or action. You become frustrated with small talk, lengthy elaboration, or information that does not advance the objective. You value honesty and directness, even when the message is difficult to hear. You respect people who can keep pace with you intellectually and who can make decisions as quickly as you can.",
    natural_communication:
      "You naturally communicate with authority and confidence. Your words carry weight because you sound certain of what you are saying. You use language that is forceful and commanding. You ask questions to understand what is needed, then provide clear direction or recommendations. You do not hedge or qualify your statements unnecessarily. You are not concerned with being liked in conversation; you are concerned with being effective and moving things forward. In group settings, you tend to dominate the conversation — not out of ego, but out of impatience with inefficiency.",
    leadership_strengths: [
      ["DECISIVENESS", "You make tough calls when others hesitate, providing clear direction when it is needed most. In moments of uncertainty, your willingness to decide — and to own the consequences — gives your team a path forward."],
      ["ACCOUNTABILITY", "You hold yourself and others to high standards and follow through on commitments relentlessly. People know that when you say something will happen, it will happen. This creates trust through reliability."],
      ["CONFIDENCE", "Your self-assurance inspires confidence in others and motivates them to reach beyond their comfort zones. In difficult moments, your calm certainty becomes the team's anchor."],
      ["VISION", "You see the destination clearly and communicate it with conviction. You inspire others to move toward it with purpose and urgency, creating a shared sense of direction and momentum."],
      ["RESULTS DELIVERY", "You consistently achieve objectives through unwavering focus, intensity, and relentless execution. When results matter — and they always do — you are the person who delivers."],
      ["COMPETITIVE DRIVE", "You set ambitious goals and motivate others to reach beyond what they thought possible. Your refusal to accept mediocrity raises the bar for everyone around you."],
    ],
    work_style:
      "At work, you are action-oriented and goal-driven. You focus on the bottom line and push yourself and others to deliver measurable results. You do not get bogged down in process, procedure, or politics. You see obstacles as challenges to overcome, not reasons to slow down. You are comfortable with risk and change when it moves you toward your goal. You prefer to lead rather than follow, and you are not bound by the way things have always been done. You challenge the status quo and drive change. You can seem impatient with details or with people who move at a pace slower than yours. In meetings, you want to get to the point, make a decision, and move on. You value competence above all else and have little patience for people who do not pull their weight.",
    know_yourself:
      "Your strength is your ability to cut through complexity and drive action. You see what needs to happen and you make it happen. Your directness creates clarity. Your decisiveness creates momentum. Your confidence creates trust. However, be aware that your direct style can feel harsh to those who process more slowly or who need more relational warmth. Just because someone does not push back does not mean they agree — they may be intimidated, confused, or hurt. Ask questions and listen to the answers, not just to gather information but to understand the impact you are having on others.",
    grow_yourself:
      "Growth for you comes from slowing down enough to bring people with you. Your drive to move forward is immensely valuable, but people matter — and their engagement determines whether your results are sustainable or temporary. Practice asking for input before deciding. Practice patience with people who need more time to process. Practice acknowledging contributions, not just celebrating results. When you invest in relationships, you become a more complete leader. Now learn to drive results with a team that genuinely wants to follow you, not one that simply fears being left behind.",
    professional_description:
      "In professional settings, the Dominant style brings leadership, decisiveness, and an unwavering results orientation. You are naturally suited to roles that require taking charge, making tough decisions, and driving change in the face of resistance. You excel in competitive environments where clear goals and measurable results are the primary currency. You are comfortable with pressure and perform at your best when the stakes are highest.",
    professional_categories: {
      "Leadership & Authority": [
        "Takes charge naturally in any group or organizational setting",
        "Prefers leading over following — authority feels natural, not burdensome",
        "Pushes self and others to higher standards of performance",
      ],
      "Decision-Making & Action": [
        "Makes quick, confident decisions even with incomplete information",
        "Moves at a fast pace and expects others to match that tempo",
        "Comfortable with risk, change, and ambiguity when it drives progress",
      ],
      "Results & Competition": [
        "Focuses relentlessly on the bottom line and measurable results",
        "Competitive and determined to win in every meaningful endeavor",
        "Believes results speak louder than intentions or processes",
      ],
      "Communication & Change": [
        "Direct in communication, feedback, and expectations — no sugar-coating",
        "Challenges the status quo and established ways of doing things",
        "Not bound by tradition or 'the way we have always done it'",
      ],
    },
    professional_roles: [
      "Executive Leadership & C-Suite",
      "Entrepreneurship & Business Ownership",
      "Sales Leadership & Revenue Strategy",
      "Crisis Management & Turnaround",
      "Operations & Project Management",
      "Negotiations & Deal-Making",
    ],
    professional_environment:
      "You thrive in fast-paced, results-driven environments with clear metrics, competitive benchmarks, and the autonomy to make decisions without excessive bureaucracy. Open floor plans with quick access to decision-makers, minimal red tape, and visible scoreboards that track performance fuel your best work. You are at your worst in slow, consensus-heavy cultures where every decision requires committee approval.",
    colleague_experience:
      "Colleagues experience you as a decisive, high-energy leader who cuts through ambiguity and drives action. They respect your ability to make tough calls under pressure and your willingness to take ownership of outcomes. They may sometimes feel steamrolled by your pace or perceive your directness as blunt. Team members who value efficiency and results thrive alongside you; those who need more processing time or relational warmth may find your style intense. At your best, you are the person everyone turns to when the stakes are high and someone needs to take charge.",
  },

  I: {
    name: "Influencing",
    letter: "I",
    tagline: "The Enthusiastic Connector",
    narrative:
      "You are wired to connect with people and inspire enthusiasm. You naturally see possibilities and you energize others with your optimism and warmth. You prefer to influence rather than control, and you build coalitions through genuine warmth and personal charisma. You remember people's names, you ask about their lives, and you genuinely want them to succeed. You are not bound by details — the big picture excites you. Your pace is fast, your optimism is infectious, and your ability to motivate others is one of your most powerful gifts. In any room, you are the person who makes others feel welcome, valued, and excited about what is possible. Your energy is magnetic, and people are drawn to you naturally because you make them feel good about themselves and about the future.",
    communication:
      "Warm and enthusiastic. You tell stories well and you remember details about people that matter to them. You communicate with emotion and energy. You are naturally intuitive about what people want to hear and how to deliver it. You sometimes gloss over details because the vision is so clear to you. You are animated and expressive, using gesture, tone, and facial expression to bring your words to life.",
    strengths:
      "You inspire people and build genuine relationships. You are naturally charismatic and motivating. You see opportunities that others miss. You adapt your approach based on who you are talking to. You generate enthusiasm and positive energy that lifts entire teams. You build trust quickly through warmth and genuine interest in others.",
    risk: "Your focus on people can mean that tasks or deadlines slip. You may over-commit because you do not want to disappoint anyone. You can talk more than you listen. You may avoid conflict or difficult conversations to preserve harmony. Your optimism can blind you to real problems that need attention.",
    motivation:
      "Recognition, belonging, positive relationships, and the chance to influence and inspire others. You want to be liked, appreciated, and part of a winning team where your contributions are visible and valued.",
    general_characteristics:
      "As an Influencing individual, you are driven by people, relationships, and the future. You see possibilities where others see obstacles. You are optimistic, enthusiastic, and energetic. You prefer collaboration to competition and win-win outcomes to zero-sum results. You are naturally gifted at reading people and adapting your approach accordingly. You remember personal details and you care about how people feel. You are not comfortable being alone or working in isolation. You need people, and people are drawn to you. You talk readily and listen selectively. You see the big picture clearly but sometimes miss the details. You are spontaneous and free-spirited, preferring flexibility to rigid structure. You make decisions based on how you feel and what you think others will think, not on hard analysis.",
    motivated_by:
      "You are motivated by positive relationships, recognition, and the opportunity to influence and inspire others. You want to belong and to be liked. You are driven by the desire to build coalitions and create win-win outcomes. Status and visibility matter to you because they represent recognition and social proof. You want your work to be noticed and appreciated. You are motivated by the chance to grow relationships, explore new possibilities, and make a positive impact on people's lives. You measure yourself by the relationships you have built and the positive influence you have had.",
    ideal_environment:
      "Your ideal environment is one where people are valued, collaboration is encouraged, and individual contributions are recognized. You thrive in social, interactive settings with engaging people and inspiring vision. You prefer work that allows you to connect with others, influence outcomes, and see the impact of your efforts. You want an environment that is upbeat, supportive, and fun. You appreciate leaders who are visible and accessible. You dislike isolation, rejection, and environments that are cold, political, or cutthroat. You want to feel part of something bigger than yourself, and you want your role in that something to be appreciated.",
    greatest_fear:
      "Rejection, being left out, or feeling unimportant. You fear that others will not like you, that you will not be included in important conversations or decisions, or that your contributions will go unnoticed and unappreciated. Being excluded or criticized is one of your deepest fears.",
    under_pressure:
      "When stress escalates, your natural enthusiasm can become manic. You talk more, listen less, and make promises you cannot keep. You may avoid dealing with difficult realities by focusing on exciting possibilities. You seek reassurance and approval from others, and your mood becomes overly dependent on their feedback. You may become disorganized and scattered, losing track of important details and commitments. You might use charm to deflect rather than to engage honestly with the real problem.",
    blind_spots:
      "Your enthusiasm can cause you to gloss over important details and realistic risks. Your desire to be liked can prevent you from giving people the honest feedback they need. You may make commitments without fully thinking through the implications. Your optimism can prevent you from seeing real problems until they are critical. You might talk so much that you fail to hear what others are really saying. Your need for recognition can lead you to self-promote in ways that alienate others. You may struggle with follow-through, creating a perception that you are all talk and no action.",
    value_to_team:
      "You bring energy, optimism, and genuine connection to any team. When morale is low, you lift it. When people feel disconnected, you bring them together. You inspire people to care about outcomes beyond their individual tasks. You build relationships that create loyalty and commitment. You help people see possibilities they did not see before. You make work feel less like work and more like a shared mission. Your team may sometimes feel you are not serious enough or detail-focused enough, but they never doubt that you genuinely care about them and their success.",
    growth_areas:
      "Practice following through on your commitments with the same energy you bring to making them. Develop systems and accountability structures that ensure you deliver. Work on listening more than talking, even though silence feels uncomfortable. Learn to hear critical feedback as helpful rather than personal rejection. Develop the discipline to focus on details and quality, not just the big picture and energy. Practice having difficult conversations rather than avoiding them. Learn to balance your optimism with realistic assessment of risks and obstacles.",
    do_dont: [
      ["Build personal connections first", "Rush into business without relationship-building"],
      ["Share your enthusiasm and ideas freely", "Dampen their energy or dismiss their ideas"],
      ["Give them opportunities to shine", "Ignore their contributions or take credit for their work"],
      ["Create fun and team energy", "Treat work as purely transactional or serious"],
      ["Allow flexibility and adaptability", "Impose rigid structure or bureaucratic processes"],
      ["Recognize their contributions publicly", "Fail to acknowledge their impact"],
      ["Engage them in big-picture vision", "Overwhelm them with details and procedures"],
      ["Be genuine and warm", "Be cold, critical, or dismissive"],
    ],
    horse: "Citation",
    horse_text:
      "Citation won through heart and will as much as through speed and talent. He inspired his jockey, his handlers, and everyone who watched him. He was not the fastest horse on the track, but he was the most beloved. Like Citation, your greatest power is not your IQ but your ability to inspire others to give their best effort. When people care about you, they will run through walls for you.",
    communicate_do:
      "Paint the big picture and the exciting possibilities. Share personal stories and make it about people, not just tasks. Give them public recognition. Make them feel like they are part of something special. Allow flexibility and spontaneity. Be warm, genuine, and interested in who they are as people.",
    communicate_dont:
      "Don't lead with data, analysis, or details. Don't criticize them publicly or focus on what they did wrong. Don't make it purely transactional or task-focused. Don't be cold, distant, or purely business-like. Don't tie them down with rigid structure or processes. Don't forget to ask how they are doing beyond work.",
    keywords: [
      ["ENTHUSIASTIC", "Having intense and eager enjoyment, interest, or approval; expressing lively and energetic interest"],
      ["CHARISMATIC", "Exercising a compelling charm that inspires devotion and enthusiasm in others"],
      ["INSPIRING", "Having the effect of motivating someone; generating enthusiasm and energy in those around you"],
      ["OPTIMISTIC", "Hopeful and confident about the future; expecting favorable outcomes even in difficult times"],
      ["EXPRESSIVE", "Effectively conveying thoughts and feelings; using animated gestures, tone, and words"],
      ["PERSONABLE", "Friendly and easy to get along with; having a pleasant and agreeable manner"],
      ["PERSUASIVE", "Good at convincing others to do or believe something through appeal and personal charm"],
      ["SPONTANEOUS", "Acting on natural feeling without effort or premeditation; unplanned and unrehearsed"],
    ],
    communication_style:
      "Your communication style is warm, enthusiastic, and relationship-focused. You tell stories well and remember details about people that matter to them. You use emotion, tone, and energy to bring your words to life. You are intuitive about what people want to hear and how to say it in a way that resonates. You connect with people quickly and naturally. You are comfortable with emotion in conversations and you express yourself freely. You prefer dynamic, interactive communication to formal presentations. You speak to move people, not just to convey information.",
    natural_communication:
      "You naturally communicate with warmth, energy, and genuine interest in people. Your words are animated and your expressions are animated. You laugh easily and often. You ask people questions about themselves and you genuinely listen to the answers. You remember personal details and you reference them later, making people feel seen and valued. You tell stories that illustrate points and connect on an emotional level. You adapt your communication style based on your audience — you instinctively know what will resonate with different people. In group settings, you are often the one who energizes the conversation and makes people feel welcome.",
    leadership_strengths: [
      ["INSPIRATION", "You motivate others to reach beyond their self-imposed limits and to commit to shared goals. Your energy and optimism create belief in what is possible."],
      ["RELATIONSHIP BUILDING", "You create genuine connections that build loyalty and commitment. People follow you because they trust you and want your approval, not because they fear your authority."],
      ["COMMUNICATION", "You make complex ideas accessible and exciting. You tell stories that stick and you communicate with a clarity and energy that holds people's attention."],
      ["OPTIMISM", "You see possibilities where others see obstacles. Your belief in what can be achieved becomes a self-fulfilling prophecy that lifts entire teams."],
      ["ADAPTABILITY", "You read people and situations intuitively and adjust your approach accordingly. You can connect with anyone and find common ground with diverse personalities."],
      ["COALITION BUILDING", "You naturally build coalitions and win buy-in for your ideas. People want to follow you and they want to be part of your team."],
    ],
    work_style:
      "At work, you are collaborative, creative, and focused on possibilities. You enjoy working with people and you bring energy and enthusiasm to every project. You are not afraid of big, ambitious goals — in fact, you are energized by them. You focus on the future and what could be, not on what is or what has been. You are adaptable and flexible, preferring to improvise rather than follow a rigid plan. You may struggle with boring or routine work and with environments that are cold or politics-heavy. You bring optimism to difficult situations and you help your team maintain perspective and hope. You connect your work to higher purpose and you inspire others to care about outcomes beyond their individual tasks.",
    know_yourself:
      "Your strength is your ability to inspire people and build genuine connections. Your optimism and enthusiasm lift entire teams. Your warmth makes people feel valued and cared for. Your adaptability allows you to connect with anyone. However, be aware that your strength in seeing possibilities can become a weakness when it prevents you from acknowledging real risks and problems. Your enthusiasm can run ahead of your follow-through, creating a perception that you do not deliver. Your need to be liked can prevent you from having the difficult conversations that your team needs. Your tendency to talk can prevent you from hearing what others are really saying.",
    grow_yourself:
      "Growth for you comes from developing discipline and follow-through to match your inspiring vision. Your ability to start things is extraordinary; now develop the ability to finish them. Match your word with your action. Create systems and accountability structures that ensure you deliver on your commitments. Practice silence and deep listening — these are more powerful than your words. Develop the courage to have difficult conversations and to give people honest feedback. Learn to balance your natural optimism with realistic assessment of risks. Your enthusiasm is a gift; now pair it with execution and accountability.",
    professional_description:
      "In professional settings, the Influencing style brings vision, energy, and people-centered leadership. You are naturally suited to roles that require building relationships, inspiring teams, and communicating vision. You excel in environments where collaboration is valued and where individual contributions are recognized. You are comfortable in the spotlight and you perform at your best when you are in front of people.",
    professional_categories: {
      "Relationship & People Development": [
        "Naturally builds rapport and trust with a wide variety of people",
        "Energizes teams and creates positive team culture and morale",
        "Focuses on developing people and helping others succeed",
      ],
      "Vision & Communication": [
        "Sees the big picture and exciting possibilities for the future",
        "Communicates vision in ways that inspire and motivate others",
        "Tells compelling stories that connect emotionally with audiences",
      ],
      "Persuasion & Influence": [
        "Builds coalitions and gains buy-in for ideas and initiatives",
        "Persuades and influences through personal warmth and credibility",
        "Adapts communication style to resonate with different audiences",
      ],
      "Collaboration & Flexibility": [
        "Prefers collaborative, team-based approaches to solo work",
        "Adapts flexibly to changing circumstances and new opportunities",
        "Brings creativity and innovation to problem-solving",
      ],
    },
    professional_roles: [
      "Sales & Business Development",
      "Marketing & Brand Leadership",
      "Team Leadership & People Management",
      "Public Relations & Communications",
      "Entrepreneurship & Growth Leadership",
      "Change Management & Transformation",
    ],
    professional_environment:
      "You thrive in dynamic, people-focused environments with visible leadership, collaborative teams, and clear paths for advancement and recognition. Flexible structures that allow for creativity and spontaneity fuel your best work. You are at your worst in highly formal, procedure-heavy cultures where conformity is valued over innovation and where individual contributions are not recognized.",
    colleague_experience:
      "Colleagues experience you as a warm, energetic, and genuinely interested leader who brings optimism and positive energy to every interaction. They appreciate your ability to see their potential and to motivate them toward higher performance. They may sometimes feel that you are not detail-focused enough or that you over-promise and under-deliver. Team members who value relationships and possibilities thrive alongside you; those who prefer structure and accountability may find your style scattered. At your best, you are the person who helps a team fall in love with what they are building together.",
  },

  S: {
    name: "Steady",
    letter: "S",
    tagline: "The Reliable Team Player",
    narrative:
      "You are wired for stability and harmony. In any situation, you naturally focus on relationships and maintaining balance. You prefer to support rather than lead, and you move toward helping others succeed. You are patient, loyal, and focused on doing the right thing. You see your role as creating stability and support that allows others to do their best work. Your pace is steady, your commitment is deep, and your tolerance for abrupt change is low. When others are rushing into action, you are making sure the foundation is sound. You bring consistency, reliability, and a calm presence that stabilizes teams under pressure. People know they can count on you because you follow through on your commitments, and you care deeply about the people you work with.",
    communication:
      "Patient and supportive. You listen well and you remember what people tell you. You communicate with warmth and genuine interest in the other person. You ask clarifying questions and you give people time to explain. You avoid confrontation and you work hard to find solutions that do not hurt anyone. You may not speak up as readily as others because you are listening more than talking.",
    strengths:
      "You follow through on your commitments. You support others generously and without seeking recognition. You maintain stable, trustworthy relationships over time. You keep teams stable and focused when change is happening. You are patient with people and you give them the time they need. You bring calm and perspective to stressful situations.",
    risk: "Your desire for stability can lead you to resist needed change. You may avoid conflict until it becomes critical. You can underestimate your own value and contribution. Your patience can turn into passivity. You may tolerate poor treatment because you do not want to rock the boat.",
    motivation:
      "Stable relationships, clear expectations, meaningful work, and the opportunity to help others succeed. You want to feel part of a team and to know that your contributions are valued. You are motivated by loyalty and by the chance to make a positive difference in people's lives.",
    general_characteristics:
      "As a Steady individual, you are driven by relationships, stability, and service to others. You value loyalty and you build deep, lasting relationships. You are dependable and consistent. You follow through on your commitments, even when it is difficult or inconvenient. You are not ambitious in the traditional sense — you do not need recognition or status. You simply want to do a good job and to be part of a team that functions well. You are comfortable following others and you do not naturally seek authority or the spotlight. You are patient and willing to listen. You adapt to change when you understand why it is necessary, but you naturally resist sudden or unexplained change. You are sincere and genuine — you do not have hidden agendas and you expect others to be the same.",
    motivated_by:
      "You are motivated by stable relationships, clear expectations, and the opportunity to help others succeed. You want to be part of a team that functions well and where people care about each other. You are driven by loyalty — once you commit to someone or something, you commit deeply. You are motivated by meaningful work that makes a positive difference. Status and recognition are not primary drivers for you, but you do want to know that your efforts are appreciated. You measure yourself by your reliability and by the loyalty you show to people and organizations.",
    ideal_environment:
      "Your ideal environment is one where relationships are valued, where change is managed carefully with explanation and support, and where you know what is expected. You thrive in stable, team-based environments with clear processes and consistent leadership. You prefer working with people you know and trust. You want an environment where loyalty is rewarded and where people are treated with respect. You appreciate leaders who are accessible, consistent, and genuinely interested in your wellbeing. You dislike sudden change without explanation, conflict, and cutthroat competition. You want to feel part of a family, not just an employee.",
    greatest_fear:
      "Sudden change, conflict, and abandonment. You fear that things will change without warning and without your understanding. You fear conflict because it threatens the harmony you value. You fear being left alone or abandoned by people you have come to rely on. Losing relationships is one of your deepest fears.",
    under_pressure:
      "When stress escalates, you tend to withdraw and internalize your stress rather than address it directly. You may become passive-aggressive, complying outwardly while resisting inwardly. You may take on additional burdens rather than pushing back, leading to burnout. You seek reassurance and support from others, but you may be reluctant to ask for what you need. You might become stubborn and resistant to change, holding onto familiar patterns even when they are no longer serving you.",
    blind_spots:
      "Your patience can become complacency, causing you to accept situations that should be changed. Your desire for harmony can prevent you from addressing real problems and conflicts. Your loyalty can be misplaced, causing you to support people or organizations that do not deserve your commitment. You may underestimate your own value and take on more than your fair share of work. Your resistance to change can prevent you from growing and developing new skills. You might assume others feel the same way you do about loyalty and commitment, leading to disappointment when they do not.",
    value_to_team:
      "You bring stability, reliability, and genuine care to any team. When chaos emerges, you maintain perspective and calm. When people are struggling, you offer support without judgment. When commitments need to be kept, you are the one who keeps them. You build team cohesion through your genuine interest in people and your willingness to support their success. Your team knows they can count on you, and they trust you because you are consistent and reliable. In times of change, you help people adjust and maintain continuity of purpose. Your presence is stabilizing and your commitment is unwavering.",
    growth_areas:
      "Practice advocating for yourself and voicing your opinions, even when it might create temporary discomfort. Develop the courage to address issues head-on rather than avoiding them. Learn to balance loyalty with honest assessment — sometimes the most supportive thing you can do is to tell someone they need to change. Work on developing new skills and taking on new challenges, even though they are uncomfortable. Practice speaking up in meetings and contributing your perspective. Learn to distinguish between healthy relationships that deserve your commitment and unhealthy ones that do not.",
    do_dont: [
      ["Build genuine relationships first", "Rush into task-focused work without building rapport"],
      ["Give them time and space", "Push them for rapid change or quick decisions"],
      ["Create stable, predictable environments", "Create sudden changes without explanation"],
      ["Acknowledge their consistency and reliability", "Ignore their contributions or overlook their hard work"],
      ["Allow time for processing and adjustment", "Force quick adaptation to new situations"],
      ["Work toward consensus and harmony", "Create conflict or pit people against each other"],
      ["Show genuine interest in their wellbeing", "Treat them as just another task or resource"],
      ["Provide clear expectations and processes", "Leave them uncertain about what is expected"],
    ],
    horse: "War Admiral",
    horse_text:
      "War Admiral was not the fastest horse in the field, but he was the most reliable. He was a working horse who showed up and delivered, day after day, in consistent fashion. He was the foundation that everything else was built on. Like War Admiral, your greatest value is not your flash and style but your reliability. You are the foundation that everything else is built on. Without you, nothing else works.",
    communicate_do:
      "Take time to build the relationship first. Give them clear expectations and processes. Provide reassurance that their contributions are valued. Acknowledge their loyalty and follow-through. Allow time for processing and adjustment. Be genuine and sincere. Check in on how they are doing beyond just work.",
    communicate_dont:
      "Don't push for rapid change without explanation. Don't create conflict or put them in the middle of battles. Don't ignore their work or overlook their contributions. Don't treat them as just another task or resource. Don't create sudden, unexplained changes. Don't be insincere or hide your true thoughts.",
    keywords: [
      ["LOYAL", "Faithful and devoted to a person, organization, or cause; standing by commitments through difficulty"],
      ["RELIABLE", "Consistently good in quality or performance; able to be trusted and depended upon"],
      ["STEADY", "Firmly fixed, supported, or balanced; not faltering, wavering, or changing course"],
      ["SUPPORTIVE", "Providing encouragement, assistance, and emotional backing to others in their endeavors"],
      ["PATIENT", "Able to accept or tolerate delays, problems, or suffering without becoming annoyed or anxious"],
      ["SINCERE", "Free from pretense or deceit; proceeding from genuine feelings and honest intentions"],
      ["TEAM-ORIENTED", "Preferring to work as part of a group; valuing collaboration over individual achievement"],
      ["CONSISTENT", "Unchanging in achievement, behavior, or effect over time; reliable and predictable"],
    ],
    communication_style:
      "Your communication style is warm, patient, and relationship-focused. You listen more than you talk. You give people time to express themselves fully. You communicate with genuine interest in understanding their perspective and their feelings. You are sincere and you do not have hidden agendas. You prefer private conversations to public displays. You adapt your communication to the person you are talking to, taking into account their pace and their comfort level. You prefer depth of connection to breadth of interaction.",
    natural_communication:
      "You naturally communicate with warmth, patience, and genuine interest in people. You ask questions and you listen carefully to the answers. You remember personal details and you reference them later. You do not rush to conclusions or interrupt. You give people time to think and respond. You are comfortable with silence and you do not feel the need to fill it with chatter. You communicate to build understanding and connection, not to convince or control. Your tone is warm and your words are gentle. In group settings, you tend to listen more than talk, but when you do speak, people listen because they know you have thought carefully about what you want to say.",
    leadership_strengths: [
      ["STABILITY", "You create calm and predictability in uncertain situations. Your steady presence reassures people and creates the foundation for others to do their best work."],
      ["RELIABILITY", "You follow through on every commitment, without exception. People know that when you say something will happen, it will happen. This creates trust and confidence."],
      ["LOYALTY", "You stand by people and organizations through difficulty. Your commitment does not depend on current conditions or personal benefit. This builds deep trust and attachment."],
      ["EMPATHY", "You genuinely care about how people feel. You listen with your full attention and you work to understand their perspective. This creates psychological safety on your team."],
      ["PATIENCE", "You give people the time and space they need to do their best work. You do not push for quick results at the expense of quality or relationships."],
      ["TEAM COHESION", "You naturally create team cohesion through your genuine interest in people and your willingness to support their success. You bring people together."],
    ],
    work_style:
      "At work, you are collaborative, supportive, and focused on relationships. You prefer working as part of a team to working alone. You are detail-oriented and you follow procedures carefully. You do your work well and you follow through on your commitments. You are not naturally ambitious or competitive, but you take pride in doing good work. You provide support to your teammates without seeking recognition. You may not speak up readily in meetings because you are listening and observing. You adapt to change when you understand the reasons, but you naturally prefer consistency and stability. You bring a steady, reliable presence that stabilizes teams under pressure. You are the person who keeps the team functioning smoothly even when conditions are difficult.",
    know_yourself:
      "Your strength is your reliability and your ability to maintain stable, trustworthy relationships. Your patience and genuine care for others create psychological safety. Your consistency creates predictability and trust. Your follow-through is exceptional. However, be aware that your tendency to avoid conflict can prevent you from addressing issues that need to be addressed. Your patience can become passivity. Your loyalty can be misplaced. Your resistance to change can prevent you from growing. Your tendency to underestimate your own value can lead to burnout. You are more valuable than you realize, and sometimes the most supportive thing you can do is to speak up and advocate for what you believe in.",
    grow_yourself:
      "Growth for you comes from finding your voice and having the courage to use it. You have valuable perspectives and insights that your team needs to hear. Practice speaking up in meetings. Practice voicing your opinions, even when they might create temporary discomfort. Practice addressing issues directly rather than avoiding them. Develop the courage to push back when you disagree. Learn to advocate for yourself as generously as you advocate for others. You do not have to become aggressive or competitive, but you do need to develop a stronger voice. When you combine your natural loyalty and care with a stronger voice and willingness to advocate, you become a complete leader.",
    professional_description:
      "In professional settings, the Steady style brings stability, reliability, and people-centered support. You are naturally suited to roles that require maintaining consistency, supporting others, and ensuring quality and follow-through. You excel in team-based environments where collaboration is valued and where individual contributions are recognized. You are comfortable in supporting roles and you perform at your best when you know that your work is making a positive difference.",
    professional_categories: {
      "Relationship & Support": [
        "Genuinely cares about people's wellbeing and success",
        "Provides consistent, reliable support without seeking recognition",
        "Creates team cohesion through genuine interest in people",
      ],
      "Stability & Consistency": [
        "Maintains consistency and stability through change",
        "Follows procedures carefully and maintains quality",
        "Creates predictability and reliable processes",
      ],
      "Loyalty & Commitment": [
        "Demonstrates deep, unwavering loyalty to people and organizations",
        "Honors commitments and follows through without exception",
        "Stands by people through difficulty",
      ],
      "Listening & Understanding": [
        "Listens with full attention and seeks to understand perspective",
        "Asks clarifying questions and validates others' feelings",
        "Focuses on understanding before responding",
      ],
    },
    professional_roles: [
      "Team Management & Leadership",
      "Customer Success & Service",
      "Human Resources & People Development",
      "Project Coordination & Administration",
      "Relationship Management & Partnership",
      "Training & Mentoring",
    ],
    professional_environment:
      "You thrive in stable, team-based environments with clear processes, consistent leadership, and a strong sense of community. Flexible approaches to change that include explanation and support fuel your best work. You are at your worst in highly competitive, cutthroat cultures where rapid change is constant and where loyalty is not valued. You need to feel part of a team and to know that your contributions are appreciated.",
    colleague_experience:
      "Colleagues experience you as a warm, supportive, and genuinely interested team member who can be counted on without question. They appreciate your loyalty and your willingness to help without seeking recognition. They may sometimes feel that you are not speaking up enough or that you are letting people take advantage of your generosity. Team members who value relationships and stability thrive alongside you; those who are highly competitive or driven by individual achievement may not understand your collaborative approach. At your best, you are the glue that holds teams together through change and difficulty.",
  },

  C: {
    name: "Compliant",
    letter: "C",
    tagline: "The Quality-Focused Expert",
    narrative:
      "You are wired to do things correctly and to maintain high standards. In any situation, you naturally focus on accuracy, quality, and following the established rules. You prefer to work systematically and carefully, and you move toward problems with a detective's focus on facts and evidence. You are thoughtful, analytical, and focused on getting it right. You see your role as ensuring quality and preventing mistakes that could have serious consequences. Your pace is careful, your standards are high, and your tolerance for vagueness or shortcuts is low. When others are rushing forward, you are making sure the foundation is solid and the details are correct. You bring precision, expertise, and a commitment to quality that protects organizations from costly mistakes. People know that when you endorse something, it has been thoroughly vetted and verified.",
    communication:
      "Precise and logical. You communicate with facts and data. You are structured and organized in how you present information. You ask detailed questions and you expect clear, specific answers. You may seem distant or cold because you focus on the facts rather than on relationships. You communicate to inform and to ensure accuracy, not to build rapport.",
    strengths:
      "You produce high-quality work consistently. You catch errors and problems that others miss. You think systematically and you see patterns. You develop deep expertise in your domain. You are thorough and nothing important escapes your attention. You follow through on commitments with careful attention to detail.",
    risk: "Your drive for perfection can create delays and prevent progress. You may focus on problems so much that you overlook what is going well. You can come across as critical or judgmental. Your anxiety about mistakes can lead to over-analysis and paralysis. Your high standards can be isolating if you expect others to meet them without support.",
    motivation:
      "Accuracy, expertise, quality, and the opportunity to prevent problems through careful analysis. You want clear standards, sufficient time to do the work right, and the respect that comes from being recognized as an expert. You are motivated by the chance to contribute something of lasting quality.",
    general_characteristics:
      "As a Compliant individual, you are driven by accuracy, quality, and doing things correctly. You are thoughtful, analytical, and systematic. You follow rules and procedures carefully. You are not comfortable with ambiguity or shortcuts. You prefer to have all the information before making a decision. You are naturally skeptical and you question claims until they are backed up by evidence. You are not naturally comfortable with people or with being the center of attention. You prefer working alone or in small groups where you can focus on the task. You are reserved and controlled in your emotions and expressions. You are perfectionistic and you set high standards for yourself and others. You see what is wrong more readily than you see what is right. You are conscientious and you take your responsibilities seriously.",
    motivated_by:
      "You are motivated by accuracy, quality, and expertise. You want clear standards and sufficient time to meet them. You are driven by the desire to prevent problems and to ensure that important things are done correctly. Status and recognition are less important to you than respect for your expertise and the quality of your work. You want your contributions to be noticed and valued, but more important is that your work meets the highest standards. You measure yourself by the quality of what you produce and by your reputation for expertise and reliability.",
    ideal_environment:
      "Your ideal environment is one where quality is valued, where clear standards are established, and where you have sufficient time to do work properly. You thrive in structured environments with clear processes, logical systems, and minimal change or ambiguity. You prefer working on complex problems that require deep analysis and thinking. You want an environment where expertise is respected and where emotions do not cloud decision-making. You appreciate leaders who are logical, fair, and consistent. You dislike environments that are chaotic, where decisions are made quickly without sufficient data, or where quality is sacrificed for speed.",
    greatest_fear:
      "Being wrong, making a mistake that has serious consequences, or being incompetent. You fear situations where you do not have enough information to decide, where you are asked to compromise quality, or where you are judged as inadequate. Being criticized for poor work is one of your deepest fears.",
    under_pressure:
      "When stress escalates, your analytical mind works overtime trying to identify every possible problem and prepare for every contingency. You become more anxious, more focused on what could go wrong, and less open to new input or alternatives. You may become withdrawn and defensive, resistant to criticism or suggestions from others. You may focus so much on preventing problems that you prevent any action at all. You may become rigid in your thinking, unable to see alternatives or to adapt to changing circumstances.",
    blind_spots:
      "Your drive for perfection can prevent progress and create analysis paralysis. Your focus on problems can cause you to overlook accomplishments and strengths. Your skepticism can prevent you from embracing new ideas or approaches. Your need for complete information can prevent you from deciding and acting when the time calls for it. Your high standards can be isolating if you fail to help others understand what you expect. Your tendency to withdraw can prevent you from building relationships that could support you. You may come across as overly critical or judgmental, even when you are not intending to be.",
    value_to_team:
      "You bring quality, thoroughness, and expertise to any team. When the team is about to make a mistake, you are the one who catches it. When quality matters, you are the one who ensures it. When complex problems need solving, you are the one who works through them systematically. You protect the organization from costly mistakes through your careful analysis and high standards. Your team may sometimes feel that you are too focused on problems or moving too slowly, but they know that when you have signed off on something, it is solid. In critical situations where quality determines success, you are invaluable.",
    growth_areas:
      "Practice distinguishing between situations that require perfection and those where good enough truly is good enough. Develop the ability to make decisions with incomplete information and to move forward even when you are not 100 percent certain. Work on giving credit and recognition to others, even when you see areas for improvement. Learn to balance criticism with acknowledgment of what is working well. Practice building relationships and working collaboratively, even though you are more comfortable alone. Develop the ability to adapt and try new approaches rather than defending the status quo. Learn to see your high standards as a gift that you can share rather than as a burden you carry alone.",
    do_dont: [
      ["Appreciate their expertise and ask for their input", "Dismiss their concerns or ignore their analysis"],
      ["Provide clear standards and expectations", "Leave them uncertain about what quality looks like"],
      ["Give them time to think deeply", "Push for quick decisions without sufficient information"],
      ["Respect their need for logical analysis", "Ask them to rely on intuition or feelings"],
      ["Acknowledge the quality of their work", "Focus only on problems or what could be improved"],
      ["Set realistic deadlines", "Rush them or impose artificial time pressure"],
      ["Allow them to work on high-stakes, important problems", "Treat their work as routine or unimportant"],
      ["Be precise and logical in your communication", "Be vague or emotional in how you express yourself"],
    ],
    horse: "Man O' War",
    horse_text:
      "Man O' War was not just a fast horse — he was a perfectly engineered, meticulously trained athlete who was studied and analyzed in every detail. Every aspect of his performance was optimized. He set records that stood for years. Like Man O' War, your power comes from your commitment to excellence in every detail. You do not settle for good enough. You build things that last and perform at the highest level.",
    communicate_do:
      "Lead with data and facts. Be precise and logical. Provide clear standards and expectations. Give them time to think through problems. Acknowledge the quality of their work. Ask for their analysis and expertise. Respect their need for accuracy and thoroughness.",
    communicate_dont:
      "Don't be vague or emotional. Don't ask them to move quickly without sufficient information. Don't dismiss their concerns or analysis. Don't overlook the quality of their work. Don't ask them to compromise on quality. Don't be illogical or inconsistent. Don't make decisions without consulting their expertise.",
    keywords: [
      ["ACCURATE", "Free from error; correct and precise in detail, measurement, and expression"],
      ["ANALYTICAL", "Using analysis or logical reasoning; separating things into component parts for examination"],
      ["THOROUGH", "Complete with regard to every detail; not superficial, partial, or careless"],
      ["SYSTEMATIC", "Done or acting according to a fixed plan or system; methodical and organized"],
      ["PRECISE", "Marked by exactness and accuracy of expression or detail; strictly correct"],
      ["QUALITY-FOCUSED", "Committed to excellence and high standards in all work and output"],
      ["EXPERT", "Having or involving authoritative knowledge; deeply skilled in a particular field or domain"],
      ["OBJECTIVE", "Not influenced by personal feelings or opinions; considering facts impartially"],
    ],
    communication_style:
      "Your communication style is precise, logical, and structured. You communicate with facts and data. You are organized in how you present information. You ask detailed questions and you expect specific, accurate answers. You focus on accuracy and completeness of information. You prefer written communication to verbal, as it allows for precision and provides a record. You communicate to inform and to ensure accuracy, not to build rapport or to convince. You are reserved in your expression of emotion or enthusiasm.",
    natural_communication:
      "You naturally communicate with precision, logic, and careful thought. You do not waste words. Every word you use is chosen carefully to convey exact meaning. You ask thoughtful questions that dig into important details. You listen carefully for accuracy and inconsistency. You take notes and you remember details precisely. You do not exaggerate or use flowery language. You state facts plainly and you expect others to do the same. In group settings, you tend to be quiet, observing carefully and contributing only when you have something substantive to say.",
    leadership_strengths: [
      ["EXPERTISE", "You develop deep, authoritative knowledge in your domain. People rely on you for critical decisions because they trust your expertise and judgment."],
      ["QUALITY ASSURANCE", "You ensure that important work meets the highest standards. You prevent costly mistakes through careful analysis and thorough review."],
      ["SYSTEMATIC THINKING", "You approach problems methodically, breaking them into component parts and analyzing each carefully. This prevents important elements from being overlooked."],
      ["RISK MANAGEMENT", "You identify risks and potential problems that others miss. Your caution prevents organizations from making costly mistakes."],
      ["ATTENTION TO DETAIL", "Nothing important escapes your attention. You catch errors and inconsistencies that others overlook. This protects quality and credibility."],
      ["PRINCIPLED LEADERSHIP", "You lead with integrity and logical consistency. You hold yourself and others to the same high standards. People trust that you will do the right thing."],
    ],
    work_style:
      "At work, you are focused, systematic, and detail-oriented. You prefer working on important, high-stakes projects that require careful analysis. You are not comfortable with ambiguity or rushed decisions. You follow procedures carefully and you maintain high standards for your own work. You may be reluctant to delegate because you want to ensure quality. You are not naturally collaborative or social, but you are willing to work with others when the work requires it. You may not speak up readily in meetings because you prefer to think through your position carefully before sharing. You are not naturally ambitious or competitive, but you take pride in the quality of your work and in your expertise. You are the person who ensures that important details are not overlooked.",
    know_yourself:
      "Your strength is your commitment to quality and accuracy. Your analytical mind allows you to see patterns and problems that others miss. Your expertise is valuable and your standards ensure that important work is done correctly. However, be aware that your drive for perfection can prevent progress. Your focus on problems can prevent you from seeing what is working well. Your high standards can be isolating if you fail to help others understand what you expect. Your skepticism can prevent you from embracing new ideas or approaches. Your tendency to withdraw can prevent you from building relationships. You are more valuable than you realize, and the world needs your commitment to quality. Now develop the ability to share your expertise generously and to help others meet your standards rather than simply criticizing them for falling short.",
    grow_yourself:
      "Growth for you comes from learning to balance quality with speed, and perfection with progress. Not every situation requires perfection — develop the discernment to know which ones do and which ones do not. Learn to make decisions with incomplete information when the situation requires it. Develop the ability to help others succeed rather than simply critiquing them. Practice acknowledging what is working well before identifying what needs improvement. Build relationships and work collaboratively, even though you are more comfortable alone. Share your expertise generously and help others understand what you expect. You are a builder of quality and a preventer of mistakes. Now add the ability to inspire and develop others, and your contribution becomes truly transformational.",
    professional_description:
      "In professional settings, the Compliant style brings expertise, quality, and systematic thinking. You are naturally suited to roles that require careful analysis, quality assurance, and preventing costly mistakes. You excel in environments where accuracy is critical and where expertise is respected. You are comfortable in technical or specialized roles where your deep knowledge is valued.",
    professional_categories: {
      "Expertise & Mastery": [
        "Develops deep, authoritative knowledge in area of specialization",
        "Becomes the go-to expert that others rely on for critical decisions",
        "Maintains continuous learning and development of skills",
      ],
      "Quality & Accuracy": [
        "Produces consistently high-quality work with meticulous attention to detail",
        "Establishes and maintains high standards for self and others",
        "Identifies and prevents errors before they impact others",
      ],
      "Analysis & Problem-Solving": [
        "Approaches problems systematically, identifying root causes",
        "Sees patterns and connections that others might miss",
        "Provides logical, evidence-based solutions",
      ],
      "Systems & Processes": [
        "Creates structured systems and processes that ensure consistency",
        "Documents procedures carefully for continuity and quality",
        "Implements controls to maintain standards and prevent errors",
      ],
    },
    professional_roles: [
      "Quality Assurance & Testing",
      "Compliance & Risk Management",
      "Technical Expertise & Specialization",
      "Research & Analysis",
      "Project Management & Coordination",
      "Financial Analysis & Audit",
    ],
    professional_environment:
      "You thrive in structured, organized environments with clear standards, logical systems, and minimal ambiguity. Environments that value quality, expertise, and careful analysis fuel your best work. You are at your worst in chaotic, emotional environments where decisions are made quickly without data and where quality is sacrificed for speed. You need to feel that important work is being done correctly.",
    colleague_experience:
      "Colleagues experience you as a thoughtful, reliable expert who can be counted on to produce high-quality work and to catch important problems before they become critical. They respect your expertise and your commitment to quality. They may sometimes feel that you are overly critical or that you are slowing progress unnecessarily. Team members who value quality and careful thinking thrive alongside you; those who prefer speed and flexibility may find your style frustrating. At your best, you are the person who ensures that important work is built on a solid foundation and who prevents costly mistakes.",
  },
};

// ============================================================
// STYLE INTERACTIONS (working with each style)
// ============================================================
export const STYLE_INTERACTIONS = {
  D: {
    with_d:
      "When two Dominant individuals work together, the results can be extraordinary or explosive — often both. You share a drive for results, a bias toward action, and an unwillingness to accept mediocrity. The risk is that neither of you wants to follow or defer, which can create power struggles. Establish clear lanes of responsibility. Compete on results, not on authority. Respect each other's autonomy. When two Dominant individuals align on purpose and divide responsibilities clearly, the output is exceptional.",
    with_i:
      "You and the Influencing personality share boldness and a preference for fast action. You focus on results; they focus on people. The Influencing person may feel you run over people in your rush to produce. You may feel they waste time socializing when work needs to be done. The truth is you need each other desperately. Acknowledge their ability to build enthusiasm and bring people along willingly. They will appreciate your decisiveness, and you will benefit from the relationships and buy-in they create.",
    with_s:
      "You and the Steady personality are natural opposites in many ways. You move fast; they move deliberately. You embrace change; they resist it. This creates friction, but also powerful balance when managed well. You are the catalyst for change; they are the anchor that keeps things stable and maintains quality through transitions. Explain your decisions and the reasoning behind them. Check in personally and show that you value the relationship, not just the output. The Steady person becomes your most loyal ally when you invest in the relationship.",
    with_c:
      "You and the Compliant personality can frustrate each other profoundly. You think they are too slow and too focused on details; they think you are too reckless and too dismissive of important information. Both perspectives are partially right — and that is precisely why you need each other. Their thoroughness prevents costly mistakes that your speed would create. Your decisiveness turns their analysis into action that would otherwise remain on paper. Respect their need for data and their expertise. Set clear deadlines and hold to them.",
  },
  I: {
    with_d:
      "You and the Dominant personality both move fast and prefer action over deliberation. You focus on people and possibilities; they focus on results and bottom lines. You bring the relationships they need for sustainable success. They bring the decisiveness and follow-through you sometimes avoid. Work together consciously — you soften their edge and help them bring people along; they add backbone and accountability to your vision. The combination is powerful when both styles are respected.",
    with_i:
      "When two Influencing individuals work together, the energy is incredible — ideas flow, enthusiasm builds, and the atmosphere is electric. The risk is that neither of you is watching the details, managing deadlines, or having the difficult conversations. Agree on who will own the follow-through for each project. Hold each other accountable to commitments, not just ideas. Your combined energy can accomplish extraordinary things — but only if you discipline yourselves to finish what you start.",
    with_s:
      "You and the Steady personality genuinely enjoy each other's company. You bring energy and new ideas; they bring calm and follow-through. You both care deeply about people and relationships. Respect their need for predictability and stability. Do not overwhelm them with too many changes or ideas too quickly. Give them adequate time to adjust to new concepts and directions. Their loyalty and consistency pay enormous dividends when you are patient enough to earn them.",
    with_c:
      "You and the Compliant personality speak fundamentally different languages. You communicate with enthusiasm, stories, and emotional energy; they communicate with data, analysis, and structured logic. They give you the reality check you need but often do not want to hear. You help them see the bigger picture and the human element they sometimes miss. Respect their expertise and ask for their analysis before you act on intuition. Together, you bring inspiration grounded in reality and quality.",
  },
  S: {
    with_d:
      "You and the Dominant personality can feel like opposite worlds. Their intensity and pace can overwhelm you. Your caution and deliberateness can frustrate them. But this relationship is genuinely valuable when both parties invest in understanding. They need your loyalty, your honest perspective, and your stabilizing influence. You need their clarity, their decisiveness, and their ability to drive change. Be honest when their pace is unsustainable. Together, you drive meaningful change anchored in stability.",
    with_i:
      "You and the Influencing personality are natural partners who genuinely enjoy each other. You both value relationships and people. They bring energy, enthusiasm, and new ideas; you bring steadiness, follow-through, and grounded perspective. The risk is that you both avoid necessary conflict because you both prioritize harmony. Be aware of this tendency and speak up when something important needs to be said, even when it is uncomfortable. Together, you create a team environment where people feel both energized and secure.",
    with_s:
      "When two Steady individuals work together, the result is a stable, harmonious, and reliable partnership. You both value consistency, loyalty, and doing things right. You both listen well and support each other generously. The risk is that you can become too comfortable with the status quo and resist change that the situation demands. Push each other gently toward growth and action when the moment calls for it. Your combined reliability is a tremendous asset; now add courage to move forward together.",
    with_c:
      "You and the Compliant personality are natural allies in many ways. You both value consistency, accuracy, and doing things right. You both prefer a measured, thoughtful pace over hasty action. This creates a strong relationship built on mutual respect and shared values. The risk is that together you can become too cautious, too resistant to change, and too slow to act when speed matters. Push each other toward action when analysis is complete. Together, you maintain exceptional quality and stability.",
  },
  C: {
    with_d:
      "You and the Dominant personality can clash because you express convictions so differently. You rely on thorough data and analysis; they rely on instinct and speed. You feel they are reckless and dismissive of important information; they feel you create unnecessary delays and overthink simple decisions. The truth is you need each other badly. Provide your input concisely and lead with clear recommendations, not exhaustive analysis. They respect expertise when it is delivered efficiently. Together, you drive results anchored in quality.",
    with_i:
      "You and the Influencing personality are fundamentally different in approach. They are enthusiastic, social, and intuitive; you are analytical, reserved, and systematic. They bring inspiration, energy, and relationship capital; you bring execution discipline, quality assurance, and structured thinking. Respect their people skills and the value they create through relationships. Help them with the details and follow-through they naturally miss. Together, you bring inspiration grounded in reality, quality, and sustainable execution.",
    with_s:
      "You and the Steady personality understand each other well because you share important values. You both value stability, quality, and doing things correctly. This creates a reliable, trustworthy partnership built on mutual respect. The risk is stagnation — together you can become so comfortable with the current state that you resist necessary change or delay important decisions. Push each other to act when the analysis is sufficient and the moment demands forward movement. Together, you bring reliability, quality, and deep trust.",
    with_c:
      "When two Compliant individuals work together, the quality of output is exceptional — thorough, accurate, and well-documented. You hold each other to the highest standards and your combined analytical power is formidable. The risk is that you can get lost in analysis, endlessly refining when the situation requires a decision. Agree on standards and deadlines in advance. When the deadline arrives, decide with the information you have. Your combined expertise is a tremendous asset; now pair it with the courage to act.",
  },
};

// ============================================================
// WORKPLACE TIPS (10 per style)
// ============================================================
export const WORKPLACE_TIPS = {
  D: [
    [
      "DECISIVENESS IN ACTION",
      "Your ability to make quick decisions is one of your greatest professional assets. In high-pressure situations, your team looks to you for clear direction and confident choices. Leverage this deliberately — when you see the team stalling, step in with a clear recommendation backed by your assessment of the situation. Be mindful that not every situation requires an immediate decision; sometimes gathering one more piece of input prevents a costly mistake that undermines the very results you are trying to achieve.",
    ],
    [
      "MANAGING YOUR INTENSITY",
      "Your drive and intensity inspire some people and intimidate others. Pay close attention to your body language and vocal tone — crossed arms, rapid-fire questions, and impatient sighs send messages louder than your words ever will. Practice moderating your intensity in one-on-one conversations by sitting down, maintaining warm eye contact, and asking an open-ended question before stating your position. The goal is not to diminish your strength but to make it accessible to people who process differently than you do.",
    ],
    [
      "DELEGATION WITH PURPOSE",
      "You naturally delegate tasks, but you may skip the critical step of explaining why the task matters. When people understand the purpose behind an assignment, they take greater ownership and deliver better results. Take thirty extra seconds to connect the task to the larger goal. This small investment of time pays dividends in quality and engagement, and it reduces the number of times work comes back to you for correction or redirection.",
    ],
    [
      "BUILDING BUY-IN",
      "Your instinct is to decide and announce. This is efficient, but it often leaves people feeling like they were not consulted. Before making major decisions, identify two or three people whose input would improve the outcome and whose buy-in you need for successful execution. Ask for their perspective, genuinely consider it, and acknowledge their contribution even if the final decision is yours. People execute better when they feel heard, even if the decision does not go their way.",
    ],
    [
      "STRATEGIC PATIENCE",
      "Speed is your default mode, and it serves you well in many situations. However, some of your most important goals require sustained effort over time rather than a single burst of energy. Practice identifying which situations require speed and which require patience. Develop the discipline to slow down when the stakes are high and the timeline is long. Strategic patience is not passivity — it is choosing the right pace for the right moment.",
    ],
    [
      "CONFLICT RESOLUTION",
      "You are comfortable with conflict, which is a genuine strength. However, your approach to conflict can be so direct that it escalates rather than resolves. Practice pausing before responding in heated moments. Ask yourself: what outcome do I actually want here? Often the fastest path to resolution runs through understanding the other person's perspective, not through overpowering it. Your willingness to engage with conflict is valuable; now refine how you engage.",
    ],
    [
      "RECOGNITION OF OTHERS",
      "Your focus on results can cause you to move past accomplishments without acknowledging the people who made them possible. Make it a practice to recognize specific contributions publicly and promptly. This is not about being soft — it is about being strategic. People who feel recognized work harder, stay longer, and bring you their best ideas. A thirty-second acknowledgment can produce weeks of increased effort.",
    ],
    [
      "LISTENING AS STRATEGY",
      "You may view listening as passive, but it is one of the most powerful strategic tools available to any leader. When you listen, you gather intelligence — about problems, about people, about opportunities. Practice asking a question and then being silent for a full count of five before responding. You will be surprised at what people tell you when they believe you are actually listening. The information you gain will make your decisions better.",
    ],
    [
      "MANAGING UPWARD",
      "You prefer autonomy and can bristle at authority. In organizational settings, this can create friction with supervisors or stakeholders who need to feel informed and included. Develop a practice of proactive communication upward — brief, factual updates that demonstrate you are on track without inviting micromanagement. The more confidence you build with those above you, the more autonomy you earn.",
    ],
    [
      "WORK-LIFE BOUNDARIES",
      "Your drive to achieve can consume every waking hour if you let it. The line between dedication and burnout is thinner than you think. Establish clear boundaries between work and personal time — not because work is not important, but because your effectiveness depends on recovery. The most productive leaders protect their energy with the same discipline they bring to their goals. Rest is not laziness; it is a performance strategy.",
    ],
  ],
  I: [
    [
      "HARNESSING YOUR ENERGY",
      "Your natural enthusiasm and energy are contagious — people are drawn to your positivity and optimism. Use this strategically by channeling your energy toward your highest-priority initiatives rather than spreading it across every opportunity. Before committing to something new, ask yourself: does this advance my most important goal? Learning to direct your energy rather than scatter it transforms you from someone who is fun to be around into someone who delivers transformative results.",
    ],
    [
      "FOLLOW-THROUGH SYSTEMS",
      "Your strength is starting things and getting people excited. Your growth area is finishing things and managing details. Create systems that compensate for this — use task management tools, set reminders, and partner with detail-oriented colleagues who can track the specifics. Do not rely on memory or good intentions alone. The gap between your promises and your delivery is the gap in your credibility. Close it with systems, not willpower.",
    ],
    [
      "LISTENING OVER TALKING",
      "You are a gifted communicator, but communication is a two-way activity. Your tendency to fill silence with words can prevent you from hearing what others are really saying. Practice the discipline of listening without planning your response. In your next three conversations, commit to asking two follow-up questions before offering your own perspective. You will discover insights and information that your talking would have drowned out.",
    ],
    [
      "DIFFICULT CONVERSATIONS",
      "Your desire to be liked can cause you to avoid conversations that need to happen — performance issues, disagreements, boundary-setting. Avoidance does not preserve relationships; it erodes them slowly. Practice having one difficult conversation per week. Start with the smallest, lowest-stakes issue and build from there. You will discover that honest conversation, delivered with your natural warmth, actually strengthens relationships rather than threatening them.",
    ],
    [
      "COMMITMENT MANAGEMENT",
      "Your generosity of spirit leads you to say yes too often. Every yes is a no to something else. Before committing, pause and ask: can I actually deliver this at the quality and timeline expected? If the answer is not a confident yes, practice saying 'Let me think about that and get back to you.' A delayed yes is better than a broken promise. Your reputation depends not on your willingness but on your reliability.",
    ],
    [
      "DEPTH OVER BREADTH",
      "You naturally cultivate a wide network of relationships, but not all relationships need to be the same depth. Identify the five to seven relationships that matter most to your professional and personal success and invest deeply in those. Quality relationships — where you know people's real challenges and they know yours — are more valuable than a thousand casual connections. Go deep with the people who matter most.",
    ],
    [
      "STRUCTURE YOUR CREATIVITY",
      "Your creative ideas are valuable, but they need structure to become reality. When you have an idea, write it down with three things: the idea itself, one specific first step, and a deadline. Share it with someone who can hold you accountable. Ideas without structure are just daydreams. Ideas with structure become innovations. Your creativity is a gift; now give it a framework.",
    ],
    [
      "EMOTIONAL INTELLIGENCE",
      "Your natural emotional awareness is a strength, but be careful not to let your own emotions drive decisions. Practice separating how you feel about a situation from what the situation actually requires. When you notice strong emotion — excitement, frustration, enthusiasm — pause and ask: what does the data say? Your emotional insight combined with factual analysis makes you a complete decision-maker.",
    ],
    [
      "MANAGING YOUR REPUTATION",
      "Your personality naturally draws attention and creates impressions. Be intentional about the impression you create. In professional settings, balance your warmth and humor with substance and depth. People should think of you as both enjoyable and competent — not one or the other. Make sure your results speak as loudly as your personality. The most respected professionals are the ones who deliver consistently, not just the ones who are fun at the holiday party.",
    ],
    [
      "RECHARGING STRATEGICALLY",
      "You draw energy from people, which means you can run on social fuel longer than most. But even you need downtime. Schedule it deliberately — time alone to think, process, and reflect. Without this, your energy becomes manic rather than magnetic. The most effective version of you is the one who has taken time to think before acting, to reflect before speaking, and to rest before engaging.",
    ],
  ],
  S: [
    [
      "FINDING YOUR VOICE",
      "You have valuable insights and perspectives that you often keep to yourself. Your natural inclination to listen and observe means you see things that louder voices miss. Challenge yourself to share one insight in every meeting you attend. Start small — a clarifying question, a summary of what you have heard, an observation about what might be missing. Your voice matters, and the team needs to hear it. Silence is not always supportive; sometimes speaking up is the most supportive thing you can do.",
    ],
    [
      "EMBRACING CHANGE",
      "Change is uncomfortable for you because it disrupts the stability and predictability you value. But change is inevitable, and your ability to navigate it determines your growth. When change comes, give yourself permission to feel uncomfortable — then focus on what you can control. Ask questions about the reasons behind the change. Understanding the 'why' helps you process the 'what.' You do not have to like change to handle it effectively. Start by accepting that discomfort is temporary but growth is permanent.",
    ],
    [
      "SETTING BOUNDARIES",
      "Your supportive nature makes you the person everyone turns to, and you rarely say no. This is generous but unsustainable. Practice identifying the difference between genuine need and convenience — sometimes people come to you because you are easy, not because you are the right person. It is okay to say 'I cannot take this on right now' or 'I need to finish my current commitment first.' Boundaries are not selfish; they are necessary for sustained service.",
    ],
    [
      "CONFLICT ENGAGEMENT",
      "You avoid conflict because it threatens the harmony you value. But unaddressed conflict does not disappear — it grows. Practice engaging with small disagreements before they become large ones. Use your natural empathy to approach conflict from a place of understanding: 'I want to understand your perspective because this matters to me.' Conflict resolved with care often strengthens relationships more than conflict avoided ever could.",
    ],
    [
      "ADVOCATING FOR YOURSELF",
      "You underestimate your own value and contribution. You do the quiet work that keeps everything running, and you rarely ask for recognition or advancement. But if you do not advocate for yourself, no one else will do it for you. Keep a record of your contributions and accomplishments. When opportunities arise, speak to your track record. You deserve the recognition you so generously give to others. Advocating for yourself is not bragging; it is honest communication.",
    ],
    [
      "ACCELERATING DECISIONS",
      "Your deliberate pace is an asset when thoroughness matters, but it can frustrate fast-moving colleagues and cause you to miss opportunities. Practice making smaller decisions more quickly — what to eat, which email to respond to first, which route to take. Build the muscle of deciding with incomplete information. Not every decision requires perfect clarity. Most decisions are reversible. Move forward with the best information you have and adjust as you learn.",
    ],
    [
      "DEVELOPING LEADERSHIP PRESENCE",
      "Your leadership style is quiet, supportive, and relationship-based. This is valuable, but it can be overlooked in organizations that reward visibility. Develop the ability to lead from the front when the situation demands it — presenting to groups, making tough calls, taking visible ownership of outcomes. You do not have to become someone you are not; you need to expand who you are. Quiet leadership is real leadership; now add visible leadership to your repertoire.",
    ],
    [
      "BUILDING RESILIENCE",
      "Disruptions affect you more deeply than they affect some other styles because you value stability. Build resilience by developing routines and anchor points that remain constant even when other things change. Your morning routine, your key relationships, your personal values — these are your foundation. When change comes, return to your anchors. You are more resilient than you think; you simply need to build a framework that supports you through transition.",
    ],
    [
      "EXPANDING YOUR NETWORK",
      "You prefer deep relationships with a small circle, and this serves you well. But professional growth often comes through exposure to new people and perspectives. Challenge yourself to build one new professional relationship per month. Use your natural warmth and listening skills — these are assets in networking. You do not have to work a room; you just need to have one genuine conversation with one new person. Quality over quantity is your style, and it works.",
    ],
    [
      "TRUSTING YOUR INSTINCTS",
      "You have strong instincts about people and situations, developed through years of careful observation. Trust these instincts more. When something feels wrong, it usually is. When someone seems trustworthy, they usually are. Your instincts are the product of your deep attention to the world around you. Give yourself permission to act on what you sense, not just on what you can prove. Your gut is one of your most reliable tools.",
    ],
  ],
  C: [
    [
      "BALANCING QUALITY WITH PROGRESS",
      "Your commitment to quality is one of your defining strengths. However, perfectionism can become an obstacle when it prevents forward movement. Learn to distinguish between situations that require perfection — regulatory compliance, safety-critical decisions, published work — and situations where good enough truly is good enough. Develop a personal standard for each type of work: what does 'done' look like? Setting this standard in advance prevents the endless loop of revision that steals your time and delays results.",
    ],
    [
      "COMMUNICATING WARMTH",
      "You care more than people realize. Your analytical focus and reserved manner can create the impression that you are cold or uninterested in people. Make a deliberate effort to communicate warmth in small ways — ask about someone's weekend, acknowledge a job well done, express gratitude for help. These small gestures take seconds but change how people experience you. You do not have to become a different person; you just need to let people see the care that already exists.",
    ],
    [
      "MAKING DECISIONS WITH IMPERFECT DATA",
      "You prefer to have all the information before deciding, but the world rarely provides that luxury. Practice identifying the minimum information you need to make a responsible decision — not a perfect decision, but a good one. Set a deadline for your analysis and commit to deciding when it arrives. Action with 80% of the information is almost always better than inaction with 95%. You can adjust as you learn; you cannot recover time spent waiting for certainty.",
    ],
    [
      "RECEIVING FEEDBACK GRACEFULLY",
      "Your high standards can make feedback feel like a personal attack — even when it is constructive and well-intentioned. Practice separating the message from the delivery. When someone gives you feedback, resist the urge to defend or explain. Instead, say 'Thank you, I will think about that.' Then actually think about it. The best feedback often comes in packages you do not want to open. Your growth depends on your ability to receive it with grace.",
    ],
    [
      "SHARING YOUR EXPERTISE",
      "You have deep knowledge that others need but do not know how to access. Make your expertise available by sharing it proactively — write it down, teach it to others, create documentation. Do not wait to be asked. The knowledge locked in your head helps no one. When you share your expertise, you multiply your value. You also build relationships with people who appreciate what you know. Generosity with knowledge is one of the fastest paths to professional respect.",
    ],
    [
      "COLLABORATION SKILLS",
      "Your preference for independent work is legitimate and productive, but the most complex problems require collaboration. Develop the ability to work effectively in teams by establishing clear roles, expectations, and processes at the outset. Use your systematic thinking to create structure that helps the whole team perform better. When everyone knows what they are supposed to do and how quality will be measured, your natural strengths become team strengths.",
    ],
    [
      "MANAGING YOUR INNER CRITIC",
      "Your internal standards are higher than most people's external standards. This drives excellence but also drives anxiety, self-doubt, and harsh self-judgment. Notice when your inner critic crosses from useful self-assessment into destructive self-criticism. Develop a practice of acknowledging what you did well before identifying what you could improve. You already know what is wrong; deliberately noticing what is right creates the balance you need to sustain high performance over time.",
    ],
    [
      "EXPRESSING APPRECIATION",
      "You notice quality work when you see it, but you may not express that recognition. Make it a practice to tell people when their work meets your standards — this is high praise coming from you, and they need to hear it. Specific, genuine recognition from someone who holds high standards is one of the most motivating things a person can receive. You have the power to inspire excellence in others simply by telling them when they have achieved it.",
    ],
    [
      "ADAPTING COMMUNICATION STYLE",
      "Your default communication style is detailed, structured, and logical. This works well with other analytical people but can overwhelm or bore people with different styles. Learn to adjust your communication based on your audience. With Dominant individuals, lead with the conclusion. With Influencing individuals, start with the big picture and the impact on people. With Steady individuals, provide context and allow processing time. Flexibility in communication is not compromise; it is strategy.",
    ],
    [
      "PROTECTING YOUR ENERGY",
      "Your analytical mind runs constantly, processing information, identifying problems, and refining solutions. This is valuable but exhausting. Create deliberate boundaries around your mental energy — schedule blocks of uninterrupted focus time, limit unnecessary meetings, and protect your ability to think deeply. Your best work comes from concentrated, focused effort. Interruptions do not just cost you time; they cost you the quality of thought that distinguishes your contribution.",
    ],
  ],
};

// ============================================================
// APPLICATION QUESTIONS (6 reflection questions for Application Guide pages)
// ============================================================
export const APPLICATION_QUESTIONS = [
  "Think about a recent situation where your natural behavioral style served you well. What happened? What did you do that was effective, and how can you replicate this in other areas of your life and work?",
  "Now think about a situation where your style created friction or misunderstanding with someone else. What happened? What would you do differently knowing what you now understand about DISC behavioral styles?",
  "Identify three people you interact with regularly — a colleague, a family member, and a friend. What DISC style do you think each person is? How does their style complement or challenge yours? What one thing could you change in how you communicate with each?",
  "Consider your current role and responsibilities. Which aspects of your work align naturally with your style, and which require you to stretch beyond your comfort zone? How can you structure your work to leverage your strengths while developing your growth areas?",
  "Imagine you are building a team from scratch for an important project. What styles would you recruit and why? How would you ensure that style differences become a source of strength rather than conflict? What role would you naturally play?",
  "Write a personal commitment statement: Based on what you have learned about your behavioral style, what is one specific behavior you will start doing, one you will stop doing, and one you will continue doing? Be as specific as possible.",
];

// ============================================================
// KEYWORD EXERCISES (per style: pressure_response + self_perception, 10 each)
// ============================================================
export const KEYWORD_EXERCISES = {
  D: {
    pressure_response: [
      ["FORCEFUL", "Full of power and conviction; exerting influence through sheer strength of will and determination"],
      ["DIRECT", "Straightforward and frank in communication; proceeding to the point without unnecessary elaboration"],
      ["DARING", "Willing to take bold risks; adventurous and courageous in the face of uncertainty or danger"],
      ["COMPETITIVE", "Having a strong desire to win or be the best; driven by rivalry and the need to outperform"],
      ["DEMANDING", "Requiring others to meet high standards; insistent and exacting in expectations"],
      ["DETERMINED", "Firmly resolved to achieve a goal; unwavering in purpose despite obstacles or setbacks"],
      ["AGGRESSIVE", "Pursuing goals with force and intensity; assertively taking action to achieve desired outcomes"],
      ["RESTLESS", "Unable to remain still or inactive; constantly seeking new challenges and forward movement"],
      ["BOLD", "Showing willingness to take risks; confident and courageous in action and speech"],
      ["IMPATIENT", "Unable or unwilling to wait; wanting immediate action, results, and forward progress"],
    ],
    self_perception: [
      ["AMBITIOUS", "Having a strong desire for success, achievement, and recognition; driven to climb higher"],
      ["PIONEERING", "Opening new areas of thought, action, or development; willing to venture where others will not"],
      ["SELF-RELIANT", "Depending on one's own abilities and judgment; preferring independence over dependence"],
      ["STRONG-WILLED", "Possessing determination and force of character; not easily swayed by opposition or doubt"],
      ["CONFIDENT", "Having firm trust in one's own abilities, qualities, and judgment; self-assured and decisive"],
      ["RESULTS-ORIENTED", "Focused primarily on achieving measurable outcomes; valuing production over process"],
      ["DECISIVE", "Having the ability to make decisions quickly and effectively; resolute in choosing a course"],
      ["INDEPENDENT", "Free from outside control or influence; self-governing and autonomous in thought and action"],
      ["PERSISTENT", "Continuing firmly in a course of action despite difficulty; refusing to give up or be deterred"],
      ["AUTHORITATIVE", "Commanding respect and obedience; having the confidence and knowledge to lead decisively"],
    ],
  },
  I: {
    pressure_response: [
      ["EXPRESSIVE", "Effectively conveying thoughts and feelings; using animated gestures, tone, and words"],
      ["ENTHUSIASTIC", "Having or showing intense and eager enjoyment, interest, or approval for ideas and people"],
      ["PERSUASIVE", "Good at convincing others to do or believe something through appeal and personal charm"],
      ["IMPULSIVE", "Acting without forethought; responding to impulse rather than careful analysis or planning"],
      ["EMOTIONAL", "Experiencing and expressing feelings readily; responding to situations with visible emotion"],
      ["TALKATIVE", "Fond of talking and conversation; readily engaging others in discussion and dialogue"],
      ["SPONTANEOUS", "Acting on natural feeling without effort or premeditation; unplanned and unrehearsed"],
      ["OPTIMISTIC", "Hopeful and confident about the future; expecting favorable outcomes even in difficult times"],
      ["ANIMATED", "Full of life, action, and spirit; lively and energetic in expression and movement"],
      ["SCATTERED", "Unfocused and disorganized under pressure; attention divided across too many priorities"],
    ],
    self_perception: [
      ["CHARISMATIC", "Exercising a compelling charm that inspires devotion and enthusiasm in others"],
      ["INSPIRING", "Having the effect of motivating someone; generating enthusiasm and energy in those around you"],
      ["SOCIABLE", "Willing to talk and engage in activities with others; friendly and pleasant in company"],
      ["CREATIVE", "Relating to or involving the use of imagination or original ideas; inventive and innovative"],
      ["OUTGOING", "Friendly and socially confident; not shy or reserved in engaging with new people or situations"],
      ["WARM", "Having or showing a kindly disposition; making others feel welcome and appreciated"],
      ["FUN-LOVING", "Lighthearted and playful; enjoying activities that bring joy and laughter to self and others"],
      ["TRUSTING", "Having confidence in the reliability, truth, or ability of others; open and believing"],
      ["MOTIVATING", "Providing a reason or incentive for action; stimulating the interest and commitment of others"],
      ["COLLABORATIVE", "Working jointly with others; welcoming partnership and shared effort toward common goals"],
    ],
  },
  S: {
    pressure_response: [
      ["PASSIVE", "Accepting or allowing what happens without active response or resistance; yielding"],
      ["PATIENT", "Able to accept or tolerate delays, problems, or suffering without becoming annoyed or anxious"],
      ["ACCOMMODATING", "Willing to fit in with someone else's wishes or needs; helpful and eager to please"],
      ["HESITANT", "Tentative, unsure, or slow in acting or speaking; cautious about committing to a direction"],
      ["POSSESSIVE", "Demanding attention and loyalty; unwilling to share relationships or familiar routines"],
      ["INDECISIVE", "Unable to make decisions quickly or effectively; wanting more input before committing"],
      ["RESISTANT", "Opposing change or new ideas; preferring familiar patterns and established routines"],
      ["WITHDRAWN", "Retreating from social interaction or conflict; becoming quiet and internally focused"],
      ["STUBBORN", "Having or showing dogged determination not to change one's attitude, position, or direction"],
      ["COMPLIANT", "Inclined to agree with others or obey rules; yielding to the wishes of those in authority"],
    ],
    self_perception: [
      ["LOYAL", "Faithful and devoted to a person, organization, or cause; standing by commitments through difficulty"],
      ["DEPENDABLE", "Worthy of trust and reliance; consistently delivering on promises and expectations"],
      ["TEAM-ORIENTED", "Preferring to work as part of a group; valuing collaboration over individual achievement"],
      ["SUPPORTIVE", "Providing encouragement, assistance, and emotional backing to others in their endeavors"],
      ["CONSISTENT", "Unchanging in achievement, behavior, or effect over time; reliable and predictable"],
      ["STEADY", "Firmly fixed, supported, or balanced; not faltering, wavering, or changing course"],
      ["CALM", "Not showing or feeling nervousness, anger, or other strong emotions; peaceful and composed"],
      ["THOUGHTFUL", "Showing careful consideration for the needs and feelings of other people; attentive"],
      ["RELIABLE", "Consistently good in quality or performance; able to be trusted and depended upon"],
      ["SINCERE", "Free from pretense or deceit; proceeding from genuine feelings and honest intentions"],
    ],
  },
  C: {
    pressure_response: [
      ["CAUTIOUS", "Careful to avoid potential problems or dangers; taking time to consider before acting"],
      ["CRITICAL", "Expressing adverse or disapproving comments or judgments; carefully analyzing for flaws"],
      ["PERFECTIONIST", "Refusing to accept any standard short of perfection; holding self and others to the highest bar"],
      ["WITHDRAWN", "Not wanting to communicate with other people; retreating into analysis and internal thought"],
      ["RIGID", "Unable or unwilling to change or be changed; fixed in approach, process, or perspective"],
      ["WORRYING", "Giving way to anxiety or unease; allowing the mind to dwell on difficulty or troubles"],
      ["OVERLY ANALYTICAL", "Examining or evaluating beyond what is useful or productive; getting lost in data"],
      ["DEFENSIVE", "Very anxious to challenge or avoid criticism; protecting one's position or methods"],
      ["SKEPTICAL", "Not easily convinced; having doubts or reservations about claims, proposals, or optimism"],
      ["DETACHED", "Separate or disconnected from others; maintaining emotional distance in interactions"],
    ],
    self_perception: [
      ["ACCURATE", "Free from error; correct and precise in detail, measurement, and expression"],
      ["THOROUGH", "Complete with regard to every detail; not superficial, partial, or careless"],
      ["SYSTEMATIC", "Done or acting according to a fixed plan or system; methodical and organized"],
      ["OBJECTIVE", "Not influenced by personal feelings or opinions; considering facts impartially"],
      ["ANALYTICAL", "Using analysis or logical reasoning; separating things into component parts for examination"],
      ["QUALITY-FOCUSED", "Committed to excellence and high standards in all work and output"],
      ["PRECISE", "Marked by exactness and accuracy of expression or detail; strictly correct"],
      ["METICULOUS", "Showing great attention to detail; very careful, thorough, and exact"],
      ["DISCIPLINED", "Showing a controlled form of behavior or way of working; orderly and methodical"],
      ["EXPERT", "Having or involving authoritative knowledge; deeply skilled in a particular field or domain"],
    ],
  },
};

// ============================================================
// ACTION PLAN TRAITS (20 Y/N statements per style)
// ============================================================
export const ACTION_PLAN_TRAITS = {
  D: [
    "I take charge naturally in group situations",
    "I make decisions quickly and confidently",
    "I prefer to lead rather than follow",
    "I am comfortable with conflict and confrontation",
    "I focus on results more than relationships",
    "I move at a fast pace and expect others to keep up",
    "I am willing to take risks that others avoid",
    "I challenge the status quo regularly",
    "I hold myself to high standards of accountability",
    "I can be blunt or direct in my communication",
    "I sometimes overlook people's feelings in pursuit of goals",
    "I get impatient with people who move slowly",
    "I resist being told what to do by others",
    "I compete even when competition is not necessary",
    "I take credit for my achievements openly",
    "I delegate tasks but may not explain the 'why'",
    "I set ambitious goals and pursue them relentlessly",
    "I recover quickly from setbacks and failures",
    "I speak up in meetings even when my view is unpopular",
    "I measure success primarily by tangible outcomes",
  ],
  I: [
    "I naturally connect with people and build rapport quickly",
    "I am enthusiastic and optimistic in most situations",
    "I enjoy being the center of attention in group settings",
    "I influence others through warmth and personal charm",
    "I sometimes talk more than I listen in conversations",
    "I over-commit because I do not want to disappoint people",
    "I avoid conflict to preserve relationships and harmony",
    "I see the big picture more clearly than the details",
    "I am energized by social interaction and collaboration",
    "I adapt my style based on who I am talking to",
    "I sometimes make promises I cannot keep",
    "I struggle with follow-through on detailed tasks",
    "I need recognition and appreciation from others",
    "I can be impulsive in decision-making",
    "I trust people easily, sometimes too easily",
    "I prefer variety and new experiences over routine",
    "I inspire and motivate others with my energy",
    "I remember personal details about the people I meet",
    "I can gloss over problems because of my optimism",
    "I prefer working with people over working alone",
  ],
  S: [
    "I value stability and predictability in my environment",
    "I am patient and willing to listen to others",
    "I prefer a steady, measured pace over rapid change",
    "I support others even at the expense of my own needs",
    "I follow through on commitments consistently",
    "I have difficulty saying no to requests from others",
    "I resist sudden or unexplained changes",
    "I prefer to work as part of a team rather than alone",
    "I avoid confrontation and difficult conversations",
    "I am loyal to people and organizations I believe in",
    "I can appear unmotivated when I am actually processing",
    "I need time to adjust to new ideas or situations",
    "I value harmony and work to maintain it",
    "I remember how things should be done and do them that way",
    "I underestimate my own value and contribution",
    "I provide consistent, reliable support to others",
    "I struggle with ambiguity and unclear expectations",
    "I prefer familiar routines and established processes",
    "I listen more than I speak in most conversations",
    "I build deep, lasting relationships with people I trust",
  ],
  C: [
    "I value accuracy and precision in all my work",
    "I ask detailed questions to understand fully",
    "I prefer clear expectations and defined processes",
    "I produce high-quality, thorough work consistently",
    "I can be slow to decide without complete information",
    "I hold myself and others to very high standards",
    "I see patterns and problems that others miss",
    "I prefer working with data and facts over opinions",
    "I can seem cold or detached even when I care deeply",
    "I focus on what is wrong more than what is right",
    "I need time and space to do quality work",
    "I over-analyze situations before taking action",
    "I struggle with ambiguity and imprecise communication",
    "I resist shortcuts or 'good enough' approaches",
    "I am uncomfortable with public praise or attention",
    "I follow rules, processes, and procedures carefully",
    "I communicate in a structured, logical manner",
    "I can be perceived as critical or judgmental",
    "I value expertise and deep knowledge in my field",
    "I prefer to work independently with minimal interruption",
  ],
};

export default {
  LEADERSHIP_SCORES,
  COMBO_PROFILES,
  SIDEBAR_QUOTES,
  COMM_SNAPSHOT,
  ENERGIZES_DRAINS,
  STRENGTH_CARDS,
  WORK_BEHAVIOR,
  PROFILES,
  STYLE_INTERACTIONS,
  WORKPLACE_TIPS,
  APPLICATION_QUESTIONS,
  KEYWORD_EXERCISES,
  ACTION_PLAN_TRAITS,
};
