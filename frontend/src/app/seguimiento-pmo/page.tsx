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

// Componente de gráfica de líneas para actividades por fecha de vencimiento
function ActividadesPorVencerChart({ entregables }: { entregables: Entregable[] }) {
  // Agrupar actividades por fecha_final
  const datosPorFecha = useMemo(() => {
    const conteoPorFecha: { [key: string]: number } = {};
    
    entregables.forEach(e => {
      if (!e.fecha_final) return;
      
      const fecha = new Date(e.fecha_final);
      
      // Validar que la fecha sea válida
      if (isNaN(fecha.getTime())) return;
      
      fecha.setHours(0, 0, 0, 0);
      const fechaStr = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
      
      conteoPorFecha[fechaStr] = (conteoPorFecha[fechaStr] || 0) + 1;
    });

    // Convertir a array y ordenar por fecha
    const datos = Object.entries(conteoPorFecha)
      .map(([fecha, cantidad]) => ({
        fecha: new Date(fecha),
        cantidad,
        fechaStr: fecha
      }))
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    return datos;
  }, [entregables]);

  // Calcular rango de fechas para el gráfico
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const minFecha = datosPorFecha.length > 0 
    ? new Date(Math.min(...datosPorFecha.map(d => d.fecha.getTime())))
    : new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 días atrás por defecto
  
  const maxFecha = datosPorFecha.length > 0
    ? new Date(Math.max(...datosPorFecha.map(d => d.fecha.getTime())))
    : new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días adelante por defecto

  // Ajustar rango para mostrar contexto
  const rangoDias = Math.max(
    Math.ceil((maxFecha.getTime() - minFecha.getTime()) / (1000 * 60 * 60 * 24)),
    60 // Mínimo 60 días
  );
  
  const fechaInicio = new Date(minFecha);
  fechaInicio.setDate(fechaInicio.getDate() - 7); // 7 días antes
  
  const fechaFin = new Date(maxFecha);
  fechaFin.setDate(fechaFin.getDate() + 7); // 7 días después

  const anchoGrafico = 300;
  const altoGrafico = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const anchoUtil = anchoGrafico - padding.left - padding.right;
  const altoUtil = altoGrafico - padding.top - padding.bottom;

  const maxCantidad = Math.max(...datosPorFecha.map(d => d.cantidad), 1);
  const rangoFechas = fechaFin.getTime() - fechaInicio.getTime();

  // Función para convertir fecha a coordenada X
  const fechaAX = (fecha: Date) => {
    const porcentaje = (fecha.getTime() - fechaInicio.getTime()) / rangoFechas;
    return padding.left + porcentaje * anchoUtil;
  };

  // Función para convertir cantidad a coordenada Y
  const cantidadAY = (cantidad: number) => {
    const porcentaje = cantidad / maxCantidad;
    return padding.top + altoUtil - (porcentaje * altoUtil);
  };

  // Generar puntos para la línea
  const puntos = datosPorFecha.map(d => ({
    x: fechaAX(d.fecha),
    y: cantidadAY(d.cantidad),
    fecha: d.fecha,
    cantidad: d.cantidad,
    fechaStr: d.fechaStr
  }));

  // Generar path para la línea
  const pathLinea = puntos.length > 0
    ? puntos.reduce((path, punto, index) => {
        const comando = index === 0 ? 'M' : 'L';
        return `${path} ${comando} ${punto.x} ${punto.y}`;
      }, '')
    : '';

  // Formatear fecha para mostrar
  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividades por Fecha de Vencimiento</h3>
      
      {datosPorFecha.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-gray-400 text-sm">Sin datos de fechas</p>
        </div>
      ) : (
        <div className="relative">
          <svg width={anchoGrafico} height={altoGrafico} viewBox={`0 0 ${anchoGrafico} ${altoGrafico}`} className="w-full max-w-full">
            {/* Gradiente para el área - debe estar antes de usarse */}
            <defs>
              <linearGradient id="gradientArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Ejes */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + altoUtil}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <line
              x1={padding.left}
              y1={padding.top + altoUtil}
              x2={padding.left + anchoUtil}
              y2={padding.top + altoUtil}
              stroke="#e5e7eb"
              strokeWidth="1"
            />

            {/* Grid horizontal */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + altoUtil - (ratio * altoUtil);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + anchoUtil}
                    y2={y}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padding.left - 5}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-gray-500"
                  >
                    {Math.round(maxCantidad * ratio)}
                  </text>
                </g>
              );
            })}

            {/* Área bajo la línea - debe estar antes de la línea para que la línea quede encima */}
            {pathLinea && puntos.length > 0 && (
              <path
                d={`${pathLinea} L ${puntos[puntos.length - 1].x} ${padding.top + altoUtil} L ${padding.left} ${padding.top + altoUtil} Z`}
                fill="url(#gradientArea)"
                opacity="0.2"
              />
            )}

            {/* Línea del gráfico */}
            {pathLinea && (
              <path
                d={pathLinea}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            )}

            {/* Puntos de datos */}
            {puntos.map((punto, index) => (
              <g key={index}>
                <circle
                  cx={punto.x}
                  cy={punto.y}
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>{`${formatearFecha(punto.fecha)}: ${punto.cantidad} actividades`}</title>
                </circle>
              </g>
            ))}

            {/* Etiquetas del eje X (fechas) */}
            {puntos.length > 0 && (
              <>
                {/* Primera fecha */}
                <text
                  x={puntos[0].x}
                  y={altoGrafico - 5}
                  textAnchor="middle"
                  className="text-[9px] fill-gray-500"
                >
                  {formatearFecha(puntos[0].fecha)}
                </text>
                {/* Última fecha */}
                {puntos.length > 1 && (
                  <text
                    x={puntos[puntos.length - 1].x}
                    y={altoGrafico - 5}
                    textAnchor="middle"
                    className="text-[9px] fill-gray-500"
                  >
                    {formatearFecha(puntos[puntos.length - 1].fecha)}
                  </text>
                )}
                {/* Fecha del medio si hay suficientes puntos */}
                {puntos.length > 2 && (
                  <text
                    x={puntos[Math.floor(puntos.length / 2)].x}
                    y={altoGrafico - 5}
                    textAnchor="middle"
                    className="text-[9px] fill-gray-500"
                  >
                    {formatearFecha(puntos[Math.floor(puntos.length / 2)].fecha)}
                  </text>
                )}
              </>
            )}
          </svg>

          {/* Información adicional */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Total: {datosPorFecha.reduce((sum, d) => sum + d.cantidad, 0)} actividades</span>
              <span>{datosPorFecha.length} fechas distintas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de gráfica de barras para estado de ejecución
function EstadoEjecucionChart({ resumen }: { resumen: ResumenPMO | null }) {
  if (!resumen) return null;

  const datos = resumen.por_estado_ejecucion.map(e => ({
    label: e.estado,
    value: e.cantidad,
    color: getEstadoColor(e.estado).bar
  })).sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...datos.map(d => d.value), 1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividades por Estado de Ejecución</h3>
      <div className="space-y-3">
        {datos.map((item, index) => (
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
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        ))}
        {datos.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">Sin datos</p>
        )}
      </div>
    </div>
  );
}

// Componente de gráfica de barras para responsables
function ResponsablesChart({ resumen }: { resumen: ResumenPMO | null }) {
  if (!resumen) return null;

  const datos = resumen.por_responsable
    .map(r => ({ label: r.responsable || 'Sin responsable', value: r.cantidad }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 responsables

  const maxValue = Math.max(...datos.map(d => d.value), 1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividades por Responsable</h3>
      <div className="space-y-3">
        {datos.map((item, index) => (
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
        {datos.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">Sin datos</p>
        )}
      </div>
    </div>
  );
}

// Componente de gráfica de donut para cortes contractuales
function CortesContractualesChart({ entregables }: { entregables: Entregable[] }) {
  const porCorte = useMemo(() => {
    const conteo: { [key: string]: number } = {};
    entregables.forEach(e => {
      const corte = e.cortes_contractuales;
      // Filtrar los que no tienen corte o tienen "Sin corte"
      if (!corte || corte.trim() === '' || corte.toLowerCase() === 'sin corte') {
        return; // Omitir este registro
      }
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
      
      {total === 0 ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-gray-400 text-sm">Sin datos de cortes contractuales</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default function SeguimientoPMOPage() {
  const [resumen, setResumen] = useState<ResumenPMO | null>(null);
  const [entregables, setEntregables] = useState<Entregable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [entregableSeleccionado, setEntregableSeleccionado] = useState<Entregable | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

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

  // Calcular resumen filtrado para las gráficas
  const resumenFiltrado = useMemo(() => {
    if (!resumen || !filtroEstado) return resumen;

    // Filtrar entregables por estado
    const entregablesFiltrados = entregables.filter(
      e => e.estado_actividad_plazo === filtroEstado || e.estado_actividad_ejecucion === filtroEstado
    );

    // Recalcular estadísticas con datos filtrados
    const porComponente: { [key: string]: number } = {};
    const porEstadoEjecucion: { [key: string]: number } = {};
    const porEstadoPlazo: { [key: string]: number } = {};
    const porResponsable: { [key: string]: number } = {};
    const porTipo: { [key: string]: number } = {};

    entregablesFiltrados.forEach(e => {
      if (e.componente) {
        porComponente[e.componente] = (porComponente[e.componente] || 0) + 1;
      }
      if (e.estado_actividad_ejecucion) {
        porEstadoEjecucion[e.estado_actividad_ejecucion] = (porEstadoEjecucion[e.estado_actividad_ejecucion] || 0) + 1;
      }
      if (e.estado_actividad_plazo) {
        porEstadoPlazo[e.estado_actividad_plazo] = (porEstadoPlazo[e.estado_actividad_plazo] || 0) + 1;
      }
      if (e.responsable_principal) {
        porResponsable[e.responsable_principal] = (porResponsable[e.responsable_principal] || 0) + 1;
      }
      if (e.tipo) {
        porTipo[e.tipo] = (porTipo[e.tipo] || 0) + 1;
      }
    });

    // Contar componentes únicos
    const componentesUnicos = new Set(entregablesFiltrados.map(e => e.componente).filter(Boolean));

    return {
      ...resumen,
      total_entregables: entregablesFiltrados.length,
      total_componentes: componentesUnicos.size,
      por_estado_plazo: Object.entries(porEstadoPlazo).map(([estado, cantidad]) => ({ estado, cantidad })),
      por_componente: Object.entries(porComponente).map(([componente, cantidad]) => ({ componente, cantidad })),
      por_estado_ejecucion: Object.entries(porEstadoEjecucion).map(([estado, cantidad]) => ({ estado, cantidad })),
      por_responsable: Object.entries(porResponsable).map(([responsable, cantidad]) => ({ responsable, cantidad })),
      por_tipo: Object.entries(porTipo).map(([tipo, cantidad]) => ({ tipo, cantidad })),
    };
  }, [resumen, entregables, filtroEstado]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <ol className="breadcrumb">
            <li>
              <Link href="/" className="breadcrumb-link">
                Inicio
              </Link>
            </li>
            <li className="breadcrumb-separator">/</li>
            <li className="breadcrumb-current">Seguimiento PMO</li>
          </ol>
        </nav>

        {/* Contenedor principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Seguimiento PMO</h1>
                  <p className="text-gray-500 text-sm">Monitoreo y control de entregables</p>
                </div>
              </div>
              {/* Estados de Actividades - Movido al header */}
              {!isLoading && resumen && (
                <div className="flex flex-wrap gap-2 items-center">
                  {resumen.por_estado_plazo.map((estado) => (
                    <button
                      key={estado.estado}
                      onClick={() => setFiltroEstado(filtroEstado === estado.estado ? '' : estado.estado)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        filtroEstado === estado.estado
                          ? 'bg-emerald-600 text-white'
                          : `${getEstadoColor(estado.estado).bg} ${getEstadoColor(estado.estado).text} hover:opacity-80`
                      }`}
                    >
                      {estado.estado} ({estado.cantidad})
                    </button>
                  ))}
                </div>
              )}
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
                    <span className="text-3xl font-bold text-emerald-700">{resumenFiltrado?.total_entregables || 0}</span>
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
                    <span className="text-3xl font-bold text-blue-700">{resumenFiltrado?.por_componente.length || 0}</span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium">Componentes</p>
                </div>

                {/* Por Estado Plazo - Primer estado */}
                {resumenFiltrado?.por_estado_plazo[0] && (
                  <div className={`bg-gradient-to-br ${getEstadoColor(resumenFiltrado.por_estado_plazo[0].estado).bg} rounded-xl p-5`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 ${getEstadoColor(resumenFiltrado.por_estado_plazo[0].estado).bg} rounded-lg flex items-center justify-center border ${getEstadoColor(resumenFiltrado.por_estado_plazo[0].estado).border}`}>
                        <svg className={`w-5 h-5 ${getEstadoColor(resumenFiltrado.por_estado_plazo[0].estado).text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className={`text-3xl font-bold ${getEstadoColor(resumenFiltrado.por_estado_plazo[0].estado).text}`}>
                        {resumenFiltrado.por_estado_plazo[0].cantidad}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${getEstadoColor(resumenFiltrado.por_estado_plazo[0].estado).text}`}>
                      {resumenFiltrado.por_estado_plazo[0].estado}
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
                    <span className="text-3xl font-bold text-purple-700">{resumenFiltrado?.por_responsable.length || 0}</span>
                  </div>
                  <p className="text-sm text-purple-600 font-medium">Responsables</p>
                </div>
              </div>

              {/* Gráficas */}
              <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gráfica 1: Actividades por Componente */}
                <HorizontalBarChart 
                  data={resumenFiltrado?.por_componente.map(c => ({ label: c.componente, value: c.cantidad })) || []}
                  title="Actividades por Componente"
                  maxItems={6}
                />

                {/* Gráfica 2: Actividades por Estado de Ejecución */}
                <EstadoEjecucionChart resumen={resumenFiltrado} />

                {/* Gráfica 3: Actividades por Responsable */}
                <ResponsablesChart resumen={resumenFiltrado} />
              </div>

              {/* Gráficas adicionales - Segunda fila */}
              <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gráfica 4: Actividades por Fecha de Vencimiento (Líneas) */}
                <ActividadesPorVencerChart entregables={entregablesFiltrados} />

                {/* Gráfica 5: Actividades por Corte Contractual (Donut) */}
                <CortesContractualesChart entregables={entregablesFiltrados} />
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
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Acción</th>
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
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => {
                                    setEntregableSeleccionado(entregable);
                                    setMostrarModal(true);
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                  Ver detalle
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
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

      {/* Modal de Detalles */}
      {mostrarModal && entregableSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detalles del Entregable</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {entregableSeleccionado.id}</p>
              </div>
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setEntregableSeleccionado(null);
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
                {/* Actividad */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Actividad</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.actividad || '-'}</p>
                </div>

                {/* Tipo */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Tipo</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.tipo || '-'}</p>
                </div>

                {/* Componente */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Componente</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.componente || '-'}</p>
                </div>

                {/* Fecha Inicio */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Inicio</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {entregableSeleccionado.fecha_inicio 
                      ? new Date(entregableSeleccionado.fecha_inicio).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : '-'}
                  </p>
                </div>

                {/* Fecha Final */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Final</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {entregableSeleccionado.fecha_final 
                      ? new Date(entregableSeleccionado.fecha_final).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : '-'}
                  </p>
                </div>

                {/* Fecha Real Ejecución */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Real Ejecución</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {entregableSeleccionado.fecha_real_ejecucion 
                      ? new Date(entregableSeleccionado.fecha_real_ejecucion).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : '-'}
                  </p>
                </div>

                {/* Estado Actividad Plazo */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Estado Plazo</label>
                  <div className="mt-1">
                    {entregableSeleccionado.estado_actividad_plazo ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getEstadoColor(entregableSeleccionado.estado_actividad_plazo).bg} ${getEstadoColor(entregableSeleccionado.estado_actividad_plazo).text}`}>
                        {entregableSeleccionado.estado_actividad_plazo}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>
                </div>

                {/* Estado Actividad Ejecución */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Estado Ejecución</label>
                  <div className="mt-1">
                    {entregableSeleccionado.estado_actividad_ejecucion ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getEstadoColor(entregableSeleccionado.estado_actividad_ejecucion).bg} ${getEstadoColor(entregableSeleccionado.estado_actividad_ejecucion).text}`}>
                        {entregableSeleccionado.estado_actividad_ejecucion}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>
                </div>

                {/* Estado Actividad Plazo Seguimiento */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Estado Plazo Seguimiento</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.estado_actividad_plazo_seguimiento || '-'}</p>
                </div>

                {/* Tipo Elección */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Tipo Elección</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.tipo_eleccion || '-'}</p>
                </div>

                {/* Cortes Contractuales */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Cortes Contractuales</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.cortes_contractuales || '-'}</p>
                </div>

                {/* Responsable Principal */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Responsable Principal</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.responsable_principal || '-'}</p>
                </div>

                {/* Encargado */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Encargado</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.encargado || '-'}</p>
                </div>

                {/* Evidencia Recibida */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Evidencia Recibida</label>
                  <p className="text-sm text-gray-800 mt-1">{entregableSeleccionado.evidencia_recibida || '-'}</p>
                </div>

                {/* Notas */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Notas</label>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{entregableSeleccionado.notas || '-'}</p>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setEntregableSeleccionado(null);
                }}
                className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
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
