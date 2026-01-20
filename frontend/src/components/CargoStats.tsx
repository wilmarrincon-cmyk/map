'use client';

import { useEffect, useState } from 'react';
import { fetchAllPersonal, fetchPersonalByDepartamento, Personal } from '@/services/api';
import { Departamento } from '@/types/departamento';

interface CargoStatsProps {
  selectedDepartamento: Departamento | null;
}

interface CargoCount {
  cargo: string;
  cantidad: number;
  porcentaje: number;
}

// Colores para las barras
const COLORS = [
  '#2196F3', // Azul
  '#4CAF50', // Verde
  '#FF9800', // Naranja
  '#9C27B0', // Púrpura
  '#F44336', // Rojo
  '#00BCD4', // Cyan
  '#FF5722', // Deep Orange
  '#3F51B5', // Indigo
];

export default function CargoStats({ selectedDepartamento }: CargoStatsProps) {
  const [cargoData, setCargoData] = useState<CargoCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAgentes, setTotalAgentes] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      let personal: Personal[];
      
      if (selectedDepartamento) {
        personal = await fetchPersonalByDepartamento(selectedDepartamento.departamento);
      } else {
        personal = await fetchAllPersonal();
      }

      // Agrupar por cargo
      const cargoMap = new Map<string, number>();
      personal.forEach((p) => {
        const cargo = p.cargo || 'Sin cargo';
        cargoMap.set(cargo, (cargoMap.get(cargo) || 0) + 1);
      });

      // Convertir a array y ordenar por cantidad
      const total = personal.length;
      const data: CargoCount[] = Array.from(cargoMap.entries())
        .map(([cargo, cantidad]) => ({
          cargo,
          cantidad,
          porcentaje: total > 0 ? (cantidad / total) * 100 : 0,
        }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 6); // Top 6 cargos

      setCargoData(data);
      setTotalAgentes(total);
      setIsLoading(false);
    };

    loadData();
  }, [selectedDepartamento]);

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[300px]">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[300px]">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Cargo
      </h3>

      {cargoData.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">Sin datos de cargos</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cargoData.map((item, index) => (
            <div key={item.cargo} className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-600 truncate max-w-[220px]" title={item.cargo}>
                  {item.cargo}
                </span>
                <span className="font-semibold text-gray-700 ml-2">
                  {item.cantidad}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${item.porcentaje}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
          
          {/* Total */}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 font-medium">Total agentes</span>
              <span className="font-bold text-gray-700">{totalAgentes}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
