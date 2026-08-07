import { LayoutDashboard, Layers3, LogOut, Settings, Sparkles, Soup, MonitorSmartphone, ExternalLink, PanelLeftClose, PanelLeftOpen, Wheat } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useRestaurante } from '../../hooks/useRestaurante'

const navigation = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/familias', label: 'Familias', icon: Layers3 },
  { to: '/admin/platos', label: 'Platos', icon: Soup },
  { to: '/admin/sugerencias', label: 'Sugerencias', icon: Sparkles },
  { to: '/admin/alergenos', label: 'Alérgenos', icon: Wheat },
  { to: '/admin/config', label: 'Configuración', icon: Settings },
  { to: '/admin/preview', label: 'Vista previa', icon: MonitorSmartphone },
]

export function AdminLayout() {
  const { signOut } = useAuth()
  const { restaurante } = useRestaurante()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-500/30">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-8">

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-4 left-4 z-40 w-72 rounded-[2rem] border border-white/5 bg-slate-900/80 backdrop-blur-xl p-5 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col ${
            open ? 'translate-x-0' : '-translate-x-[120%]'
          } lg:block`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">
                CartaDigital
              </p>
              <h1 className="mt-1 font-display text-2xl text-white truncate max-w-[12rem]">
                {restaurante?.nombre || 'Admin Panel'}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/10 p-2 lg:hidden text-slate-400 hover:text-white hover:bg-white/5"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>

          {/* Info banner */}
          <div className="mb-6 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4 text-xs text-amber-200/80 leading-relaxed">
            Modo administrador. Los cambios se reflejarán en la carta pública al instante.
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5 flex-1">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm [&>svg]:text-slate-900 [&>svg]:opacity-100'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white [&>svg]:opacity-70'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="mt-8 space-y-2 pt-6 border-t border-white/5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Ver carta pública
              <ExternalLink className="h-4 w-4 opacity-50" />
            </a>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 lg:pl-6 pb-20 lg:pb-0">
          {/* Mobile Header */}
          <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 border border-white/5 px-4 py-3 text-sm font-medium text-white shadow-sm active:scale-95 transition-transform"
            >
              <PanelLeftOpen className="h-4 w-4" /> Menú
            </button>
            <span className="rounded-full bg-slate-900 border border-white/5 px-4 py-2 text-sm font-medium text-amber-400 shadow-sm truncate max-w-[50vw]">
              {restaurante?.nombre || 'Panel'}
            </span>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}