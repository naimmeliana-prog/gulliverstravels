import React, { useState } from 'react';
import { StudyAnalyticsSummary, generateCsvReport } from '../utils/studyEngine';
import { Download, Printer, Plus, ArrowUpRight } from 'lucide-react';

interface AnalyticsViewProps {
  analytics: StudyAnalyticsSummary;
  uiLang?: 'es' | 'en';
  onLogManualStudyMinutes: (minutes: number) => void;
  onJumpToChapter: (sectionId: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  uiLang = 'es',
  onLogManualStudyMinutes,
  onJumpToChapter
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    analytics.recentDailySeries.length - 1
  );

  const isEs = uiLang === 'es';

  const handleDownloadCsv = () => {
    const csvContent = generateCsvReport(analytics);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gullivers-travels-b2-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const maxDailyMinutes = Math.max(
    analytics.dailyGoalMinutes * 1.25,
    ...analytics.recentDailySeries.map((d) => d.minutesStudied),
    30
  );

  const selectedDay =
    analytics.recentDailySeries[selectedDayIndex] ||
    analytics.recentDailySeries[analytics.recentDailySeries.length - 1];

  return (
    <div className="space-y-8">
      {/* Top Executive Header & Export Actions */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">
            {isEs
              ? 'Informe de Rendimiento y Progreso MCER B2'
              : 'Performance Telemetry & CEFR B2 Progress Report'}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {isEs
              ? 'Reportes Detallados y Analíticas Interactivas'
              : 'Detailed Reports & Interactive Analytics'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isEs
              ? 'Visualiza tu mejora continua en lectura, comprensión por capítulo, precisión en gramática y vocabulario B2, y disciplina de estudio diaria. Exporta reportes completos en PDF o CSV en cualquier momento.'
              : 'Track your continuous improvement across reading velocity, chapter comprehension, B2 grammatical accuracy, and daily study discipline. Export complete reports to CSV or PDF at any time.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            onClick={() => onLogManualStudyMinutes(15)}
            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            {isEs ? 'Registrar +15m de Estudio' : 'Log +15m Study Session'}
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            {isEs ? 'Descargar CSV' : 'Download CSV'}
          </button>

          <button
            onClick={handleExportPdf}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            {isEs ? 'Exportar Reporte PDF' : 'Export PDF Report'}
          </button>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isEs ? 'Progreso de Lectura del Libro' : 'Book Reading Progress'}
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono-tabular">
            {analytics.overallBookCompletionPercent}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-tabular">
            {analytics.estimatedWordsRead.toLocaleString()} /{' '}
            {analytics.totalWordsInBook.toLocaleString()} {isEs ? 'palabras' : 'words'} ·{' '}
            {analytics.completedSectionsCount}/{analytics.totalSections}{' '}
            {isEs ? 'capítulos' : 'chapters'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isEs ? 'Comprensión Lectora' : 'Reading Comprehension'}
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono-tabular">
            {analytics.comprehensionAccuracyPercent}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-tabular">
            {analytics.comprehensionCorrect} {isEs ? 'aciertos de' : 'correct of'}{' '}
            {analytics.comprehensionAnswered} {isEs ? 'respondidas' : 'answered'} (
            {analytics.comprehensionTotal} total)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isEs ? 'Dominio Laboratorio MCER B2' : 'CEFR B2 Lab Mastery'}
          </div>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1 font-mono-tabular">
            {analytics.b2AccuracyPercent}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-tabular">
            {isEs ? 'Gram.' : 'Grammar'} {analytics.b2GrammarAccuracyPercent}% · Vocab{' '}
            {analytics.b2VocabAccuracyPercent}% · {analytics.glossaryMastered}{' '}
            {isEs ? 'términos' : 'terms'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isEs ? 'Disciplina y Racha de Estudio' : 'Study Discipline & Streak'}
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono-tabular">
            {analytics.currentStreakDays}{' '}
            {analytics.currentStreakDays === 1
              ? isEs
                ? 'día'
                : 'day'
              : isEs
                ? 'días'
                : 'days'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono-tabular">
            {isEs ? 'Hoy:' : 'Today:'} {analytics.todayMinutesStudied}m /{' '}
            {analytics.dailyGoalMinutes}m {isEs ? 'meta' : 'goal'} · Total:{' '}
            {analytics.totalMinutesStudied}m
          </div>
        </div>
      </div>

      {/* Interactive Graphical Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive 7-Day Study Time & Goal SVG Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isEs
                  ? 'Disciplina de los Últimos 7 Días y Meta Diaria'
                  : '7-Day Study Discipline & Daily Target'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEs
                  ? `Haz clic en cualquier barra para inspeccionar el día. La línea punteada marca tu meta diaria de ${analytics.dailyGoalMinutes} minutos.`
                  : `Click any day bar to inspect detailed session metrics. Dashed line marks your ${analytics.dailyGoalMinutes}-minute daily target.`}
              </p>
            </div>
            {selectedDay && (
              <div className="text-xs font-mono-tabular text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                {selectedDay.date}: {selectedDay.minutesStudied}m · {selectedDay.exercisesAnswered}{' '}
                {isEs ? 'ejercicios' : 'exercises'}
              </div>
            )}
          </div>

          {/* Interactive SVG Bar + Target Line Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 560 220"
              className="w-full h-56 select-none"
              role="img"
              aria-label={
                isEs
                  ? 'Gráfico de barras de duración de estudio de 7 días'
                  : '7-day study duration bar chart'
              }
            >
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = 180 - ratio * 150;
                const labelVal = Math.round(maxDailyMinutes * ratio);
                return (
                  <g key={i}>
                    <line
                      x1={44}
                      y1={y}
                      x2={540}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth="1"
                    />
                    <text
                      x={36}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-slate-400 text-[10px] font-mono-tabular"
                    >
                      {labelVal}m
                    </text>
                  </g>
                );
              })}

              {(() => {
                const goalY = 180 - (analytics.dailyGoalMinutes / maxDailyMinutes) * 150;
                return (
                  <g>
                    <line
                      x1={44}
                      y1={goalY}
                      x2={540}
                      y2={goalY}
                      stroke="#0284C7"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={538}
                      y={goalY - 5}
                      textAnchor="end"
                      className="fill-sky-600 dark:fill-sky-400 text-[10px] font-mono-tabular"
                    >
                      {isEs ? 'Meta:' : 'Goal:'} {analytics.dailyGoalMinutes}m
                    </text>
                  </g>
                );
              })()}

              {analytics.recentDailySeries.map((day, idx) => {
                const barWidth = 42;
                const gap = 28;
                const x = 62 + idx * (barWidth + gap);
                const barHeight = Math.max(
                  4,
                  Math.min(150, (day.minutesStudied / maxDailyMinutes) * 150)
                );
                const y = 180 - barHeight;
                const metGoal = day.minutesStudied >= analytics.dailyGoalMinutes;
                const isSelected = idx === selectedDayIndex;

                return (
                  <g
                    key={day.date}
                    onClick={() => setSelectedDayIndex(idx)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={6}
                      className={
                        metGoal
                          ? 'fill-emerald-600 dark:fill-emerald-500'
                          : isSelected
                            ? 'fill-sky-600 dark:fill-sky-500'
                            : 'fill-slate-300 dark:fill-slate-700 hover:fill-sky-500'
                      }
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      className="fill-slate-700 dark:fill-slate-200 text-[10px] font-mono-tabular"
                    >
                      {day.minutesStudied}m
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={198}
                      textAnchor="middle"
                      className={`text-[10px] font-mono-tabular ${
                        isSelected
                          ? 'fill-sky-600 dark:fill-sky-400 font-bold'
                          : 'fill-slate-500 dark:fill-slate-400'
                      }`}
                    >
                      {day.date.slice(5)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right 5 Columns: B2 Grammar & Vocabulary Competence Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {isEs
              ? 'Desglose por Competencias MCER B2'
              : 'CEFR B2 Skill Domain Breakdown'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-5">
            {isEs
              ? 'Precisión alcanzada en cada área gramatical y léxica de nivel B2.'
              : 'Accuracy across upper-intermediate grammatical and lexical targets.'}
          </p>

          <div className="space-y-3.5 max-h-[230px] overflow-y-auto pr-1">
            {analytics.b2TopicMetrics.map((t) => (
              <div key={t.topic} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate pr-2">
                    {t.topic}
                  </span>
                  <span className="font-mono-tabular text-slate-500 dark:text-slate-400 shrink-0">
                    {t.correct}/{t.total} · {t.accuracyPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      t.category === 'grammar' ? 'bg-sky-600' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.max(4, t.accuracyPercent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter-by-Chapter Performance Table */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isEs
                ? 'Matriz de Lectura y Comprensión por Capítulo'
                : 'Chapter-by-Chapter Reading & Comprehension Matrix'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEs
                ? 'Desglose completo de las 11 secciones de Gulliver’s Travels.'
                : 'Complete breakdown of all 11 sections of Gulliver’s Travels.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-medium">{isEs ? 'Capítulo' : 'Section'}</th>
                <th className="py-3 px-4 font-medium">{isEs ? 'Parte' : 'Part'}</th>
                <th className="py-3 px-4 font-medium text-right">
                  {isEs ? 'Palabras' : 'Words'}
                </th>
                <th className="py-3 px-4 font-medium text-right">
                  {isEs ? 'Avance Lectura' : 'Reading Progress'}
                </th>
                <th className="py-3 px-4 font-medium text-right">
                  {isEs ? 'Ejercicios Resp.' : 'Quiz Answered'}
                </th>
                <th className="py-3 px-4 font-medium text-right">
                  {isEs ? 'Precisión Quiz' : 'Quiz Accuracy'}
                </th>
                <th className="py-3 px-4 font-medium text-right no-print">
                  {isEs ? 'Acción' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
              {analytics.chapterMetrics.map((m) => (
                <tr
                  key={m.sectionId}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {m.title}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {m.part.replace('PART ', 'Part ')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular text-slate-600 dark:text-slate-300">
                    {m.wordCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular">
                    <span
                      className={
                        m.isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300'
                      }
                    >
                      {m.readingProgress}% {m.isCompleted ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular text-slate-600 dark:text-slate-300">
                    {m.questionsAnswered} / {m.questionsTotal}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular font-medium text-slate-900 dark:text-slate-100">
                    {m.questionsAnswered > 0 ? `${m.accuracyPercent}%` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right no-print">
                    <button
                      onClick={() => onJumpToChapter(m.sectionId)}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      {isEs ? 'Abrir' : 'Open'}
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
