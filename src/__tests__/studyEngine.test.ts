import { describe, it, expect } from 'vitest';
import parsedChapters from '../data/parsedChapters.json';
import { COMPREHENSION_QUESTIONS } from '../data/comprehensionData';
import { B2_EXERCISES } from '../data/b2ExercisesData';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { AUDIO_TRACKS } from '../data/audioTracksData';
import {
  createDefaultStudyState,
  calculateStudyAnalytics,
  encodeSyncToken,
  decodeSyncToken,
  mergeStudyStates,
  generateCsvReport,
  segmentParagraphWithGlossary
} from '../utils/studyEngine';
import { BookSection } from '../types/study';

const sections = parsedChapters as BookSection[];

describe('Gulliver’s Travels B2 Study Engine & Dataset Integrity', () => {
  it('loads the complete 11 sections of the book (Introduction + Parts 1, 2, and 3)', () => {
    expect(sections.length).toBe(11);
    const ids = sections.map((s) => s.id);
    expect(ids).toEqual([
      'intro',
      'p1-c1',
      'p1-c2',
      'p1-c3',
      'p1-c4',
      'p2-c1',
      'p2-c2',
      'p2-c3',
      'p3-c1',
      'p3-c2',
      'p3-c3'
    ]);
    const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
    expect(totalWords).toBeGreaterThan(9500);
  });

  it('maps all 29 official MP3 audio tracks to their corresponding book chapters', () => {
    expect(AUDIO_TRACKS.length).toBe(29);
    const sectionIds = new Set(sections.map((s) => s.id));
    for (const track of AUDIO_TRACKS) {
      expect(sectionIds.has(track.chapterId)).toBe(true);
      expect(track.src).toMatch(/^\/assets\/aistudio\/Track_\d{2}_[a-f0-9]+\.mp3$/);
    }
    for (const sec of sections) {
      const tracksForSec = AUDIO_TRACKS.filter((t) => t.chapterId === sec.id);
      expect(tracksForSec.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('provides interactive reading comprehension exercises for every chapter', () => {
    for (const sec of sections) {
      const chapQuestions = COMPREHENSION_QUESTIONS.filter((q) => q.chapterId === sec.id);
      expect(chapQuestions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('calculates accurate study analytics, accuracy percentages, and streaks', () => {
    const fixedDate = new Date('2026-10-27T12:00:00Z');
    const state = createDefaultStudyState(fixedDate);
    state.completedChapters = ['intro', 'p1-c1'];
    state.comprehensionAnswers = {
      'comp-intro-1': { selectedIndex: 1, isCorrect: true, timestamp: fixedDate.toISOString() },
      'comp-intro-2': { selectedIndex: 0, isCorrect: false, timestamp: fixedDate.toISOString() }
    };
    state.b2ExerciseAnswers = {
      'b2-gram-1': { selectedIndex: 0, isCorrect: true, timestamp: fixedDate.toISOString() },
      'b2-vocab-1': { selectedIndex: 0, isCorrect: true, timestamp: fixedDate.toISOString() }
    };
    state.glossaryMastery = {
      'term-satire': 'mastered',
      'term-strings': 'learning'
    };

    const summary = calculateStudyAnalytics(
      state,
      sections,
      COMPREHENSION_QUESTIONS,
      B2_EXERCISES,
      GLOSSARY_TERMS,
      fixedDate
    );

    expect(summary.completedSectionsCount).toBe(2);
    expect(summary.comprehensionAnswered).toBe(2);
    expect(summary.comprehensionCorrect).toBe(1);
    expect(summary.comprehensionAccuracyPercent).toBe(50);
    expect(summary.b2Answered).toBe(2);
    expect(summary.b2AccuracyPercent).toBe(100);
    expect(summary.glossaryMastered).toBe(1);
    expect(summary.glossaryLearning).toBe(1);
    expect(summary.currentStreakDays).toBeGreaterThanOrEqual(1);
  });

  it('encodes, decodes, and non-destructively merges multi-device sync states', () => {
    const now = new Date('2026-10-27T12:00:00Z');
    const desktopState = createDefaultStudyState(now);
    desktopState.completedChapters = ['intro'];
    desktopState.chapterReadingProgress = { intro: 100, 'p1-c1': 40 };
    desktopState.glossaryMastery = { 'term-satire': 'learning' };

    const mobileState = createDefaultStudyState(new Date('2026-10-27T14:00:00Z'));
    mobileState.currentSectionId = 'p1-c2';
    mobileState.completedChapters = ['p1-c1'];
    mobileState.chapterReadingProgress = { 'p1-c1': 100, 'p1-c2': 60 };
    mobileState.glossaryMastery = { 'term-satire': 'mastered', 'term-yahoo': 'learning' };

    const token = encodeSyncToken(mobileState);
    const decodedMobile = decodeSyncToken(token);
    const merged = mergeStudyStates(desktopState, decodedMobile);

    expect(merged.completedChapters).toContain('intro');
    expect(merged.completedChapters).toContain('p1-c1');
    expect(merged.chapterReadingProgress['p1-c1']).toBe(100);
    expect(merged.chapterReadingProgress['p1-c2']).toBe(60);
    expect(merged.glossaryMastery['term-satire']).toBe('mastered');
    expect(merged.glossaryMastery['term-yahoo']).toBe('learning');
    expect(merged.currentSectionId).toBe('p1-c2');
  });

  it('generates valid CSV report output with chapter metrics and B2 breakdown', () => {
    const state = createDefaultStudyState(new Date('2026-10-27T12:00:00Z'));
    const analytics = calculateStudyAnalytics(
      state,
      sections,
      COMPREHENSION_QUESTIONS,
      B2_EXERCISES,
      GLOSSARY_TERMS
    );
    const csv = generateCsvReport(analytics);

    expect(csv).toContain('Section ID,Part,Chapter Title,Word Count');
    expect(csv).toContain('p1-c1');
    expect(csv).toContain('OVERALL BOOK COMPLETION (%)');
  });

  it('segments paragraph text and links glossary terms accurately', () => {
    const sample = 'The Big-enders and Little-enders fought while the Parliament debated gunpowder.';
    const segments = segmentParagraphWithGlossary(sample, GLOSSARY_TERMS, true);
    const matchedTerms = segments.filter((s) => s.glossaryTerm).map((s) => s.glossaryTerm?.id);

    expect(matchedTerms).toContain('term-big-enders');
    expect(matchedTerms).toContain('term-parliament');
    expect(matchedTerms).toContain('term-gunpowder');
  });
});
