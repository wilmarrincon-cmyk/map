'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { fetchKpisSeguimiento, fetchFiltrosKpis } from '@/services/api';
import { KpiSeguimiento, FiltrosKpis } from '@/types/kpis-seguimiento';

// Colores para resultados
const RESULTADO_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  'Cumplido': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  'En proceso': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'Pendiente': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  'No cumplido': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  'En riesgo': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  'default': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

const getResultadoColor = (resultado: string) => {
  return RESULTADO_COLORS[resultado] || RESULTADO_COLORS['default'];
};

export default function KpisComponentesPage() {
  const [kpis, setKpis] = useState<KpiSeguimiento[]>([]);
  const [filtros, setFiltros] = useState<FiltrosKpis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [kpiSeleccionado, setKpiSeleccionado] = useState<KpiSeguimiento | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [kpisData, filtrosData] = await Promise.all([
          fetchKpisSeguimiento(),
          fetchFiltrosKpis(),
        ]);
        setKpis(kpisData);
        setFiltros(filtrosData);
        
        // Seleccionar el primer componente por defecto si hay datos
        if (kpisData.length > 0 && !componenteSeleccionado) {
          const primerComponente = kpisData[0]?.componente;
          if (primerComponente) {
            setComponenteSeleccionado(primerComponente);
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

  // Calcular conteo de KPIs por componente
  const componentesConConteo = useMemo(() => {
    const conteo = new Map<string, number>();
    
    kpis.forEach((kpi) => {
      if (kpi.componente) {
        conteo.set(kpi.componente, (conteo.get(kpi.componente) || 0) + 1);
      }
    });

    return Array.from(conteo.entries())
      .map(([componente, cantidad]) => ({ componente, cantidad }))
      .sort((a, b) => a.componente.localeCompare(b.componente, 'es'));
  }, [kpis]);

  // Filtrar KPIs por componente seleccionado
  const kpisDelComponente = useMemo(() => {
    if (!componenteSeleccionado) return [];
    
    return kpis
      .filter((kpi) => kpi.componente === componenteSeleccionado)
      .sort((a, b) => a.kpi_nombre.localeCompare(b.kpi_nombre, 'es'));
  }, [kpis, componenteSeleccionado]);

  const handleSeleccionarComponente = (componente: string) => {
    setComponenteSeleccionado(componente);
  };

  const handleVerDetalle = (kpi: KpiSeguimiento) => {
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
            <span className="breadcrumb-current">KPIs de Componentes</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-6">
        <div className="content-container">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">KPIs de Componentes</h1>
              <p className="text-gray-500 text-sm">Monitoreo y seguimiento de indicadores por componente</p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-280px)] min-h-[600px]">
              {/* Panel Izquierdo - Lista de KPIs del componente seleccionado */}
              <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
                {componenteSeleccionado ? (
                  <>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        KPIs de: <span className="text-blue-600">{componenteSeleccionado}</span>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {kpisDelComponente.length} KPI{kpisDelComponente.length !== 1 ? 's' : ''} encontrado{kpisDelComponente.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {kpisDelComponente.length > 0 ? (
                      <div className="space-y-3">
                        {kpisDelComponente.map((kpi) => {
                          const resultadoColor = getResultadoColor(kpi.resultado || '');
                          return (
                            <div
                              key={kpi.id_kpi}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleVerDetalle(kpi)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-800 mb-2">{kpi.kpi_nombre}</h3>
                                  
                                  <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Resultado</p>
                                      {kpi.resultado ? (
                                        <span
                                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${resultadoColor.bg} ${resultadoColor.text} ${resultadoColor.border} border`}
                                        >
                                          {kpi.resultado}
                                        </span>
                                      ) : (
                                        <p className="text-sm text-gray-400">-</p>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Frecuencia</p>
                                      <p className="text-sm text-gray-900">{kpi.frecuencia || '-'}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Meta/Umbral</p>
                                      <p className="text-sm text-gray-900">{kpi.meta_umbral || '-'}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Responsable</p>
                                      <p className="text-sm text-gray-900">{kpi.responsable_dato || '-'}</p>
                                    </div>
                                  </div>

                                  {kpi.ultima_fecha_reporte && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                      <p className="text-xs text-gray-500">
                                        Última fecha de reporte: <span className="text-gray-700">{kpi.ultima_fecha_reporte}</span>
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
                        <p className="text-gray-500">No hay KPIs para este componente</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Selecciona un componente de la lista</p>
                  </div>
                )}
              </div>

              {/* Panel Derecho - Lista de Componentes */}
              <div className="w-80 p-6 bg-gray-50 overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Componentes</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-blue-600 font-medium uppercase mb-0.5">Total KPIs</p>
                    <p className="text-xl font-bold text-blue-800">{kpis.length}</p>
                  </div>
                </div>
                
                {componentesConConteo.length > 0 ? (
                  <div className="space-y-2">
                    {componentesConConteo.map((item) => (
                      <button
                        key={item.componente}
                        onClick={() => handleSeleccionarComponente(item.componente)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          componenteSeleccionado === item.componente
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            componenteSeleccionado === item.componente
                              ? 'text-blue-700'
                              : 'text-gray-800'
                          }`}>
                            {item.componente}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            componenteSeleccionado === item.componente
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {item.cantidad}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No hay componentes disponibles</p>
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
                  <label className="text-xs font-medium text-gray-500 uppercase">Componente</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{kpiSeleccionado.componente}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">KPI Nombre</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{kpiSeleccionado.kpi_nombre}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Objetivo</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.objetivo || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">¿Qué Responde?</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.que_responde || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">¿Qué Mide?</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.que_mide || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Base Contractual</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.base_contractual || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Fórmula</label>
                  <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 p-2 rounded">{kpiSeleccionado.formula || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Unidad</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.unidad || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Frecuencia</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.frecuencia || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Fuente</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.fuente || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Meta/Umbral</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">{kpiSeleccionado.meta_umbral || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Resultado</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {kpiSeleccionado.resultado ? (
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          getResultadoColor(kpiSeleccionado.resultado).bg
                        } ${getResultadoColor(kpiSeleccionado.resultado).text} ${
                          getResultadoColor(kpiSeleccionado.resultado).border
                        } border`}
                      >
                        {kpiSeleccionado.resultado}
                      </span>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Responsable del Dato</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.responsable_dato || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Última Fecha de Reporte</label>
                  <p className="text-sm text-gray-900 mt-1">{kpiSeleccionado.ultima_fecha_reporte || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Creación</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {kpiSeleccionado.fecha_creacion
                      ? new Date(kpiSeleccionado.fecha_creacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Actualización</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {kpiSeleccionado.fecha_actualizacion
                      ? new Date(kpiSeleccionado.fecha_actualizacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
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
