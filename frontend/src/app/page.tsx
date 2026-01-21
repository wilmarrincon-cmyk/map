'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto p-4">
        {/* Contenedor principal con el mismo estilo del mapa */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 lg:p-12 h-[600px]">
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
                  className="group flex-1 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
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
                  className="group flex-1 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
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

            {/* Lado Derecho - Imagen (50% del ancho) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="w-3/4">
                {/* Imagen placeholder - Colombia */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
                  <svg 
                    viewBox="0 0 400 500" 
                    className="w-full h-auto"
                    fill="none"
                  >
                    {/* Silueta simplificada de Colombia */}
                    <path
                      d="M200 50 L280 80 L320 150 L350 200 L340 280 L300 350 L250 400 L200 450 L150 420 L100 380 L80 300 L60 220 L80 150 L120 100 L160 60 Z"
                      fill="url(#colombiaGradient)"
                      stroke="#1e40af"
                      strokeWidth="3"
                    />
                    <defs>
                      <linearGradient id="colombiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    {/* Puntos representando ciudades */}
                    <circle cx="200" cy="180" r="8" fill="#1e40af" />
                    <circle cx="150" cy="250" r="6" fill="#1e40af" />
                    <circle cx="250" cy="220" r="6" fill="#1e40af" />
                    <circle cx="180" cy="320" r="6" fill="#1e40af" />
                    <circle cx="220" cy="280" r="6" fill="#1e40af" />
                  </svg>
                  <p className="text-center text-blue-800 font-semibold mt-4">
                    República de Colombia
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
