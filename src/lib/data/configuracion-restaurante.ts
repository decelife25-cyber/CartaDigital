import { supabase } from '../supabase'
import type { ConfiguracionRestaurante } from '../../types/database'

const configuracionRestauranteId = import.meta.env.VITE_RESTAURANTE_ID as string | undefined

export async function getConfiguracionRestaurante() {
  const query = configuracionRestauranteId
    ? supabase.from('configuracion_restaurante').select('*').eq('id', configuracionRestauranteId).single()
    : supabase.from('configuracion_restaurante').select('*').eq('activo', true).order('created_at', { ascending: true }).limit(1).single()

  const { data, error } = await query
  if (error) throw error
  return data as ConfiguracionRestaurante
}

export async function updateConfiguracionRestaurante(configuracionId: string, payload: Partial<ConfiguracionRestaurante>) {
  const { data, error } = await supabase.from('configuracion_restaurante').update(payload).eq('id', configuracionId).select().single()
  if (error) throw error
  return data as ConfiguracionRestaurante
}
