import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

export class EntregableResponseDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  componente?: string;

  @IsOptional()
  @IsString()
  actividad?: string;

  @IsOptional()
  fecha_inicio?: Date;

  @IsOptional()
  fecha_final?: Date;

  @IsOptional()
  fecha_real_ejecucion?: Date;

  @IsOptional()
  @IsString()
  estado_actividad_plazo?: string;

  @IsOptional()
  @IsString()
  tipo_eleccion?: string;

  @IsOptional()
  @IsString()
  cortes_contractuales?: string;

  @IsOptional()
  @IsString()
  responsable_principal?: string;

  @IsOptional()
  @IsString()
  encargado?: string;

  @IsOptional()
  @IsString()
  estado_actividad_plazo_seguimiento?: string;

  @IsOptional()
  @IsString()
  estado_actividad_ejecucion?: string;

  @IsOptional()
  @IsString()
  evidencia_recibida?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class ResumenPMODto {
  @IsNumber()
  total_entregables: number;

  @IsNumber()
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

export class FiltroEntregablesDto {
  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  componente?: string;

  @IsOptional()
  @IsString()
  estado_plazo?: string;

  @IsOptional()
  @IsString()
  estado_ejecucion?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsString()
  tipo_eleccion?: string;
}
