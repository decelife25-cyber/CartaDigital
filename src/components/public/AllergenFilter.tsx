import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { ALLERGEN_STORAGE_KEY, allergenIconMap } from '../../lib/allergens'
import type { Alergeno } from '../../types/database'

interface AllergenFilterProps {
  alergenos: Alergeno[]
  selectedIds: string[]
  onToggle: (alergenoId: string) => void
  onClear: () => void
}

export function AllergenFilter({ alergenos, selectedIds, onToggle, onClear }: AllergenFilterProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(ALLERGEN_STORAGE_KEY, JSON.stringify(selectedIds))
  }, [selectedIds])

  return (
    <section className="rounded-[2rem] border border-amber-100 bg-white/90 p-5 shadow-sm">
      <button type="button" className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setOpen((current) => !current)}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Filtros</p>
          <h2 className="mt-2 font-display text-2xl text-slate-900">Alérgenos</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          {selectedIds.length} seleccionados {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {alergenos.map((alergeno) => {
              const selected = selectedIds.includes(alergeno.id)
              return (
                <button
                  key={alergeno.id}
                  type="button"
                  onClick={() => onToggle(alergeno.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? 'border-amber-500 bg-amber-100 text-amber-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <span aria-hidden="true">{allergenIconMap[alergeno.nombre] ?? '🍽️'}</span>
                  <span>{alergeno.nombre}</span>
                </button>
              )
            })}
          </div>
          <button type="button" onClick={onClear} className="text-sm font-semibold text-slate-500 transition hover:text-slate-900">
            Limpiar selección
          </button>
        </div>
      )}
    </section>
  )
}
