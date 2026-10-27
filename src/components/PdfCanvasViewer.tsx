import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Layers,
  FileText,
  Loader2
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfCanvasViewerProps {
  pdfUrl: string;
  initialPage?: number;
  title: string;
  uiLang: 'es' | 'en';
}

interface SinglePageCanvasProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  scale: number;
}

const SinglePageCanvas: React.FC<SinglePageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  scale
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: pdfjsLib.RenderTask | null = null;

    async function renderPage() {
      if (!canvasRef.current) return;
      setRendering(true);
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled || !canvasRef.current) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: scale * dpr });
        const displayViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(displayViewport.width)}px`;
        canvas.style.height = `${Math.floor(displayViewport.height)}px`;

        renderTask = page.render({
          canvasContext: context,
          viewport,
          canvas
        });
        await renderTask.promise;
        if (!isCancelled) setRendering(false);
      } catch {
        if (!isCancelled) setRendering(false);
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // Ignore cancel error
        }
      }
    };
  }, [pdfDoc, pageNumber, scale]);

  return (
    <div className="relative inline-block bg-white shadow-sm rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      {rendering && (
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="block max-w-full h-auto" />
    </div>
  );
};

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  pdfUrl,
  initialPage = 1,
  title,
  uiLang
}) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.15);
  const [viewAllPages, setViewAllPages] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEs = uiLang === 'es';

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setErrorMsg(null);

    async function loadDocument() {
      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const doc = await loadingTask.promise;
        if (isCancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(Math.min(Math.max(1, initialPage), doc.numPages));
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;
        setErrorMsg(
          err instanceof Error ? err.message : 'Error loading PDF document'
        );
        setLoading(false);
      }
    }

    loadDocument();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (numPages > 0) {
      setCurrentPage(Math.min(Math.max(1, initialPage), numPages));
    }
  }, [initialPage, numPages]);

  const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* PDF Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          {!viewAllPages && (
            <>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {isEs ? 'Anterior' : 'Prev'}
              </button>

              <span className="text-xs font-mono-tabular text-slate-700 dark:text-slate-200 px-2">
                {isEs ? 'Página' : 'Page'} {currentPage} / {numPages || '—'}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={currentPage >= numPages || loading}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                {isEs ? 'Siguiente' : 'Next'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setViewAllPages((prev) => !prev)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            {viewAllPages ? (
              <>
                <FileText className="w-3.5 h-3.5" />
                {isEs ? 'Ver por página' : 'Single Page'}
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                {isEs ? `Ver todas (${numPages})` : `All Pages (${numPages})`}
              </>
            )}
          </button>
        </div>

        {/* Zoom & Download Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.65, Number((s - 0.15).toFixed(2))))}
            title={isEs ? 'Reducir zoom' : 'Zoom out'}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-mono-tabular text-slate-600 dark:text-slate-300 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => setScale((s) => Math.min(2.0, Number((s + 0.15).toFixed(2))))}
            title={isEs ? 'Aumentar zoom' : 'Zoom in'}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <a
            href={pdfUrl}
            download
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            {isEs ? 'Descargar PDF' : 'Download PDF'}
          </a>
        </div>
      </div>

      {/* Quick Page Strip when in Single Page Mode */}
      {!viewAllPages && numPages > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {pageNumbers.map((pNum) => (
            <button
              key={pNum}
              onClick={() => setCurrentPage(pNum)}
              className={`px-2.5 py-1 text-xs font-mono-tabular rounded-md transition-colors shrink-0 ${
                currentPage === pNum
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {isEs ? `Pág. ${pNum}` : `P. ${pNum}`}
            </button>
          ))}
        </div>
      )}

      {/* PDF Canvas Viewport */}
      <div className="w-full min-h-[620px] max-h-[820px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-4 flex flex-col items-center gap-6">
        {loading ? (
          <div className="my-auto flex flex-col items-center gap-3 py-20 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
            <p className="text-xs font-medium">
              {isEs ? `Renderizando ${title}...` : `Rendering ${title}...`}
            </p>
          </div>
        ) : errorMsg ? (
          <div className="my-auto text-center py-16 space-y-3">
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {isEs
                ? `No se pudo previsualizar el documento (${errorMsg}).`
                : `Could not preview document (${errorMsg}).`}
            </p>
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 text-white"
            >
              <Download className="w-4 h-4" />
              {isEs ? 'Descargar PDF directamente' : 'Download PDF directly'}
            </a>
          </div>
        ) : pdfDoc ? (
          viewAllPages ? (
            pageNumbers.map((pNum) => (
              <div key={pNum} className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono-tabular text-slate-500 dark:text-slate-400">
                  {isEs ? `Página ${pNum} de ${numPages}` : `Page ${pNum} of ${numPages}`}
                </span>
                <SinglePageCanvas pdfDoc={pdfDoc} pageNumber={pNum} scale={scale} />
              </div>
            ))
          ) : (
            <SinglePageCanvas pdfDoc={pdfDoc} pageNumber={currentPage} scale={scale} />
          )
        ) : null}
      </div>
    </div>
  );
};
