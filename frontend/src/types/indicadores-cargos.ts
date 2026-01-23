export interface IndicadorCargo {
  id_indicador: number;
  cargo: string;
  indicador: string;
  descripcion?: string;
  formula?: string;
  meta_umbral?: string;
  unidad?: string;
  frecuencia?: string;
  resultado_enero?: string;
  fecha_registro?: string;
}

export interface ResumenIndicadoresCargos {
  total_indicadores: number;
  total_cargos: number;
  por_cargo: {
    cargo: string;
    cantidad: number;
  }[];
  por_resultado: {
    resultado: string;
    cantidad: number;
  }[];
  por_frecuencia: {
    frecuencia: string;
    cantidad: number;
  }[];
}

export interface FiltrosIndicadoresCargos {
  cargos: string[];
  resultados: string[];
  frecuencias: string[];
  indicadores: string[];
}
