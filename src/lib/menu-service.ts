import type { ConfiguracionRestaurante, ProductoConAlergenos, Sugerencia } from '../types/database'
import {
  createFamilia,
  createProducto,
  createSugerencia as createSugerenciaData,
  deleteFamilia,
  deleteProducto,
  deleteSugerencia as deleteSugerenciaData,
  getConfiguracionRestaurante,
  listAlergenos,
  listFamilias,
  listProductos,
  listSugerencias as listSugerenciasData,
  updateConfiguracionRestaurante,
  updateFamilia,
  updateProducto,
  updateSugerencia as updateSugerenciaData,
  uploadStorageFile,
} from './data'

export interface SugerenciaConPlato extends Omit<Sugerencia, 'producto_id'> {
  plato_id: string | null
  plato?: ProductoConAlergenos | null
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
  return (await getConfiguracionRestaurante()) as ConfiguracionRestaurante
}

export async function updateRestauranteConfig(restauranteId: string, payload: Partial<ConfiguracionRestaurante>) {
  return updateConfiguracionRestaurante(restauranteId, payload)
}

export { createFamilia, deleteFamilia, listAlergenos, listFamilias, updateFamilia, uploadStorageFile }

export async function listPlatos(configuracionRestauranteId: string) {
  return (await listProductos(configuracionRestauranteId)) as ProductoConAlergenos[]
}

export async function createPlato(configuracionRestauranteId: string, input: DishInput) {
  return createProducto(configuracionRestauranteId, input)
}

export async function updatePlato(platoId: string, input: Partial<DishInput>) {
  return updateProducto(platoId, input)
}

export async function deletePlato(platoId: string) {
  return deleteProducto(platoId)
}

export async function duplicatePlato(configuracionRestauranteId: string, plato: ProductoConAlergenos) {
  return createProducto(configuracionRestauranteId, {
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

export async function listSugerencias(configuracionRestauranteId: string) {
  const data = await listSugerenciasData(configuracionRestauranteId)
  return data.map((item) => ({
    ...item,
    plato_id: item.producto_id,
    plato: item.producto ?? null,
  })) as SugerenciaConPlato[]
}

export async function createSugerencia(configuracionRestauranteId: string, input: SuggestionInput) {
  const { plato_id, ...rest } = input
  return createSugerenciaData(configuracionRestauranteId, {
    ...rest,
    producto_id: plato_id,
  })
}

export async function updateSugerencia(sugerenciaId: string, input: Partial<SuggestionInput>) {
  const { plato_id, ...rest } = input
  return updateSugerenciaData(sugerenciaId, {
    ...rest,
    producto_id: plato_id,
  })
}

export async function deleteSugerencia(sugerenciaId: string) {
  return deleteSugerenciaData(sugerenciaId)
}
