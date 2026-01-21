import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

export class CircunscripcionResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  citrep: string;

  @IsString()
  departamento: string;

  @IsOptional()
  @IsNumber()
  value?: number;
}

export class PersonalCitrepResponseDto {
  @IsNumber()
  id_personal_citrep: number;

  @IsNumber()
  nro: number;

  @IsString()
  cargo: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  seniority?: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsString()
  citrep: string;

  @IsString()
  departamento: string;

  @IsOptional()
  @IsString()
  municipio_principal?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsString()
  profesion?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}

export class PersonalCitrepResumenDto {
  @IsNumber()
  total_agentes: number;

  @IsNumber()
  total_circunscripciones_dim: number;

  @IsNumber()
  total_circunscripciones_con_agentes: number;

  por_circunscripcion: {
    citrep: string;
    cantidad: number;
  }[];
}
