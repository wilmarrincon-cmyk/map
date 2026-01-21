'use client';

import { useEffect, useState } from 'react';
import { fetchPersonalResumen, PersonalResumen } from '@/services/api';
import { Departamento } from '@/types/departamento';

// Constantes para el cálculo de cobertura
const TOTAL_DEPARTAMENTOS_COLOMBIA = 33; // 32 departamentos + Bogotá D.C.
const MAX_AGENTES_POR_DEPTO = 10; // Máximo agentes para 100% de cobertura por depto
const META_TOTAL = TOTAL_DEPARTAMENTOS_COLOMBIA * MAX_AGENTES_POR_DEPTO; // 330 agentes = 100%

interface AgentesStatsProps {
  selectedDepartamento: Departamento | null;
  departamentos: Departamento[];
  onSelectDepartamento: (departamento: Departamento | null) => void;
}

// Componente de gráfica circular
function CircularProgress({ 
  percentage, 
  size = 80, 
  strokeWidth = 8,
  color = '#4CAF50'
}: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Fondo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function AgentesStats({ selectedDepartamento, departamentos, onSelectDepartamento }: AgentesStatsProps) {
  const [resumen, setResumen] = useState<PersonalResumen | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResumen = async () => {
      setIsLoading(true);
      const data = await fetchPersonalResumen();
      setResumen(data);
      setIsLoading(false);
    };
    loadResumen();
  }, []);

  // Ordenar departamentos alfabéticamente
  const sortedDepartamentos = [...departamentos].sort((a, b) =>
    a.departamento.localeCompare(b.departamento, 'es')
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codigo = e.target.value;
    if (!codigo) {
      onSelectDepartamento(null);
      return;
    }
    const departamento = departamentos.find((d) => d.codigo === codigo);
    if (departamento) {
      onSelectDepartamento(departamento);
    }
  };

  // Normalizar texto para comparación
  const normalizeText = (text: string) => {
    return text?.toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim() || '';
  };

  // Obtener cantidad de agentes del departamento seleccionado
  const getAgentesDelDepartamento = () => {
    if (!selectedDepartamento || !resumen) return 0;
    
    const dept = resumen.por_departamento.find(
      (d) => normalizeText(d.departamento) === normalizeText(selectedDepartamento.departamento)
    );
    return dept?.cantidad || 0;
  };

  // Calcular cobertura total (cada depto máximo 10 agentes)
  const calcularCobertura = () => {
    if (!resumen) return { porcentaje: 0, agentesEfectivos: 0 };
    
    // Sumar agentes pero con máximo 10 por departamento
    const agentesEfectivos = resumen.por_departamento.reduce((sum, dept) => {
      return sum + Math.min(dept.cantidad, MAX_AGENTES_POR_DEPTO);
    }, 0);
    
    const porcentaje = (agentesEfectivos / META_TOTAL) * 100;
    return { porcentaje: Math.min(porcentaje, 100), agentesEfectivos };
  };

  // Calcular cobertura del departamento seleccionado
  const calcularCoberturaDepto = () => {
    const agentes = getAgentesDelDepartamento();
    const efectivos = Math.min(agentes, MAX_AGENTES_POR_DEPTO);
    const porcentaje = (efectivos / MAX_AGENTES_POR_DEPTO) * 100;
    return { porcentaje, efectivos, total: agentes };
  };

  const agentesSeleccionado = getAgentesDelDepartamento();
  const coberturaTotal = calcularCobertura();
  const coberturaDepto = calcularCoberturaDepto();

  // Color según porcentaje de cobertura
  const getColorByPercentage = (pct: number) => {
    if (pct >= 100) return '#4CAF50'; // Verde
    if (pct >= 70) return '#FF9800';  // Naranja
    if (pct >= 40) return '#FFEB3B';  // Amarillo
    return '#F44336';                  // Rojo
  };

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[300px]">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[300px]">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Agentes
        </h3>
        <select
          value={selectedDepartamento?.codigo || ''}
          onChange={handleFilterChange}
          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full max-w-[160px]"
        >
          <option value="">Todos</option>
          {sortedDepartamentos.map((dept) => (
            <option key={dept.codigo} value={dept.codigo}>
              {dept.departamento}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-3">
        {/* Gráfica de Cobertura */}
        <div className="flex flex-col items-center py-2">
          <CircularProgress 
            percentage={selectedDepartamento ? coberturaDepto.porcentaje : coberturaTotal.porcentaje}
            size={70}
            strokeWidth={7}
            color={getColorByPercentage(selectedDepartamento ? coberturaDepto.porcentaje : coberturaTotal.porcentaje)}
          />
          <p className="text-[10px] text-gray-500 mt-1 text-center">
            {selectedDepartamento ? (
              <>Cobertura {selectedDepartamento.departamento}</>
            ) : (
              <>Cobertura Nacional</>
            )}
          </p>
          <p className="text-[9px] text-gray-400">
            {selectedDepartamento ? (
              <>{Math.min(agentesSeleccionado, MAX_AGENTES_POR_DEPTO)}/{MAX_AGENTES_POR_DEPTO} agentes</>
            ) : (
              <>{coberturaTotal.agentesEfectivos}/{META_TOTAL} efectivos</>
            )}
          </p>
        </div>

        {/* Total de agentes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500">Total</span>
          </div>
          <span className="text-sm font-bold text-indigo-600">{resumen?.total_agentes || 0}</span>
        </div>

        {/* Departamentos con agentes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500">Dptos.</span>
          </div>
          <span className="text-sm font-bold text-amber-600">{resumen?.total_departamentos || 0}/{TOTAL_DEPARTAMENTOS_COLOMBIA}</span>
        </div>

        {/* Agentes del departamento seleccionado */}
        {selectedDepartamento && (
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 truncate max-w-[70px]" title={selectedDepartamento.departamento}>
                  {selectedDepartamento.departamento}
                </span>
              </div>
              <span className="text-sm font-bold text-blue-600">{agentesSeleccionado}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
