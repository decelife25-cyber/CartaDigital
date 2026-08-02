import { useMemo, useRef } from 'react'

import type { Familia, PlatoConAlergenos } from '../../types/database'
import { PlatoCard } from './PlatoCard'

interface FamilyViewProps {
  familias: Familia[]
  platos: PlatoConAlergenos[]
  selectedAllergenIds: string[]
}

export function FamilyView({ familias, platos, selectedAllergenIds }: FamilyViewProps) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const familiesWithContent = useMemo(
    () => familias.filter((familia) => platos.some((plato) => plato.familia_id === familia.id)),
    [familias, platos],
  )

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 overflow-x-auto border-y border-amber-100 bg-white/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border">
        <div className="flex w-max gap-2">
          {familiesWithContent.map((familia) => (
            <button
              key={familia.id}
              type="button"
              onClick={() => sectionRefs.current[familia.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-full border border-amber-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
            >
              {familia.nombre}
            </button>
          ))}
        </div>
      </div>

      {familiesWithContent.map((familia) => {
        const items = platos.filter((plato) => plato.familia_id === familia.id)

        return (
          <section
            key={familia.id}
            id={`familia-${familia.id}`}
            ref={(node) => {
              sectionRefs.current[familia.id] = node
            }}
            className="scroll-mt-24 space-y-4 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Por familias</p>
              <h2 className="mt-2 font-display text-3xl text-slate-900">{familia.nombre}</h2>
              {familia.descripcion && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{familia.descripcion}</p>}
            </div>
            <div className="space-y-4">
              {items.map((plato) => (
                <PlatoCard key={plato.id} plato={plato} selectedAllergenIds={selectedAllergenIds} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
