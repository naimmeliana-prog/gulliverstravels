import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  FileText,
  SlidersHorizontal,
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Headphones,
  ListMusic
} from 'lucide-react';
import {
  BookSection,
  ComprehensionQuestion,
  GlossaryTerm,
  TermMasteryStatus,
  UserStudyState,
  ReaderPreferences
} from '../types/study';
import { AUDIO_TRACKS, AudioTrackItem } from '../data/audioTracksData';
import { segmentParagraphWithGlossary } from '../utils/studyEngine';

const PdfCanvasViewer = lazy(() =>
  import('./PdfCanvasViewer').then((m) => ({ default: m.PdfCanvasViewer }))
);

interface ReaderViewProps {
  sections: BookSection[];
  currentSection: BookSection;
  comprehensionQuestions: ComprehensionQuestion[];
  glossaryTerms: GlossaryTerm[];
  studyState: UserStudyState;
  onSelectSection: (sectionId: string) => void;
  onUpdateProgress: (sectionId: string, progress: number) => void;
  onToggleCompleteChapter: (sectionId: string) => void;
  onAnswerComprehension: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onSetGlossaryMastery: (termId: string, status: TermMasteryStatus) => void;
  onToggleBookmark: (paragraphKey: string) => void;
  onSaveChapterNote: (sectionId: string, note: string) => void;
  onUpdatePreferences: (patch: Partial<ReaderPreferences>) => void;
}

const ATTACHED_PDFS = [
  {
    id: 'book-pdf',
    labelEs: 'Libro Penguin Readers (PDF)',
    labelEn: 'Penguin Readers Book (PDF)',
    path: '/assets/aistudio/PENGUIN_READERS_Level_2_Gulliver_s_Travels_888d4385.pdf',
    syncChapterPage: true
  },
  {
    id: 'worksheets-pdf',
    labelEs: 'Fichas de Actividades y Test (PDF)',
    labelEn: 'Activity Worksheets & Progress Test (PDF)',
    path: '/assets/aistudio/PENGUIN_READERS_Level_2_Gulliver_s_Travels__Worksheets__ef1e5b8f.pdf',
    syncChapterPage: false
  },
  {
    id: 'notes-pdf',
    labelEs: 'Notas del Profesor y Guía (PDF)',
    labelEn: 'Teacher’s Notes & Satire Guide (PDF)',
    path: '/assets/aistudio/PENGUIN_READERS_Level_2_Gulliver_s_Travels__Teacher_s_Notes__c6525aef.pdf',
    syncChapterPage: false
  }
];

function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  sections,
  currentSection,
  comprehensionQuestions,
  glossaryTerms,
  studyState,
  onSelectSection,
  onUpdateProgress,
  onToggleCompleteChapter,
  onAnswerComprehension,
  onSetGlossaryMastery,
  onToggleBookmark,
  onSaveChapterNote,
  onUpdatePreferences
}) => {
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);
  const [showAppearancePanel, setShowAppearancePanel] = useState(false);
  const [showAllTracksModal, setShowAllTracksModal] = useState(false);
  const [readerMode, setReaderMode] = useState<'interactive' | 'pdf'>('interactive');
  const [selectedPdfId, setSelectedPdfId] = useState<string>('book-pdf');
  const [noteDraft, setNoteDraft] = useState(studyState.personalNotes[currentSection.id] || '');
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  // Official MP3 Audiobook Player State
  const chapterTracks = AUDIO_TRACKS.filter((t) => t.chapterId === currentSection.id);
  const [currentTrack, setCurrentTrack] = useState<AudioTrackItem>(
    () => chapterTracks[0] || AUDIO_TRACKS[0]
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [autoAdvanceTrack, setAutoAdvanceTrack] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { preferences } = studyState;
  const uiLang = preferences.uiLanguage || 'es';
  const isEs = uiLang === 'es';

  useEffect(() => {
    setNoteDraft(studyState.personalNotes[currentSection.id] || '');
    const tracksForChapter = AUDIO_TRACKS.filter((t) => t.chapterId === currentSection.id);
    if (tracksForChapter.length > 0 && currentTrack.chapterId !== currentSection.id) {
      setCurrentTrack(tracksForChapter[0]);
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
    }
  }, [currentSection.id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = preferences.speechRate || 1.0;
    }
  }, [preferences.speechRate, currentTrack.id]);

  const handleTogglePlayPause = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlayingAudio) {
      el.pause();
      setIsPlayingAudio(false);
    } else {
      el.playbackRate = preferences.speechRate || 1.0;
      el.play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  const handleSelectTrack = (track: AudioTrackItem, autoPlay = true) => {
    if (track.chapterId !== currentSection.id) {
      onSelectSection(track.chapterId);
    }
    setCurrentTrack(track);
    setAudioCurrentTime(0);
    if (autoPlay) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.playbackRate = preferences.speechRate || 1.0;
          audioRef.current
            .play()
            .then(() => setIsPlayingAudio(true))
            .catch(() => setIsPlayingAudio(false));
        }
      }, 60);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleSeekRelative = (deltaSeconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    const nextTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + deltaSeconds));
    el.currentTime = nextTime;
    setAudioCurrentTime(nextTime);
  };

  const handleTrackEnded = () => {
    if (!autoAdvanceTrack) {
      setIsPlayingAudio(false);
      return;
    }
    const nextTrack = AUDIO_TRACKS.find((t) => t.trackNumber === currentTrack.trackNumber + 1);
    if (nextTrack) {
      handleSelectTrack(nextTrack, true);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const speakSingleWord = (word: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const currentIdx = sections.findIndex((s) => s.id === currentSection.id);
  const prevSection = currentIdx > 0 ? sections[currentIdx - 1] : null;
  const nextSection = currentIdx < sections.length - 1 ? sections[currentIdx + 1] : null;

  const chapterQuestions = comprehensionQuestions.filter(
    (q) => q.chapterId === currentSection.id
  );
  const isChapterCompleted = studyState.completedChapters.includes(currentSection.id);
  const currentProgress = isChapterCompleted
    ? 100
    : studyState.chapterReadingProgress[currentSection.id] ?? 0;

  const columnWidthClass =
    preferences.columnWidth === 'narrow'
      ? 'max-w-[60ch]'
      : preferences.columnWidth === 'wide'
        ? 'max-w-[82ch]'
        : 'max-w-[70ch]';

  const handleSaveNote = () => {
    onSaveChapterNote(currentSection.id, noteDraft);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2000);
  };

  const selectedPdf = ATTACHED_PDFS.find((p) => p.id === selectedPdfId) || ATTACHED_PDFS[0];

  const masteryLabel = (st: TermMasteryStatus) => {
    if (!isEs) return st;
    if (st === 'new') return 'nuevo';
    if (st === 'learning') return 'en estudio';
    return 'dominado';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Navigation Sidebar: Table of Contents */}
      <aside className="lg:col-span-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 rounded-xl p-4">
        <div className="pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isEs ? 'Índice y Progreso' : 'Contents & Progress'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono-tabular">
              {studyState.completedChapters.length} / {sections.length}{' '}
              {isEs ? 'capítulos · 29 pistas' : 'chapters · 29 tracks'}
            </p>
          </div>
        </div>

        <nav aria-label={isEs ? 'Capítulos del libro' : 'Book Chapters'} className="space-y-1">
          {sections.map((sec, idx) => {
            const isSelected = sec.id === currentSection.id;
            const isDone = studyState.completedChapters.includes(sec.id);
            const prog = isDone ? 100 : studyState.chapterReadingProgress[sec.id] ?? 0;
            const secTrackCount = AUDIO_TRACKS.filter((t) => t.chapterId === sec.id).length;

            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-sky-600 text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[11px] font-mono-tabular ${
                      isSelected ? 'text-sky-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {String(idx).padStart(2, '0')} · {sec.part.replace('PART ', 'Part ')}
                  </div>
                  <div className="text-xs font-medium truncate mt-0.5">{sec.title}</div>
                  <div
                    className={`text-[11px] mt-0.5 font-mono-tabular ${
                      isSelected ? 'text-sky-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {sec.wordCount} {isEs ? 'pal.' : 'w'} · {secTrackCount}{' '}
                    {isEs ? (secTrackCount === 1 ? 'audio' : 'audios') : secTrackCount === 1 ? 'track' : 'tracks'} · {prog}%
                  </div>
                </div>
                {isDone && (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-1 ${
                      isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Center & Right Stage: Audiobook Player, Reader & Contextual Exercises */}
      <div className="lg:col-span-9 space-y-6">
        {/* Official Penguin Readers 29-Track Audiobook Player Card */}
        <section
          aria-label={isEs ? 'Reproductor oficial de audiolibro' : 'Official Audiobook Player'}
          className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
        >
          <audio
            ref={audioRef}
            src={currentTrack.src}
            preload="metadata"
            onTimeUpdate={(e) => setAudioCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => {
              setAudioDuration(e.currentTarget.duration);
              e.currentTarget.playbackRate = preferences.speechRate || 1.0;
            }}
            onEnded={handleTrackEnded}
            onPlay={() => setIsPlayingAudio(true)}
            onPause={() => setIsPlayingAudio(false)}
          />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 font-medium">
                <Headphones className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isEs ? 'Audiolibro Oficial Penguin Readers' : 'Official Penguin Readers Audiobook'} ·{' '}
                  {currentTrack.subLabel}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                {currentTrack.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic truncate">
                {isEs ? 'Comienza en:' : 'Starts at:'} {currentTrack.openingCue}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setAutoAdvanceTrack((prev) => !prev)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                  autoAdvanceTrack
                    ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isEs
                  ? `Auto-Avance: ${autoAdvanceTrack ? 'Sí' : 'No'}`
                  : `Auto-Next: ${autoAdvanceTrack ? 'On' : 'Off'}`}
              </button>

              <button
                onClick={() => setShowAllTracksModal((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <ListMusic className="w-3.5 h-3.5" />
                {isEs ? 'Las 29 Pistas' : 'All 29 Tracks'}
              </button>
            </div>
          </div>

          {/* Playback Controls & Scrubber Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSeekRelative(-10)}
                title={isEs ? 'Retroceder 10 segundos' : 'Rewind 10 seconds'}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={isEs ? 'Retroceder 10 segundos' : 'Rewind 10 seconds'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlayPause}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    {isEs ? 'Pausar' : 'Pause'}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    {isEs
                      ? `Reproducir Pista ${String(currentTrack.trackNumber).padStart(2, '0')}`
                      : `Play Track ${String(currentTrack.trackNumber).padStart(2, '0')}`}
                  </>
                )}
              </button>

              <button
                onClick={() => handleSeekRelative(10)}
                title={isEs ? 'Adelantar 10 segundos' : 'Fast-forward 10 seconds'}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={isEs ? 'Adelantar 10 segundos' : 'Fast-forward 10 seconds'}
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber & Time */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="text-xs font-mono-tabular text-slate-600 dark:text-slate-300 w-11 text-right">
                {formatAudioTime(audioCurrentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={audioDuration > 0 ? audioDuration : 100}
                step={0.5}
                value={audioCurrentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (audioRef.current) {
                    audioRef.current.currentTime = val;
                  }
                  setAudioCurrentTime(val);
                }}
                aria-label={isEs ? 'Barra de tiempo de audio' : 'Audio timeline scrubber'}
                className="flex-1 accent-sky-600"
              />
              <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400 w-11">
                {formatAudioTime(audioDuration)}
              </span>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {[0.75, 0.9, 1.0, 1.15, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onUpdatePreferences({ speechRate: rate })}
                  className={`px-2 py-1 text-[11px] font-mono-tabular rounded-md transition-colors ${
                    preferences.speechRate === rate
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Chapter-Specific Audio Track Selector Tabs */}
          {chapterTracks.length > 1 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
                {isEs ? 'Pistas de este capítulo:' : 'Chapter Tracks:'}
              </span>
              {chapterTracks.map((t, idx) => {
                const isActive = t.id === currentTrack.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTrack(t, true)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors font-mono-tabular whitespace-nowrap ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isEs ? 'Pista' : 'Track'} {String(t.trackNumber).padStart(2, '0')} ({isEs ? 'Parte' : 'Part'}{' '}
                    {idx + 1}/{chapterTracks.length})
                  </button>
                );
              })}
            </div>
          )}

          {/* Collapsible Full 29-Track Playlist Drawer */}
          {showAllTracksModal && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {isEs
                    ? 'Índice Completo del Audiolibro (Pistas 01–29 · CD 1 y CD 2)'
                    : 'Complete Audiobook Index (Tracks 01–29 · CD 1 & CD 2)'}
                </h3>
                <button
                  onClick={() => setShowAllTracksModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  {isEs ? 'Cerrar índice' : 'Close Index'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {AUDIO_TRACKS.map((t) => {
                  const isCurrent = t.id === currentTrack.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        handleSelectTrack(t, true);
                        setShowAllTracksModal(false);
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                        isCurrent
                          ? 'border-sky-600 bg-sky-500/10 text-sky-900 dark:text-sky-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-mono-tabular text-[11px] text-slate-500 dark:text-slate-400">
                        {isEs ? 'Pista' : 'Track'} {String(t.trackNumber).padStart(2, '0')} · {t.subLabel}
                      </div>
                      <div className="truncate mt-0.5">{t.openingCue}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Reader Controls Bar */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          {/* Mode Switch: Interactive Text vs Original PDFs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setReaderMode('interactive')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                readerMode === 'interactive'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {isEs ? 'Texto Interactivo' : 'Interactive Text'}
            </button>
            <button
              onClick={() => setReaderMode('pdf')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                readerMode === 'pdf'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              {isEs ? 'Documentos PDF Originales (3)' : 'Original PDFs (3)'}
            </button>
          </div>

          {/* Right Utilities: Glossary Toggle & Typography Settings */}
          <div className="flex items-center gap-2 flex-wrap">
            {readerMode === 'interactive' && (
              <>
                <button
                  onClick={() =>
                    onUpdatePreferences({
                      highlightGlossaryTerms: !preferences.highlightGlossaryTerms
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    preferences.highlightGlossaryTerms
                      ? 'border-sky-600/40 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isEs
                    ? `Resaltado B2: ${preferences.highlightGlossaryTerms ? 'Activo' : 'Oculto'}`
                    : `B2 Highlights: ${preferences.highlightGlossaryTerms ? 'On' : 'Off'}`}
                </button>

                <button
                  onClick={() => setShowAppearancePanel((prev) => !prev)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {isEs ? 'Ajustes de Lectura' : 'Reading Setup'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Collapsible Reading Customization Panel */}
        {showAppearancePanel && readerMode === 'interactive' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                {isEs ? 'Tipografía' : 'Typeface'}
              </label>
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => onUpdatePreferences({ fontFamily: 'serif' })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    preferences.fontFamily === 'serif'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Serif (Lora)
                </button>
                <button
                  onClick={() => onUpdatePreferences({ fontFamily: 'sans' })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    preferences.fontFamily === 'sans'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Sans (Jakarta)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 font-mono-tabular">
                {isEs ? `Tamaño: ${preferences.fontSize}px` : `Font Size: ${preferences.fontSize}px`}
              </label>
              <input
                type="range"
                min={15}
                max={22}
                step={1}
                value={preferences.fontSize}
                onChange={(e) => onUpdatePreferences({ fontSize: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 font-mono-tabular">
                {isEs ? `Interlineado: ${preferences.lineHeight}` : `Line Spacing: ${preferences.lineHeight}`}
              </label>
              <input
                type="range"
                min={1.5}
                max={2.0}
                step={0.05}
                value={preferences.lineHeight}
                onChange={(e) => onUpdatePreferences({ lineHeight: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                {isEs ? 'Ancho de Columna' : 'Measure Width'}
              </label>
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {(['narrow', 'balanced', 'wide'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdatePreferences({ columnWidth: w })}
                    className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-md transition-colors ${
                      preferences.columnWidth === w
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isEs
                      ? w === 'narrow'
                        ? 'Estrecho'
                        : w === 'balanced'
                          ? 'Medio'
                          : 'Ancho'
                      : w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Dictionary Popup Card when a highlighted word is clicked */}
        {activeTerm && (
          <div className="bg-white dark:bg-slate-900 border border-sky-500/40 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {activeTerm.term}
                  </h3>
                  <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400">
                    {activeTerm.phonetic} · {activeTerm.partOfSpeech} · CEFR {activeTerm.cefrLevel}
                  </span>
                  <button
                    onClick={() => speakSingleWord(activeTerm.term)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {isEs ? 'Pronunciar' : 'Pronounce'}
                  </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
                  {activeTerm.definitionEn}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEs ? 'Traducción:' : 'Translation:'}{' '}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {activeTerm.translationEs}
                  </strong>{' '}
                  · {isEs ? 'Nota B2:' : 'B2 Note:'} {activeTerm.b2UsageNote}
                </p>
              </div>
              <button
                onClick={() => setActiveTerm(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                aria-label={isEs ? 'Cerrar tarjeta' : 'Close term card'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isEs
                  ? 'Actualiza tu nivel de dominio para este término:'
                  : 'Update your personal mastery status for this term:'}
              </span>
              <div className="flex items-center gap-1.5">
                {(['new', 'learning', 'mastered'] as const).map((st) => {
                  const currentStatus = studyState.glossaryMastery[activeTerm.id] || 'new';
                  return (
                    <button
                      key={st}
                      onClick={() => onSetGlossaryMastery(activeTerm.id, st)}
                      className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                        currentStatus === st
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {masteryLabel(st)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Stage: Either Interactive Chapter Text OR Canvas-Rendered PDF Viewer */}
        {readerMode === 'pdf' ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {isEs
                    ? 'Documentos PDF Originales de Penguin Readers'
                    : 'Original Penguin Readers PDF Documents'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEs
                    ? 'Alterna entre el libro completo en PDF, las hojas de ejercicios fotocopiables y las notas del profesor.'
                    : 'Switch between the complete book PDF, photocopiable worksheets, and teacher’s notes.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ATTACHED_PDFS.map((pdf) => (
                  <button
                    key={pdf.id}
                    onClick={() => setSelectedPdfId(pdf.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      selectedPdfId === pdf.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isEs ? pdf.labelEs : pdf.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <Suspense
              fallback={
                <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400">
                  {isEs ? 'Cargando visor de documentos PDF...' : 'Loading PDF document viewer...'}
                </div>
              }
            >
              <PdfCanvasViewer
                pdfUrl={selectedPdf.path}
                initialPage={selectedPdf.syncChapterPage ? currentSection.pageStart : 1}
                title={isEs ? selectedPdf.labelEs : selectedPdf.labelEn}
                uiLang={uiLang}
              />
            </Suspense>
          </div>
        ) : (
          <article className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-10">
            {/* Chapter Header */}
            <header
              className={`${columnWidthClass} mx-auto pb-6 mb-8 border-b border-slate-200 dark:border-slate-800`}
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
                {currentSection.part} · {isEs ? 'Pág. PDF' : 'PDF Page'} {currentSection.pageStart} ·{' '}
                {currentSection.wordCount} {isEs ? 'palabras' : 'words'} · {chapterTracks.length}{' '}
                {isEs
                  ? chapterTracks.length === 1
                    ? 'pista de audio'
                    : 'pistas de audio'
                  : chapterTracks.length === 1
                    ? 'audio track'
                    : 'audio tracks'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
                {currentSection.title}
              </h1>

              {/* Reading Progress Slider & Complete Toggle */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular whitespace-nowrap">
                    {isEs ? 'Progreso:' : 'Progress:'} {currentProgress}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={currentProgress}
                    onChange={(e) => onUpdateProgress(currentSection.id, Number(e.target.value))}
                    aria-label={isEs ? 'Porcentaje de progreso del capítulo' : 'Chapter reading progress percentage'}
                    className="w-full max-w-xs accent-sky-600"
                  />
                </div>

                <button
                  onClick={() => onToggleCompleteChapter(currentSection.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isChapterCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isChapterCompleted
                    ? isEs
                      ? 'Capítulo Completado'
                      : 'Chapter Completed'
                    : isEs
                      ? 'Marcar como Completado'
                      : 'Mark Chapter Complete'}
                </button>
              </div>
            </header>

            {/* Full Chapter Paragraphs (Always in English for reading practice) */}
            <div
              className={`${columnWidthClass} mx-auto space-y-5 ${
                preferences.fontFamily === 'serif' ? 'font-reading-serif' : 'font-reading-sans'
              }`}
              style={{
                fontSize: `${preferences.fontSize}px`,
                lineHeight: preferences.lineHeight
              }}
            >
              {currentSection.paragraphs.map((para, pIdx) => {
                const bookmarkKey = `${currentSection.id}:${pIdx}`;
                const isBookmarked = studyState.bookmarkedParagraphs.includes(bookmarkKey);
                const segments = segmentParagraphWithGlossary(
                  para,
                  glossaryTerms,
                  preferences.highlightGlossaryTerms
                );

                return (
                  <div
                    key={bookmarkKey}
                    className={`group relative rounded-lg transition-colors ${
                      isBookmarked ? 'bg-amber-500/10 p-3 -mx-3' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {preferences.showParagraphNumbers && (
                        <button
                          onClick={() => onToggleBookmark(bookmarkKey)}
                          title={isEs ? 'Clic para marcar este párrafo' : 'Click to bookmark paragraph'}
                          className={`text-[11px] font-mono-tabular mt-1.5 select-none shrink-0 transition-colors flex items-center gap-0.5 ${
                            isBookmarked
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-500'
                          }`}
                        >
                          {String(pIdx + 1).padStart(2, '0')}
                          {isBookmarked && <Bookmark className="w-3 h-3 fill-current" />}
                        </button>
                      )}
                      <p className="text-slate-800 dark:text-slate-200 flex-1">
                        {segments.map((seg, sIdx) => {
                          if (!seg.glossaryTerm) {
                            return <React.Fragment key={sIdx}>{seg.text}</React.Fragment>;
                          }
                          const term = seg.glossaryTerm;
                          const mastery = studyState.glossaryMastery[term.id] || 'new';
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => setActiveTerm(term)}
                              className={`inline font-medium border-b-2 transition-colors px-0.5 rounded-xs ${
                                mastery === 'mastered'
                                  ? 'border-emerald-500/60 hover:bg-emerald-500/15 text-slate-900 dark:text-slate-100'
                                  : 'border-sky-500/70 bg-sky-500/10 hover:bg-sky-500/20 text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              {seg.text}
                            </button>
                          );
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Personal Study Notes for Current Chapter */}
            <div
              className={`${columnWidthClass} mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800`}
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="chapter-study-notes"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {isEs
                    ? `Notas Personales de Estudio B2 (${currentSection.title})`
                    : `Personal B2 Study Notes & Summary (${currentSection.title})`}
                </label>
                {noteSavedToast && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {isEs ? 'Guardado en el dispositivo' : 'Saved to device & sync state'}
                  </span>
                )}
              </div>
              <textarea
                id="chapter-study-notes"
                rows={3}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder={
                  isEs
                    ? 'Escribe expresiones clave B2, notas de escucha o reflexiones sobre este capítulo...'
                    : 'Write key B2 expressions, listening notes, or plot reflections from this chapter...'
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {isEs ? 'Guardar Notas' : 'Save Notes'}
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Interactive End-of-Chapter Reading Comprehension Section */}
        <section
          aria-labelledby="chapter-comprehension-heading"
          className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8"
        >
          <div className="pb-5 mb-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                {isEs ? 'Evaluación de Fin de Capítulo' : 'End-of-Chapter Assessment'} ·{' '}
                {currentSection.title}
              </div>
              <h2
                id="chapter-comprehension-heading"
                className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1"
              >
                {isEs
                  ? 'Ejercicios Interactivos de Comprensión Lectora'
                  : 'Interactive Reading Comprehension'}
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
              {
                chapterQuestions.filter(
                  (q) => studyState.comprehensionAnswers[q.id]?.isCorrect
                ).length
              }{' '}
              / {chapterQuestions.length}{' '}
              {isEs ? 'correctas en este capítulo' : 'correct in this chapter'}
            </div>
          </div>

          <div className="space-y-6">
            {chapterQuestions.map((q, qIdx) => {
              const userAns = studyState.comprehensionAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular mb-1.5">
                    {isEs ? 'Pregunta' : 'Question'} {qIdx + 1} · {q.skillTag}
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                    {q.prompt}
                  </p>
                  {q.quoteContext && (
                    <blockquote className="mt-2 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300">
                      {q.quoteContext}
                    </blockquote>
                  )}

                  <div className="mt-4 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAns?.selectedIndex === optIdx;
                      const isRightOption = optIdx === q.correctIndex;

                      let btnStyle =
                        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-sky-500';
                      if (userAns !== undefined) {
                        if (isRightOption) {
                          btnStyle =
                            'border-emerald-600 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-medium';
                        } else if (isSelected && !userAns.isCorrect) {
                          btnStyle =
                            'border-rose-600 bg-rose-500/10 text-rose-900 dark:text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() =>
                            onAnswerComprehension(q.id, optIdx, optIdx === q.correctIndex)
                          }
                          className={`w-full text-left px-4 py-3 rounded-lg border text-xs sm:text-sm transition-colors flex items-start justify-between gap-3 ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {userAns !== undefined && isRightOption && (
                            <span className="text-xs font-mono-tabular text-emerald-700 dark:text-emerald-300 shrink-0">
                              ✓ {isEs ? 'Correcto' : 'Correct'}
                            </span>
                          )}
                          {userAns !== undefined && isSelected && !isRightOption && (
                            <span className="text-xs font-mono-tabular text-rose-700 dark:text-rose-300 shrink-0">
                              ✕ {isEs ? 'Incorrecto' : 'Incorrect'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {userAns !== undefined && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                      <p className="text-slate-800 dark:text-slate-200">
                        <strong>Explanation (EN):</strong> {q.explanationEn}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        <strong>Explicación (ES):</strong> {q.explanationEs}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chapter Navigation Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            {prevSection ? (
              <button
                onClick={() => onSelectSection(prevSection.id)}
                className="px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {isEs ? 'Anterior:' : 'Previous:'} {prevSection.title}
              </button>
            ) : (
              <div />
            )}

            {nextSection && (
              <button
                onClick={() => {
                  if (!isChapterCompleted) {
                    onToggleCompleteChapter(currentSection.id);
                  }
                  onSelectSection(nextSection.id);
                }}
                className="px-5 py-2.5 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                {isEs ? 'Completar y Siguiente:' : 'Complete & Next:'} {nextSection.title}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
