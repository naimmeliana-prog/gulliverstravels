# Gulliver's Travels — B2 Interactive Study Edition

Plataforma web educativa minimalista y de alto rendimiento diseñada para la lectura íntegra en inglés, práctica de comprensión lectora, entrenamiento de gramática y vocabulario de nivel **MCER B2**, glosario interactivo, analíticas avanzadas con exportación a **PDF/CSV** y sincronización fluida entre dispositivos móviles y de escritorio.

---

## Características Principales

1. **Contenido Íntegro Estructurado + Documentos PDF Originales**:
   - Incluye las **11 secciones completas** (~10.030 palabras) de *Gulliver's Travels* (*Introduction*, *Part 1: A Journey to Lilliput [Ch. 1–4]*, *Part 2: Gulliver in Brobdingnag [Ch. 1–3]*, *Part 3: Gulliver in the Country of the Houyhnhnms [Ch. 1–3]*).
   - Permite alternar en un clic entre el **Lector Interactivo** y los **3 PDFs originales** (*Libro*, *Activity Worksheets & Progress Test* y *Teacher's Notes*).
2. **Ejercicios Interactivos de Comprensión Lectora al Final de Cada Capítulo**:
   - Preguntas de identificación de referentes pronominales, causa-efecto, verdadero/falso con corrección y secuenciación cronológica con retroalimentación bilingüe (Inglés / Español).
3. **Laboratorio de Gramática y Vocabulario Nivel B2 (`B2 Lab`)**:
   - 20 ejercicios contextualizados a la obra de Jonathan Swift cubriendo *Third & Mixed Conditionals*, *Causative Have/Get*, *Past Modals of Deduction*, *Reporting Verbs*, *Negative Inversion*, *Cleft Sentences*, *Phrasal Verbs*, *Word Formation* y vocabulario político/satírico.
4. **Glosario Interactivo en Contexto + Modo Flashcards**:
   - Los términos difíciles aparecen resaltados directamente en los párrafos del libro. Al pulsar sobre cualquier término se despliega su fonética británica, audio TTS, definición en inglés, traducción al español, nota gramatical B2 y selector de dominio (`New`, `Learning`, `Mastered`).
5. **Estadísticas, Visualizaciones Gráficas Interactivas y Exportación PDF/CSV**:
   - Gráfico SVG interactivo de disciplina de los últimos 7 días frente a la meta diaria, barras de competencia B2 por tema gramatical/léxico y matriz completa por capítulo.
   - Exportación instantánea de reportes en formato **CSV** y **PDF** (mediante hoja de impresión optimizada `@media print`).
6. **Sincronización Móvil ↔ Escritorio y Recordatorios Diarios**:
   - **Código de Sincronización Portátil** y respaldo `.json` con resolución inteligente de conflictos (`mergeStudyStates`) que conserva siempre el mayor avance de cada capítulo y combina respuestas y notas entre dispositivos sin pérdida de datos.
   - **Notificaciones Diarias**: Configuración de meta diaria en minutos y hora de recordatorio mediante Web Notifications API y aviso integrado.
7. **Diseño Minimalista, Modo Oscuro Nativo y Rendimiento (< 2s)**:
   - Modo claro editorial sobre papel cálido (`#FAF8F5`) y modo oscuro de baja fatiga visual (`#0B0F17`).
   - Favicon SVG sin fondo (`/public/favicon.svg`) que ocupa el 100% del área disponible (`viewBox="0 0 64 64"`).
   - Empaquetado estático ligero sin dependencias pesadas para carga ultrarrápida en redes móviles de baja cobertura.

---

## Estructura del Proyecto

```text
├── public/
│   ├── assets/aistudio/          # PDFs originales (Libro, Worksheets, Teacher's Notes)
│   └── favicon.svg               # Favicon vectorial sin fondo a sangre completa (64x64)
├── src/
│   ├── __tests__/
│   │   └── studyEngine.test.ts   # Pruebas unitarias automatizadas (Vitest)
│   ├── components/
│   │   ├── ReaderView.tsx        # Lector interactivo, TTS, notas y quiz por capítulo
│   │   ├── B2LabView.tsx         # Laboratorio de gramática y vocabulario nivel B2
│   │   ├── GlossaryView.tsx      # Diccionario contextual y modo Flashcards
│   │   ├── AnalyticsView.tsx     # Gráficos SVG interactivos y exportación PDF/CSV
│   │   └── SyncSettingsView.tsx  # Sincronización multi-dispositivo y notificaciones
│   ├── data/
│   │   ├── parsedChapters.json   # Texto íntegro estructurado en 11 secciones
│   │   ├── comprehensionData.ts  # Ejercicios de comprensión por capítulo
│   │   ├── b2ExercisesData.ts    # Ejercicios de gramática y vocabulario B2
│   │   └── glossaryData.ts       # Glosario interactivo con notas B2
│   ├── types/
│   │   └── study.ts              # Contratos TypeScript estrictos
│   ├── utils/
│   │   └── studyEngine.ts        # Motor de analíticas, fusión multi-dispositivo y CSV
│   ├── App.tsx                   # Shell principal responsive y gestión de estado
│   └── index.css                 # Sistema tipográfico, modo oscuro y estilos de impresión
├── CHANGELOG.md                  # Registro detallado de cambios
├── vercel.json                   # Configuración de despliegue y cabeceras de seguridad
└── package.json
```

---

## Instalación, Ejecución y Pruebas Unitarias

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 3. Ejecutar pruebas unitarias automatizadas
```bash
npm test
```

### 4. Compilar para producción
```bash
npm run build
```

---

## Despliegue en GitHub y Vercel

1. Sube este repositorio a **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of Gulliver's Travels B2 Study Platform"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repositorio>.git
   git push -u origin main
   ```
2. Importa el repositorio en **[Vercel](https://vercel.com/new)**:
   - Vercel detectará automáticamente `vercel.json` (`framework: vite`, `buildCommand: npm run build`, `outputDirectory: dist`).
   - Se aplicarán automáticamente las cabeceras de seguridad HTTP (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) y caché inmutable para activos estáticos.
