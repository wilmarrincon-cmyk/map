export interface Departamento {
  codigo_dane: number;
  codigo: string;        // Código Highcharts (hc-key)
  departamento: string;  // Nombre
  latitud?: number;
  longitud?: number;
  value?: number;
}

export interface DepartamentoMapData {
  'hc-key': string;
  name: string;
  value: number;
  codigo_dane?: number;
  latitud?: number;
  longitud?: number;
  color?: string;
}
