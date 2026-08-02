import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12">
      <div className="rounded-[2.5rem] border border-white/80 bg-white/90 p-10 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">404</p>
        <h1 className="mt-4 font-display text-5xl text-slate-900">Página no encontrada</h1>
        <p className="mt-4 text-slate-600">La ruta que buscas no existe o todavía no está disponible.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Volver a la carta
        </Link>
      </div>
    </main>
  )
}
