export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface RedesSociales {
  instagram?: string
  facebook?: string
  twitter?: string
  x?: string
  web?: string
  [key: string]: Json | undefined
}

export interface Restaurante {
  id: string
  nombre: string
  logo_url: string | null
  color_principal: string | null
  descripcion: string | null
  direccion: string | null
  telefono: string | null
  redes_sociales: RedesSociales
  horario: string | null
  qr_url: string | null
  dominio: string | null
  activo: boolean
  created_at: string
}

export interface Familia {
  id: string
  restaurante_id: string
  nombre: string
  descripcion: string | null
  activo: boolean
  orden: number
  created_at: string
}

export interface Alergeno {
  id: string
  nombre: string
  sigla: string
  icono_url?: string | null
  descripcion: string | null
}

export interface Plato {
  id: string
  restaurante_id: string
  familia_id: string | null
  nombre: string
  descripcion: string | null
  precio: number | null
  foto_url: string | null
  activo: boolean
  agotado: boolean
  orden: number
  created_at: string
}

export interface PlatoAlergeno {
  plato_id: string
  alergeno_id: string
}

export interface Sugerencia {
  id: string
  restaurante_id: string
  plato_id: string | null
  nombre: string | null
  descripcion: string | null
  precio: number | null
  activo: boolean
  orden: number
  created_at: string
}

export interface PlatoConAlergenos extends Plato {
  familia?: Familia | null
  alergenos: Alergeno[]
}

export interface Database {
  public: {
    Tables: {
      restaurantes: {
        Row: Restaurante
        Insert: Partial<Omit<Restaurante, 'id' | 'created_at'>>
        Update: Partial<Omit<Restaurante, 'id' | 'created_at'>>
      }
      familias: {
        Row: Familia
        Insert: Partial<Omit<Familia, 'id' | 'created_at'>>
        Update: Partial<Omit<Familia, 'id' | 'created_at'>>
      }
      alergenos: {
        Row: Alergeno
        Insert: Partial<Omit<Alergeno, 'id'>>
        Update: Partial<Omit<Alergeno, 'id'>>
      }
      platos: {
        Row: Plato
        Insert: Partial<Omit<Plato, 'id' | 'created_at'>>
        Update: Partial<Omit<Plato, 'id' | 'created_at'>>
      }
      plato_alergenos: {
        Row: PlatoAlergeno
        Insert: PlatoAlergeno
        Update: Partial<PlatoAlergeno>
      }
      sugerencias: {
        Row: Sugerencia
        Insert: Partial<Omit<Sugerencia, 'id' | 'created_at'>>
        Update: Partial<Omit<Sugerencia, 'id' | 'created_at'>>
      }
    }
  }
}
