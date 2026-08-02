import { Link } from 'react-router-dom'
import { Layers3, Sparkles, Soup, Store } from 'lucide-react'

import { useRestaurante } from '../../hooks/useRestaurante'

const quickLinks = [
  { to: '/admin/familias', label: 'Gestionar familias', icon: Layers3 },
  { to: '/admin/platos', label: 'Gestionar platos', icon: Soup },
  { to: '/admin/sugerencias', label: 'Gestionar sugerencias', icon: Sparkles },
  { to: '/admin/config', label: 'Configurar restaurante', icon: Store },
]

export function DashboardPage() {
  const { restaurante, familias, platos, sugerencias } = useRestaurante()

  const stats = [
    { label: 'Familias', value: familias.length },
    { label: 'Platos activos', value: platos.filter((plato) => plato.activo).length },
    { label: 'Platos agotados', value: platos.filter((plato) => plato.agotado).length },
    { label: 'Sugerencias activas', value: sugerencias.filter((sugerencia) => sugerencia.activo).length },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Panel principal</p>
        <h1 className="mt-3 font-display text-4xl">{restaurante?.nombre || 'CartaDigital'}</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Controla la oferta del restaurante, marca platos agotados y destaca sugerencias del día desde un mismo lugar.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-3 font-display text-4xl text-slate-900">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {quickLinks.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex items-center gap-4 rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-2xl text-slate-900">{label}</h2>
              <p className="text-sm text-slate-500">Abrir sección</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
