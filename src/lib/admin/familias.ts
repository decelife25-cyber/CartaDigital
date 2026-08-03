import { supabase } from "@/lib/supabase";
import type { Familia } from "@/types/familia";

export async function obtenerFamilias(): Promise<Familia[]> {
  const { data, error } = await supabase
    .from("familias")
    .select("*")
    .order("orden");

  if (error) throw error;

  return (data ?? []) as Familia[];
}

export async function obtenerFamilia(id: string): Promise<Familia | null> {
  const { data, error } = await supabase
    .from("familias")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Familia;
}

export async function crearFamilia(
  familia: Omit<Familia, "id" | "created_at" | "updated_at">
): Promise<Familia> {
  const { data, error } = await supabase
    .from("familias")
    .insert(familia)
    .select()
    .single();

  if (error) throw error;

  return data as Familia;
}

export async function actualizarFamilia(
  id: string,
  cambios: Partial<Familia>
): Promise<void> {
  const { error } = await supabase
    .from("familias")
    .update(cambios)
    .eq("id", id);

  if (error) throw error;
}

export async function eliminarFamilia(id: string): Promise<void> {
  const { error } = await supabase
    .from("familias")
    .delete()
    .eq("id", id);

  if (error) throw error;
}