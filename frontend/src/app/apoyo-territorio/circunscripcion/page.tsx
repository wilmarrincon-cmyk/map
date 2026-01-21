'use client';

import { useState } from 'react';
import Link from 'next/link';
import MapaCircunscripcion from '@/components/circunscripcion/MapaCircunscripcion';
import InfoPanelCirc from '@/components/circunscripcion/InfoPanelCirc';
import AgentesStatsCirc from '@/components/circunscripcion/AgentesStatsCirc';
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
          <ol className="breadcrumb">
            <li>
              <Link href="/" className="breadcrumb-link">
                Inicio
              </Link>
            </li>
            <li className="breadcrumb-separator">/</li>
            <li>
              <Link href="/apoyo-territorio" className="breadcrumb-link">
                Apoyo Territorio
              </Link>
            </li>
            <li className="breadcrumb-separator">/</li>
            <li className="breadcrumb-current">Circunscripción</li>
          </ol>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-4 pt-2">
        <div className="content-container relative">
          <MapaCircunscripcion
            selectedCircunscripcion={selectedCircunscripcion}
            onSelectCircunscripcion={handleSelectCircunscripcion}
            onCircunscripcionesLoaded={handleCircunscripcionesLoaded}
          />
          
          {/* Panel izquierdo - Lista de agentes */}
          <div className="absolute top-4 left-4 z-10">
            <InfoPanelCirc circunscripcion={selectedCircunscripcion} />
          </div>
          
          {/* Panel derecho sobre el mapa - KPIs */}
          <div className="absolute top-4 right-4 z-10">
            <AgentesStatsCirc 
              selectedCircunscripcion={selectedCircunscripcion}
              circunscripciones={circunscripciones}
              onSelectCircunscripcion={handleSelectCircunscripcion}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
