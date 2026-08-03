import { supabase } from '../supabase'
import type { Alergeno } from '../../types/database'

export async function listAlergenos() {
  const { data, error } = await supabase.from('alergenos').select('*').order('orden', { ascending: true })
  if (error) throw error
  return (data ?? []) as Alergeno[]
}
