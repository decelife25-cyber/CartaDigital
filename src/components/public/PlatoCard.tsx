import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, TriangleAlert } from 'lucide-react'

import type { PlatoConAlergenos } from '../../types/database'
import { PlatoModal } from './PlatoModal'

interface PlatoCardProps {
  plato: PlatoConAlergenos
  selectedAllergenIds: string[]
}

function formatPrice(precio: number | null) {
  if (precio === null) return 'Consultar'
  return `${precio.toFixed(2)} €`
}

export function PlatoCard({ plato, selectedAllergenIds }: PlatoCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const matchingAllergens = useMemo(
    () => plato.alergenos.filter((alergeno) => selectedAllergenIds.includes(alergeno.id)),
    [plato.alergenos, selectedAllergenIds],
  )

  const hasWarning = matchingAllergens.length > 0

  return (
    <>
      <article
        className={`rounded-3xl border bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${
          hasWarning ? 'border-orange-300 ring-1 ring-orange-100' : 'border-white'
        } ${plato.agotado ? 'opacity-80' : ''}`}
      >
        <div className="flex items-start justify-between gap-4">
          <button type="button" onClick={() => setIsOpen(true)} className="flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-2xl text-slate-900">{plato.nombre}</h3>
              {plato.agotado && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">Agotado</span>}
              {hasWarning && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                  <TriangleAlert className="h-3.5 w-3.5" /> ¡Contiene alérgenos!
                </span>
              )}
            </div>
            <p className={`mt-3 text-sm leading-6 text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}>{plato.descripcion || 'Sin descripción disponible.'}</p>
          </button>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800">{formatPrice(plato.precio)}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {plato.alergenos.slice(0, expanded ? plato.alergenos.length : 3).map((alergeno) => (
              <span key={alergeno.id} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                {alergeno.sigla}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {plato.descripcion && plato.descripcion.length > 90 && (
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 transition hover:text-amber-900"
              >
                {expanded ? (
                  <>
                    Ver menos <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Ver más <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
            >
              Ver plato
            </button>
          </div>
        </div>
      </article>
      <PlatoModal plato={isOpen ? plato : null} onClose={() => setIsOpen(false)} />
    </>
  )
}
