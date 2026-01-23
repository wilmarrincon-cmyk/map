'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Determinar si estamos en la página de inicio
  const isHome = pathname === '/';
  
  // Determinar el módulo activo
  const isApoyoTerritorio = pathname.startsWith('/apoyo-territorio');
  const isSeguimientoPMO = pathname.startsWith('/seguimiento-pmo');
  const isKpisComponentes = pathname.startsWith('/kpis-componentes');
  const isKpisCargos = pathname.startsWith('/kpis-cargos');
  const isKpisGerencia = pathname.startsWith('/kpis-gerencia');

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo / Título */}
          <Link 
            href="/" 
            className="text-xl font-bold hover:text-white/90 transition-colors duration-200"
          >
            Sistema de Gestión
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-1">
            {/* Inicio */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isHome
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Inicio
            </Link>

            {/* Apoyo Territorio */}
            <Link
              href="/apoyo-territorio"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isApoyoTerritorio
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Apoyo Territorio
            </Link>

            {/* Seguimiento PMO */}
            <Link
              href="/seguimiento-pmo"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isSeguimientoPMO
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Seguimiento PMO
            </Link>

            {/* KPIs de Componentes */}
            <Link
              href="/kpis-componentes"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isKpisComponentes
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              KPIs Componentes
            </Link>

            {/* KPIs de Cargos */}
            <Link
              href="/kpis-cargos"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isKpisCargos
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              KPIs Cargos
            </Link>

            {/* KPIs de Control Gerencia */}
            <Link
              href="/kpis-gerencia"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isKpisGerencia
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              KPIs Gerencia
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
