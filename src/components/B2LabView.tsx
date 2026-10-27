import React, { useState } from 'react';
import { B2ExerciseItem, BookSection, UserStudyState } from '../types/study';
import { RotateCcw, ArrowUpRight } from 'lucide-react';

interface B2LabViewProps {
  exercises: B2ExerciseItem[];
  sections: BookSection[];
  studyState: UserStudyState;
  onAnswerB2: (exerciseId: string, selectedIndex: number, isCorrect: boolean) => void;
  onResetB2Category: (category: 'all' | 'grammar' | 'vocabulary') => void;
  onJumpToChapter: (sectionId: string) => void;
}

export const B2LabView: React.FC<B2LabViewProps> = ({
  exercises,
  sections,
  studyState,
  onAnswerB2,
  onResetB2Category,
  onJumpToChapter
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'grammar' | 'vocabulary'>('all');
  const [filterPart, setFilterPart] = useState<string>('all');

  const isEs = (studyState.preferences.uiLanguage || 'es') === 'es';
  const sectionMap = new Map<string, BookSection>(sections.map((s) => [s.id, s]));

  const filteredExercises = exercises.filter((ex) => {
    if (filterCategory !== 'all' && ex.category !== filterCategory) return false;
    if (filterPart !== 'all') {
      if (filterPart === 'intro' && ex.relatedChapterId !== 'intro') return false;
      if (filterPart !== 'intro' && !ex.relatedChapterId.startsWith(filterPart)) return false;
    }
    return true;
  });

  const totalFiltered = filteredExercises.length;
  const answeredFiltered = filteredExercises.filter(
    (ex) => studyState.b2ExerciseAnswers[ex.id] !== undefined
  ).length;
  const correctFiltered = filteredExercises.filter(
    (ex) => studyState.b2ExerciseAnswers[ex.id]?.isCorrect
  ).length;
  const accuracyFiltered =
    answeredFiltered > 0 ? Math.round((correctFiltered / answeredFiltered) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header & Filter Bar */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">
              {isEs
                ? 'Práctica MCER Nivel B2 · Contextualizada al texto de Jonathan Swift'
                : 'CEFR Upper-Intermediate Practice · Contextualized to Jonathan Swift’s Text'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {isEs
                ? 'Laboratorio de Gramática y Vocabulario B2'
                : 'B2 Grammar & Vocabulary Lab'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {isEs
                ? 'Domina estructuras gramaticales avanzadas de nivel B2 (Tercer Condicional y Mixtos, Inversión Negativa, Causativas, Pasiva impersonal, Modales de Deducción) y vocabulario literario/marítimo extraído de Gulliver’s Travels.'
                : 'Master complex B2 grammatical structures (Third & Mixed Conditionals, Negative Inversion, Causatives, Passive Reporting, Past Modals) and literary/maritime collocations drawn directly from Gulliver’s Travels.'}
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono-tabular text-right">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'Completados' : 'Completed'}
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {answeredFiltered} / {totalFiltered}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'Precisión B2' : 'B2 Accuracy'}
              </div>
              <div className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {accuracyFiltered}%
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Filter Controls */}
        <div className="pt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['all', 'grammar', 'vocabulary'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filterCategory === cat
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all'
                    ? isEs
                      ? 'Todo B2 (20)'
                      : 'All B2 Skills (20)'
                    : cat === 'grammar'
                      ? isEs
                        ? 'Gramática B2'
                        : 'B2 Grammar'
                      : isEs
                        ? 'Vocabulario B2'
                        : 'B2 Vocabulary'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {[
                { id: 'all', label: isEs ? 'Todas las Partes' : 'All Parts' },
                { id: 'p1', label: 'Part 1: Lilliput' },
                { id: 'p2', label: 'Part 2: Brobdingnag' },
                { id: 'p3', label: 'Part 3: Houyhnhnms' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFilterPart(p.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filterPart === p.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onResetB2Category(filterCategory)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isEs ? 'Reiniciar Filtro Actual' : 'Reset Current Filter'}
          </button>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExercises.map((ex, idx) => {
          const ans = studyState.b2ExerciseAnswers[ex.id];
          const sec = sectionMap.get(ex.relatedChapterId);

          return (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
                  <span>
                    {String(idx + 1).padStart(2, '0')} ·{' '}
                    {isEs
                      ? ex.category === 'grammar'
                        ? 'GRAMÁTICA'
                        : 'VOCABULARIO'
                      : ex.category.toUpperCase()}{' '}
                    · {ex.b2Topic}
                  </span>
                  {sec && (
                    <button
                      onClick={() => onJumpToChapter(sec.id)}
                      className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0"
                    >
                      {sec.title}
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {ex.cefrDescriptor}
                </p>

                <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-4 leading-relaxed">
                  {ex.sentenceStem}
                </p>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
                  {isEs ? 'Estructura objetivo:' : 'Pattern hint:'} {ex.targetStructureHint}
                </div>

                <div className="mt-4 space-y-2">
                  {ex.options.map((opt, optIdx) => {
                    const isSelected = ans?.selectedIndex === optIdx;
                    const isCorrectOption = optIdx === ex.correctIndex;

                    let optionClass =
                      'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-sky-500';
                    if (ans !== undefined) {
                      if (isCorrectOption) {
                        optionClass =
                          'border-emerald-600 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-medium';
                      } else if (isSelected && !ans.isCorrect) {
                        optionClass =
                          'border-rose-600 bg-rose-500/10 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => onAnswerB2(ex.id, optIdx, optIdx === ex.correctIndex)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-between gap-2 ${optionClass}`}
                      >
                        <span className="font-mono-tabular">{opt}</span>
                        {ans !== undefined && isCorrectOption && (
                          <span className="text-xs font-mono-tabular text-emerald-700 dark:text-emerald-300 shrink-0">
                            ✓ {isEs ? 'Forma B2 Correcta' : 'Target B2 Form'}
                          </span>
                        )}
                        {ans !== undefined && isSelected && !isCorrectOption && (
                          <span className="text-xs font-mono-tabular text-rose-700 dark:text-rose-300 shrink-0">
                            ✕ {isEs ? 'Incorrecto' : 'Incorrect'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {ans !== undefined && (
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-800 dark:text-slate-200">
                    <strong>B2 Rule (EN):</strong> {ex.explanationEn}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Explicación (ES):</strong> {ex.explanationEs}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
