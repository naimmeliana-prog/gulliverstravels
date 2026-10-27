import React, { useState } from 'react';
import { GlossaryTerm, TermMasteryStatus, UserStudyState, BookSection } from '../types/study';
import { Search, Volume2, RotateCw, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface GlossaryViewProps {
  terms: GlossaryTerm[];
  sections: BookSection[];
  studyState: UserStudyState;
  onSetMastery: (termId: string, status: TermMasteryStatus) => void;
  onJumpToChapter: (sectionId: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  terms,
  sections,
  studyState,
  onSetMastery,
  onJumpToChapter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TermMasteryStatus>('all');
  const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const isEs = (studyState.preferences.uiLanguage || 'es') === 'es';
  const sectionMap = new Map<string, BookSection>(sections.map((s) => [s.id, s]));

  const filteredTerms = terms.filter((t) => {
    const mastery = studyState.glossaryMastery[t.id] || 'new';
    if (statusFilter !== 'all' && mastery !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        t.term.toLowerCase().includes(q) ||
        t.definitionEn.toLowerCase().includes(q) ||
        t.translationEs.toLowerCase().includes(q) ||
        t.b2UsageNote.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pronounceWord = (word: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-GB';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const masteredCount = terms.filter((t) => studyState.glossaryMastery[t.id] === 'mastered').length;
  const learningCount = terms.filter((t) => studyState.glossaryMastery[t.id] === 'learning').length;

  const activeCard =
    filteredTerms.length > 0 ? filteredTerms[flashcardIdx % filteredTerms.length] : null;

  const filterLabel = (st: 'all' | TermMasteryStatus) => {
    if (!isEs) return st;
    if (st === 'all') return 'todos';
    if (st === 'new') return 'nuevos';
    if (st === 'learning') return 'en estudio';
    return 'dominados';
  };

  const statusButtonLabel = (st: TermMasteryStatus) => {
    if (!isEs) return st;
    if (st === 'new') return 'nuevo';
    if (st === 'learning') return 'en estudio';
    return 'dominado';
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">
              {isEs
                ? 'Compañero Léxico y Terminología Satírica'
                : 'Lexical Companion & Satirical Terminology'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {isEs
                ? 'Glosario Interactivo y Tarjetas B2'
                : 'Interactive Glossary & B2 Flashcards'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {isEs
                ? 'Repasa los términos difíciles, el vocabulario creado por Swift (Lilliput, Brobdingnag, Grildrig, Glumdalclitch, Splacknuck, Houyhnhnm, Yahoo) y colocaciones de nivel B2.'
                : 'Review difficult words, Swift’s invented vocabulary (Lilliput, Brobdingnag, Grildrig, Glumdalclitch, Splacknuck, Houyhnhnm, Yahoo), and high-utility B2 academic collocations.'}
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono-tabular text-right">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'Dominados' : 'Mastered'}
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {masteredCount} / {terms.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'En Estudio' : 'In Review'}
              </div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {learningCount}
              </div>
            </div>
          </div>
        </div>

        {/* Search, Mastery Filter, and Mode Switch */}
        <div className="pt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFlashcardIdx(0);
              }}
              placeholder={
                isEs
                  ? 'Buscar término en inglés, traducción al español o nota B2...'
                  : 'Search English term, Spanish translation, or B2 note...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['all', 'new', 'learning', 'mastered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setFlashcardIdx(0);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium capitalize rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {filterLabel(st)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isEs ? 'Cuadrícula' : 'Dictionary Grid'}
              </button>
              <button
                onClick={() => {
                  setViewMode('flashcards');
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'flashcards'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isEs ? 'Tarjetas de Memoria' : 'Active Recall Flashcards'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isEs
              ? 'Ningún término coincide con tu búsqueda o filtro actual.'
              : 'No glossary terms match your current search or filter criteria.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            {isEs ? 'Restablecer Filtros' : 'Reset Glossary Filters'}
          </button>
        </div>
      ) : viewMode === 'flashcards' && activeCard ? (
        /* Active Recall Flashcard Deck */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono-tabular mb-6">
            <span>
              {isEs ? 'Tarjeta' : 'Card'} {(flashcardIdx % filteredTerms.length) + 1}{' '}
              {isEs ? 'de' : 'of'} {filteredTerms.length}
            </span>
            <span>
              CEFR {activeCard.cefrLevel} · {activeCard.partOfSpeech}
            </span>
          </div>

          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setIsFlipped((prev) => !prev);
            }}
            className="min-h-[240px] p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:border-sky-500"
          >
            {!isFlipped ? (
              <>
                <span className="text-xs text-slate-400 mb-2">
                  {isEs
                    ? 'Término (Haz clic para revelar la definición)'
                    : 'Term (Click to reveal definition)'}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {activeCard.term}
                </h2>
                <p className="text-sm font-mono-tabular text-slate-500 dark:text-slate-400 mt-2">
                  {activeCard.phonetic}
                </p>
                <blockquote className="mt-5 text-xs italic text-slate-600 dark:text-slate-300 max-w-lg">
                  “{activeCard.contextQuote}”
                </blockquote>
              </>
            ) : (
              <>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-medium mb-2">
                  {isEs ? 'Definición y Uso B2' : 'Definition & B2 Usage'}
                </span>
                <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                  {activeCard.definitionEn}
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold mt-3">
                  ES: {activeCard.translationEs}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-lg">
                  {activeCard.b2UsageNote}
                </p>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setFlashcardIdx((prev) => (prev - 1 + filteredTerms.length) % filteredTerms.length);
                }}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {isEs ? 'Anterior' : 'Prev'}
              </button>
              <button
                onClick={() => setIsFlipped((prev) => !prev)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {isEs ? 'Girar Tarjeta' : 'Flip Card'}
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setFlashcardIdx((prev) => (prev + 1) % filteredTerms.length);
                }}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                {isEs ? 'Siguiente' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {(['new', 'learning', 'mastered'] as const).map((st) => {
                const cur = studyState.glossaryMastery[activeCard.id] || 'new';
                return (
                  <button
                    key={st}
                    onClick={() => onSetMastery(activeCard.id, st)}
                    className={`px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-colors ${
                      cur === st
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {statusButtonLabel(st)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Dictionary Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((term) => {
            const mastery = studyState.glossaryMastery[term.id] || 'new';
            const sec = sectionMap.get(term.chapterId);

            return (
              <div
                key={term.id}
                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {term.term}
                        </h3>
                        <button
                          onClick={() => pronounceWord(term.term)}
                          title={
                            isEs
                              ? 'Escuchar pronunciación británica'
                              : 'Listen to British pronunciation'
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400 mt-0.5">
                        {term.phonetic} · {term.partOfSpeech} · CEFR {term.cefrLevel}
                      </div>
                    </div>

                    {sec && (
                      <button
                        onClick={() => onJumpToChapter(sec.id)}
                        className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0"
                      >
                        {sec.title}
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-3 leading-relaxed">
                    {term.definitionEn}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                    <strong>Español:</strong> {term.translationEs}
                  </p>

                  <blockquote className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs italic text-slate-600 dark:text-slate-300">
                    “{term.contextQuote}”
                  </blockquote>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    <strong>{isEs ? 'Nota de estudio B2:' : 'B2 Study Note:'}</strong>{' '}
                    {term.b2UsageNote}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono-tabular">
                    {isEs ? 'Estado:' : 'Status:'} {statusButtonLabel(mastery).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    {(['new', 'learning', 'mastered'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => onSetMastery(term.id, st)}
                        className={`px-2.5 py-1 text-xs font-medium capitalize rounded-md transition-colors ${
                          mastery === st
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {statusButtonLabel(st)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
