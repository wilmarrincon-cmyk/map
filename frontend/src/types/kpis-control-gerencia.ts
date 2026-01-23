export interface KpiControlGerencia {
  id_kpi: number;
  kpi: string;
  descripcion?: string;
  formula_metodo?: string;
  meta?: string;
  resultado_actual?: string;
  estado?: string;
  periodicidad?: string;
  responsable?: string;
  fecha_actualizacion?: Date;
}

export interface ResumenKpisControlGerencia {
  total_kpis: number;
  por_estado: {
    estado: string;
    cantidad: number;
  }[];
  por_periodicidad: {
    periodicidad: string;
    cantidad: number;
  }[];
  por_responsable: {
    responsable: string;
    cantidad: number;
  }[];
}

export interface FiltrosKpisControlGerencia {
  estados: string[];
  periodicidades: string[];
  responsables: string[];
  kpis: string[];
}
