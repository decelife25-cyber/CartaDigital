import type { SugerenciaConPlato } from '../../context/RestauranteContext'

interface SugerenciasSectionProps {
  sugerencias: SugerenciaConPlato[]
}

function formatPrice(precio: number | null) {
  if (precio === null) return 'Consultar'
  return `${precio.toFixed(2)} €`
}

export function SugerenciasSection({ sugerencias }: SugerenciasSectionProps) {
  if (sugerencias.length === 0) return null

  return (
    <section className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-soft">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Recomendado hoy</p>
          <h2 className="mt-2 font-display text-3xl text-slate-900">Sugerencias del día</h2>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900">{sugerencias.length} propuestas</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {sugerencias.map((sugerencia) => (
          <article key={sugerencia.id} className="rounded-3xl border border-white/80 bg-white/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-2xl text-slate-900">{sugerencia.nombre || sugerencia.plato?.nombre || 'Sugerencia especial'}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800">{formatPrice(sugerencia.precio ?? sugerencia.plato?.precio ?? null)}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{sugerencia.descripcion || sugerencia.plato?.descripcion || 'Déjate sorprender por la cocina de hoy.'}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
