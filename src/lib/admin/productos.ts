import { supabase } from "@/lib/supabase";
import type { Producto } from "@/types/producto";

export async function obtenerProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("orden");

  if (error) throw error;

  return (data ?? []) as Producto[];
}

export async function obtenerProducto(
  id: string
): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Producto;
}

export async function crearProducto(
  producto: Omit<Producto, "id" | "created_at" | "updated_at">
): Promise<Producto> {
  const { data, error } = await supabase
    .from("productos")
    .insert(producto)
    .select()
    .single();

  if (error) throw error;

  return data as Producto;
}

export async function actualizarProducto(
  id: string,
  cambios: Partial<Producto>
): Promise<void> {
  const { error } = await supabase
    .from("productos")
    .update(cambios)
    .eq("id", id);

  if (error) throw error;
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

export async function obtenerProductosFamilia(
  familiaId: string
): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("familia_id", familiaId)
    .order("orden");

  if (error) throw error;

  return (data ?? []) as Producto[];
}