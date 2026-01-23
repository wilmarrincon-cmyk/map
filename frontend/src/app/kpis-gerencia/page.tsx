'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { fetchKpisControlGerencia, fetchFiltrosKpisControlGerencia } from '@/services/api';
import { KpiControlGerencia, FiltrosKpisControlGerencia } from '@/types/kpis-control-gerencia';

// Colores para estados
const ESTADO_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  'Cumplido': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  'En proceso': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'Pendiente': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  'No cumplido': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  'En riesgo': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  'En alerta': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  'default': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

const getEstadoColor = (estado: string) => {
  return ESTADO_COLORS[estado] || ESTADO_COLORS['default'];
};

export default function KpisGerenciaPage() {
  const [kpis, setKpis] = useState<KpiControlGerencia[]>([]);
  const [filtros, setFiltros] = useState<FiltrosKpisControlGerencia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periodicidadSeleccionada, setPeriodicidadSeleccionada] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [kpiSeleccionado, setKpiSeleccionado] = useState<KpiControlGerencia | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [kpisData, filtrosData] = await Promise.all([
          fetchKpisControlGerencia(),
          fetchFiltrosKpisControlGerencia(),
        ]);
        setKpis(kpisData);
        setFiltros(filtrosData);
        
        // Seleccionar la primera periodicidad por defecto si hay datos
        if (kpisData.length > 0 && !periodicidadSeleccionada) {
          const periodicidades = filtrosData?.periodicidades || [];
          if (periodicidades.length > 0) {
            setPeriodicidadSeleccionada(periodicidades[0]);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Calcular conteo de KPIs por periodicidad
  const periodicidadesConConteo = useMemo(() => {
    const conteo = new Map<string, number>();
    
    kpis.forEach((kpi) => {
      const periodicidad = kpi.periodicidad || 'Sin periodicidad';
      conteo.set(periodicidad, (conteo.get(periodicidad) || 0) + 1);
    });

    const periodicidades = Array.from(conteo.entries())
      .map(([periodicidad, cantidad]) => ({ periodicidad, cantidad }))
      .sort((a, b) => a.periodicidad.localeCompare(b.periodicidad, 'es'));

    return periodicidades;
  }, [kpis]);

  // Filtrar KPIs por periodicidad seleccionada
  const kpisDeLaPeriodicidad = useMemo(() => {
    if (!periodicidadSeleccionada) {
      return [];
    }
    
    return kpis
      .filter((kpi) => (kpi.periodicidad || 'Sin periodicidad') === periodicidadSeleccionada)
      .sort((a, b) => a.kpi.localeCompare(b.kpi, 'es'));
  }, [kpis, periodicidadSeleccionada]);

  const handleSeleccionarPeriodicidad = (periodicidad: string) => {
    setPeriodicidadSeleccionada(periodicidad);
  };

  const handleVerDetalle = (kpi: KpiControlGerencia) => {
    setKpiSeleccionado(kpi);
    setMostrarModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-3">
          <div className="breadcrumb">
            <Link href="/" className="breadcrumb-link">
              Inicio
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">KPIs de Control Gerencia</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-6">
        <div className="content-container">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">KPIs de Control Gerencia</h1>
              <p className="text-gray-500 text-sm">Monitoreo y seguimiento de indicadores de control gerencial</p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-280px)] min-h-[600px]">
              {/* Panel Izquierdo - Lista de KPIs de la periodicidad seleccionada */}
              <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
                {periodicidadSeleccionada ? (
                  <>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        KPIs de: <span className="text-blue-600">{periodicidadSeleccionada}</span>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {kpisDeLaPeriodicidad.length} KPI{kpisDeLaPeriodicidad.length !== 1 ? 's' : ''} encontrado{kpisDeLaPeriodicidad.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {kpisDeLaPeriodicidad.length > 0 ? (
                      <div className="space-y-3">
                        {kpisDeLaPeriodicidad.map((kpi) => {
                          const estadoColor = getEstadoColor(kpi.estado || '');
                          return (
                            <div
                              key={kpi.id_kpi}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleVerDetalle(kpi)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-800 mb-2">{kpi.kpi}</h3>
                                  
                                  {kpi.descripcion && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{kpi.descripcion}</p>
                                  )}
                                  
                                  <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Estado</p>
                                      {kpi.estado ? (
                                        <span
                                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${estadoColor.bg} ${estadoColor.text} ${estadoColor.border} border`}
                                        >
                                          {kpi.estado}
                                        </span>
                                      ) : (
                                        <p className="text-sm text-gray-400">-</p>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Periodicidad</p>
                                      <p className="text-sm text-gray-900">{kpi.periodicidad || '-'}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Resultado Actual</p>
                                      <p className="text-sm text-gray-900 font-medium">{kpi.resultado_actual || '-'}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Meta</p>
                                      <p className="text-sm text-gray-900">{kpi.meta || '-'}</p>
                                    </div>

                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-500 uppercase mb-1">Responsable</p>
                                      <p className="text-sm text-gray-900">{kpi.responsable || '-'}</p>
                                    </div>
                                  </div>

                                  {kpi.fecha_actualizacion && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                      <p className="text-xs text-gray-500">
                                        Última actualización: <span className="text-gray-700">
                                          {new Date(kpi.fecha_actualizacion).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                          })}
                                        </span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="ml-4">
                                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                                    Ver detalle
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No hay KPIs para esta periodicidad</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Selecciona una periodicidad de la lista</p>
                  </div>
                )}
              </div>

              {/* Panel Derecho - Lista de Periodicidades */}
              <div className="w-80 p-6 bg-gray-50 overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Periodicidades</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-blue-600 font-medium uppercase mb-0.5">Total KPIs</p>
                    <p className="text-xl font-bold text-blue-800">{kpis.length}</p>
                  </div>
                </div>
                
                {periodicidadesConConteo.length > 0 ? (
                  <div className="space-y-2">
                    {periodicidadesConConteo.map((item) => {
                      return (
                        <button
                          key={item.periodicidad}
                          onClick={() => handleSeleccionarPeriodicidad(item.periodicidad)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            periodicidadSeleccionada === item.periodicidad
                              ? 'bg-blue-50 border-blue-500 shadow-md'
                              : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              periodicidadSeleccionada === item.periodicidad
                                ? 'text-blue-700'
                                : 'text-gray-800'
                            }`}>
                              {item.periodicidad}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              periodicidadSeleccionada === item.periodicidad
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {item.cantidad}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No hay periodicidades disponibles</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      {mostrarModal && kpiSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detalles del KPI</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {kpiSeleccionado.id_kpi}</p>
              </div>
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setKpiSeleccionado(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">KPI</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{kpiSeleccionado.kpi}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Estado</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {kpiSeleccionado.estado ? (
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          getEstadoColor(kpiSeleccionado.estado).bg
                        } ${getEstadoColor(kpiSeleccionado.estado).text} ${
                          getEstadoColor(kpiSeleccionado.estado).border
                        } border`}
                      >
                        {kpiSeleccionado.estado}
                      </span>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Descripción</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.descripcion || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Fórmula / Método</label>
                  <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 p-2 rounded">{kpiSeleccionado.formula_metodo || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Meta</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">{kpiSeleccionado.meta || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Resultado Actual</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">{kpiSeleccionado.resultado_actual || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Periodicidad</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.periodicidad || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Responsable</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.responsable || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Actualización</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {kpiSeleccionado.fecha_actualizacion
                      ? new Date(kpiSeleccionado.fecha_actualizacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setKpiSeleccionado(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
