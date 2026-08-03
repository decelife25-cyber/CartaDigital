import { supabase } from '../supabase'
import type { Familia } from '../../types/database'

export interface FamiliaInput {
  nombre: string
  descripcion: string
  activo: boolean
  orden: number
}

export async function listFamilias(configuracionRestauranteId: string) {
  const { data, error } = await supabase
    .from('familias')
    .select('*')
    .eq('configuracion_restaurante_id', configuracionRestauranteId)
    .order('orden', { ascending: true })
  if (error) throw error
  return (data ?? []) as Familia[]
}

export async function createFamilia(configuracionRestauranteId: string, input: FamiliaInput) {
  const { data, error } = await supabase
    .from('familias')
    .insert({ configuracion_restaurante_id: configuracionRestauranteId, nombre: input.nombre, descripcion: input.descripcion, activo: input.activo, orden: input.orden })
    .select()
    .single()

  if (error) throw error
  return data as Familia
}

export async function updateFamilia(familiaId: string, input: Partial<FamiliaInput>) {
  const { data, error } = await supabase.from('familias').update(input).eq('id', familiaId).select().single()
  if (error) throw error
  return data as Familia
}

export async function deleteFamilia(familiaId: string) {
  const { error } = await supabase.from('familias').delete().eq('id', familiaId)
  if (error) throw error
}
