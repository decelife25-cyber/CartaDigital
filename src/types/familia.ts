export interface Familia {
  id: string;
  configuracion_restaurante_id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  orden: number;

  created_at?: string;
  updated_at?: string;
}