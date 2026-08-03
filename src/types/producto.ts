export interface Producto {
  id: string;

  configuracion_restaurante_id: string;
  familia_id: string;

  nombre: string;
  descripcion: string;

  precio: number;

  foto_url: string | null;

  activo: boolean;
  agotado: boolean;
  destacado: boolean;

  orden: number;

  created_at?: string;
  updated_at?: string;
}

export interface ProductoEditor extends Producto {
  alergenos: string[];
}