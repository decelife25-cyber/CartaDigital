import { Outlet } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-[2rem] bg-white px-8 py-10 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">CartaDigital</p>
          <h1 className="mt-3 font-display text-3xl text-slate-900">Comprobando sesión...</h1>
        </div>
      </div>
    )
  }

  // DEVELOPMENT OVERRIDE: Allow access without supabase auth for visual testing
  // if (!session) {
  //   return <Navigate to="/login" replace state={{ from: location }} />
  // }

  return <Outlet />
}
