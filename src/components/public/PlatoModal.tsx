import { useEffect } from 'react'
import { X } from 'lucide-react'

import { allergenIconMap } from '../../lib/allergens'
import type { PlatoConAlergenos } from '../../types/database'

interface PlatoModalProps {
  plato: PlatoConAlergenos | null
  onClose: () => void
}

function formatPrice(precio: number | null) {
  if (precio === null) return 'Consultar'
  return `${precio.toFixed(2)} €`
}

export function PlatoModal({ plato, onClose }: PlatoModalProps) {
  useEffect(() => {
    if (!plato) return

    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [plato])

  if (!plato) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-60 bg-gradient-to-br from-amber-200 via-amber-100 to-white sm:h-72">
          {plato.foto_url ? (
            <img src={plato.foto_url} alt={plato.nombre} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-amber-900">
              <div>
                <p className="font-display text-3xl">{plato.nombre}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.35em] text-amber-800/80">Especialidad de la casa</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:bg-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">{plato.familia?.nombre ?? 'Carta'}</p>
              <h2 className="mt-2 font-display text-3xl text-slate-900">{plato.nombre}</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-lg font-semibold text-amber-900">{formatPrice(plato.precio)}</span>
          </div>

          {plato.agotado && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Actualmente agotado.
            </div>
          )}

          <p className="text-base leading-7 text-slate-600">{plato.descripcion || 'Sin descripción adicional.'}</p>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Alérgenos</h3>
            {plato.alergenos.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {plato.alergenos.map((alergeno) => (
                  <div key={alergeno.id} className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                    <span className="text-2xl" aria-hidden="true">
                      {allergenIconMap[alergeno.nombre] ?? '🍽️'}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{alergeno.nombre}</p>
                      <p className="text-sm text-slate-500">{alergeno.sigla}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Este plato no tiene alérgenos marcados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
