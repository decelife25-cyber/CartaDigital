import { useState } from 'react';
import { Smartphone, Monitor, RotateCcw, ExternalLink } from 'lucide-react';
import { Card } from '../../components/admin/shared/Card';

export function PreviewPage() {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-1">
            Simulador
          </p>
          <h1 className="font-display text-3xl text-white">Vista Preliminar</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900/50 p-1">
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors ${
                device === 'mobile'
                  ? 'bg-amber-500 text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4" /> Móvil
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors ${
                device === 'desktop'
                  ? 'bg-amber-500 text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="h-4 w-4" /> PC
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Abrir en nueva pestaña</span>
          </a>
        </div>
      </div>

      <Card className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-slate-950">
        <div
          className={`relative overflow-hidden transition-all duration-500 ease-in-out border-4 border-slate-800 ${
            device === 'mobile'
              ? 'w-[375px] h-[812px] rounded-[3rem]'
              : 'w-full h-full rounded-2xl max-w-5xl'
          }`}
        >
          {device === 'mobile' && (
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 z-10 flex justify-center rounded-t-[2.5rem]">
              <div className="w-1/3 h-4 bg-slate-950 rounded-b-xl" />
            </div>
          )}

          <div className="absolute inset-0 bg-slate-900 animate-pulse flex flex-col items-center justify-center z-[-1]">
             <RotateCcw className="h-8 w-8 text-slate-600 animate-spin mb-4" />
             <p className="text-slate-500 text-sm">Cargando vista pública...</p>
          </div>

          <iframe
            src="/"
            title="Public Menu Preview"
            className="w-full h-full bg-slate-100 dark:bg-slate-950"
            style={{
              border: 'none',
              paddingTop: device === 'mobile' ? '1.5rem' : '0'
            }}
          />
        </div>
      </Card>
    </div>
  );
}