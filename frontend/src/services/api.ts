import { Departamento } from '@/types/departamento';
import { Circunscripcion, PersonalCitrep, PersonalCitrepResumen } from '@/types/circunscripcion';
import { Entregable, ResumenPMO, FiltrosPMO } from '@/types/seguimiento-pmo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Obtiene todos los departamentos desde el backend NestJS
 */
export async function fetchDepartamentos(): Promise<Departamento[]> {
  try {
    const response = await fetch(`${API_URL}/api/departamentos`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    return [];
  }
}

/**
 * Obtiene un departamento por código DANE
 */
export async function fetchDepartamentoByCodigoDane(codigoDane: number): Promise<Departamento | null> {
  try {
    const response = await fetch(`${API_URL}/api/departamentos/dane/${codigoDane}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener departamento:', error);
    return null;
  }
}

/**
 * Obtiene un departamento por código Highcharts
 */
export async function fetchDepartamentoByCodigo(codigo: string): Promise<Departamento | null> {
  try {
    const response = await fetch(`${API_URL}/api/departamentos/codigo/${codigo}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener departamento:', error);
    return null;
  }
}

// ============ API de Personal ============

export interface PersonalResumen {
  total_agentes: number;
  total_departamentos: number;
  por_departamento: {
    departamento: string;
    cantidad: number;
  }[];
}

export interface Personal {
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

/**
 * Obtiene resumen de agentes
 */
export async function fetchPersonalResumen(): Promise<PersonalResumen | null> {
  try {
    const response = await fetch(`${API_URL}/api/personal/resumen`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener resumen de personal:', error);
    return null;
  }
}

/**
 * Obtiene conteo de agentes por departamento
 */
export async function fetchPersonalPorDepartamento(): Promise<{ departamento: string; cantidad: number }[]> {
  try {
    const response = await fetch(`${API_URL}/api/personal/por-departamento`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener personal por departamento:', error);
    return [];
  }
}

/**
 * Obtiene personal de un departamento específico
 */
export async function fetchPersonalByDepartamento(departamento: string): Promise<Personal[]> {
  try {
    const response = await fetch(`${API_URL}/api/personal/departamento/${encodeURIComponent(departamento)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener personal del departamento:', error);
    return [];
  }
}

/**
 * Obtiene todo el personal
 */
export async function fetchAllPersonal(): Promise<Personal[]> {
  try {
    const response = await fetch(`${API_URL}/api/personal`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener todo el personal:', error);
    return [];
  }
}

// ============ API de Circunscripciones ============

/**
 * Obtiene todas las circunscripciones desde el backend NestJS
 */
export async function fetchCircunscripciones(): Promise<Circunscripcion[]> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener circunscripciones:', error);
    return [];
  }
}

/**
 * Obtiene una circunscripción por citrep
 */
export async function fetchCircunscripcionByCitrep(citrep: string): Promise<Circunscripcion | null> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones/citrep/${encodeURIComponent(citrep)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener circunscripción:', error);
    return null;
  }
}

/**
 * Obtiene circunscripciones por departamento
 */
export async function fetchCircunscripcionesByDepartamento(departamento: string): Promise<Circunscripcion[]> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones/departamento/${encodeURIComponent(departamento)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener circunscripciones del departamento:', error);
    return [];
  }
}

/**
 * Obtiene todo el personal de citrep
 */
export async function fetchAllPersonalCitrep(): Promise<PersonalCitrep[]> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones/personal`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener personal citrep:', error);
    return [];
  }
}

/**
 * Obtiene resumen de personal citrep
 */
export async function fetchPersonalCitrepResumen(): Promise<PersonalCitrepResumen | null> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones/personal/resumen`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener resumen de personal citrep:', error);
    return null;
  }
}

/**
 * Obtiene conteo de personal por circunscripción
 */
export async function fetchPersonalPorCircunscripcion(): Promise<{ citrep: string; departamento: string; cantidad: number }[]> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones/personal/por-circunscripcion`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener personal por circunscripción:', error);
    return [];
  }
}

/**
 * Obtiene personal por citrep
 */
export async function fetchPersonalByCitrep(citrep: string): Promise<PersonalCitrep[]> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones/personal/citrep/${encodeURIComponent(citrep)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener personal del citrep:', error);
    return [];
  }
}

/**
 * Obtiene personal por departamento (citrep)
 */
export async function fetchPersonalCitrepByDepartamento(departamento: string): Promise<PersonalCitrep[]> {
  try {
    const response = await fetch(`${API_URL}/api/circunscripciones/personal/departamento/${encodeURIComponent(departamento)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener personal citrep del departamento:', error);
    return [];
  }
}

// ============ API de Seguimiento PMO ============

/**
 * Obtiene todos los entregables
 */
export async function fetchEntregables(): Promise<Entregable[]> {
  try {
    const response = await fetch(`${API_URL}/api/seguimiento-pmo`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener entregables:', error);
    return [];
  }
}

/**
 * Obtiene resumen del PMO
 */
export async function fetchResumenPMO(): Promise<ResumenPMO | null> {
  try {
    const response = await fetch(`${API_URL}/api/seguimiento-pmo/resumen`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener resumen PMO:', error);
    return null;
  }
}

/**
 * Obtiene opciones de filtros
 */
export async function fetchFiltrosPMO(): Promise<FiltrosPMO | null> {
  try {
    const response = await fetch(`${API_URL}/api/seguimiento-pmo/filtros`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener filtros PMO:', error);
    return null;
  }
}

/**
 * Obtiene entregables por estado de plazo
 */
export async function fetchEntregablesByEstadoPlazo(estado: string): Promise<Entregable[]> {
  try {
    const response = await fetch(`${API_URL}/api/seguimiento-pmo/estado-plazo/${encodeURIComponent(estado)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener entregables por estado:', error);
    return [];
  }
}

/**
 * Obtiene entregables por componente
 */
export async function fetchEntregablesByComponente(componente: string): Promise<Entregable[]> {
  try {
    const response = await fetch(`${API_URL}/api/seguimiento-pmo/componente/${encodeURIComponent(componente)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener entregables por componente:', error);
    return [];
  }
}
