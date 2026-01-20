'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Departamento } from '@/types/departamento';
import { fetchDepartamentos, fetchPersonalPorDepartamento } from '@/services/api';
import SanAndresInset from './SanAndresInset';

// Colores del semáforo según cantidad de agentes (opaco para normal, intenso para selección)
const SEMAFORO_COLORS = {
  azul: { normal: '#90CAF9', intenso: '#2196F3', border: '#1565C0' },      // > 10 agentes
  verde: { normal: '#A5D6A7', intenso: '#4CAF50', border: '#388E3C' },     // = 10 agentes
  naranja: { normal: '#FFCC80', intenso: '#FF9800', border: '#F57C00' },   // 7-9 agentes
  amarillo: { normal: '#FFF59D', intenso: '#FFEB3B', border: '#FBC02D' },  // 4-6 agentes
  rojo: { normal: '#EF9A9A', intenso: '#F44336', border: '#D32F2F' },      // <= 3 agentes
  sinDatos: { normal: '#E0E0E0', intenso: '#9E9E9E', border: '#757575' },  // Sin datos
};

const COLORS = {
  hover: '#b3d4fc',
  border: '#666666',
};

const SAN_ANDRES_CODE = '88'; // Código DANE de San Andrés

// GeoJSON local de Colombia
const GEOJSON_URL = '/colombia.geojson';

interface MapaColombiaProps {
  selectedDepartamento: Departamento | null;
  onSelectDepartamento: (departamento: Departamento | null) => void;
  onDepartamentosLoaded: (departamentos: Departamento[]) => void;
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
const getColorsByAgentes = (cantidad: number) => {
  if (cantidad > 10) return SEMAFORO_COLORS.azul;
  if (cantidad === 10) return SEMAFORO_COLORS.verde;
  if (cantidad >= 7 && cantidad <= 9) return SEMAFORO_COLORS.naranja;
  if (cantidad >= 4 && cantidad <= 6) return SEMAFORO_COLORS.amarillo;
  if (cantidad >= 1 && cantidad <= 3) return SEMAFORO_COLORS.rojo;
  return SEMAFORO_COLORS.sinDatos;
};

// Componente interno del mapa (se carga dinámicamente)
function MapaLeaflet({
  selectedDepartamento,
  onSelectDepartamento,
  geoJsonData,
  departamentosRef,
  agentesPorDepto,
}: {
  selectedDepartamento: Departamento | null;
  onSelectDepartamento: (departamento: Departamento | null) => void;
  geoJsonData: any;
  departamentosRef: React.MutableRefObject<Departamento[]>;
  agentesPorDepto: Map<string, number>;
}) {
  const { MapContainer, GeoJSON } = require('react-leaflet');

  // Filtrar San Andrés del GeoJSON
  const filteredGeoJson = geoJsonData ? {
    ...geoJsonData,
    features: geoJsonData.features.filter((f: any) => getDeptCode(f) !== SAN_ANDRES_CODE)
  } : null;

  // Key única para forzar re-render del GeoJSON cuando cambia la selección
  const geoJsonKey = `geojson-${selectedDepartamento?.codigo_dane || 'none'}-${agentesPorDepto.size}`;

  // Obtener cantidad de agentes para un departamento
  const getAgentesCount = (deptName: string): number => {
    const normalizedName = normalizeText(deptName);
    const entries = Array.from(agentesPorDepto.entries());
    for (const [key, value] of entries) {
      if (normalizeText(key) === normalizedName) {
        return value;
      }
    }
    return 0;
  };

  // Estilo para cada departamento
  const getStyle = (feature: any) => {
    const deptName = getDeptName(feature);
    const deptCode = getDeptCode(feature);
    
    const isSelected = 
      selectedDepartamento?.codigo_dane?.toString() === deptCode ||
      normalizeText(selectedDepartamento?.departamento || '') === normalizeText(deptName);
    
    const agentesCount = getAgentesCount(deptName);
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
    const deptCode = getDeptCode(feature);
    const agentesCount = getAgentesCount(deptName);
    
    // Tooltip con nombre y cantidad de agentes
    layer.bindTooltip(`${deptName}<br/><b>${agentesCount} agentes</b>`, {
      permanent: false,
      direction: 'center',
      className: 'dept-tooltip',
    });

    // Eventos
    layer.on({
      mouseover: (e: any) => {
        const targetLayer = e.target;
        const isSelected = 
          selectedDepartamento?.codigo_dane?.toString() === deptCode ||
          normalizeText(selectedDepartamento?.departamento || '') === normalizeText(deptName);
        if (!isSelected) {
          targetLayer.setStyle({
            fillColor: COLORS.hover,
            weight: 2,
          });
        }
      },
      mouseout: (e: any) => {
        const targetLayer = e.target;
        const isSelected = 
          selectedDepartamento?.codigo_dane?.toString() === deptCode ||
          normalizeText(selectedDepartamento?.departamento || '') === normalizeText(deptName);
        const colors = getColorsByAgentes(agentesCount);
        targetLayer.setStyle({
          fillColor: isSelected ? colors.intenso : colors.normal,
          weight: isSelected ? 3 : 1,
          color: isSelected ? colors.border : COLORS.border,
          fillOpacity: isSelected ? 0.9 : 0.7,
        });
      },
      click: () => {
        const dept = departamentosRef.current.find(
          (d) => d.codigo_dane?.toString() === deptCode || 
                 normalizeText(d.departamento || '') === normalizeText(deptName)
        );
        
        if (dept) {
          onSelectDepartamento(dept);
        } else {
          onSelectDepartamento({
            codigo_dane: parseInt(deptCode) || 0,
            codigo: '',
            departamento: deptName,
          });
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

export default function MapaColombia({
  selectedDepartamento,
  onSelectDepartamento,
  onDepartamentosLoaded,
}: MapaColombiaProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentesPorDepto, setAgentesPorDepto] = useState<Map<string, number>>(new Map());
  const departamentosRef = useRef<Departamento[]>([]);

  // Cargar departamentos desde la API
  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        const data = await fetchDepartamentos();
        departamentosRef.current = data;
        onDepartamentosLoaded(data);
      } catch (err) {
        console.error('Error cargando departamentos:', err);
      }
    };
    loadDepartamentos();
  }, [onDepartamentosLoaded]);

  // Cargar conteo de agentes por departamento
  useEffect(() => {
    const loadAgentes = async () => {
      try {
        const data = await fetchPersonalPorDepartamento();
        const map = new Map<string, number>();
        data.forEach((item) => {
          map.set(item.departamento, item.cantidad);
        });
        setAgentesPorDepto(map);
      } catch (err) {
        console.error('Error cargando agentes:', err);
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
    const isSanAndresSelected = selectedDepartamento?.codigo_dane === 88 ||
      selectedDepartamento?.departamento?.toUpperCase().includes('SAN ANDR');
    
    if (isSanAndresSelected) {
      onSelectDepartamento(null);
    } else {
      const sanAndres = departamentosRef.current.find((d) => d.codigo_dane === 88);
      onSelectDepartamento(sanAndres || {
        codigo_dane: 88,
        codigo: 'co-sa',
        departamento: 'San Andrés Y Providencia',
      });
    }
  }, [selectedDepartamento, onSelectDepartamento]);

  // Obtener cantidad de agentes de San Andrés
  const getSanAndresAgentes = (): number => {
    const entries = Array.from(agentesPorDepto.entries());
    for (const [key, value] of entries) {
      if (normalizeText(key).includes('SAN ANDR')) {
        return value;
      }
    }
    return 0;
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

  const isSanAndresSelected = selectedDepartamento?.codigo_dane === 88 ||
    (selectedDepartamento?.departamento?.toUpperCase().includes('SAN ANDR') ?? false);

  return (
    <div className="relative">
      <SanAndresInset
        isSelected={isSanAndresSelected}
        onSelect={handleSanAndresSelect}
        agentesCount={getSanAndresAgentes()}
      />
      <MapaLeafletDynamic
        selectedDepartamento={selectedDepartamento}
        onSelectDepartamento={onSelectDepartamento}
        geoJsonData={geoJsonData}
        departamentosRef={departamentosRef}
        agentesPorDepto={agentesPorDepto}
      />
      
      {/* Leyenda del semáforo - alineada con San Andrés */}
      <div className="absolute top-[160px] bg-white/90 backdrop-blur-sm rounded shadow p-2 z-10" style={{ left: '350px' }}>
        <p className="text-[10px] font-semibold text-gray-700 mb-1">Agentes</p>
        <div className="space-y-0.5 text-[9px]">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.azul.intenso }}></div>
            <span className="text-gray-600">&gt;10</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.verde.intenso }}></div>
            <span className="text-gray-600">=10</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.naranja.intenso }}></div>
            <span className="text-gray-600">7-9</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.amarillo.intenso }}></div>
            <span className="text-gray-600">4-6</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SEMAFORO_COLORS.rojo.intenso }}></div>
            <span className="text-gray-600">1-3</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm border border-gray-300" style={{ backgroundColor: SEMAFORO_COLORS.sinDatos.intenso }}></div>
            <span className="text-gray-600">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
