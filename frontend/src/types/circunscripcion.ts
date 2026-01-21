export interface Circunscripcion {
  id: number;               // ID único
  citrep: string;           // Código de circunscripción
  departamento: string;     // Departamento relacionado
  value?: number;
}

export interface PersonalCitrep {
  id_personal_citrep: number;
  nro: number;
  cargo: string;
  nombre: string;
  seniority?: string;
  empresa?: string;
  citrep: string;
  departamento: string;
  municipio_principal?: string;
  correo?: string;
  celular?: string;
  profesion?: string;
  estado?: string;
}

export interface PersonalCitrepResumen {
  total_agentes: number;
  total_circunscripciones_dim: number;
  total_circunscripciones_con_agentes: number;
  por_circunscripcion: {
    citrep: string;
    cantidad: number;
  }[];
}
