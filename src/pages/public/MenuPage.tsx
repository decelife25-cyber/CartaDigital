import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { useRestaurante } from '../../hooks/useRestaurante'
import { ALLERGEN_STORAGE_KEY } from '../../lib/allergens'
import { AllergenFilter } from '../../components/public/AllergenFilter'
import { ClassicView } from '../../components/public/ClassicView'
import { FamilyView } from '../../components/public/FamilyView'
import { SugerenciasSection } from '../../components/public/SugerenciasSection'

type ViewMode = 'classic' | 'family'

export function MenuPage() {
  const { restaurante, familias, platos, alergenos, sugerencias, loading, error } = useRestaurante()
  const [viewMode, setViewMode] = useState<ViewMode>('classic')
  const [query, setQuery] = useState('')
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([])

  useEffect(() => {
    const saved = window.localStorage.getItem(ALLERGEN_STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as string[]
      setSelectedAllergenIds(parsed)
    } catch {
      window.localStorage.removeItem(ALLERGEN_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const brandColor = restaurante?.color_principal || '#c8a96e'
    document.documentElement.style.setProperty('--brand-color', brandColor)
  }, [restaurante?.color_principal])

  const filteredPlatos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return platos.filter((plato) => {
      const matchesText =
        !normalizedQuery ||
        plato.nombre.toLowerCase().includes(normalizedQuery) ||
        plato.descripcion?.toLowerCase().includes(normalizedQuery)

      return matchesText
    })
  }, [platos, query])

  const toggleAllergen = (alergenoId: string) => {
    setSelectedAllergenIds((current) =>
      current.includes(alergenoId) ? current.filter((id) => id !== alergenoId) : [...current, alergenoId],
    )
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12">
        <div className="rounded-[2rem] border border-amber-100 bg-white/80 px-10 py-12 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">CartaDigital</p>
          <h1 className="mt-3 font-display text-4xl text-slate-900">Cargando la carta...</h1>
          <p className="mt-3 text-slate-600">Estamos preparando la experiencia del restaurante.</p>
        </div>
      </main>
    )
  }

  if (!restaurante && error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12">
        <div className="rounded-[2rem] border border-red-100 bg-white/80 px-10 py-12 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">CartaDigital</p>
          <h1 className="mt-3 font-display text-4xl text-slate-900">Carta no disponible</h1>
          <pre className="mt-4 max-w-md whitespace-pre-wrap break-all text-left text-base leading-7 text-slate-600">
            {error ?? 'Error desconocido'}
          </pre>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-texture p-6 shadow-soft sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: restaurante?.color_principal || '#c8a96e' }}>
                {restaurante?.nombre.slice(0, 2).toUpperCase() || 'CD'}
              </span>
              <span>Carta online</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.45em] text-amber-700">Carta digital</p>
              <h1 className="mt-3 font-display text-4xl text-slate-900 sm:text-5xl">{restaurante?.nombre || 'CartaDigital'}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {restaurante?.descripcion || 'Descubre la carta, consulta alérgenos y encuentra tus favoritos en segundos.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              {restaurante?.direccion && <span className="rounded-full bg-white/80 px-4 py-2">📍 {restaurante.direccion}</span>}
              {restaurante?.telefono && <span className="rounded-full bg-white/80 px-4 py-2">📞 {restaurante.telefono}</span>}
              {restaurante?.horario && <span className="rounded-full bg-white/80 px-4 py-2">🕒 {restaurante.horario}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 rounded-[2rem] border border-white/70 bg-white/70 p-3 backdrop-blur">
            <button
              type="button"
              onClick={() => setViewMode('classic')}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                viewMode === 'classic' ? 'bg-slate-900 text-white shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              Carta clásica
            </button>
            <button
              type="button"
              onClick={() => setViewMode('family')}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                viewMode === 'family' ? 'bg-slate-900 text-white shadow-sm' : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              Por familias
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 space-y-6">
        {error && (
          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-sm sm:p-5">
              <label htmlFor="menu-search" className="sr-only">
                Buscar platos
              </label>
              <Search className="pointer-events-none absolute left-8 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre o descripción"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-14 pr-4 text-slate-900 outline-none transition focus:border-amber-300 focus:bg-white"
              />
            </div>

            <SugerenciasSection sugerencias={sugerencias} />

            {selectedAllergenIds.length > 0 && (
              <div className="rounded-[1.75rem] border border-yellow-300 bg-yellow-50 px-5 py-4 text-sm font-medium text-yellow-800">
                Atención: tienes intolerancias seleccionadas
              </div>
            )}

            {filteredPlatos.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-8 py-12 text-center">
                <h2 className="font-display text-3xl text-slate-900">No encontramos platos</h2>
                <p className="mt-3 text-slate-600">Prueba con otra búsqueda o elimina filtros de alérgenos.</p>
              </div>
            ) : viewMode === 'classic' ? (
              <ClassicView familias={familias} platos={filteredPlatos} selectedAllergenIds={selectedAllergenIds} />
            ) : (
              <FamilyView familias={familias} platos={filteredPlatos} selectedAllergenIds={selectedAllergenIds} />
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-6">
            <AllergenFilter
              alergenos={alergenos}
              selectedIds={selectedAllergenIds}
              onToggle={toggleAllergen}
              onClear={() => setSelectedAllergenIds([])}
            />
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Consejo</p>
              <h2 className="mt-2 font-display text-2xl text-slate-900">Una carta pensada para móvil</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Guarda esta web en tu pantalla de inicio para consultar platos, precios y alérgenos incluso cuando la conexión sea inestable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
