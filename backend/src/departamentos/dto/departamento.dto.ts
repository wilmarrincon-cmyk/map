import { IsNumber, IsString, IsOptional } from 'class-validator';

export class DepartamentoResponseDto {
  @IsNumber()
  codigo_dane: number;

  @IsString()
  codigo: string;

  @IsString()
  departamento: string;

  @IsOptional()
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @IsNumber()
  longitud?: number;

  @IsOptional()
  @IsNumber()
  value?: number;
}

export class CreateDepartamentoDto {
  @IsNumber()
  codigo_dane: number;

  @IsString()
  codigo: string;

  @IsString()
  departamento: string;

  @IsOptional()
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @IsNumber()
  longitud?: number;
}
