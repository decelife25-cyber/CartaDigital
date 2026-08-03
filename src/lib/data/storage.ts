import { slugify } from '../format'
import { supabase } from '../supabase'

export async function uploadStorageFile(bucket: string, file: File) {
  const filePath = `${bucket}/${Date.now()}-${slugify(file.name)}`
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}
