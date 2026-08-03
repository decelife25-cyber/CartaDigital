import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Alergeno, Familia, PlatoConAlergenos, Restaurante, Sugerencia } from '../types/database'

export interface SugerenciaConPlato extends Sugerencia {
  plato?: PlatoConAlergenos | null
}

interface RestauranteContextValue {
  restaurante: Restaurante | null
  restauranteId: string | null
  familias: Familia[]
  platos: PlatoConAlergenos[]
  alergenos: Alergeno[]
  sugerencias: SugerenciaConPlato[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

export const RestauranteContext = createContext<RestauranteContextValue | undefined>(undefined)

const restauranteIdFromEnv = import.meta.env.VITE_RESTAURANTE_ID as string | undefined

function normalizeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Error desconocido al conectar con Supabase.'
}

export function RestauranteProvider({ children }: { children: ReactNode }) {
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null)
  const [familias, setFamilias] = useState<Familia[]>([])
  const [platos, setPlatos] = useState<PlatoConAlergenos[]>([])
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
      const restauranteQuery = supabase
        .from('restaurantes')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: true })
        .limit(1)

      const restauranteResponse = restauranteIdFromEnv
        ? await supabase.from('restaurantes').select('*').eq('id', restauranteIdFromEnv).single()
        : await restauranteQuery.maybeSingle()

      if (restauranteResponse.error) throw restauranteResponse.error

      const restauranteData = restauranteResponse.data
      if (!restauranteData) {
        setError('No se encontró ningún restaurante activo. Aplica la migración y carga el seed de ejemplo.')
        setLoading(false)
        return
      }

      const currentRestauranteId = restauranteData.id
      const [familiasResponse, platosResponse, alergenosResponse, sugerenciasResponse] = await Promise.all([
        supabase.from('familias').select('*').eq('restaurante_id', currentRestauranteId).eq('activo', true).order('orden', { ascending: true }),
        supabase.from('platos').select('*').eq('restaurante_id', currentRestauranteId).eq('activo', true).order('orden', { ascending: true }),
        supabase.from('alergenos').select('*').order('orden', { ascending: true }),
        supabase.from('sugerencias').select('*').eq('restaurante_id', currentRestauranteId).eq('activo', true).order('orden', { ascending: true }),
      ])

      if (familiasResponse.error) throw familiasResponse.error
      if (platosResponse.error) throw platosResponse.error
      if (alergenosResponse.error) throw alergenosResponse.error
      if (sugerenciasResponse.error) throw sugerenciasResponse.error

      const platosIds = (platosResponse.data ?? []).map((plato) => plato.id)
      const platoAlergenosResponse = platosIds.length
        ? await supabase.from('plato_alergenos').select('plato_id, alergeno_id').in('plato_id', platosIds)
        : { data: [], error: null }

      if (platoAlergenosResponse.error) throw platoAlergenosResponse.error

      const catalogo = alergenosResponse.data ?? []
      const catalogoById = Object.fromEntries(catalogo.map((item) => [item.id, item]))
      const familiasById = Object.fromEntries((familiasResponse.data ?? []).map((item) => [item.id, item]))
      const alergenosByPlato = (platoAlergenosResponse.data ?? []).reduce<Record<string, Alergeno[]>>((acc, row) => {
        const alergeno = catalogoById[row.alergeno_id]
        if (!alergeno) return acc
        acc[row.plato_id] = [...(acc[row.plato_id] || []), alergeno]
        return acc
      }, {})

      const platosCompletos: PlatoConAlergenos[] = (platosResponse.data ?? []).map((plato) => ({
        ...plato,
        familia: plato.familia_id ? familiasById[plato.familia_id] ?? null : null,
        alergenos: alergenosByPlato[plato.id] ?? [],
      }))

      setRestaurante(restauranteData)
      setFamilias(familiasResponse.data ?? [])
      setPlatos(platosCompletos)
      setAlergenos(catalogo)
      setSugerencias(
        (sugerenciasResponse.data ?? []).map((sugerencia) => ({
          ...sugerencia,
          plato: platosCompletos.find((plato) => plato.id === sugerencia.plato_id) ?? null,
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
