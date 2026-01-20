export class PersonalResponseDto {
  id_personal: number;
  nro: number;
  cargo: string;
  nombre: string;
  departamento: string;
  roles: string;
  celular: string;
  correo: string;
  profesion: string;
  seniority: string;
  empresa: string;
}

export class PersonalPorDepartamentoDto {
  departamento: string;
  total_agentes: number;
  agentes: PersonalResponseDto[];
}

export class ResumenAgentesDto {
  total_agentes: number;
  total_departamentos: number;
  por_departamento: {
    departamento: string;
    cantidad: number;
  }[];
}
