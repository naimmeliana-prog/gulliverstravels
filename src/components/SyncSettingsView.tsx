import React, { useState } from 'react';
import { UserStudyState, ReaderPreferences } from '../types/study';
import { encodeSyncToken, decodeSyncToken } from '../utils/studyEngine';
import {
  Smartphone,
  Copy,
  Check,
  Upload,
  Download,
  Bell,
  Moon,
  Sun,
  RotateCcw,
  Globe
} from 'lucide-react';

interface SyncSettingsViewProps {
  studyState: UserStudyState;
  onMergeRemoteState: (remote: UserStudyState) => void;
  onUpdatePreferences: (patch: Partial<ReaderPreferences>) => void;
  onResetAllProgress: () => void;
}

export const SyncSettingsView: React.FC<SyncSettingsViewProps> = ({
  studyState,
  onMergeRemoteState,
  onUpdatePreferences,
  onResetAllProgress
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [incomingTokenInput, setIncomingTokenInput] = useState('');
  const [syncFeedback, setSyncFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [notificationFeedback, setNotificationFeedback] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const { preferences } = studyState;
  const uiLang = preferences.uiLanguage || 'es';
  const isEs = uiLang === 'es';
  const currentSyncToken = encodeSyncToken(studyState);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(currentSyncToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    } catch {
      setSyncFeedback({
        type: 'error',
        message: isEs
          ? 'No se pudo copiar automáticamente. Selecciona y copia el código manualmente.'
          : 'Could not copy automatically. Please select and copy the token manually.'
      });
    }
  };

  const handleApplyIncomingToken = () => {
    if (!incomingTokenInput.trim()) {
      setSyncFeedback({
        type: 'error',
        message: isEs
          ? 'Por favor, pega primero un código de sincronización de tu otro dispositivo.'
          : 'Please paste a synchronization token from your other device first.'
      });
      return;
    }
    try {
      const decoded = decodeSyncToken(incomingTokenInput);
      onMergeRemoteState(decoded);
      setIncomingTokenInput('');
      setSyncFeedback({
        type: 'success',
        message: isEs
          ? '¡Progreso fusionado correctamente! Capítulos, ejercicios, glosario y estadísticas están ahora sincronizados.'
          : 'Progress merged successfully! Chapters, quiz answers, glossary mastery, and study logs are now synchronized.'
      });
    } catch {
      setSyncFeedback({
        type: 'error',
        message: isEs
          ? 'Código de sincronización inválido. Asegúrate de copiar la cadena completa.'
          : 'Invalid sync token. Make sure you copied the complete string.'
      });
    }
  };

  const handleDownloadJsonBackup = () => {
    const blob = new Blob([JSON.stringify(studyState, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gulliver-study-sync-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as UserStudyState;
        if (!parsed || typeof parsed.version !== 'number') {
          throw new Error('Invalid schema');
        }
        onMergeRemoteState(parsed);
        setSyncFeedback({
          type: 'success',
          message: isEs
            ? 'Archivo JSON importado y fusionado sin pérdida de datos con este dispositivo.'
            : 'JSON backup imported and merged non-destructively with your current device.'
        });
      } catch {
        setSyncFeedback({
          type: 'error',
          message: isEs
            ? 'El archivo seleccionado no es una copia de respaldo válida.'
            : 'The selected file is not a valid Gulliver’s Travels study backup.'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleRequestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationFeedback(
        isEs
          ? 'El recordatorio diario integrado en la app está activo (este navegador no soporta notificaciones del sistema).'
          : 'In-app daily reminder banner is active (system notifications are not supported by this browser).'
      );
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      new Notification('Gulliver’s Travels — Recordatorio B2', {
        body: isEs
          ? `¡Disciplina diaria activa! Meta: ${preferences.dailyGoalMinutes} minutos/día a las ${preferences.reminderTime}.`
          : `Daily study discipline active! Target: ${preferences.dailyGoalMinutes} minutes/day at ${preferences.reminderTime}.`,
        icon: '/favicon.svg'
      });
      setNotificationFeedback(
        isEs
          ? '¡Notificaciones del navegador activadas y aviso de prueba enviado!'
          : 'Browser notifications enabled and test reminder sent!'
      );
    } else {
      setNotificationFeedback(
        isEs
          ? 'El aviso diario integrado en la aplicación te notificará en el horario programado.'
          : 'In-app daily reminder banner will notify you at your scheduled study time.'
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Cross-Device Synchronization (Mobile <-> Desktop) */}
      <section className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="pb-5 mb-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs text-sky-600 dark:text-sky-400 font-medium flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              {isEs ? 'Continuidad Móvil y Escritorio' : 'Mobile & Desktop Continuity'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {isEs
                ? 'Sincronización entre Dispositivos y Ajustes'
                : 'Cross-Device Synchronization & Study Settings'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {isEs
                ? 'Mantén tu progreso de lectura, resultados de ejercicios B2, dominio del glosario y notas personales sincronizados entre tu móvil y tu ordenador sin perder ningún dato.'
                : 'Keep your reading progress, B2 exercise scores, glossary mastery, and notes seamlessly synchronized between your smartphone and desktop computer without losing any data.'}
            </p>
          </div>
          <div className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400">
            {isEs ? 'Último guardado:' : 'Last saved:'}{' '}
            {new Date(studyState.lastUpdatedIso).toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export / Copy Sync Code */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isEs
                ? '1. Exportar Progreso desde Este Dispositivo'
                : '1. Export Progress from This Device'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isEs
                ? 'Copia este código de sincronización o descarga un archivo .json para llevar tu progreso actual a tu teléfono, tablet u ordenador.'
                : 'Copy this encrypted state token or download a .json backup file to transfer your current progress to your phone, tablet, or laptop.'}
            </p>
            <textarea
              readOnly
              rows={3}
              value={currentSyncToken}
              aria-label={
                isEs ? 'Código de sincronización actual' : 'Current device synchronization token'
              }
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono-tabular text-slate-600 dark:text-slate-300"
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleCopyToken}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors flex items-center gap-1.5"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedToken
                  ? isEs
                    ? '¡Código Copiado!'
                    : 'Copied Sync Code!'
                  : isEs
                    ? 'Copiar Código de Sincronización'
                    : 'Copy Sync Code'}
              </button>

              <button
                onClick={handleDownloadJsonBackup}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                {isEs ? 'Descargar Respaldo (.json)' : 'Download Backup (.json)'}
              </button>
            </div>
          </div>

          {/* Import / Merge Sync Code */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isEs
                ? '2. Fusionar Progreso desde Otro Dispositivo'
                : '2. Merge Progress from Another Device'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isEs
                ? 'Pega aquí el código generado en tu móvil o escritorio. El sistema fusiona automáticamente tu mayor avance en cada capítulo y todas tus respuestas.'
                : 'Paste a sync code from your mobile or desktop device below. Smart conflict resolution keeps your highest chapter progress and combines all completed exercises.'}
            </p>
            <textarea
              rows={3}
              value={incomingTokenInput}
              onChange={(e) => setIncomingTokenInput(e.target.value)}
              placeholder={isEs ? 'Pega aquí el código de sincronización...' : 'Paste sync code here...'}
              aria-label={
                isEs
                  ? 'Pegar código de sincronización de otro dispositivo'
                  : 'Paste synchronization token from another device'
              }
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs font-mono-tabular text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleApplyIncomingToken}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors"
              >
                {isEs ? 'Sincronizar y Fusionar Ahora' : 'Synchronize & Merge Now'}
              </button>

              <label className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                {isEs ? 'Importar Archivo JSON' : 'Import JSON File'}
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportJsonBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {syncFeedback && (
          <div
            className={`mt-4 p-3.5 rounded-lg text-xs font-medium border ${
              syncFeedback.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-200'
            }`}
          >
            {syncFeedback.message}
          </div>
        )}
      </section>

      {/* Section 2: Daily Notifications & Study Discipline */}
      <section className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="pb-4 mb-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              {isEs
                ? 'Notificaciones Diarias y Meta de Disciplina'
                : 'Daily Study Notifications & Discipline Target'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEs
                ? 'Configura tus avisos diarios y el objetivo de minutos para mantener tu racha de estudio.'
                : 'Configure daily study reminders and target duration to maintain your reading streak.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 font-mono-tabular">
              {isEs
                ? `Meta Diaria de Estudio: ${preferences.dailyGoalMinutes} minutos / día`
                : `Daily Study Goal: ${preferences.dailyGoalMinutes} minutes / day`}
            </label>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={preferences.dailyGoalMinutes}
              onChange={(e) =>
                onUpdatePreferences({ dailyGoalMinutes: Number(e.target.value) })
              }
              className="w-full accent-sky-600"
            />
          </div>

          <div>
            <label
              htmlFor="reminder-time-input"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              {isEs ? 'Hora Programada del Recordatorio' : 'Scheduled Daily Reminder Time'}
            </label>
            <input
              id="reminder-time-input"
              type="time"
              value={preferences.reminderTime}
              onChange={(e) => onUpdatePreferences({ reminderTime: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono-tabular rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onUpdatePreferences({ reminderEnabled: !preferences.reminderEnabled })
              }
              className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
                preferences.reminderEnabled
                  ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isEs
                ? `Avisos: ${preferences.reminderEnabled ? 'Activos' : 'Pausados'}`
                : `Reminders: ${preferences.reminderEnabled ? 'Active' : 'Paused'}`}
            </button>

            <button
              onClick={handleRequestNotificationPermission}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors"
            >
              {isEs ? 'Probar Notificación' : 'Test Notification'}
            </button>
          </div>
        </div>

        {notificationFeedback && (
          <p className="mt-4 text-xs text-sky-700 dark:text-sky-300 font-medium">
            {notificationFeedback}
          </p>
        )}
      </section>

      {/* Section 3: Complete UI Customization & Dark Mode */}
      <section className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="pb-4 mb-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isEs
                ? 'Tema Visual y Personalización de la Interfaz'
                : 'Visual Theme & Interface Customization'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEs
                ? 'Personaliza el idioma de la interfaz (manteniendo los textos del libro en inglés), el modo oscuro y la velocidad de narración.'
                : 'Customize interface language, dark mode, audio narration pace, and paragraph numbering for distraction-free study.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isEs ? 'Idioma de la Interfaz (UI)' : 'Interface Language (UI)'}
            </label>
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => onUpdatePreferences({ uiLanguage: 'es' })}
                className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  uiLang === 'es'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Español (UI)
              </button>
              <button
                onClick={() => onUpdatePreferences({ uiLanguage: 'en' })}
                className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  uiLang === 'en'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                English (UI)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isEs ? 'Tema de Color (Confort Visual)' : 'Color Theme (Eye Comfort)'}
            </label>
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => onUpdatePreferences({ theme: 'light' })}
                className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  preferences.theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                {isEs ? 'Papel Cálido' : 'Warm Paper'}
              </button>
              <button
                onClick={() => onUpdatePreferences({ theme: 'dark' })}
                className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  preferences.theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                {isEs ? 'Modo Oscuro' : 'Night Dark'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 font-mono-tabular">
              {isEs
                ? `Velocidad del Audiolibro: ${preferences.speechRate}x`
                : `Audiobook Speed: ${preferences.speechRate}x`}
            </label>
            <input
              type="range"
              min={0.75}
              max={1.25}
              step={0.05}
              value={preferences.speechRate}
              onChange={(e) => onUpdatePreferences({ speechRate: Number(e.target.value) })}
              className="w-full accent-sky-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isEs ? 'Restablecer Registros' : 'Reset Study Records'}
            </label>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isEs ? 'Borrar Todos los Datos' : 'Reset All Data'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetAllProgress();
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-2 text-xs font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                >
                  {isEs ? 'Confirmar' : 'Confirm'}
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
