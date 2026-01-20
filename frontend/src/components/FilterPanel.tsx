'use client';

import { Departamento } from '@/types/departamento';

interface FilterPanelProps {
  departamentos: Departamento[];
  selectedDepartamento: Departamento | null;
  onSelectDepartamento: (departamento: Departamento | null) => void;
}

export default function FilterPanel({
  departamentos,
  selectedDepartamento,
  onSelectDepartamento,
}: FilterPanelProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codigo = e.target.value;
    
    if (!codigo) {
      onSelectDepartamento(null);
      return;
    }
    
    const departamento = departamentos.find((d) => d.codigo === codigo);
    if (departamento) {
      onSelectDepartamento(departamento);
    }
  };

  const sortedDepartamentos = [...departamentos].sort((a, b) =>
    a.departamento.localeCompare(b.departamento, 'es')
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 min-w-[180px]">
      <div className="space-y-2">
        <select
          id="departamento-select"
          value={selectedDepartamento?.codigo || ''}
          onChange={handleChange}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Seleccionar depto...</option>
          {sortedDepartamentos.map((dept) => (
            <option key={dept.codigo} value={dept.codigo}>
              {dept.departamento}
            </option>
          ))}
        </select>

        {selectedDepartamento && (
          <button
            onClick={() => onSelectDepartamento(null)}
            className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs font-medium"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
