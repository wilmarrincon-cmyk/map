export interface Entregable {
  id: number;
  tipo?: string;
  componente?: string;
  actividad?: string;
  fecha_inicio?: string;
  fecha_final?: string;
  fecha_real_ejecucion?: string;
  estado_actividad_plazo?: string;
  tipo_eleccion?: string;
  cortes_contractuales?: string;
  responsable_principal?: string;
  encargado?: string;
  estado_actividad_plazo_seguimiento?: string;
  estado_actividad_ejecucion?: string;
  evidencia_recibida?: string;
  notas?: string;
}

export interface ResumenPMO {
  total_entregables: number;
  total_componentes: number;
  por_estado_plazo: {
    estado: string;
    cantidad: number;
  }[];
  por_estado_ejecucion: {
    estado: string;
    cantidad: number;
  }[];
  por_componente: {
    componente: string;
    cantidad: number;
  }[];
  por_tipo: {
    tipo: string;
    cantidad: number;
  }[];
  por_responsable: {
    responsable: string;
    cantidad: number;
  }[];
}

export interface FiltrosPMO {
  tipos: string[];
  componentes: string[];
  estados_plazo: string[];
  estados_ejecucion: string[];
  responsables: string[];
  tipos_eleccion: string[];
}
