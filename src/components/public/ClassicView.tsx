import type { Familia, PlatoConAlergenos } from '../../types/database'
import { PlatoCard } from './PlatoCard'

interface ClassicViewProps {
  familias: Familia[]
  platos: PlatoConAlergenos[]
  selectedAllergenIds: string[]
}

export function ClassicView({ familias, platos, selectedAllergenIds }: ClassicViewProps) {
  return (
    <div className="space-y-8">
      {familias.map((familia) => {
        const platosFamilia = platos.filter((plato) => plato.familia_id === familia.id)
        if (platosFamilia.length === 0) return null

        return (
          <section key={familia.id} className="rounded-[2rem] border border-amber-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-dashed border-amber-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Carta clásica</p>
                <h2 className="mt-2 font-display text-3xl text-slate-900">{familia.nombre}</h2>
              </div>
              <span className="text-sm text-slate-500">{platosFamilia.length} platos</span>
            </div>
            <div className="space-y-4">
              {platosFamilia.map((plato) => (
                <PlatoCard key={plato.id} plato={plato} selectedAllergenIds={selectedAllergenIds} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
