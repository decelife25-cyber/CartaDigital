import { supabase } from '../supabase'
import type { Alergeno, ProductoConAlergenos } from '../../types/database'

export interface ProductoInput {
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

export async function listProductos(configuracionRestauranteId: string) {
  const [productosResponse, familiasResponse, alergenosResponse, productoAlergenoResponse] = await Promise.all([
    supabase.from('productos').select('*').eq('configuracion_restaurante_id', configuracionRestauranteId).order('orden', { ascending: true }),
    supabase.from('familias').select('*').eq('configuracion_restaurante_id', configuracionRestauranteId),
    supabase.from('alergenos').select('*').order('orden', { ascending: true }),
    supabase.from('producto_alergeno').select('producto_id, alergeno_id'),
  ])

  if (productosResponse.error) throw productosResponse.error
  if (familiasResponse.error) throw familiasResponse.error
  if (alergenosResponse.error) throw alergenosResponse.error
  if (productoAlergenoResponse.error) throw productoAlergenoResponse.error

  const familiasById = Object.fromEntries((familiasResponse.data ?? []).map((familia) => [familia.id, familia]))
  const alergenosById = Object.fromEntries((alergenosResponse.data ?? []).map((alergeno) => [alergeno.id, alergeno]))
  const alergenosByProducto = (productoAlergenoResponse.data ?? []).reduce<Record<string, Alergeno[]>>((acc, row) => {
    const alergeno = alergenosById[row.alergeno_id]
    if (!alergeno) return acc
    acc[row.producto_id] = [...(acc[row.producto_id] ?? []), alergeno]
    return acc
  }, {})

  return (productosResponse.data ?? []).map((producto) => ({
    ...producto,
    familia: producto.familia_id ? familiasById[producto.familia_id] ?? null : null,
    alergenos: alergenosByProducto[producto.id] ?? [],
  })) as ProductoConAlergenos[]
}

export async function createProducto(configuracionRestauranteId: string, input: ProductoInput) {
  const { data, error } = await supabase
    .from('productos')
    .insert({
      configuracion_restaurante_id: configuracionRestauranteId,
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
      .from('producto_alergeno')
      .insert(input.alergenoIds.map((alergenoId) => ({ producto_id: data.id, alergeno_id: alergenoId })))
    if (relationError) throw relationError
  }

  return data as ProductoConAlergenos
}

export async function updateProducto(productoId: string, input: Partial<ProductoInput>) {
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

  const { data, error } = await supabase.from('productos').update(payload).eq('id', productoId).select().single()
  if (error) throw error

  if (input.alergenoIds) {
    const { error: deleteError } = await supabase.from('producto_alergeno').delete().eq('producto_id', productoId)
    if (deleteError) throw deleteError

    if (input.alergenoIds.length > 0) {
      const { error: insertError } = await supabase
        .from('producto_alergeno')
        .insert(input.alergenoIds.map((alergenoId) => ({ producto_id: productoId, alergeno_id: alergenoId })))
      if (insertError) throw insertError
    }
  }

  return data as ProductoConAlergenos
}

export async function deleteProducto(productoId: string) {
  const { error } = await supabase.from('productos').delete().eq('id', productoId)
  if (error) throw error
}

export async function duplicateProducto(configuracionRestauranteId: string, producto: ProductoConAlergenos) {
  return createProducto(configuracionRestauranteId, {
    nombre: `${producto.nombre} (copia)`,
    familia_id: producto.familia_id,
    precio: producto.precio,
    descripcion: producto.descripcion ?? '',
    activo: producto.activo,
    agotado: producto.agotado,
    orden: producto.orden + 1,
    foto_url: producto.foto_url,
    alergenoIds: producto.alergenos.map((alergeno) => alergeno.id),
  })
}
