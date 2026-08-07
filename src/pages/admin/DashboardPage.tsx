import { Link } from 'react-router-dom';
import { Layers3, Sparkles, Soup, Store, ArrowRight } from 'lucide-react';
import { useRestaurante } from '../../hooks/useRestaurante';
import { Card } from '../../components/admin/shared/Card';

const quickLinks = [
  { to: '/admin/familias', label: 'Gestionar familias', desc: 'Organiza las categorías', icon: Layers3 },
  { to: '/admin/platos', label: 'Gestionar platos', desc: 'Añade y edita productos', icon: Soup },
  { to: '/admin/sugerencias', label: 'Gestionar sugerencias', desc: 'Destaca platos especiales', icon: Sparkles },
  { to: '/admin/config', label: 'Configuración', desc: 'Ajustes del restaurante', icon: Store },
];

export function DashboardPage() {
  const { restaurante, familias, platos, sugerencias } = useRestaurante();

  const stats = [
    { label: 'Familias', value: familias.length },
    { label: 'Platos activos', value: platos.filter((plato) => plato.activo).length },
    { label: 'Platos agotados', value: platos.filter((plato) => plato.agotado).length },
    { label: 'Sugerencias activas', value: sugerencias.filter((sugerencia) => sugerencia.activo).length },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 p-8 sm:p-10 border-white/10 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400/90 mb-3">
          Panel principal
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-white mb-4">
          Hola de nuevo, {restaurante?.nombre || 'Administrador'}
        </h1>
        <p className="max-w-2xl text-slate-300 text-lg">
          Controla la oferta del restaurante, marca platos agotados y destaca sugerencias del día desde un mismo lugar.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col p-6 hover:bg-slate-800/50 transition-colors">
            <span className="text-sm font-medium text-slate-400 mb-2">{stat.label}</span>
            <span className="font-display text-4xl text-white">{stat.value}</span>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="group h-full p-6 transition-all hover:bg-slate-800/80 hover:border-white/20 hover:-translate-y-1 relative overflow-hidden">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl text-white mb-1">{label}</h2>
              <p className="text-sm text-slate-400">{desc}</p>

              <div className="absolute right-6 bottom-6 opacity-0 transform translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-amber-400">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
