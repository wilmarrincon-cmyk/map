export interface KpiSeguimiento {
  id_kpi: number;
  componente: string;
  kpi_nombre: string;
  objetivo?: string;
  que_responde?: string;
  que_mide?: string;
  base_contractual?: string;
  formula?: string;
  unidad?: string;
  fuente?: string;
  frecuencia?: string;
  meta_umbral?: string;
  resultado?: string;
  responsable_dato?: string;
  ultima_fecha_reporte?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface ResumenKpis {
  total_kpis: number;
  total_componentes: number;
  por_componente: {
    componente: string;
    cantidad: number;
    promedio_cumplimiento: number;
  }[];
  por_estado: {
    estado: string;
    cantidad: number;
  }[];
  por_periodo: {
    periodo: string;
    cantidad: number;
  }[];
  kpis_por_encima_meta: number;
  kpis_por_debajo_meta: number;
}

export interface FiltrosKpis {
  componentes: string[];
  resultados: string[];
  frecuencias: string[];
  kpi_nombres: string[];
}
