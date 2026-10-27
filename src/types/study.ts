export interface BookSection {
  id: string;
  part: string;
  chapterNumber: number;
  title: string;
  fullTitle: string;
  pageStart: number;
  paragraphs: string[];
  wordCount: number;
}

export type ExerciseType =
  | 'multiple-choice'
  | 'true-false-correction'
  | 'reference-identification'
  | 'causal-why';

export interface ComprehensionQuestion {
  id: string;
  chapterId: string;
  type: ExerciseType;
  prompt: string;
  quoteContext?: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationEs: string;
  skillTag: string;
}

export type B2Category = 'grammar' | 'vocabulary';

export interface B2ExerciseItem {
  id: string;
  category: B2Category;
  b2Topic: string;
  cefrDescriptor: string;
  relatedChapterId: string;
  sentenceStem: string;
  targetStructureHint: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationEs: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  matchForms: string[];
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom' | 'literary-term';
  cefrLevel: 'B1' | 'B2' | 'C1';
  definitionEn: string;
  translationEs: string;
  chapterId: string;
  contextQuote: string;
  b2UsageNote: string;
}

export type TermMasteryStatus = 'new' | 'learning' | 'mastered';

export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  chaptersVisited: string[];
  exercisesAnswered: number;
  correctAnswers: number;
}

export interface ReaderPreferences {
  uiLanguage?: 'es' | 'en';
  theme: 'light' | 'dark';
  fontFamily: 'serif' | 'sans';
  fontSize: number; // 15 to 22
  lineHeight: number; // 1.5 to 2.0
  columnWidth: 'narrow' | 'balanced' | 'wide';
  showParagraphNumbers: boolean;
  highlightGlossaryTerms: boolean;
  speechRate: number; // 0.8 to 1.25
  dailyGoalMinutes: number;
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm
}

export interface UserStudyState {
  version: number;
  lastUpdatedIso: string;
  deviceLabel: string;
  currentSectionId: string;
  completedChapters: string[];
  chapterReadingProgress: Record<string, number>; // sectionId -> 0..100
  comprehensionAnswers: Record<string, { selectedIndex: number; isCorrect: boolean; timestamp: string }>;
  b2ExerciseAnswers: Record<string, { selectedIndex: number; isCorrect: boolean; timestamp: string }>;
  glossaryMastery: Record<string, TermMasteryStatus>;
  bookmarkedParagraphs: string[]; // `${sectionId}:${paragraphIdx}`
  personalNotes: Record<string, string>; // sectionId -> markdown/text note
  dailyLogs: Record<string, DailyStudyLog>;
  lastReminderShownDate: string | null;
  preferences: ReaderPreferences;
}
