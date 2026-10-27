import {
  BookSection,
  ComprehensionQuestion,
  B2ExerciseItem,
  GlossaryTerm,
  UserStudyState,
  ReaderPreferences,
  DailyStudyLog
} from '../types/study';

export const STORAGE_KEY = 'gulliver_b2_study_state_v1';

export const DEFAULT_PREFERENCES: ReaderPreferences = {
  uiLanguage: 'es',
  theme: 'light',
  fontFamily: 'serif',
  fontSize: 18,
  lineHeight: 1.75,
  columnWidth: 'balanced',
  showParagraphNumbers: true,
  highlightGlossaryTerms: true,
  speechRate: 1.0,
  dailyGoalMinutes: 20,
  reminderEnabled: true,
  reminderTime: '19:30'
};

export function getTodayDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultStudyState(now: Date = new Date()): UserStudyState {
  const today = getTodayDateString(now);
  return {
    version: 1,
    lastUpdatedIso: now.toISOString(),
    deviceLabel: typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop Workstation',
    currentSectionId: 'intro',
    completedChapters: [],
    chapterReadingProgress: { intro: 25 },
    comprehensionAnswers: {},
    b2ExerciseAnswers: {},
    glossaryMastery: {},
    bookmarkedParagraphs: [],
    personalNotes: {},
    dailyLogs: {
      [today]: {
        date: today,
        minutesStudied: 5,
        chaptersVisited: ['intro'],
        exercisesAnswered: 0,
        correctAnswers: 0
      }
    },
    lastReminderShownDate: null,
    preferences: { ...DEFAULT_PREFERENCES }
  };
}

export interface ChapterPerformanceMetric {
  sectionId: string;
  title: string;
  part: string;
  wordCount: number;
  isCompleted: boolean;
  readingProgress: number;
  questionsTotal: number;
  questionsAnswered: number;
  questionsCorrect: number;
  accuracyPercent: number;
}

export interface B2TopicMetric {
  topic: string;
  category: 'grammar' | 'vocabulary';
  total: number;
  answered: number;
  correct: number;
  accuracyPercent: number;
}

export interface StudyAnalyticsSummary {
  totalSections: number;
  completedSectionsCount: number;
  overallBookCompletionPercent: number;
  totalWordsInBook: number;
  estimatedWordsRead: number;
  comprehensionTotal: number;
  comprehensionAnswered: number;
  comprehensionCorrect: number;
  comprehensionAccuracyPercent: number;
  b2Total: number;
  b2Answered: number;
  b2Correct: number;
  b2AccuracyPercent: number;
  b2GrammarAccuracyPercent: number;
  b2VocabAccuracyPercent: number;
  glossaryTotal: number;
  glossaryMastered: number;
  glossaryLearning: number;
  totalMinutesStudied: number;
  todayMinutesStudied: number;
  dailyGoalMinutes: number;
  dailyGoalProgressPercent: number;
  currentStreakDays: number;
  chapterMetrics: ChapterPerformanceMetric[];
  b2TopicMetrics: B2TopicMetric[];
  recentDailySeries: DailyStudyLog[];
}

export function calculateStudyAnalytics(
  state: UserStudyState,
  sections: BookSection[],
  comprehensionQuestions: ComprehensionQuestion[],
  b2Exercises: B2ExerciseItem[],
  glossaryTerms: GlossaryTerm[],
  now: Date = new Date()
): StudyAnalyticsSummary {
  const totalSections = sections.length;
  const completedSectionsCount = state.completedChapters.length;
  const totalWordsInBook = sections.reduce((acc, s) => acc + s.wordCount, 0);

  let estimatedWordsRead = 0;
  const chapterMetrics: ChapterPerformanceMetric[] = sections.map((sec) => {
    const isCompleted = state.completedChapters.includes(sec.id);
    const rawProg = state.chapterReadingProgress[sec.id] ?? 0;
    const readingProgress = isCompleted ? 100 : Math.min(100, Math.max(0, rawProg));
    estimatedWordsRead += Math.round((sec.wordCount * readingProgress) / 100);

    const chapQuestions = comprehensionQuestions.filter((q) => q.chapterId === sec.id);
    const questionsTotal = chapQuestions.length;
    let questionsAnswered = 0;
    let questionsCorrect = 0;

    for (const q of chapQuestions) {
      const ans = state.comprehensionAnswers[q.id];
      if (ans !== undefined) {
        questionsAnswered++;
        if (ans.isCorrect) questionsCorrect++;
      }
    }

    const accuracyPercent =
      questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0;

    return {
      sectionId: sec.id,
      title: sec.title,
      part: sec.part,
      wordCount: sec.wordCount,
      isCompleted,
      readingProgress,
      questionsTotal,
      questionsAnswered,
      questionsCorrect,
      accuracyPercent
    };
  });

  const overallBookCompletionPercent =
    totalWordsInBook > 0 ? Math.min(100, Math.round((estimatedWordsRead / totalWordsInBook) * 100)) : 0;

  const comprehensionTotal = comprehensionQuestions.length;
  let comprehensionAnswered = 0;
  let comprehensionCorrect = 0;
  for (const q of comprehensionQuestions) {
    const ans = state.comprehensionAnswers[q.id];
    if (ans) {
      comprehensionAnswered++;
      if (ans.isCorrect) comprehensionCorrect++;
    }
  }
  const comprehensionAccuracyPercent =
    comprehensionAnswered > 0 ? Math.round((comprehensionCorrect / comprehensionAnswered) * 100) : 0;

  const b2Total = b2Exercises.length;
  let b2Answered = 0;
  let b2Correct = 0;
  let gramAnswered = 0;
  let gramCorrect = 0;
  let vocabAnswered = 0;
  let vocabCorrect = 0;

  const topicMap = new Map<string, B2TopicMetric>();

  for (const ex of b2Exercises) {
    const existingTopic = topicMap.get(ex.b2Topic) ?? {
      topic: ex.b2Topic,
      category: ex.category,
      total: 0,
      answered: 0,
      correct: 0,
      accuracyPercent: 0
    };
    existingTopic.total += 1;

    const ans = state.b2ExerciseAnswers[ex.id];
    if (ans) {
      b2Answered++;
      existingTopic.answered += 1;
      if (ex.category === 'grammar') gramAnswered++;
      else vocabAnswered++;

      if (ans.isCorrect) {
        b2Correct++;
        existingTopic.correct += 1;
        if (ex.category === 'grammar') gramCorrect++;
        else vocabCorrect++;
      }
    }
    existingTopic.accuracyPercent =
      existingTopic.answered > 0
        ? Math.round((existingTopic.correct / existingTopic.answered) * 100)
        : 0;
    topicMap.set(ex.b2Topic, existingTopic);
  }

  const b2AccuracyPercent = b2Answered > 0 ? Math.round((b2Correct / b2Answered) * 100) : 0;
  const b2GrammarAccuracyPercent =
    gramAnswered > 0 ? Math.round((gramCorrect / gramAnswered) * 100) : 0;
  const b2VocabAccuracyPercent =
    vocabAnswered > 0 ? Math.round((vocabCorrect / vocabAnswered) * 100) : 0;

  const glossaryTotal = glossaryTerms.length;
  let glossaryMastered = 0;
  let glossaryLearning = 0;
  for (const term of glossaryTerms) {
    const st = state.glossaryMastery[term.id];
    if (st === 'mastered') glossaryMastered++;
    else if (st === 'learning') glossaryLearning++;
  }

  const allLogs = Object.values(state.dailyLogs);
  const totalMinutesStudied = allLogs.reduce((acc, l) => acc + l.minutesStudied, 0);
  const todayStr = getTodayDateString(now);
  const todayMinutesStudied = state.dailyLogs[todayStr]?.minutesStudied ?? 0;
  const dailyGoalMinutes = Math.max(5, state.preferences.dailyGoalMinutes || 20);
  const dailyGoalProgressPercent = Math.min(
    100,
    Math.round((todayMinutesStudied / dailyGoalMinutes) * 100)
  );

  // Calculate consecutive day streak up to today
  let currentStreakDays = 0;
  const checkDate = new Date(now);
  for (let i = 0; i < 365; i++) {
    const dStr = getTodayDateString(checkDate);
    const log = state.dailyLogs[dStr];
    if (log && (log.minutesStudied > 0 || log.exercisesAnswered > 0)) {
      currentStreakDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      // If today has 0 activity yet, check starting from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Build 7-day chronological series ending today
  const recentDailySeries: DailyStudyLog[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    const dStr = getTodayDateString(d);
    recentDailySeries.push(
      state.dailyLogs[dStr] ?? {
        date: dStr,
        minutesStudied: 0,
        chaptersVisited: [],
        exercisesAnswered: 0,
        correctAnswers: 0
      }
    );
  }

  return {
    totalSections,
    completedSectionsCount,
    overallBookCompletionPercent,
    totalWordsInBook,
    estimatedWordsRead,
    comprehensionTotal,
    comprehensionAnswered,
    comprehensionCorrect,
    comprehensionAccuracyPercent,
    b2Total,
    b2Answered,
    b2Correct,
    b2AccuracyPercent,
    b2GrammarAccuracyPercent,
    b2VocabAccuracyPercent,
    glossaryTotal,
    glossaryMastered,
    glossaryLearning,
    totalMinutesStudied,
    todayMinutesStudied,
    dailyGoalMinutes,
    dailyGoalProgressPercent,
    currentStreakDays,
    chapterMetrics,
    b2TopicMetrics: Array.from(topicMap.values()),
    recentDailySeries
  };
}

export function encodeSyncToken(state: UserStudyState): string {
  const json = JSON.stringify(state);
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(encodeURIComponent(json));
  }
  return Buffer.from(encodeURIComponent(json), 'utf-8').toString('base64');
}

export function decodeSyncToken(token: string): UserStudyState {
  const clean = token.trim();
  let decodedUri = '';
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    decodedUri = window.atob(clean);
  } else {
    decodedUri = Buffer.from(clean, 'base64').toString('utf-8');
  }
  const parsed = JSON.parse(decodeURIComponent(decodedUri)) as UserStudyState;
  if (!parsed || typeof parsed !== 'object' || typeof parsed.version !== 'number') {
    throw new Error('Invalid synchronization token format');
  }
  return parsed;
}

export function mergeStudyStates(local: UserStudyState, remote: UserStudyState): UserStudyState {
  const completedChapters = Array.from(
    new Set([...local.completedChapters, ...remote.completedChapters])
  );

  const chapterReadingProgress: Record<string, number> = { ...local.chapterReadingProgress };
  for (const [k, v] of Object.entries(remote.chapterReadingProgress || {})) {
    chapterReadingProgress[k] = Math.max(chapterReadingProgress[k] ?? 0, v);
  }

  const comprehensionAnswers = { ...local.comprehensionAnswers, ...remote.comprehensionAnswers };
  const b2ExerciseAnswers = { ...local.b2ExerciseAnswers, ...remote.b2ExerciseAnswers };

  const rank: Record<string, number> = { new: 0, learning: 1, mastered: 2 };
  const glossaryMastery = { ...local.glossaryMastery };
  for (const [k, v] of Object.entries(remote.glossaryMastery || {})) {
    const existing = glossaryMastery[k] ?? 'new';
    if ((rank[v] ?? 0) >= (rank[existing] ?? 0)) {
      glossaryMastery[k] = v;
    }
  }

  const bookmarkedParagraphs = Array.from(
    new Set([...local.bookmarkedParagraphs, ...(remote.bookmarkedParagraphs || [])])
  );

  const personalNotes = { ...local.personalNotes, ...(remote.personalNotes || {}) };

  const dailyLogs: Record<string, DailyStudyLog> = { ...local.dailyLogs };
  for (const [date, rLog] of Object.entries(remote.dailyLogs || {})) {
    const lLog = dailyLogs[date];
    if (!lLog) {
      dailyLogs[date] = rLog;
    } else {
      dailyLogs[date] = {
        date,
        minutesStudied: Math.max(lLog.minutesStudied, rLog.minutesStudied),
        chaptersVisited: Array.from(new Set([...lLog.chaptersVisited, ...rLog.chaptersVisited])),
        exercisesAnswered: Math.max(lLog.exercisesAnswered, rLog.exercisesAnswered),
        correctAnswers: Math.max(lLog.correctAnswers, rLog.correctAnswers)
      };
    }
  }

  const isRemoteNewer =
    new Date(remote.lastUpdatedIso || 0).getTime() > new Date(local.lastUpdatedIso || 0).getTime();

  return {
    version: 1,
    lastUpdatedIso: new Date().toISOString(),
    deviceLabel: local.deviceLabel,
    currentSectionId: isRemoteNewer ? remote.currentSectionId : local.currentSectionId,
    completedChapters,
    chapterReadingProgress,
    comprehensionAnswers,
    b2ExerciseAnswers,
    glossaryMastery,
    bookmarkedParagraphs,
    personalNotes,
    dailyLogs,
    lastReminderShownDate: local.lastReminderShownDate || remote.lastReminderShownDate,
    preferences: isRemoteNewer
      ? { ...local.preferences, ...remote.preferences }
      : { ...remote.preferences, ...local.preferences }
  };
}

export function generateCsvReport(analytics: StudyAnalyticsSummary): string {
  const headers = [
    'Section ID',
    'Part',
    'Chapter Title',
    'Word Count',
    'Reading Progress (%)',
    'Completed',
    'Comprehension Questions Answered',
    'Comprehension Correct',
    'Accuracy (%)'
  ];

  const escapeCsv = (val: string | number | boolean) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = analytics.chapterMetrics.map((m) =>
    [
      m.sectionId,
      m.part,
      m.title,
      m.wordCount,
      m.readingProgress,
      m.isCompleted ? 'Yes' : 'No',
      m.questionsAnswered,
      m.questionsCorrect,
      m.accuracyPercent
    ]
      .map(escapeCsv)
      .join(',')
  );

  const summaryRows = [
    '',
    'B2 SKILL BREAKDOWN,Category,Total Items,Answered,Correct,Accuracy (%)',
    ...analytics.b2TopicMetrics.map((t) =>
      [t.topic, t.category.toUpperCase(), t.total, t.answered, t.correct, t.accuracyPercent]
        .map(escapeCsv)
        .join(',')
    ),
    '',
    `OVERALL BOOK COMPLETION (%),${analytics.overallBookCompletionPercent}`,
    `ESTIMATED WORDS READ,${analytics.estimatedWordsRead}`,
    `OVERALL COMPREHENSION ACCURACY (%),${analytics.comprehensionAccuracyPercent}`,
    `OVERALL B2 GRAMMAR & VOCAB ACCURACY (%),${analytics.b2AccuracyPercent}`,
    `GLOSSARY TERMS MASTERED,${analytics.glossaryMastered}/${analytics.glossaryTotal}`,
    `TOTAL STUDY TIME (MINUTES),${analytics.totalMinutesStudied}`,
    `CURRENT STREAK (DAYS),${analytics.currentStreakDays}`
  ];

  return [headers.join(','), ...rows, ...summaryRows].join('\n');
}

export interface TextSegment {
  text: string;
  glossaryTerm?: GlossaryTerm;
}

export function segmentParagraphWithGlossary(
  paragraph: string,
  glossaryTerms: GlossaryTerm[],
  enableHighlighting: boolean
): TextSegment[] {
  if (!enableHighlighting || !paragraph) {
    return [{ text: paragraph }];
  }

  // Build lookup map from lowercase form to GlossaryTerm
  const formToTerm = new Map<string, GlossaryTerm>();
  const allForms: string[] = [];

  for (const term of glossaryTerms) {
    for (const form of term.matchForms) {
      const lower = form.toLowerCase();
      if (!formToTerm.has(lower)) {
        formToTerm.set(lower, term);
        allForms.push(form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      }
    }
  }

  // Sort longest match first so "House of Lords" matches before "Lords"
  allForms.sort((a, b) => b.length - a.length);
  if (allForms.length === 0) return [{ text: paragraph }];

  const pattern = new RegExp(`\\b(${allForms.join('|')})\\b`, 'gi');
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(paragraph)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: paragraph.slice(lastIndex, match.index) });
    }
    const matchedText = match[0];
    const glossaryTerm = formToTerm.get(matchedText.toLowerCase());
    segments.push({ text: matchedText, glossaryTerm });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < paragraph.length) {
    segments.push({ text: paragraph.slice(lastIndex) });
  }

  return segments;
}
