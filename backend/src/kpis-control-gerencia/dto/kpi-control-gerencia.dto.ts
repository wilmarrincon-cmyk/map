import { IsNumber, IsString, IsOptional } from 'class-validator';

export class KpiControlGerenciaResponseDto {
  @IsNumber()
  id_kpi: number;

  @IsString()
  kpi: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  formula_metodo?: string;

  @IsOptional()
  @IsString()
  meta?: string;

  @IsOptional()
  @IsString()
  resultado_actual?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  periodicidad?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  fecha_actualizacion?: Date;
}

export class ResumenKpisControlGerenciaDto {
  @IsNumber()
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
