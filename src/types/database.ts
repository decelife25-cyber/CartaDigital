export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface RedesSociales {
  instagram?: string
  facebook?: string
  twitter?: string
  x?: string
  web?: string
  [key: string]: Json | undefined
}

export interface ConfiguracionRestaurante {
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
  updated_at: string
}

export interface Familia {
  id: string
  configuracion_restaurante_id: string
  nombre: string
  descripcion: string | null
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
}

export interface Alergeno {
  id: string
  nombre: string
  sigla: string
  icono_url?: string | null
  descripcion: string | null
  created_at: string
  updated_at: string
}

export interface Producto {
  id: string
  configuracion_restaurante_id: string
  familia_id: string | null
  nombre: string
  descripcion: string | null
  precio: number | null
  foto_url: string | null
  activo: boolean
  agotado: boolean
  orden: number
  created_at: string
  updated_at: string
}

export interface ProductoAlergeno {
  producto_id: string
  alergeno_id: string
}

export interface Sugerencia {
  id: string
  configuracion_restaurante_id: string
  producto_id: string | null
  nombre: string | null
  descripcion: string | null
  precio: number | null
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
}

export interface ProductoConAlergenos extends Producto {
  familia?: Familia | null
  alergenos: Alergeno[]
}

export type Restaurante = ConfiguracionRestaurante
export type Plato = Producto
export type PlatoAlergeno = ProductoAlergeno
export type PlatoConAlergenos = ProductoConAlergenos

export interface Database {
  public: {
    Tables: {
      configuracion_restaurante: {
        Row: ConfiguracionRestaurante
        Insert: Partial<Omit<ConfiguracionRestaurante, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<ConfiguracionRestaurante, 'id' | 'created_at' | 'updated_at'>>
      }
      familias: {
        Row: Familia
        Insert: Partial<Omit<Familia, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<Familia, 'id' | 'created_at' | 'updated_at'>>
      }
      alergenos: {
        Row: Alergeno
        Insert: Partial<Omit<Alergeno, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<Alergeno, 'id' | 'created_at' | 'updated_at'>>
      }
      productos: {
        Row: Producto
        Insert: Partial<Omit<Producto, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<Producto, 'id' | 'created_at' | 'updated_at'>>
      }
      producto_alergeno: {
        Row: ProductoAlergeno
        Insert: ProductoAlergeno
        Update: Partial<ProductoAlergeno>
      }
      sugerencias: {
        Row: Sugerencia
        Insert: Partial<Omit<Sugerencia, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<Sugerencia, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
