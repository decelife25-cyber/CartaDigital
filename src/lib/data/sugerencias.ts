import { supabase } from '../supabase'
import type { ProductoConAlergenos, Sugerencia } from '../../types/database'
import { listProductos } from './productos'

export interface SugerenciaConProducto extends Sugerencia {
  producto?: ProductoConAlergenos | null
}

export interface SugerenciaInput {
  producto_id: string | null
  nombre: string | null
  descripcion: string | null
  precio: number | null
  activo: boolean
  orden: number
}

export async function listSugerencias(configuracionRestauranteId: string) {
  const [sugerenciasResponse, productos] = await Promise.all([
    supabase.from('sugerencias').select('*').eq('configuracion_restaurante_id', configuracionRestauranteId).order('orden', { ascending: true }),
    listProductos(configuracionRestauranteId),
  ])

  if (sugerenciasResponse.error) throw sugerenciasResponse.error
  return (sugerenciasResponse.data ?? []).map((sugerencia) => ({
    ...sugerencia,
    producto: productos.find((producto) => producto.id === sugerencia.producto_id) ?? null,
  })) as SugerenciaConProducto[]
}

export async function createSugerencia(configuracionRestauranteId: string, input: SugerenciaInput) {
  const { data, error } = await supabase
    .from('sugerencias')
    .insert({
      configuracion_restaurante_id: configuracionRestauranteId,
      producto_id: input.producto_id,
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      activo: input.activo,
      orden: input.orden,
    })
    .select()
    .single()

  if (error) throw error
  return data as Sugerencia
}

export async function updateSugerencia(sugerenciaId: string, input: Partial<SugerenciaInput>) {
  const { data, error } = await supabase.from('sugerencias').update(input).eq('id', sugerenciaId).select().single()
  if (error) throw error
  return data as Sugerencia
}

export async function deleteSugerencia(sugerenciaId: string) {
  const { error } = await supabase.from('sugerencias').delete().eq('id', sugerenciaId)
  if (error) throw error
}
