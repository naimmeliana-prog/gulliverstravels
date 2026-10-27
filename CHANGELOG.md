# Changelog

Todos los cambios notables en este proyecto se documentan en este archivo siguiendo [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-10-27

### Added
- **Lector Íntegro Estructurado + Visor PDF Original (`ReaderView`)**:
  - Integración completa de las 11 secciones del libro *Gulliver's Travels* (Penguin Readers): *Introduction*, *Part 1 (Chapters 1–4)*, *Part 2 (Chapters 1–3)* y *Part 3 (Chapters 1–3)*.
  - Visor integrado para alternar entre el texto interactivo y los 3 documentos PDF originales adjuntos (*Book*, *Activity Worksheets* y *Teacher's Notes*).
  - Narración por voz integrada en inglés británico (`en-GB`) mediante Web Speech API con control de velocidad (`0.75x` – `1.25x`).
  - Personalización tipográfica en tiempo real: fuente Serif (`Lora`) o Sans (`Plus Jakarta Sans`), tamaño de letra (`15px`–`22px`), interlineado (`1.5`–`2.0`), ancho de columna (`Narrow`, `Balanced`, `Wide`), numeración de párrafos y marcadores.
- **Comprensión Lectora Interactiva por Capítulo (`comprehensionData.ts`)**:
  - Ejercicios interactivos al final de cada uno de los 11 capítulos con verificación instantánea y explicaciones bilingües (EN/ES).
- **Laboratorio de Gramática y Vocabulario Nivel B2 (`B2LabView`)**:
  - 20 ejercicios contextualizados de nivel MCER B2 (Third & Mixed Conditionals, Causative *have/get*, Past Modals of Deduction, Reporting Verbs, Negative Inversion, Phrasal Verbs, Word Formation y terminología satírica/política).
- **Glosario Interactivo y Tarjetas de Memoria (`GlossaryView`)**:
  - Más de 30 términos clave y literarios subrayados dinámicamente dentro del texto con pronunciación, categoría gramatical, nivel MCER, traducción al español y modo *Active Recall Flashcards*.
- **Analíticas Avanzadas y Exportación PDF/CSV (`AnalyticsView`)**:
  - Visualizaciones gráficas SVG interactivas de disciplina de estudio en los últimos 7 días, desglose de competencias B2 y matriz de progreso por capítulo.
  - Exportación automática de reportes detallados en formatos **CSV** y **PDF**.
- **Sincronización Multi-Dispositivo y Recordatorios Diarios (`SyncSettingsView`)**:
  - Algoritmo de fusión sin pérdida (`mergeStudyStates`) mediante código de sincronización portátil (Base64) y exportación/importación de respaldos `.json` entre móvil y escritorio.
  - Sistema de recordatorios diarios de estudio con soporte para la API de Notificaciones del navegador y banner en la aplicación.
- **Modo Oscuro Nativo y Favicon SVG sin Fondo**:
  - Soporte nativo para modo claro papel cálido (`#FAF8F5`) y modo oscuro nocturno (`#0B0F17`).
  - Favicon vectorial (`/public/favicon.svg`) con fondo 100% transparente que ocupa todo el lienzo (`viewBox="0 0 64 64"`).
- **Calidad de Software y Despliegue (`studyEngine.test.ts` & `vercel.json`)**:
  - Suite de pruebas unitarias automatizadas con **Vitest**.
  - Cabeceras de seguridad HTTP y configuración lista para despliegue en **Vercel** y **GitHub**.
