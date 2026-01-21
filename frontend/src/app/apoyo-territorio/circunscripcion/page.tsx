'use client';

import { useState } from 'react';
import Link from 'next/link';
import MapaCircunscripcion from '@/components/circunscripcion/MapaCircunscripcion';
import InfoPanelCirc from '@/components/circunscripcion/InfoPanelCirc';
import AgentesStatsCirc from '@/components/circunscripcion/AgentesStatsCirc';
import CargoStatsCirc from '@/components/circunscripcion/CargoStatsCirc';
import { Circunscripcion } from '@/types/circunscripcion';

export default function CircunscripcionPage() {
  const [selectedCircunscripcion, setSelectedCircunscripcion] = useState<Circunscripcion | null>(null);
  const [circunscripciones, setCircunscripciones] = useState<Circunscripcion[]>([]);

  const handleSelectCircunscripcion = (circunscripcion: Circunscripcion | null) => {
    setSelectedCircunscripcion(circunscripcion);
  };

  const handleCircunscripcionesLoaded = (data: Circunscripcion[]) => {
    setCircunscripciones(data);
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
            <li className="text-gray-600 font-medium">Circunscripción</li>
          </ol>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-4 pt-2">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
          <MapaCircunscripcion
            selectedCircunscripcion={selectedCircunscripcion}
            onSelectCircunscripcion={handleSelectCircunscripcion}
            onCircunscripcionesLoaded={handleCircunscripcionesLoaded}
          />
          
          {/* Panel izquierdo - Lista de agentes */}
          <div className="absolute top-4 left-4 z-10">
            <InfoPanelCirc circunscripcion={selectedCircunscripcion} />
          </div>
          
          {/* Panel derecho sobre el mapa - KPIs y Cargos */}
          <div className="absolute top-4 right-4 z-10 space-y-3">
            <AgentesStatsCirc 
              selectedCircunscripcion={selectedCircunscripcion}
              circunscripciones={circunscripciones}
              onSelectCircunscripcion={handleSelectCircunscripcion}
            />
            <CargoStatsCirc selectedCircunscripcion={selectedCircunscripcion} />
          </div>
        </div>
      </div>
    </main>
  );
}
