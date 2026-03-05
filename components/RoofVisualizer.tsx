
import React from 'react';

interface RoofVisualizerProps {
  ancho: number;
  longitudVertiente: number;
  traslapos: number;
}

const RoofVisualizer: React.FC<RoofVisualizerProps> = ({ ancho, longitudVertiente, traslapos }) => {
  // We want to maintain aspect ratio but fit within a container
  const maxWidth = 600;
  const maxHeight = 400;
  
  // Calculate scale to fit
  const scale = Math.min(maxWidth / longitudVertiente, maxHeight / ancho) * 0.8;
  
  const drawWidth = longitudVertiente * scale;
  const drawHeight = ancho * scale;
  
  // Center the rectangle in the SVG
  const x = (maxWidth - drawWidth) / 2;
  const y = (maxHeight - drawHeight) / 2;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mt-6 print:border-none print:shadow-none print:p-0 print:mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Vista en Planta (Esquema)</h2>
        <div className="flex gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span>Área de Cubierta</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-r-2 border-red-500 border-dashed"></div>
            <span>Traslapos</span>
          </div>
        </div>
      </div>
      
      <div className="relative bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center min-h-[300px] p-4 print:bg-white print:border-none">
        <svg 
          viewBox={`0 0 ${maxWidth} ${maxHeight}`} 
          className="w-full h-auto max-w-2xl drop-shadow-md"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main Rectangle */}
          <rect
            x={x}
            y={y}
            width={drawWidth}
            height={drawHeight}
            fill="#3b82f6"
            fillOpacity="0.1"
            stroke="#2563eb"
            strokeWidth="2"
            rx="4"
          />
          
          {/* Grid lines to simulate panels */}
          {Array.from({ length: Math.min(Math.ceil(ancho), Math.ceil(ancho)) }).map((_, i) => (
             <line 
                key={i}
                x1={x}
                y1={y + (i * (drawHeight / Math.ceil(ancho)))}
                x2={x + drawWidth}
                y2={y + (i * (drawHeight / Math.ceil(ancho)))}
                stroke="#2563eb"
                strokeWidth="0.5"
                strokeOpacity="0.3"
             />
          ))}

          {/* Overlap divisions (Traslapos) */}
          {traslapos > 0 && Array.from({ length: traslapos }).map((_, i) => {
            const sectionWidth = drawWidth / (traslapos + 1);
            const lineX = x + (i + 1) * sectionWidth;
            return (
              <line
                key={`traslapo-${i}`}
                x1={lineX}
                y1={y}
                x2={lineX}
                y2={y + drawHeight}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4 2"
                strokeOpacity="0.8"
              />
            );
          })}

          {/* Dimension Labels - Base (Longitud Vertiente) */}
          <g>
            <line 
              x1={x} 
              y1={y + drawHeight + 20} 
              x2={x + drawWidth} 
              y2={y + drawHeight + 20} 
              stroke="#64748b" 
              strokeWidth="1" 
              markerStart="url(#arrowhead-start)"
              markerEnd="url(#arrowhead-end)"
            />
            <text 
              x={x + drawWidth / 2} 
              y={y + drawHeight + 40} 
              textAnchor="middle" 
              className="text-[14px] font-bold fill-slate-600"
            >
              Longitud de Vertiente: {longitudVertiente.toFixed(2)}m
            </text>
          </g>

          {/* Dimension Labels - Height (Ancho) */}
          <g transform={`rotate(-90, ${x - 20}, ${y + drawHeight / 2})`}>
            <line 
              x1={x - 20 - drawHeight / 2} 
              y1={y + drawHeight / 2} 
              x2={x - 20 + drawHeight / 2} 
              y2={y + drawHeight / 2} 
              stroke="#64748b" 
              strokeWidth="1"
              markerStart="url(#arrowhead-start)"
              markerEnd="url(#arrowhead-end)"
            />
            <text 
              x={x - 20} 
              y={y + drawHeight / 2 - 10} 
              textAnchor="middle" 
              className="text-[14px] font-bold fill-slate-600"
            >
              Ancho: {ancho.toFixed(2)}m
            </text>
          </g>

          {/* Arrow markers */}
          <defs>
            <marker id="arrowhead-start" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="10 0, 10 7, 0 3.5" fill="#64748b" />
            </marker>
            <marker id="arrowhead-end" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 0 7, 10 3.5" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </div>
      <p className="mt-4 text-xs text-slate-400 text-center italic">
        * Representación esquemática no a escala real para fines ilustrativos.
      </p>
    </div>
  );
};

export default RoofVisualizer;
