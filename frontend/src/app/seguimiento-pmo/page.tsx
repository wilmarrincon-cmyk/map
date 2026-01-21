'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { fetchResumenPMO, fetchEntregables } from '@/services/api';
import { ResumenPMO, Entregable } from '@/types/seguimiento-pmo';

// Colores para estados
const ESTADO_COLORS: { [key: string]: { bg: string; text: string; border: string; bar: string } } = {
  'Completado': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', bar: '#22c55e' },
  'En progreso': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', bar: '#3b82f6' },
  'Pendiente': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', bar: '#eab308' },
  'Atrasado': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', bar: '#ef4444' },
  'En riesgo': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', bar: '#f97316' },
  'default': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', bar: '#6b7280' },
};

const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

const getEstadoColor = (estado: string) => {
  return ESTADO_COLORS[estado] || ESTADO_COLORS['default'];
};

// Componente de gráfica de barras horizontal
function HorizontalBarChart({ 
  data, 
  title, 
  maxItems = 8 
}: { 
  data: { label: string; value: number }[]; 
  title: string;
  maxItems?: number;
}) {
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, maxItems);
  const maxValue = Math.max(...sortedData.map(d => d.value), 1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-3">
        {sortedData.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 truncate max-w-[70%]" title={item.label}>
                {item.label}
              </span>
              <span className="font-semibold text-gray-800">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">Sin datos</p>
        )}
      </div>
    </div>
  );
}

// Componente de gráfica de actividades por vencer
function ActividadesPorVencerChart({ entregables }: { entregables: Entregable[] }) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Calcular actividades por vencer
  const actividadesPorVencer = useMemo(() => {
    const vencidas: Entregable[] = [];
    const hoyVencen: Entregable[] = [];
    const proximos7Dias: Entregable[] = [];
    const proximos15Dias: Entregable[] = [];
    const proximos30Dias: Entregable[] = [];
    const masDe30Dias: Entregable[] = [];

    entregables.forEach(e => {
      if (!e.fecha_final) return;
      
      const fechaFinal = new Date(e.fecha_final);
      fechaFinal.setHours(0, 0, 0, 0);
      const diffDias = Math.ceil((fechaFinal.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDias < 0) {
        vencidas.push(e);
      } else if (diffDias === 0) {
        hoyVencen.push(e);
      } else if (diffDias <= 7) {
        proximos7Dias.push(e);
      } else if (diffDias <= 15) {
        proximos15Dias.push(e);
      } else if (diffDias <= 30) {
        proximos30Dias.push(e);
      } else {
        masDe30Dias.push(e);
      }
    });

    return [
      { label: 'Vencidas', value: vencidas.length, color: '#ef4444' },
      { label: 'Vencen hoy', value: hoyVencen.length, color: '#f97316' },
      { label: 'Próximos 7 días', value: proximos7Dias.length, color: '#eab308' },
      { label: 'Próximos 15 días', value: proximos15Dias.length, color: '#22c55e' },
      { label: 'Próximos 30 días', value: proximos30Dias.length, color: '#3b82f6' },
      { label: 'Más de 30 días', value: masDe30Dias.length, color: '#6b7280' },
    ];
  }, [entregables]);

  const total = actividadesPorVencer.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividades por Fecha de Vencimiento</h3>
      
      {/* Barra de progreso segmentada */}
      <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex mb-4">
        {actividadesPorVencer.map((item, index) => (
          item.value > 0 && (
            <div
              key={item.label}
              className="h-full transition-all duration-500 relative group"
              style={{ 
                width: `${(item.value / total) * 100}%`,
                backgroundColor: item.color
              }}
              title={`${item.label}: ${item.value}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {(item.value / total) * 100 > 8 && (
                  <span className="text-white text-xs font-bold">{item.value}</span>
                )}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-2 gap-2">
        {actividadesPorVencer.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">{item.label}</span>
            <span className="text-xs font-semibold text-gray-800 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de gráfica de donut para cortes contractuales
function CortesContractualesChart({ entregables }: { entregables: Entregable[] }) {
  const porCorte = useMemo(() => {
    const conteo: { [key: string]: number } = {};
    entregables.forEach(e => {
      const corte = e.cortes_contractuales || 'Sin corte';
      conteo[corte] = (conteo[corte] || 0) + 1;
    });
    return Object.entries(conteo)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [entregables]);

  const total = porCorte.reduce((sum, item) => sum + item.value, 0);

  // Calcular segmentos del donut
  let currentAngle = 0;
  const segments = porCorte.map((item, index) => {
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: CHART_COLORS[index % CHART_COLORS.length]
    };
    currentAngle += angle;
    return segment;
  });

  // Función para crear path de arco
  const createArcPath = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);
    
    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividades por Corte Contractual</h3>
      
      <div className="flex items-center gap-4">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((segment, index) => (
              <path
                key={segment.label}
                d={createArcPath(segment.startAngle, segment.endAngle, 45, 25)}
                fill={segment.color}
                className="transition-all duration-300 hover:opacity-80"
              >
                <title>{`${segment.label}: ${segment.value}`}</title>
              </path>
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-xl font-bold text-gray-800">{total}</span>
              <p className="text-[10px] text-gray-500">Total</p>
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex-1 space-y-1 max-h-32 overflow-y-auto">
          {porCorte.slice(0, 6).map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-xs text-gray-600 truncate flex-1" title={item.label}>
                {item.label}
              </span>
              <span className="text-xs font-semibold text-gray-800">{item.value}</span>
            </div>
          ))}
          {porCorte.length > 6 && (
            <p className="text-xs text-gray-400">+{porCorte.length - 6} más...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeguimientoPMOPage() {
  const [resumen, setResumen] = useState<ResumenPMO | null>(null);
  const [entregables, setEntregables] = useState<Entregable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [resumenData, entregablesData] = await Promise.all([
        fetchResumenPMO(),
        fetchEntregables()
      ]);
      setResumen(resumenData);
      setEntregables(entregablesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filtrar entregables
  const entregablesFiltrados = filtroEstado 
    ? entregables.filter(e => e.estado_actividad_plazo === filtroEstado || e.estado_actividad_ejecucion === filtroEstado)
    : entregables;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Inicio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 font-medium">Seguimiento PMO</li>
          </ol>
        </nav>

        {/* Contenedor principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Seguimiento PMO</h1>
                <p className="text-gray-500 text-sm">Monitoreo y control de entregables</p>
              </div>
              {/* Filtro */}
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Todos los estados</option>
                {resumen?.por_estado_plazo.map((e) => (
                  <option key={e.estado} value={e.estado}>{e.estado}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <>
              {/* KPIs */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Entregables */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-emerald-700">{resumen?.total_entregables || 0}</span>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">Total Entregables</p>
                </div>

                {/* Componentes */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-blue-700">{resumen?.total_componentes || 0}</span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium">Componentes</p>
                </div>

                {/* Por Estado Plazo - Primer estado */}
                {resumen?.por_estado_plazo[0] && (
                  <div className={`bg-gradient-to-br ${getEstadoColor(resumen.por_estado_plazo[0].estado).bg} rounded-xl p-5`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 ${getEstadoColor(resumen.por_estado_plazo[0].estado).bg} rounded-lg flex items-center justify-center border ${getEstadoColor(resumen.por_estado_plazo[0].estado).border}`}>
                        <svg className={`w-5 h-5 ${getEstadoColor(resumen.por_estado_plazo[0].estado).text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className={`text-3xl font-bold ${getEstadoColor(resumen.por_estado_plazo[0].estado).text}`}>
                        {resumen.por_estado_plazo[0].cantidad}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${getEstadoColor(resumen.por_estado_plazo[0].estado).text}`}>
                      {resumen.por_estado_plazo[0].estado}
                    </p>
                  </div>
                )}

                {/* Responsables */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-purple-700">{resumen?.por_responsable.length || 0}</span>
                  </div>
                  <p className="text-sm text-purple-600 font-medium">Responsables</p>
                </div>
              </div>

              {/* Estados de Plazo */}
              <div className="px-6 pb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado de Actividades</h3>
                <div className="flex flex-wrap gap-2">
                  {resumen?.por_estado_plazo.map((estado) => (
                    <button
                      key={estado.estado}
                      onClick={() => setFiltroEstado(filtroEstado === estado.estado ? '' : estado.estado)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filtroEstado === estado.estado
                          ? 'bg-emerald-600 text-white'
                          : `${getEstadoColor(estado.estado).bg} ${getEstadoColor(estado.estado).text} hover:opacity-80`
                      }`}
                    >
                      {estado.estado} ({estado.cantidad})
                    </button>
                  ))}
                </div>
              </div>

              {/* Gráficas */}
              <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gráfica 1: Actividades por Componente */}
                <HorizontalBarChart 
                  data={resumen?.por_componente.map(c => ({ label: c.componente, value: c.cantidad })) || []}
                  title="Actividades por Componente"
                  maxItems={6}
                />

                {/* Gráfica 2: Actividades por Fecha de Vencimiento */}
                <ActividadesPorVencerChart entregables={entregables} />

                {/* Gráfica 3: Actividades por Corte Contractual */}
                <CortesContractualesChart entregables={entregables} />
              </div>

              {/* Tabla de Entregables */}
              <div className="px-6 pb-6">
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Actividad</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Componente</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Responsable</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado Plazo</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado Ejecución</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {entregablesFiltrados.length > 0 ? (
                          entregablesFiltrados.map((entregable) => (
                            <tr key={entregable.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-600">{entregable.id}</td>
                              <td className="px-4 py-3 text-gray-800 max-w-xs truncate" title={entregable.actividad}>
                                {entregable.actividad || '-'}
                              </td>
                              <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={entregable.componente}>
                                {entregable.componente || '-'}
                              </td>
                              <td className="px-4 py-3 text-gray-600">{entregable.responsable_principal || '-'}</td>
                              <td className="px-4 py-3">
                                {entregable.estado_actividad_plazo && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(entregable.estado_actividad_plazo).bg} ${getEstadoColor(entregable.estado_actividad_plazo).text}`}>
                                    {entregable.estado_actividad_plazo}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {entregable.estado_actividad_ejecucion && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(entregable.estado_actividad_ejecucion).bg} ${getEstadoColor(entregable.estado_actividad_ejecucion).text}`}>
                                    {entregable.estado_actividad_ejecucion}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                              No hay entregables para mostrar
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Mostrando {entregablesFiltrados.length} de {entregables.length} entregables
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
