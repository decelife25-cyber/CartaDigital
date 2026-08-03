import { supabase } from "@/lib/supabase";
import type { Producto } from "@/types/producto";

export async function obtenerProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("familia_id")
    .order("orden");

  if (error) throw error;

  return (data ?? []) as Producto[];
}

export async function guardarProducto(
  producto: Producto
): Promise<void> {

  const { error } = await supabase
    .from("productos")
    .update({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      familia_id: producto.familia_id,
      precio: producto.precio,
      foto_url: producto.foto_url,
      activo: producto.activo,
      agotado: producto.agotado,
      destacado: producto.destacado,
      orden: producto.orden,
    })
    .eq("id", producto.id);

  if (error) throw error;

}

export async function crearProducto(
  producto: Omit<
    Producto,
    "id" | "created_at" | "updated_at"
  >
): Promise<Producto> {

  const { data, error } = await supabase
    .from("productos")
    .insert(producto)
    .select()
    .single();

  if (error) throw error;

  return data as Producto;

}

export async function eliminarProducto(
  id: string
): Promise<void> {

  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) throw error;

}