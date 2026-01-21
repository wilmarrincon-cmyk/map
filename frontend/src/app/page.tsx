'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto p-4">
        {/* Contenedor principal con el mismo estilo del mapa */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 lg:p-12 h-[600px]">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 h-full">
            
            {/* Lado Izquierdo - Botones de navegación (50% del ancho) */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                  Sistema de Gestión
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Seleccione el módulo al que desea acceder
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                {/* Botón Apoyo Territorio */}
                <Link
                  href="/apoyo-territorio"
                  className="group flex-1 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Apoyo Territorio</h2>
                      <p className="text-sm text-white/80">Gestión de departamentos y circunscripciones</p>
                    </div>
                  </div>
                </Link>

                {/* Botón Seguimiento PMO */}
                <Link
                  href="/seguimiento-pmo"
                  className="group flex-1 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Seguimiento PMO</h2>
                      <p className="text-sm text-white/80">Monitoreo y control de proyectos</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Lado Derecho - Imagen Tecnológica (50% del ancho) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="w-3/4">
                {/* Diseño Tecnológico Moderno */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200 shadow-lg">
                  <svg 
                    viewBox="0 0 400 400" 
                    className="w-full h-auto"
                    fill="none"
                  >
                    <defs>
                      <linearGradient id="techGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="techGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Chip/Circuito Central */}
                    <rect x="150" y="150" width="100" height="100" rx="8" fill="url(#techGradient1)" opacity="0.9" filter="url(#glow)"/>
                    <rect x="160" y="160" width="80" height="80" rx="4" fill="none" stroke="#ffffff" strokeWidth="2"/>
                    
                    {/* Líneas de conexión */}
                    <line x1="100" y1="200" x2="150" y2="200" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="250" y1="200" x2="300" y2="200" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="200" y1="100" x2="200" y2="150" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="200" y1="250" x2="200" y2="300" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
                    
                    {/* Nodos de conexión */}
                    <circle cx="100" cy="200" r="8" fill="url(#techGradient2)" filter="url(#glow)"/>
                    <circle cx="300" cy="200" r="8" fill="url(#techGradient2)" filter="url(#glow)"/>
                    <circle cx="200" cy="100" r="8" fill="url(#techGradient2)" filter="url(#glow)"/>
                    <circle cx="200" cy="300" r="8" fill="url(#techGradient2)" filter="url(#glow)"/>
                    
                    {/* Iconos de tecnología */}
                    {/* Base de datos */}
                    <g transform="translate(80, 80)">
                      <rect x="0" y="0" width="40" height="30" rx="4" fill="url(#techGradient1)" opacity="0.7"/>
                      <line x1="10" y1="10" x2="30" y2="10" stroke="#ffffff" strokeWidth="2"/>
                      <line x1="10" y1="15" x2="30" y2="15" stroke="#ffffff" strokeWidth="2"/>
                      <line x1="10" y1="20" x2="30" y2="20" stroke="#ffffff" strokeWidth="2"/>
                    </g>
                    
                    {/* Servidor/Cloud */}
                    <g transform="translate(280, 80)">
                      <ellipse cx="20" cy="15" rx="20" ry="12" fill="url(#techGradient2)" opacity="0.7"/>
                      <ellipse cx="20" cy="25" rx="25" ry="15" fill="url(#techGradient2)" opacity="0.7"/>
                    </g>
                    
                    {/* Red/Network */}
                    <g transform="translate(80, 280)">
                      <circle cx="20" cy="20" r="15" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.7"/>
                      <circle cx="20" cy="20" r="8" fill="url(#techGradient1)" opacity="0.7"/>
                      <line x1="35" y1="20" x2="50" y2="20" stroke="#8b5cf6" strokeWidth="2" opacity="0.7"/>
                      <circle cx="50" cy="20" r="5" fill="#8b5cf6" opacity="0.7"/>
                    </g>
                    
                    {/* Código/Code */}
                    <g transform="translate(280, 280)">
                      <rect x="0" y="0" width="40" height="40" rx="4" fill="url(#techGradient1)" opacity="0.6"/>
                      <line x1="8" y1="12" x2="32" y2="12" stroke="#ffffff" strokeWidth="2"/>
                      <line x1="8" y1="20" x2="24" y2="20" stroke="#ffffff" strokeWidth="2"/>
                      <line x1="8" y1="28" x2="28" y2="28" stroke="#ffffff" strokeWidth="2"/>
                    </g>
                    
                    {/* Partículas flotantes */}
                    <circle cx="120" cy="120" r="3" fill="#3b82f6" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="280" cy="120" r="3" fill="#8b5cf6" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="120" cy="280" r="3" fill="#06b6d4" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="280" cy="280" r="3" fill="#3b82f6" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  <p className="text-center text-indigo-800 font-semibold mt-4 text-lg">
                    Tecnología e Innovación
                  </p>
                  <p className="text-center text-indigo-600 text-sm mt-2">
                    Soluciones Digitales Avanzadas
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
