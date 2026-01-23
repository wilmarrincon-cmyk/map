'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { fetchIndicadoresCargos, fetchFiltrosIndicadoresCargos } from '@/services/api';
import { IndicadorCargo, FiltrosIndicadoresCargos } from '@/types/indicadores-cargos';

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

export default function KpisCargosPage() {
  const [indicadores, setIndicadores] = useState<IndicadorCargo[]>([]);
  const [filtros, setFiltros] = useState<FiltrosIndicadoresCargos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cargoSeleccionado, setCargoSeleccionado] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState<IndicadorCargo | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [indicadoresData, filtrosData] = await Promise.all([
          fetchIndicadoresCargos(),
          fetchFiltrosIndicadoresCargos(),
        ]);
        setIndicadores(indicadoresData);
        setFiltros(filtrosData);
        
        // Seleccionar el primer cargo por defecto si hay datos
        if (indicadoresData.length > 0 && !cargoSeleccionado) {
          const primerCargo = indicadoresData[0]?.cargo;
          if (primerCargo) {
            setCargoSeleccionado(primerCargo);
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

  // Calcular conteo de indicadores por cargo
  const cargosConConteo = useMemo(() => {
    const conteo = new Map<string, number>();
    
    indicadores.forEach((indicador) => {
      if (indicador.cargo) {
        conteo.set(indicador.cargo, (conteo.get(indicador.cargo) || 0) + 1);
      }
    });

    return Array.from(conteo.entries())
      .map(([cargo, cantidad]) => ({ cargo, cantidad }))
      .sort((a, b) => a.cargo.localeCompare(b.cargo, 'es'));
  }, [indicadores]);

  // Filtrar indicadores por cargo seleccionado
  const indicadoresDelCargo = useMemo(() => {
    if (!cargoSeleccionado) return [];
    
    return indicadores
      .filter((indicador) => indicador.cargo === cargoSeleccionado)
      .sort((a, b) => a.indicador.localeCompare(b.indicador, 'es'));
  }, [indicadores, cargoSeleccionado]);

  const handleSeleccionarCargo = (cargo: string) => {
    setCargoSeleccionado(cargo);
  };

  const handleVerDetalle = (indicador: IndicadorCargo) => {
    setIndicadorSeleccionado(indicador);
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
            <span className="breadcrumb-current">KPIs de Cargos</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-6">
        <div className="content-container">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">KPIs de Cargos</h1>
              <p className="text-gray-500 text-sm">Monitoreo y seguimiento de indicadores de desempeño por cargo</p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-280px)] min-h-[600px]">
              {/* Panel Izquierdo - Lista de Indicadores del cargo seleccionado */}
              <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
                {cargoSeleccionado ? (
                  <>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        Indicadores de: <span className="text-blue-600">{cargoSeleccionado}</span>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {indicadoresDelCargo.length} indicador{indicadoresDelCargo.length !== 1 ? 'es' : ''} encontrado{indicadoresDelCargo.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {indicadoresDelCargo.length > 0 ? (
                      <div className="space-y-3">
                        {indicadoresDelCargo.map((indicador) => {
                          const resultadoColor = getResultadoColor(indicador.resultado_enero || '');
                          return (
                            <div
                              key={indicador.id_indicador}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleVerDetalle(indicador)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-800 mb-2">{indicador.indicador}</h3>
                                  
                                  {indicador.descripcion && (
                                    <p className="text-sm text-gray-600 mb-3">{indicador.descripcion}</p>
                                  )}
                                  
                                  <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Resultado Enero</p>
                                      {indicador.resultado_enero ? (
                                        <span
                                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${resultadoColor.bg} ${resultadoColor.text} ${resultadoColor.border} border`}
                                        >
                                          {indicador.resultado_enero}
                                        </span>
                                      ) : (
                                        <p className="text-sm text-gray-400">-</p>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Frecuencia</p>
                                      <p className="text-sm text-gray-900">{indicador.frecuencia || '-'}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Meta/Umbral</p>
                                      <p className="text-sm text-gray-900">{indicador.meta_umbral || '-'}</p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-1">Unidad</p>
                                      <p className="text-sm text-gray-900">{indicador.unidad || '-'}</p>
                                    </div>
                                  </div>

                                  {indicador.fecha_registro && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                      <p className="text-xs text-gray-500">
                                        Fecha de registro: <span className="text-gray-700">
                                          {new Date(indicador.fecha_registro).toLocaleDateString('es-ES')}
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
                        <p className="text-gray-500">No hay indicadores para este cargo</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Selecciona un cargo de la lista</p>
                  </div>
                )}
              </div>

              {/* Panel Derecho - Lista de Cargos */}
              <div className="w-80 p-6 bg-gray-50 overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Cargos</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-blue-600 font-medium uppercase mb-0.5">Total Indicadores</p>
                    <p className="text-xl font-bold text-blue-800">{indicadores.length}</p>
                  </div>
                </div>
                
                {cargosConConteo.length > 0 ? (
                  <div className="space-y-2">
                    {cargosConConteo.map((item) => (
                      <button
                        key={item.cargo}
                        onClick={() => handleSeleccionarCargo(item.cargo)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          cargoSeleccionado === item.cargo
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            cargoSeleccionado === item.cargo
                              ? 'text-blue-700'
                              : 'text-gray-800'
                          }`}>
                            {item.cargo}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            cargoSeleccionado === item.cargo
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
                    <p className="text-gray-500 text-sm">No hay cargos disponibles</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      {mostrarModal && indicadorSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detalles del Indicador</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {indicadorSeleccionado.id_indicador}</p>
              </div>
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setIndicadorSeleccionado(null);
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
                  <label className="text-xs font-medium text-gray-500 uppercase">Cargo</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{indicadorSeleccionado.cargo}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Indicador</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{indicadorSeleccionado.indicador}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Descripción</label>
                  <p className="text-sm text-gray-900 mt-1">{indicadorSeleccionado.descripcion || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Fórmula</label>
                  <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 p-2 rounded">{indicadorSeleccionado.formula || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Meta/Umbral</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">{indicadorSeleccionado.meta_umbral || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Unidad</label>
                  <p className="text-sm text-gray-900 mt-1">{indicadorSeleccionado.unidad || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Frecuencia</label>
                  <p className="text-sm text-gray-900 mt-1">{indicadorSeleccionado.frecuencia || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Resultado Enero</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {indicadorSeleccionado.resultado_enero ? (
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          getResultadoColor(indicadorSeleccionado.resultado_enero).bg
                        } ${getResultadoColor(indicadorSeleccionado.resultado_enero).text} ${
                          getResultadoColor(indicadorSeleccionado.resultado_enero).border
                        } border`}
                      >
                        {indicadorSeleccionado.resultado_enero}
                      </span>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Fecha de Registro</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {indicadorSeleccionado.fecha_registro
                      ? new Date(indicadorSeleccionado.fecha_registro).toLocaleDateString('es-ES', {
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
                  setIndicadorSeleccionado(null);
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
