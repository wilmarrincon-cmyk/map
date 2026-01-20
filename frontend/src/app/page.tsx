'use client';

import { useState } from 'react';
import MapaColombia from '@/components/MapaColombia';
import InfoPanel from '@/components/InfoPanel';
import AgentesStats from '@/components/AgentesStats';
import CargoStats from '@/components/CargoStats';
import { Departamento } from '@/types/departamento';

export default function Home() {
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const handleSelectDepartamento = (departamento: Departamento | null) => {
    setSelectedDepartamento(departamento);
  };

  const handleDepartamentosLoaded = (data: Departamento[]) => {
    setDepartamentos(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          Mapa de Colombia - Reporte Interactivo
        </h1>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
          <MapaColombia
            selectedDepartamento={selectedDepartamento}
            onSelectDepartamento={handleSelectDepartamento}
            onDepartamentosLoaded={handleDepartamentosLoaded}
          />
          
          {/* Panel izquierdo - Lista de agentes */}
          <div className="absolute top-4 left-4 z-10">
            <InfoPanel departamento={selectedDepartamento} />
          </div>
          
          {/* Panel derecho sobre el mapa - KPIs y Cargos */}
          <div className="absolute top-4 right-4 z-10 space-y-3">
            <AgentesStats 
              selectedDepartamento={selectedDepartamento}
              departamentos={departamentos}
              onSelectDepartamento={handleSelectDepartamento}
            />
            <CargoStats selectedDepartamento={selectedDepartamento} />
          </div>
        </div>
      </div>
    </main>
  );
}
