'use client';

// Colores del semáforo (opaco para normal, intenso para selección)
const SEMAFORO_COLORS = {
  azul: { normal: '#90CAF9', intenso: '#2196F3', border: '#1565C0' },      // > 2 agentes
  verde: { normal: '#A5D6A7', intenso: '#4CAF50', border: '#388E3C' },     // = 2 agentes
  rojo: { normal: '#EF9A9A', intenso: '#F44336', border: '#D32F2F' },      // < 2 agentes (1)
  gris: { normal: '#E0E0E0', intenso: '#9E9E9E', border: '#757575' },     // 0 agentes
};

// Obtener colores según cantidad de agentes
// Criterios: > 2 = Azul, = 2 = Verde, < 2 (1) = Rojo, 0 = Gris
const getColorsByAgentes = (cantidad: number) => {
  if (cantidad > 2) return SEMAFORO_COLORS.azul;
  if (cantidad === 2) return SEMAFORO_COLORS.verde;
  if (cantidad === 1) return SEMAFORO_COLORS.rojo;
  return SEMAFORO_COLORS.gris; // 0 agentes
};

interface SanAndresInsetCircProps {
  isSelected: boolean;
  onSelect: () => void;
  agentesCount?: number;
}

export default function SanAndresInsetCirc({ isSelected, onSelect, agentesCount = 0 }: SanAndresInsetCircProps) {
  const colors = getColorsByAgentes(agentesCount);
  const fillColor = isSelected ? colors.intenso : colors.normal;
  const strokeColor = isSelected ? colors.border : '#666666';
  const strokeWidth = isSelected ? 2 : 1;

  return (
    <div className="san-andres-inset" onClick={onSelect}>
      <div className="inset-title">
        San Andrés y<br />Providencia
      </div>
      <svg viewBox="0 0 70 115">
        {/* Isla San Andrés (la más grande, al sur) */}
        <path
          id="isla-san-andres"
          style={{ fill: fillColor, stroke: strokeColor, strokeWidth, cursor: 'pointer', transition: 'all 0.2s' }}
          d="M32,108 
             C28,108 25,105 24,100 
             C23,95 24,88 26,82 
             C28,76 30,72 32,68 
             C34,64 36,62 38,62 
             C40,62 42,64 43,68 
             C44,72 44,78 43,85 
             C42,92 40,98 38,103 
             C36,108 34,108 32,108 Z"
        />

        {/* Isla Providencia (mediana, al norte) */}
        <path
          id="isla-providencia"
          style={{ fill: fillColor, stroke: strokeColor, strokeWidth, cursor: 'pointer', transition: 'all 0.2s' }}
          d="M28,38 
             C24,40 22,44 22,48 
             C22,52 24,55 28,56 
             C32,57 38,56 42,54 
             C46,52 48,48 48,44 
             C48,40 46,37 42,36 
             C38,35 32,36 28,38 Z"
        />

        {/* Isla Santa Catalina (pequeña, al noroeste de Providencia) */}
        <path
          id="isla-santa-catalina"
          style={{ fill: fillColor, stroke: strokeColor, strokeWidth, cursor: 'pointer', transition: 'all 0.2s' }}
          d="M14,20 
             C12,22 12,26 14,28 
             C16,30 20,30 22,28 
             C24,26 24,22 22,20 
             C20,18 16,18 14,20 Z"
        />

        {/* Cayos pequeños */}
        <ellipse style={{ fill: fillColor, stroke: strokeColor, strokeWidth: 0.5, cursor: 'pointer' }} cx="54" cy="25" rx="3" ry="2" />
        <ellipse style={{ fill: fillColor, stroke: strokeColor, strokeWidth: 0.5, cursor: 'pointer' }} cx="16" cy="28" rx="2" ry="1.5" />
      </svg>
    </div>
  );
}
