import { Departamento } from '@/types/departamento';

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
