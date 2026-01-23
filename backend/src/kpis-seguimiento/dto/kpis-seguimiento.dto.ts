import { IsNumber, IsString, IsOptional } from 'class-validator';

export class KpiSeguimientoResponseDto {
  @IsNumber()
  id_kpi: number;

  @IsString()
  componente: string;

  @IsString()
  kpi_nombre: string;

  @IsOptional()
  @IsString()
  objetivo?: string;

  @IsOptional()
  @IsString()
  que_responde?: string;

  @IsOptional()
  @IsString()
  que_mide?: string;

  @IsOptional()
  @IsString()
  base_contractual?: string;

  @IsOptional()
  @IsString()
  formula?: string;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsString()
  fuente?: string;

  @IsOptional()
  @IsString()
  frecuencia?: string;

  @IsOptional()
  @IsString()
  meta_umbral?: string;

  @IsOptional()
  @IsString()
  resultado?: string;

  @IsOptional()
  @IsString()
  responsable_dato?: string;

  @IsOptional()
  @IsString()
  ultima_fecha_reporte?: string;

  @IsOptional()
  fecha_creacion?: Date;

  @IsOptional()
  fecha_actualizacion?: Date;
}

export class ResumenKpisDto {
  @IsNumber()
  total_kpis: number;

  @IsNumber()
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
