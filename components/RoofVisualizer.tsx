
import React from 'react';

interface RoofVisualizerProps {
  ancho: number;
  roofType: 'single' | 'double';
  longitudVertiente: number;
  longitudVertiente2?: number;
}

const RoofVisualizer: React.FC<RoofVisualizerProps> = ({ 
  ancho, 
  roofType, 
  longitudVertiente, 
  longitudVertiente2 = 0
}) => {
  // We want to maintain aspect ratio but fit within a container
  const maxWidth = 600;
  const maxHeight = 400;
  
  const totalLongitud = roofType === 'single' ? longitudVertiente : longitudVertiente + longitudVertiente2;
  
  // Calculate scale to fit
  const scale = Math.min(maxWidth / totalLongitud, maxHeight / ancho) * 0.8;
  
  const drawWidth1 = longitudVertiente * scale;
  const drawWidth2 = longitudVertiente2 * scale;
  const drawHeight = ancho * scale;
  
  // Center the rectangle in the SVG
  const x = (maxWidth - (drawWidth1 + drawWidth2)) / 2;
  const y = (maxHeight - drawHeight) / 2;

  // Calculate traslapos internally for consistency
  const t1 = longitudVertiente <= 12 ? 0 : Math.floor(longitudVertiente / 11.8);
  const t2 = longitudVertiente2 <= 12 ? 0 : Math.floor(longitudVertiente2 / 11.8);

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
          {roofType === 'double' && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-slate-800"></div>
              <span>Caballete</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center min-h-[300px] p-4 print:bg-white print:border-none">
        <svg 
          viewBox={`0 0 ${maxWidth} ${maxHeight}`} 
          className="w-full h-auto max-w-2xl drop-shadow-md"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main Rectangle 1 */}
          <rect
            x={x}
            y={y}
            width={drawWidth1}
            height={drawHeight}
            fill="#3b82f6"
            fillOpacity="0.1"
            stroke="#2563eb"
            strokeWidth="2"
            rx="2"
          />

          {/* Main Rectangle 2 (if double) */}
          {roofType === 'double' && (
            <rect
              x={x + drawWidth1}
              y={y}
              width={drawWidth2}
              height={drawHeight}
              fill="#3b82f6"
              fillOpacity="0.1"
              stroke="#2563eb"
              strokeWidth="2"
              rx="2"
            />
          )}

          {/* Ridge Line (Caballete) */}
          {roofType === 'double' && (
            <line 
              x1={x + drawWidth1}
              y1={y}
              x2={x + drawWidth1}
              y2={y + drawHeight}
              stroke="#1e293b"
              strokeWidth="3"
            />
          )}
          
          {/* Grid lines to simulate panels */}
          {Array.from({ length: Math.ceil(ancho) + 1 }).map((_, i) => (
             <line 
                key={i}
                x1={x}
                y1={y + (i * (drawHeight / Math.ceil(ancho)))}
                x2={x + drawWidth1 + drawWidth2}
                y2={y + (i * (drawHeight / Math.ceil(ancho)))}
                stroke="#2563eb"
                strokeWidth="0.5"
                strokeOpacity="0.3"
             />
          ))}

          {/* Overlap divisions Slope 1 */}
          {t1 > 0 && Array.from({ length: t1 }).map((_, i) => {
            const sectionWidth = drawWidth1 / (t1 + 1);
            const lineX = x + (i + 1) * sectionWidth;
            return (
              <line
                key={`traslapo1-${i}`}
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

          {/* Overlap divisions Slope 2 */}
          {roofType === 'double' && t2 > 0 && Array.from({ length: t2 }).map((_, i) => {
            const sectionWidth = drawWidth2 / (t2 + 1);
            const lineX = x + drawWidth1 + (i + 1) * sectionWidth;
            return (
              <line
                key={`traslapo2-${i}`}
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

          {/* Dimension Labels - Base */}
          <g>
            <line x1={x} y1={y + drawHeight + 20} x2={x + drawWidth1 + drawWidth2} y2={y + drawHeight + 20} stroke="#64748b" strokeWidth="1" />
            <text x={x + (drawWidth1 + drawWidth2) / 2} y={y + drawHeight + 35} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="bold">
              Largo Total: {(longitudVertiente + longitudVertiente2).toFixed(2)}m
            </text>
          </g>

          {/* Dimension Labels - Height */}
          <g>
            <line x1={x - 20} y1={y} x2={x - 20} y2={y + drawHeight} stroke="#64748b" strokeWidth="1" />
            <text 
              x={x - 35} 
              y={y + drawHeight / 2} 
              textAnchor="middle" 
              fontSize="12" 
              fill="#64748b" 
              fontWeight="bold"
              transform={`rotate(-90, ${x - 35}, ${y + drawHeight / 2})`}
            >
              Ancho: {ancho.toFixed(2)}m
            </text>
          </g>
        </svg>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Resumen de Vertiente 1</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Longitud:</span>
            <span className="text-sm font-bold text-slate-800">{longitudVertiente.toFixed(2)}m</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-slate-600">Traslapos:</span>
            <span className="text-sm font-bold text-red-600">{t1}</span>
          </div>
        </div>
        
        {roofType === 'double' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Resumen de Vertiente 2</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Longitud:</span>
              <span className="text-sm font-bold text-slate-800">{longitudVertiente2.toFixed(2)}m</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-slate-600">Traslapos:</span>
              <span className="text-sm font-bold text-red-600">{t2}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoofVisualizer;
