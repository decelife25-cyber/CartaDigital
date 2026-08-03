import { LayoutDashboard, Layers3, LogOut, Settings, Sparkles, Soup, Upload, ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useRestaurante } from '../../hooks/useRestaurante'

const navigation = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/familias', label: 'Familias', icon: Layers3 },
  { to: '/admin/platos', label: 'Platos', icon: Soup },
  { to: '/admin/sugerencias', label: 'Sugerencias', icon: Sparkles },
  { to: '/admin/config', label: 'Configuración', icon: Settings },
  { to: '/admin/importar', label: 'Importar', icon: Upload },
]

export function AdminLayout() {
  const { signOut } = useAuth()
  const { restaurante } = useRestaurante()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <aside className={`fixed inset-y-4 left-4 z-40 w-72 rounded-[2rem] border border-white/80 bg-slate-950 p-5 text-white shadow-2xl transition lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-[120%]'} lg:block`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">CartaDigital</p>
              <h1 className="mt-2 font-display text-3xl">{restaurante?.nombre || 'Admin'}</h1>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2 lg:hidden">
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Conectado a Supabase. Tus cambios se guardarán en tiempo real.
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 space-y-3">
            <a
              href="#/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Ver carta pública
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {open && <button type="button" aria-label="Cerrar menú" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              <PanelLeftOpen className="h-4 w-4" /> Menú
            </button>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">{restaurante?.nombre || 'Panel'}</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
