import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { listAlergenos, listFamilias, listProductos, listSugerencias, getConfiguracionRestaurante } from '../lib/data'
import { isSupabaseConfigured } from '../lib/supabase'
import type { Alergeno, ConfiguracionRestaurante, Familia, ProductoConAlergenos, Sugerencia } from '../types/database'

export interface SugerenciaConPlato extends Sugerencia {
  plato?: ProductoConAlergenos | null
}

interface RestauranteContextValue {
  restaurante: ConfiguracionRestaurante | null
  restauranteId: string | null
  familias: Familia[]
  platos: ProductoConAlergenos[]
  alergenos: Alergeno[]
  sugerencias: SugerenciaConPlato[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

export const RestauranteContext = createContext<RestauranteContextValue | undefined>(undefined)

function normalizeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Error desconocido al conectar con Supabase.'
}

export function RestauranteProvider({ children }: { children: ReactNode }) {
  const [restaurante, setRestaurante] = useState<ConfiguracionRestaurante | null>(null)
  const [familias, setFamilias] = useState<Familia[]>([])
  const [platos, setPlatos] = useState<ProductoConAlergenos[]>([])
  const [alergenos, setAlergenos] = useState<Alergeno[]>([])
  const [sugerencias, setSugerencias] = useState<SugerenciaConPlato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured) {
      setError('Supabase no está configurado. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env para ver la carta.')
      setLoading(false)
      return
    }

    try {
      const restauranteData = await getConfiguracionRestaurante()
      if (!restauranteData) {
        setError('No se encontró ningún restaurante activo. Aplica la migración y carga el seed de ejemplo.')
        setLoading(false)
        return
      }

      const currentRestauranteId = restauranteData.id
      const [familiasData, productosData, catalogo, sugerenciasData] = await Promise.all([
        listFamilias(currentRestauranteId),
        listProductos(currentRestauranteId),
        listAlergenos(),
        listSugerencias(currentRestauranteId),
      ])

      setRestaurante(restauranteData)
      setFamilias(familiasData.filter((familia) => familia.activo))
      setPlatos(productosData.filter((producto) => producto.activo))
      setAlergenos(catalogo)
      setSugerencias(
        (sugerenciasData ?? []).map((sugerencia) => ({
          ...sugerencia,
          plato: productosData.find((producto) => producto.id === sugerencia.producto_id) ?? null,
        })),
      )
    } catch (fetchError) {
      setError(`La carta no está disponible temporalmente. Por favor, inténtalo de nuevo en unos momentos. (${normalizeErrorMessage(fetchError)})`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshData()
  }, [refreshData])

  const value = useMemo<RestauranteContextValue>(
    () => ({
      restaurante,
      restauranteId: restaurante?.id ?? null,
      familias,
      platos,
      alergenos,
      sugerencias,
      loading,
      error,
      refreshData,
    }),
    [error, familias, loading, platos, refreshData, restaurante, sugerencias, alergenos],
  )

  return <RestauranteContext.Provider value={value}>{children}</RestauranteContext.Provider>
}
