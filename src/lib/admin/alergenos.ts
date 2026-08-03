import { supabase } from "@/lib/supabase";
import type { Alergeno } from "@/types/alergeno";

export async function obtenerAlergenos(): Promise<Alergeno[]> {
  const { data, error } = await supabase
    .from("alergenos")
    .select("*")
    .order("orden");

  if (error) throw error;

  return (data ?? []) as Alergeno[];
}

export async function obtenerAlergenosProducto(
  productoId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("producto_alergeno")
    .select("alergeno_id")
    .eq("producto_id", productoId);

  if (error) throw error;

  return (data ?? []).map((x) => x.alergeno_id);
}

export async function guardarAlergenosProducto(
  productoId: string,
  alergenos: string[]
): Promise<void> {

  const { error: borrarError } = await supabase
    .from("producto_alergeno")
    .delete()
    .eq("producto_id", productoId);

  if (borrarError) throw borrarError;

  if (alergenos.length === 0) return;

  const filas = alergenos.map((alergenoId) => ({
    producto_id: productoId,
    alergeno_id: alergenoId,
  }));

  const { error } = await supabase
    .from("producto_alergeno")
    .insert(filas);

  if (error) throw error;
}