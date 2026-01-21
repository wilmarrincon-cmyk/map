'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchPersonalResumen, PersonalResumen } from '@/services/api';
import { fetchPersonalCitrepResumen } from '@/services/api';
import { PersonalCitrepResumen } from '@/types/circunscripcion';

export default function ApoyoTerritorioPage() {
  const [resumenDepto, setResumenDepto] = useState<PersonalResumen | null>(null);
  const [resumenCirc, setResumenCirc] = useState<PersonalCitrepResumen | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [deptoData, circData] = await Promise.all([
        fetchPersonalResumen(),
        fetchPersonalCitrepResumen()
      ]);
      setResumenDepto(deptoData);
      setResumenCirc(circData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Constantes
  const TOTAL_DEPARTAMENTOS = 33;

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
            <li className="text-gray-600 font-medium">Apoyo Territorio</li>
          </ol>
        </nav>

        {/* Contenedor principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px]">
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Panel Departamentos - 50% */}
            <Link
              href="/apoyo-territorio/departamentos"
              className="group w-full lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-blue-50/50 transition-all duration-300 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Departamentos
                  </h2>
                  <p className="text-sm text-gray-500">Gestión de agentes por departamento</p>
                </div>
              </div>

              {/* KPIs */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {isLoading ? (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4 animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Total Agentes */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-blue-700">{resumenDepto?.total_agentes || 0}</span>
                      </div>
                      <p className="text-sm text-blue-600 font-medium">Total Agentes</p>
                    </div>

                    {/* Departamentos con Agentes */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-indigo-700">
                          {resumenDepto?.total_departamentos || 0}/{TOTAL_DEPARTAMENTOS}
                        </span>
                      </div>
                      <p className="text-sm text-indigo-600 font-medium">Dptos. con Agentes</p>
                    </div>

                    {/* Cobertura */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-emerald-700">
                          {resumenDepto ? Math.round((resumenDepto.total_departamentos / TOTAL_DEPARTAMENTOS) * 100) : 0}%
                        </span>
                      </div>
                      <p className="text-sm text-emerald-600 font-medium">Cobertura Nacional</p>
                    </div>

                    {/* Promedio por Depto */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-amber-700">
                          {resumenDepto && resumenDepto.total_departamentos > 0 
                            ? (resumenDepto.total_agentes / resumenDepto.total_departamentos).toFixed(1) 
                            : 0}
                        </span>
                      </div>
                      <p className="text-sm text-amber-600 font-medium">Promedio/Depto</p>
                    </div>
                  </>
                )}
              </div>

              {/* Footer - Acceder */}
              <div className="mt-6 flex items-center justify-end text-blue-600 font-medium group-hover:text-blue-700">
                <span>Acceder al módulo</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            {/* Panel Circunscripción - 50% */}
            <Link
              href="/apoyo-territorio/circunscripcion"
              className="group w-full lg:w-1/2 p-8 hover:bg-amber-50/50 transition-all duration-300 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                    Circunscripción
                  </h2>
                  <p className="text-sm text-gray-500">Gestión de agentes CITREP</p>
                </div>
              </div>

              {/* KPIs */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {isLoading ? (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4 animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Total Agentes CITREP */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-amber-700">{resumenCirc?.total_agentes || 0}</span>
                      </div>
                      <p className="text-sm text-amber-600 font-medium">Total Agentes</p>
                    </div>

                    {/* Total Circunscripciones */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-orange-700">{resumenCirc?.total_circunscripciones_dim || 0}</span>
                      </div>
                      <p className="text-sm text-orange-600 font-medium">Total Circs.</p>
                    </div>

                    {/* Circunscripciones con Agentes */}
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-teal-700">
                          {resumenCirc?.total_circunscripciones_con_agentes || 0}/{resumenCirc?.total_circunscripciones_dim || 0}
                        </span>
                      </div>
                      <p className="text-sm text-teal-600 font-medium">Con Agentes</p>
                    </div>

                    {/* Cobertura */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-rose-200 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className="text-3xl font-bold text-rose-700">
                          {resumenCirc && resumenCirc.total_circunscripciones_dim > 0 
                            ? Math.round((resumenCirc.total_circunscripciones_con_agentes / resumenCirc.total_circunscripciones_dim) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <p className="text-sm text-rose-600 font-medium">Cobertura</p>
                    </div>
                  </>
                )}
              </div>

              {/* Footer - Acceder */}
              <div className="mt-6 flex items-center justify-end text-amber-600 font-medium group-hover:text-amber-700">
                <span>Acceder al módulo</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}
