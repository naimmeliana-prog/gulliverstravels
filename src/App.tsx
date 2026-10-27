/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import parsedChapters from './data/parsedChapters.json';
import { COMPREHENSION_QUESTIONS } from './data/comprehensionData';
import { B2_EXERCISES } from './data/b2ExercisesData';
import { GLOSSARY_TERMS } from './data/glossaryData';
import {
  BookSection,
  UserStudyState,
  ReaderPreferences,
  TermMasteryStatus
} from './types/study';
import {
  STORAGE_KEY,
  createDefaultStudyState,
  calculateStudyAnalytics,
  mergeStudyStates,
  getTodayDateString,
  generateCsvReport
} from './utils/studyEngine';
import { ReaderView } from './components/ReaderView';
import { B2LabView } from './components/B2LabView';
import { GlossaryView } from './components/GlossaryView';
import { AnalyticsView } from './components/AnalyticsView';
import { SyncSettingsView } from './components/SyncSettingsView';
import { Bell, X } from 'lucide-react';

type ActiveTab = 'reader' | 'b2-lab' | 'glossary' | 'analytics' | 'sync';

const SECTIONS = parsedChapters as BookSection[];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');
  const [studyState, setStudyState] = useState<UserStudyState>(() => {
    if (typeof window === 'undefined') return createDefaultStudyState();
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserStudyState;
        if (parsed && typeof parsed.version === 'number') {
          return {
            ...parsed,
            preferences: {
              ...parsed.preferences,
              uiLanguage: parsed.preferences?.uiLanguage || 'es'
            }
          };
        }
      }
    } catch {
      // Fallback to default state
    }
    return createDefaultStudyState();
  });

  const [showReminderBanner, setShowReminderBanner] = useState(false);

  const uiLang = studyState.preferences.uiLanguage || 'es';
  const isEs = uiLang === 'es';

  // Persist to localStorage & sync dark mode class on <html>
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(studyState));
    } catch {
      // Ignore storage quota errors
    }
    const isDark = studyState.preferences.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [studyState]);

  // Automatic 60-second active study timer while reading or practicing
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      const today = getTodayDateString();
      setStudyState((prev) => {
        const prevLog = prev.dailyLogs[today] ?? {
          date: today,
          minutesStudied: 0,
          chaptersVisited: [prev.currentSectionId],
          exercisesAnswered: 0,
          correctAnswers: 0
        };
        const updatedChapters = prevLog.chaptersVisited.includes(prev.currentSectionId)
          ? prevLog.chaptersVisited
          : [...prevLog.chaptersVisited, prev.currentSectionId];

        return {
          ...prev,
          lastUpdatedIso: new Date().toISOString(),
          dailyLogs: {
            ...prev.dailyLogs,
            [today]: {
              ...prevLog,
              minutesStudied: prevLog.minutesStudied + 1,
              chaptersVisited: updatedChapters
            }
          }
        };
      });
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  // Check daily study discipline reminder after 12 seconds of dwell time
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = getTodayDateString();
      const todayMins = studyState.dailyLogs[today]?.minutesStudied ?? 0;
      if (
        studyState.preferences.reminderEnabled &&
        studyState.lastReminderShownDate !== today &&
        todayMins < studyState.preferences.dailyGoalMinutes
      ) {
        setShowReminderBanner(true);
      }
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [
    studyState.preferences.reminderEnabled,
    studyState.preferences.dailyGoalMinutes,
    studyState.lastReminderShownDate,
    studyState.dailyLogs
  ]);

  const currentSection = useMemo(
    () => SECTIONS.find((s) => s.id === studyState.currentSectionId) || SECTIONS[0],
    [studyState.currentSectionId]
  );

  const analytics = useMemo(
    () =>
      calculateStudyAnalytics(
        studyState,
        SECTIONS,
        COMPREHENSION_QUESTIONS,
        B2_EXERCISES,
        GLOSSARY_TERMS
      ),
    [studyState]
  );

  const handleSelectSection = (sectionId: string) => {
    const today = getTodayDateString();
    setStudyState((prev) => {
      const prevLog = prev.dailyLogs[today] ?? {
        date: today,
        minutesStudied: 0,
        chaptersVisited: [],
        exercisesAnswered: 0,
        correctAnswers: 0
      };
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        currentSectionId: sectionId,
        chapterReadingProgress: {
          ...prev.chapterReadingProgress,
          [sectionId]: Math.max(prev.chapterReadingProgress[sectionId] ?? 0, 15)
        },
        dailyLogs: {
          ...prev.dailyLogs,
          [today]: {
            ...prevLog,
            chaptersVisited: Array.from(new Set([...prevLog.chaptersVisited, sectionId]))
          }
        }
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProgress = (sectionId: string, progress: number) => {
    setStudyState((prev) => {
      const completed =
        progress >= 100
          ? Array.from(new Set([...prev.completedChapters, sectionId]))
          : prev.completedChapters.filter((id) => id !== sectionId);
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        completedChapters: completed,
        chapterReadingProgress: {
          ...prev.chapterReadingProgress,
          [sectionId]: progress
        }
      };
    });
  };

  const handleToggleCompleteChapter = (sectionId: string) => {
    setStudyState((prev) => {
      const exists = prev.completedChapters.includes(sectionId);
      const completedChapters = exists
        ? prev.completedChapters.filter((id) => id !== sectionId)
        : [...prev.completedChapters, sectionId];
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        completedChapters,
        chapterReadingProgress: {
          ...prev.chapterReadingProgress,
          [sectionId]: exists ? 50 : 100
        }
      };
    });
  };

  const handleAnswerComprehension = (
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean
  ) => {
    const today = getTodayDateString();
    setStudyState((prev) => {
      const prevLog = prev.dailyLogs[today] ?? {
        date: today,
        minutesStudied: 1,
        chaptersVisited: [prev.currentSectionId],
        exercisesAnswered: 0,
        correctAnswers: 0
      };
      const alreadyAnswered = prev.comprehensionAnswers[questionId] !== undefined;
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        comprehensionAnswers: {
          ...prev.comprehensionAnswers,
          [questionId]: {
            selectedIndex,
            isCorrect,
            timestamp: new Date().toISOString()
          }
        },
        dailyLogs: {
          ...prev.dailyLogs,
          [today]: {
            ...prevLog,
            exercisesAnswered: alreadyAnswered
              ? prevLog.exercisesAnswered
              : prevLog.exercisesAnswered + 1,
            correctAnswers:
              !alreadyAnswered && isCorrect
                ? prevLog.correctAnswers + 1
                : prevLog.correctAnswers
          }
        }
      };
    });
  };

  const handleAnswerB2 = (exerciseId: string, selectedIndex: number, isCorrect: boolean) => {
    const today = getTodayDateString();
    setStudyState((prev) => {
      const prevLog = prev.dailyLogs[today] ?? {
        date: today,
        minutesStudied: 1,
        chaptersVisited: [prev.currentSectionId],
        exercisesAnswered: 0,
        correctAnswers: 0
      };
      const alreadyAnswered = prev.b2ExerciseAnswers[exerciseId] !== undefined;
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        b2ExerciseAnswers: {
          ...prev.b2ExerciseAnswers,
          [exerciseId]: {
            selectedIndex,
            isCorrect,
            timestamp: new Date().toISOString()
          }
        },
        dailyLogs: {
          ...prev.dailyLogs,
          [today]: {
            ...prevLog,
            exercisesAnswered: alreadyAnswered
              ? prevLog.exercisesAnswered
              : prevLog.exercisesAnswered + 1,
            correctAnswers:
              !alreadyAnswered && isCorrect
                ? prevLog.correctAnswers + 1
                : prevLog.correctAnswers
          }
        }
      };
    });
  };

  const handleResetB2Category = (category: 'all' | 'grammar' | 'vocabulary') => {
    setStudyState((prev) => {
      if (category === 'all') {
        return {
          ...prev,
          lastUpdatedIso: new Date().toISOString(),
          b2ExerciseAnswers: {}
        };
      }
      const nextAnswers = { ...prev.b2ExerciseAnswers };
      for (const ex of B2_EXERCISES) {
        if (ex.category === category) {
          delete nextAnswers[ex.id];
        }
      }
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        b2ExerciseAnswers: nextAnswers
      };
    });
  };

  const handleSetGlossaryMastery = (termId: string, status: TermMasteryStatus) => {
    setStudyState((prev) => ({
      ...prev,
      lastUpdatedIso: new Date().toISOString(),
      glossaryMastery: {
        ...prev.glossaryMastery,
        [termId]: status
      }
    }));
  };

  const handleToggleBookmark = (paragraphKey: string) => {
    setStudyState((prev) => {
      const exists = prev.bookmarkedParagraphs.includes(paragraphKey);
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        bookmarkedParagraphs: exists
          ? prev.bookmarkedParagraphs.filter((k) => k !== paragraphKey)
          : [...prev.bookmarkedParagraphs, paragraphKey]
      };
    });
  };

  const handleSaveChapterNote = (sectionId: string, note: string) => {
    setStudyState((prev) => ({
      ...prev,
      lastUpdatedIso: new Date().toISOString(),
      personalNotes: {
        ...prev.personalNotes,
        [sectionId]: note
      }
    }));
  };

  const handleUpdatePreferences = (patch: Partial<ReaderPreferences>) => {
    setStudyState((prev) => ({
      ...prev,
      lastUpdatedIso: new Date().toISOString(),
      preferences: {
        ...prev.preferences,
        ...patch
      }
    }));
  };

  const handleLogManualStudyMinutes = (minutes: number) => {
    const today = getTodayDateString();
    setStudyState((prev) => {
      const prevLog = prev.dailyLogs[today] ?? {
        date: today,
        minutesStudied: 0,
        chaptersVisited: [prev.currentSectionId],
        exercisesAnswered: 0,
        correctAnswers: 0
      };
      return {
        ...prev,
        lastUpdatedIso: new Date().toISOString(),
        dailyLogs: {
          ...prev.dailyLogs,
          [today]: {
            ...prevLog,
            minutesStudied: prevLog.minutesStudied + minutes
          }
        }
      };
    });
  };

  const handleQuickExportCsv = () => {
    const csv = generateCsvReport(analytics);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gullivers-travels-b2-report-${getTodayDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'reader', label: isEs ? 'Lector del Libro' : 'Book Reader' },
    { id: 'b2-lab', label: isEs ? 'Gramática y Vocab B2' : 'B2 Grammar & Vocab' },
    { id: 'glossary', label: isEs ? 'Glosario' : 'Glossary' },
    { id: 'analytics', label: isEs ? 'Estadísticas' : 'Analytics' },
    { id: 'sync', label: isEs ? 'Sincronizar y Ajustes' : 'Sync & Settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs sticky top-0 z-30 no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('reader');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 font-display"
        >
          Gulliver’s Travels
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav
          aria-label={isEs ? 'Secciones principales de estudio' : 'Primary Study Sections'}
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === item.id
                  ? 'text-slate-900 dark:text-white border-b-2 border-sky-600 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleQuickExportCsv}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-sky-600 rounded-lg hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0"
          >
            {isEs ? 'Exportar Reporte CSV' : 'Export CSV Report'}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar (visible only on small screens, compact height) */}
      <nav
        aria-label={isEs ? 'Navegación móvil' : 'Mobile Navigation'}
        className="md:hidden flex items-center justify-around border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-2 overflow-x-auto no-print"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeTab === item.id
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Daily Study Discipline Notification Banner */}
      {showReminderBanner && (
        <div className="bg-sky-600 text-white px-6 py-2.5 text-xs flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 shrink-0" />
            <span>
              {isEs ? (
                <>
                  Recordatorio Diario de Estudio ({studyState.preferences.reminderTime}): Has
                  completado{' '}
                  <strong className="font-mono-tabular">{analytics.todayMinutesStudied}m</strong> de
                  tu meta diaria de{' '}
                  <strong className="font-mono-tabular">{analytics.dailyGoalMinutes}m</strong>. ¡Mantén
                  tu racha de{' '}
                  <strong className="font-mono-tabular">{analytics.currentStreakDays} días</strong>!
                </>
              ) : (
                <>
                  Daily Study Reminder ({studyState.preferences.reminderTime}): You have completed{' '}
                  <strong className="font-mono-tabular">{analytics.todayMinutesStudied}m</strong> of
                  your <strong className="font-mono-tabular">{analytics.dailyGoalMinutes}m</strong>{' '}
                  daily B2 target today. Keep your{' '}
                  <strong className="font-mono-tabular">{analytics.currentStreakDays}-day</strong>{' '}
                  streak going!
                </>
              )}
            </span>
          </div>
          <button
            onClick={() => {
              setShowReminderBanner(false);
              setStudyState((prev) => ({
                ...prev,
                lastReminderShownDate: getTodayDateString()
              }));
            }}
            className="p-1 hover:bg-sky-700 rounded-md shrink-0"
            aria-label={isEs ? 'Cerrar recordatorio diario' : 'Dismiss daily reminder'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reader' && (
          <ReaderView
            sections={SECTIONS}
            currentSection={currentSection}
            comprehensionQuestions={COMPREHENSION_QUESTIONS}
            glossaryTerms={GLOSSARY_TERMS}
            studyState={studyState}
            onSelectSection={handleSelectSection}
            onUpdateProgress={handleUpdateProgress}
            onToggleCompleteChapter={handleToggleCompleteChapter}
            onAnswerComprehension={handleAnswerComprehension}
            onSetGlossaryMastery={handleSetGlossaryMastery}
            onToggleBookmark={handleToggleBookmark}
            onSaveChapterNote={handleSaveChapterNote}
            onUpdatePreferences={handleUpdatePreferences}
          />
        )}

        {activeTab === 'b2-lab' && (
          <B2LabView
            exercises={B2_EXERCISES}
            sections={SECTIONS}
            studyState={studyState}
            onAnswerB2={handleAnswerB2}
            onResetB2Category={handleResetB2Category}
            onJumpToChapter={(secId) => {
              handleSelectSection(secId);
              setActiveTab('reader');
            }}
          />
        )}

        {activeTab === 'glossary' && (
          <GlossaryView
            terms={GLOSSARY_TERMS}
            sections={SECTIONS}
            studyState={studyState}
            onSetMastery={handleSetGlossaryMastery}
            onJumpToChapter={(secId) => {
              handleSelectSection(secId);
              setActiveTab('reader');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            uiLang={uiLang}
            onLogManualStudyMinutes={handleLogManualStudyMinutes}
            onJumpToChapter={(secId) => {
              handleSelectSection(secId);
              setActiveTab('reader');
            }}
          />
        )}

        {activeTab === 'sync' && (
          <SyncSettingsView
            studyState={studyState}
            onMergeRemoteState={(remote) =>
              setStudyState((prev) => mergeStudyStates(prev, remote))
            }
            onUpdatePreferences={handleUpdatePreferences}
            onResetAllProgress={() => setStudyState(createDefaultStudyState())}
          />
        )}
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            Gulliver’s Travels by Jonathan Swift ·{' '}
            {isEs
              ? `Edición de Estudio Personal B2 (Penguin Readers) · ${analytics.totalWordsInBook.toLocaleString()} palabras en 11 secciones`
              : `Penguin Readers Personal B2 Study Edition · ${analytics.totalWordsInBook.toLocaleString()} words across 11 sections`}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                handleUpdatePreferences({
                  uiLanguage: isEs ? 'en' : 'es'
                })
              }
              className="hover:text-slate-900 dark:hover:text-slate-200 underline"
            >
              {isEs ? 'Idioma UI: Español (Cambiar a EN)' : 'UI Language: English (Switch to ES)'}
            </button>
            <span>·</span>
            <button
              onClick={() =>
                handleUpdatePreferences({
                  theme: studyState.preferences.theme === 'dark' ? 'light' : 'dark'
                })
              }
              className="hover:text-slate-900 dark:hover:text-slate-200 underline"
            >
              {isEs
                ? `Cambiar a Modo ${studyState.preferences.theme === 'dark' ? 'Claro' : 'Oscuro'}`
                : `Switch to ${studyState.preferences.theme === 'dark' ? 'Light Paper' : 'Dark Night'} Mode`}
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('sync')}
              className="hover:text-slate-900 dark:hover:text-slate-200 underline"
            >
              {isEs ? 'Sincronizar Móvil y Escritorio' : 'Sync Mobile & Desktop'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
