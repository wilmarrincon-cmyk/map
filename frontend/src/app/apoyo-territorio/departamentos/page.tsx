'use client';

import { useState } from 'react';
import Link from 'next/link';
import MapaColombia from '@/components/MapaColombia';
import InfoPanel from '@/components/InfoPanel';
import AgentesStats from '@/components/AgentesStats';
import CargoStats from '@/components/CargoStats';
import { Departamento } from '@/types/departamento';

export default function DepartamentosPage() {
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
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-4">
        <nav className="mb-2">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Inicio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/apoyo-territorio" className="text-blue-600 hover:text-blue-800">
                Apoyo Territorio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 font-medium">Departamentos</li>
          </ol>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-4 pt-2">
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
