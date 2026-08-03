export interface Alergeno {
  id: string;
  nombre: string;
  sigla: string;
  icono: string;
  descripcion: string;
  orden: number;
}

export type AlergenoMap = Record<string, boolean>;