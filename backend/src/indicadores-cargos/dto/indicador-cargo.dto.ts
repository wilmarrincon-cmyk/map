import { IsNumber, IsString, IsOptional } from 'class-validator';

export class IndicadorCargoResponseDto {
  @IsNumber()
  id_indicador: number;

  @IsString()
  cargo: string;

  @IsString()
  indicador: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  formula?: string;

  @IsOptional()
  @IsString()
  meta_umbral?: string;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsString()
  frecuencia?: string;

  @IsOptional()
  @IsString()
  resultado_enero?: string;

  @IsOptional()
  fecha_registro?: Date;
}

export class ResumenIndicadoresCargosDto {
  @IsNumber()
  total_indicadores: number;

  @IsNumber()
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
