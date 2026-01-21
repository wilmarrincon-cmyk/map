'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Circunscripcion } from '@/types/circunscripcion';
import { fetchCircunscripciones, fetchPersonalPorCircunscripcion } from '@/services/api';
import SanAndresInsetCirc from './SanAndresInsetCirc';

// Colores del semáforo según cantidad de agentes (opaco para normal, intenso para selección)
const SEMAFORO_COLORS = {
  azul: { normal: '#90CAF9', intenso: '#2196F3', border: '#1565C0' },      // > 2 agentes
  verde: { normal: '#A5D6A7', intenso: '#4CAF50', border: '#388E3C' },     // = 2 agentes
  rojo: { normal: '#EF9A9A', intenso: '#F44336', border: '#D32F2F' },      // < 2 agentes (1)
  gris: { normal: '#E0E0E0', intenso: '#9E9E9E', border: '#757575' },     // 0 agentes
};

const COLORS = {
  hover: '#b3d4fc',
  border: '#666666',
};

const SAN_ANDRES_CODE = '88'; // Código DANE de San Andrés

// GeoJSON local de Colombia
const GEOJSON_URL = '/colombia.geojson';

interface MapaCircunscripcionProps {
  selectedCircunscripcion: Circunscripcion | null;
  onSelectCircunscripcion: (circunscripcion: Circunscripcion | null) => void;
  onCircunscripcionesLoaded: (circunscripciones: Circunscripcion[]) => void;
}

// Normalizar texto para comparación (función global)
const normalizeText = (text: string) => {
  return text?.toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim() || '';
};

// Obtener nombre del departamento de las propiedades
const getDeptName = (feature: any) => {
  const props = feature.properties;
  const name = props.DPTO_CNMBR || props.NOMBRE_DPT || props.name || props.DEPARTAMENTO || '';
  return name.split(' ').map((word: string) => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Obtener código del departamento
const getDeptCode = (feature: any) => {
  const props = feature.properties;
  return props.DPTO_CCDGO || props.codigo || '';
};

// Obtener colores según cantidad de agentes (retorna objeto con normal, intenso y border)
// Criterios: > 2 = Azul, = 2 = Verde, < 2 (1) = Rojo, 0 = Gris
const getColorsByAgentes = (cantidad: number) => {
  if (cantidad > 2) return SEMAFORO_COLORS.azul;
  if (cantidad === 2) return SEMAFORO_COLORS.verde;
  if (cantidad === 1) return SEMAFORO_COLORS.rojo;
  return SEMAFORO_COLORS.gris; // 0 agentes
};

// Componente interno del mapa (se carga dinámicamente)
function MapaLeaflet({
  selectedCircunscripcion,
  onSelectCircunscripcion,
  geoJsonData,
  circunscripcionesRef,
  agentesPorCitrepDepto,
}: {
  selectedCircunscripcion: Circunscripcion | null;
  onSelectCircunscripcion: (circunscripcion: Circunscripcion | null) => void;
  geoJsonData: any;
  circunscripcionesRef: React.MutableRefObject<Circunscripcion[]>;
  agentesPorCitrepDepto: Array<{ citrep: string; departamento: string; cantidad: number }>;
}) {
  const { MapContainer, GeoJSON } = require('react-leaflet');

  // Filtrar San Andrés del GeoJSON
  const filteredGeoJson = geoJsonData ? {
    ...geoJsonData,
    features: geoJsonData.features.filter((f: any) => getDeptCode(f) !== SAN_ANDRES_CODE)
  } : null;

  // Key única para forzar re-render del GeoJSON cuando cambia la selección
  // Incluye el citrep seleccionado para que se actualicen los colores
  const geoJsonKey = `geojson-circ-${selectedCircunscripcion?.citrep || 'none'}-${agentesPorCitrepDepto.length}`;

  // Verificar si un departamento tiene circunscripciones asociadas
  const tieneCircunscripciones = (deptName: string): boolean => {
    const normalizedName = normalizeText(deptName);
    return circunscripcionesRef.current.some(
      c => normalizeText(c.departamento || '') === normalizedName
    );
  };

  // Obtener todas las citreps de un departamento
  const getCitrepsDelDepto = (deptName: string): string[] => {
    const normalizedName = normalizeText(deptName);
    const citreps = circunscripcionesRef.current
      .filter(c => normalizeText(c.departamento || '') === normalizedName)
      .map(c => c.citrep)
      .filter(Boolean);
    // Eliminar duplicados y ordenar
    return Array.from(new Set(citreps)).sort();
  };

  // Obtener el citrep principal de un departamento (primera citrep para color por defecto)
  const getCitrepPrincipalDelDepto = (deptName: string): string | null => {
    const citreps = getCitrepsDelDepto(deptName);
    return citreps.length > 0 ? citreps[0] : null;
  };

  // Obtener el total de agentes de una citrep (suma de todos sus departamentos)
  // Usa la relación citrep-departamento del backend
  const getAgentesCountPorCitrep = (citrep: string): number => {
    if (!citrep) return 0;
    
    // Sumar agentes de todos los registros que tienen este citrep
    // (agrupados por citrep-departamento en el backend)
    const totalAgentes = agentesPorCitrepDepto
      .filter(item => item.citrep === citrep)
      .reduce((sum, item) => sum + item.cantidad, 0);
    
    return totalAgentes;
  };

  // Obtener cantidad de agentes para un departamento (basado en su citrep principal)
  // Todos los departamentos de la misma citrep retornan el mismo valor (suma total)
  const getAgentesCount = (deptName: string): number => {
    const citrep = getCitrepPrincipalDelDepto(deptName);
    if (!citrep) return 0;
    
    // Retornar el total de agentes de la citrep (suma de todos sus departamentos)
    return getAgentesCountPorCitrep(citrep);
  };

  // Estilo para cada departamento (mismo color para todos los deptos de la misma citrep)
  const getStyle = (feature: any) => {
    const deptName = getDeptName(feature);
    
    // Verificar si el departamento tiene circunscripciones
    const tieneCirc = tieneCircunscripciones(deptName);
    
    // Si no tiene circunscripciones, mostrar en blanco
    if (!tieneCirc) {
      return {
        fillColor: '#FFFFFF', // Blanco
        weight: 1,
        opacity: 1,
        color: '#CCCCCC', // Borde gris claro
        fillOpacity: 1,
      };
    }
    
    // Obtener todas las citreps de este departamento
    const citreps = getCitrepsDelDepto(deptName);
    const citrepPrincipal = citreps.length > 0 ? citreps[0] : null;
    
    // Verificar si este departamento pertenece a la citrep seleccionada
    // Si el departamento pertenece a múltiples citreps, se resalta si alguna coincide
    const isSelected = selectedCircunscripcion?.citrep && 
      citreps.includes(selectedCircunscripcion.citrep);
    
    // Si está seleccionado, usar la citrep seleccionada; si no, usar la principal
    const citrepParaColor = isSelected && selectedCircunscripcion?.citrep 
      ? selectedCircunscripcion.citrep 
      : citrepPrincipal;
    
    // Obtener el total de agentes de la citrep (suma de todos sus departamentos)
    const agentesCount = citrepParaColor ? getAgentesCountPorCitrep(citrepParaColor) : 0;
    const colors = getColorsByAgentes(agentesCount);
    
    return {
      fillColor: isSelected ? colors.intenso : colors.normal,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? colors.border : COLORS.border,
      fillOpacity: isSelected ? 0.9 : 0.7,
    };
  };

  // Eventos para cada feature
  const onEachFeature = (feature: any, layer: any) => {
    const deptName = getDeptName(feature);
    const citreps = getCitrepsDelDepto(deptName);
    const tieneCirc = tieneCircunscripciones(deptName);
    
    // Construir tooltip con información de todas las citreps
    let tooltipContent = `${deptName}`;
    
    if (tieneCirc && citreps.length > 0) {
      if (citreps.length === 1) {
        // Una sola citrep
        const citrep = citreps[0];
        const agentesCount = getAgentesCountPorCitrep(citrep);
        tooltipContent += `<br/><b>CITREP: ${citrep}</b><br/>Total: ${agentesCount} agentes`;
      } else {
        // Múltiples citreps
        tooltipContent += `<br/><b>Pertenece a ${citreps.length} CITREPs:</b>`;
        citreps.forEach(citrep => {
          const agentesCount = getAgentesCountPorCitrep(citrep);
          tooltipContent += `<br/>• ${citrep}: ${agentesCount} agentes`;
        });
      }
    } else {
      tooltipContent += `<br/><b>Sin circunscripciones</b>`;
    }
    
    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'center',
      className: 'dept-tooltip',
    });

    // Eventos
    layer.on({
      mouseover: (e: any) => {
        const targetLayer = e.target;
        const citreps = getCitrepsDelDepto(deptName);
        const isSelected = selectedCircunscripcion?.citrep && 
          citreps.includes(selectedCircunscripcion.citrep);
        
        // Si no tiene circunscripciones, mantener blanco con borde más oscuro
        if (!tieneCirc) {
          targetLayer.setStyle({
            fillColor: '#F5F5F5', // Gris muy claro al hover
            weight: 2,
            color: '#999999',
          });
        } else if (!isSelected) {
          targetLayer.setStyle({
            fillColor: COLORS.hover,
            weight: 2,
          });
        }
      },
      mouseout: (e: any) => {
        const targetLayer = e.target;
        const citreps = getCitrepsDelDepto(deptName);
        const isSelected = selectedCircunscripcion?.citrep && 
          citreps.includes(selectedCircunscripcion.citrep);
        
        // Si no tiene circunscripciones, volver a blanco
        if (!tieneCirc) {
          targetLayer.setStyle({
            fillColor: '#FFFFFF',
            weight: 1,
            color: '#CCCCCC',
            fillOpacity: 1,
          });
        } else {
          // Determinar qué citrep usar para el color
          const citrepParaColor = isSelected && selectedCircunscripcion?.citrep 
            ? selectedCircunscripcion.citrep 
            : (citreps.length > 0 ? citreps[0] : null);
          
          const agentesCount = citrepParaColor ? getAgentesCountPorCitrep(citrepParaColor) : 0;
          const colors = getColorsByAgentes(agentesCount);
          
          targetLayer.setStyle({
            fillColor: isSelected ? colors.intenso : colors.normal,
            weight: isSelected ? 3 : 1,
            color: isSelected ? colors.border : COLORS.border,
            fillOpacity: isSelected ? 0.9 : 0.7,
          });
        }
      },
      click: () => {
        // Solo permitir clic si tiene circunscripciones
        if (!tieneCirc || citreps.length === 0) {
          return;
        }
        
        // Si tiene múltiples citreps, seleccionar la primera
        // Si está seleccionada una citrep y el departamento la incluye, mantenerla
        const citrepParaSeleccionar = selectedCircunscripcion?.citrep && citreps.includes(selectedCircunscripcion.citrep)
          ? selectedCircunscripcion.citrep
          : citreps[0];
        
        // Buscar la primera circunscripción con este citrep
        const circ = circunscripcionesRef.current.find(
          (c) => c.citrep === citrepParaSeleccionar
        );
        
        if (circ) {
          onSelectCircunscripcion(circ);
        }
      },
    });
  };

  return (
    <MapContainer
      center={[4.5, -73.5]}
      zoom={5}
      style={{ height: '500px', width: '100%', backgroundColor: '#f8fafc' }}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      {filteredGeoJson && (
        <GeoJSON
          key={geoJsonKey}
          data={filteredGeoJson}
          style={getStyle}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
}

// Cargar el mapa dinámicamente (solo en cliente)
const MapaLeafletDynamic = dynamic(
  () => Promise.resolve(MapaLeaflet),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
);

export default function MapaCircunscripcion({
  selectedCircunscripcion,
  onSelectCircunscripcion,
  onCircunscripcionesLoaded,
}: MapaCircunscripcionProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Mantener la relación citrep-departamento-cantidad
  const [agentesPorCitrepDepto, setAgentesPorCitrepDepto] = useState<Array<{ citrep: string; departamento: string; cantidad: number }>>([]);
  const circunscripcionesRef = useRef<Circunscripcion[]>([]);

  // Cargar circunscripciones desde la API
  useEffect(() => {
    const loadCircunscripciones = async () => {
      try {
        const data = await fetchCircunscripciones();
        circunscripcionesRef.current = data;
        onCircunscripcionesLoaded(data);
      } catch (err) {
        console.error('Error cargando circunscripciones:', err);
      }
    };
    loadCircunscripciones();
  }, [onCircunscripcionesLoaded]);

  // Cargar conteo de agentes por circunscripción/departamento
  // Mantener la relación citrep-departamento-cantidad del backend
  useEffect(() => {
    const loadAgentes = async () => {
      try {
        const data = await fetchPersonalPorCircunscripcion();
        // Mantener la estructura completa: citrep-departamento-cantidad
        setAgentesPorCitrepDepto(data);
      } catch (err) {
        console.error('Error cargando agentes:', err);
        setAgentesPorCitrepDepto([]);
      }
    };
    loadAgentes();
  }, []);

  // Cargar GeoJSON
  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        console.log('Cargando GeoJSON desde:', GEOJSON_URL);
        const response = await fetch(GEOJSON_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('GeoJSON cargado:', data.features?.length, 'departamentos');
        setGeoJsonData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error cargando GeoJSON:', err);
        setError('Error cargando el mapa');
        setIsLoading(false);
      }
    };
    loadGeoJson();
  }, []);

  // Handler para San Andrés
  const handleSanAndresSelect = useCallback(() => {
    const isSanAndresSelected = selectedCircunscripcion?.departamento?.toUpperCase().includes('SAN ANDR');
    
    if (isSanAndresSelected) {
      onSelectCircunscripcion(null);
    } else {
      const sanAndres = circunscripcionesRef.current.find(
        (c) => c.departamento?.toUpperCase().includes('SAN ANDR')
      );
      onSelectCircunscripcion(sanAndres || {
        id: 0,
        citrep: 'SAN ANDRES',
        departamento: 'San Andrés Y Providencia',
      });
    }
  }, [selectedCircunscripcion, onSelectCircunscripcion]);

  // Obtener el total de agentes de una citrep (suma de todos sus departamentos)
  // Usa la relación citrep-departamento del backend
  const getAgentesCountPorCitrep = (citrep: string): number => {
    if (!citrep) return 0;
    
    // Sumar agentes de todos los registros que tienen este citrep
    // (agrupados por citrep-departamento en el backend)
    const totalAgentes = agentesPorCitrepDepto
      .filter(item => item.citrep === citrep)
      .reduce((sum, item) => sum + item.cantidad, 0);
    
    return totalAgentes;
  };

  // Obtener cantidad de agentes de San Andrés
  const getSanAndresAgentes = (): number => {
    // Encontrar el citrep de San Andrés
    const sanAndresCirc = circunscripcionesRef.current.find(
      c => normalizeText(c.departamento || '').includes('SAN ANDR')
    );
    
    if (!sanAndresCirc?.citrep) return 0;
    
    // Retornar el total de agentes de la citrep (suma de todos sus departamentos)
    return getAgentesCountPorCitrep(sanAndresCirc.citrep);
  };

  if (error) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  const isSanAndresSelected = selectedCircunscripcion?.departamento?.toUpperCase().includes('SAN ANDR') ?? false;

  return (
    <div className="relative">
      <SanAndresInsetCirc
        isSelected={isSanAndresSelected}
        onSelect={handleSanAndresSelect}
        agentesCount={getSanAndresAgentes()}
      />
      <MapaLeafletDynamic
        selectedCircunscripcion={selectedCircunscripcion}
        onSelectCircunscripcion={onSelectCircunscripcion}
        geoJsonData={geoJsonData}
        circunscripcionesRef={circunscripcionesRef}
        agentesPorCitrepDepto={agentesPorCitrepDepto}
      />
      
      {/* Leyenda del semáforo - alineada con San Andrés */}
      <div className="absolute top-[160px] bg-white/90 backdrop-blur-sm rounded shadow p-2 z-10" style={{ left: '350px' }}>
        <p className="text-[10px] font-semibold text-gray-700 mb-1">Agentes</p>
        <div className="space-y-0.5 text-[9px]">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.azul.intenso }}></div>
            <span className="text-gray-600">&gt;2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.verde.intenso }}></div>
            <span className="text-gray-600">=2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.rojo.intenso }}></div>
            <span className="text-gray-600">&lt;2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm border border-gray-300" style={{ backgroundColor: SEMAFORO_COLORS.gris.intenso }}></div>
            <span className="text-gray-600">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
