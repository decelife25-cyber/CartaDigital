import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/admin'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signIn(email, password)
      navigate(redirectTo, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
      <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/90 shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">CartaDigital Admin</p>
          <h1 className="mt-6 font-display text-5xl">Gestiona tu carta online en minutos.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Organiza familias, platos, sugerencias del día y configuración del restaurante desde un panel pensado para móvil y escritorio.
          </p>
        </section>
        <section className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <LockKeyhole className="h-7 w-7" />
            </div>
            <h2 className="mt-6 font-display text-4xl text-slate-900">Iniciar sesión</h2>
            <p className="mt-3 text-slate-600">
              Accede al panel para gestionar el restaurante. Usa las credenciales de Supabase Auth.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-300 focus:bg-white"
                  placeholder="admin@restaurante.com"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Contraseña</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-300 focus:bg-white"
                  placeholder="••••••••"
                />
              </label>

              {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Entrando...' : 'Entrar al panel'}
              </button>
            </form>

            <Link to="/" className="mt-6 inline-flex text-sm font-semibold text-amber-800 transition hover:text-amber-950">
              ← Volver a la carta pública
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
