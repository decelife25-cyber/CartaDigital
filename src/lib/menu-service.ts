import { supabase } from './supabase'
import { slugify } from './format'
import type { Alergeno, Familia, PlatoConAlergenos, Restaurante, Sugerencia } from '../types/database'

export interface SugerenciaConPlato extends Sugerencia {
  plato?: PlatoConAlergenos | null
}

export interface FamilyInput {
  nombre: string
  descripcion: string
  activo: boolean
  orden: number
}

export interface DishInput {
  nombre: string
  familia_id: string | null
  precio: number | null
  descripcion: string
  activo: boolean
  agotado: boolean
  orden: number
  foto_url: string | null
  alergenoIds: string[]
}

export interface SuggestionInput {
  plato_id: string | null
  nombre: string | null
  descripcion: string | null
  precio: number | null
  activo: boolean
  orden: number
}

export async function listRestaurante() {
  const restauranteId = import.meta.env.VITE_RESTAURANTE_ID as string | undefined
  const query = restauranteId
    ? supabase.from('restaurantes').select('*').eq('id', restauranteId).single()
    : supabase.from('restaurantes').select('*').eq('activo', true).order('created_at', { ascending: true }).limit(1).single()

  const { data, error } = await query
  if (error) throw error
  return data as Restaurante
}

export async function updateRestauranteConfig(restauranteId: string, payload: Partial<Restaurante>) {
  const { data, error } = await supabase.from('restaurantes').update(payload).eq('id', restauranteId).select().single()
  if (error) throw error
  return data as Restaurante
}

export async function listFamilias(restauranteId: string) {
  const { data, error } = await supabase.from('familias').select('*').eq('restaurante_id', restauranteId).order('orden', { ascending: true })
  if (error) throw error
  return (data ?? []) as Familia[]
}

export async function createFamilia(restauranteId: string, input: FamilyInput) {
  const { data, error } = await supabase
    .from('familias')
    .insert({ restaurante_id: restauranteId, nombre: input.nombre, descripcion: input.descripcion, activo: input.activo, orden: input.orden })
    .select()
    .single()

  if (error) throw error
  return data as Familia
}

export async function updateFamilia(familiaId: string, input: Partial<FamilyInput>) {
  const { data, error } = await supabase.from('familias').update(input).eq('id', familiaId).select().single()
  if (error) throw error
  return data as Familia
}

export async function deleteFamilia(familiaId: string) {
  const { error } = await supabase.from('familias').delete().eq('id', familiaId)
  if (error) throw error
}

export async function listPlatos(restauranteId: string) {
  const [platosResponse, familiasResponse, alergenosResponse, platoAlergenosResponse] = await Promise.all([
    supabase.from('platos').select('*').eq('restaurante_id', restauranteId).order('orden', { ascending: true }),
    supabase.from('familias').select('*').eq('restaurante_id', restauranteId),
    supabase.from('alergenos').select('*').order('orden', { ascending: true }),
    supabase.from('plato_alergenos').select('plato_id, alergeno_id'),
  ])

  if (platosResponse.error) throw platosResponse.error
  if (familiasResponse.error) throw familiasResponse.error
  if (alergenosResponse.error) throw alergenosResponse.error
  if (platoAlergenosResponse.error) throw platoAlergenosResponse.error

  const familiasById = Object.fromEntries((familiasResponse.data ?? []).map((familia) => [familia.id, familia]))
  const alergenosById = Object.fromEntries((alergenosResponse.data ?? []).map((alergeno) => [alergeno.id, alergeno]))
  const alergenosByPlato = (platoAlergenosResponse.data ?? []).reduce<Record<string, Alergeno[]>>((acc, row) => {
    const alergeno = alergenosById[row.alergeno_id]
    if (!alergeno) return acc
    acc[row.plato_id] = [...(acc[row.plato_id] ?? []), alergeno]
    return acc
  }, {})

  return (platosResponse.data ?? []).map((plato) => ({
    ...plato,
    familia: plato.familia_id ? familiasById[plato.familia_id] ?? null : null,
    alergenos: alergenosByPlato[plato.id] ?? [],
  })) as PlatoConAlergenos[]
}

export async function createPlato(restauranteId: string, input: DishInput) {
  const { data, error } = await supabase
    .from('platos')
    .insert({
      restaurante_id: restauranteId,
      familia_id: input.familia_id,
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      foto_url: input.foto_url,
      activo: input.activo,
      agotado: input.agotado,
      orden: input.orden,
    })
    .select()
    .single()

  if (error) throw error

  if (input.alergenoIds.length > 0) {
    const { error: relationError } = await supabase
      .from('plato_alergenos')
      .insert(input.alergenoIds.map((alergenoId) => ({ plato_id: data.id, alergeno_id: alergenoId })))
    if (relationError) throw relationError
  }

  return data as PlatoConAlergenos
}

export async function updatePlato(platoId: string, input: Partial<DishInput>) {
  const payload = {
    nombre: input.nombre,
    familia_id: input.familia_id,
    precio: input.precio,
    descripcion: input.descripcion,
    activo: input.activo,
    agotado: input.agotado,
    orden: input.orden,
    foto_url: input.foto_url,
  }

  const { data, error } = await supabase.from('platos').update(payload).eq('id', platoId).select().single()
  if (error) throw error

  if (input.alergenoIds) {
    const { error: deleteError } = await supabase.from('plato_alergenos').delete().eq('plato_id', platoId)
    if (deleteError) throw deleteError

    if (input.alergenoIds.length > 0) {
      const { error: insertError } = await supabase
        .from('plato_alergenos')
        .insert(input.alergenoIds.map((alergenoId) => ({ plato_id: platoId, alergeno_id: alergenoId })))
      if (insertError) throw insertError
    }
  }

  return data as PlatoConAlergenos
}

export async function deletePlato(platoId: string) {
  const { error } = await supabase.from('platos').delete().eq('id', platoId)
  if (error) throw error
}

export async function duplicatePlato(restauranteId: string, plato: PlatoConAlergenos) {
  return createPlato(restauranteId, {
    nombre: `${plato.nombre} (copia)`,
    familia_id: plato.familia_id,
    precio: plato.precio,
    descripcion: plato.descripcion ?? '',
    activo: plato.activo,
    agotado: plato.agotado,
    orden: plato.orden + 1,
    foto_url: plato.foto_url,
    alergenoIds: plato.alergenos.map((alergeno) => alergeno.id),
  })
}

export async function listAlergenos() {
  const { data, error } = await supabase.from('alergenos').select('*').order('orden', { ascending: true })
  if (error) throw error
  return (data ?? []) as Alergeno[]
}

export async function listSugerencias(restauranteId: string) {
  const [sugerenciasResponse, platos] = await Promise.all([
    supabase.from('sugerencias').select('*').eq('restaurante_id', restauranteId).order('orden', { ascending: true }),
    listPlatos(restauranteId),
  ])

  if (sugerenciasResponse.error) throw sugerenciasResponse.error
  return (sugerenciasResponse.data ?? []).map((sugerencia) => ({
    ...sugerencia,
    plato: platos.find((plato) => plato.id === sugerencia.plato_id) ?? null,
  })) as SugerenciaConPlato[]
}

export async function createSugerencia(restauranteId: string, input: SuggestionInput) {
  const { data, error } = await supabase
    .from('sugerencias')
    .insert({
      restaurante_id: restauranteId,
      plato_id: input.plato_id,
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

export async function updateSugerencia(sugerenciaId: string, input: Partial<SuggestionInput>) {
  const { data, error } = await supabase.from('sugerencias').update(input).eq('id', sugerenciaId).select().single()
  if (error) throw error
  return data as Sugerencia
}

export async function deleteSugerencia(sugerenciaId: string) {
  const { error } = await supabase.from('sugerencias').delete().eq('id', sugerenciaId)
  if (error) throw error
}

export async function uploadStorageFile(bucket: string, file: File) {
  const filePath = `${bucket}/${Date.now()}-${slugify(file.name)}`
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}
