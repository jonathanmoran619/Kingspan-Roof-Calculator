
import { RoofInputs, CalculationResult } from '../types';

const calculateSingleSlope = (ancho: number, proyeccion: number, pendiente: number, separacion: number) => {
  const ratio = pendiente / 100;
  const longitudReal = proyeccion * Math.sqrt(1 + Math.pow(ratio, 2));

  // Si longitud real <= 12m, no hay traslapos. Si es mayor, se calcula por cada 11.8m
  const traslapos = longitudReal <= 12 ? 0 : Math.floor(longitudReal / 11.8);

  const areaFaldon = ancho * longitudReal;
  
  // Área Real Panel considerando traslapo técnico de 20cm
  const areaReal = (longitudReal + (traslapos * 0.20)) * Math.ceil(ancho);
  
  // Accesorios
  const numCorreas = Math.ceil((longitudReal + 0.6) / (separacion || 1.5));
  const remateNivel = Math.ceil((longitudReal * 2 + ancho) / 2.9) * 3;
  const remateFrontal = Math.ceil(ancho / 2.9) * 3;
  
  // Tornillería (Fórmula optimizada)
  const tornillos = (Math.ceil(ancho) * 2 + 1) * (numCorreas - traslapos) + (Math.ceil(ancho) * 4 + 1) * traslapos;

  return {
    longitudReal,
    traslapos,
    areaFaldon,
    areaReal,
    remateNivel,
    remateFrontal,
    tornillos
  };
};

export const calculateRoofData = (inputs: RoofInputs): CalculationResult[] => {
  const { ancho, proyeccion, pendiente, proyeccion2, pendiente2, separacion, roofType } = inputs;

  const slope1 = calculateSingleSlope(ancho, proyeccion, pendiente, separacion);
  
  if (roofType === 'single') {
    return [
      { 
        label: 'Longitud de Vertiente', 
        value: `${slope1.longitudReal.toFixed(2)} m`, 
        numericValue: slope1.longitudReal,
        unit: 'm',
        color: 'blue',
        description: 'Longitud real medida sobre la pendiente de la cubierta.'
      },
      { 
        label: 'Traslapos Necesarios', 
        value: `${slope1.traslapos} und`, 
        numericValue: slope1.traslapos,
        unit: 'und',
        color: 'amber',
        description: 'Cantidad de traslapos longitudinales por línea de panel.'
      },
      { 
        label: 'Área Neta Cubierta', 
        value: `${slope1.areaFaldon.toFixed(2)} m²`, 
        numericValue: slope1.areaFaldon,
        unit: 'm²',
        color: 'emerald',
        description: 'Superficie geométrica exacta de la cubierta.'
      },
      { 
        label: 'Área Real Panel (Compra)', 
        value: `${slope1.areaReal.toFixed(1)} m²`, 
        numericValue: slope1.areaReal,
        unit: 'm²',
        color: 'indigo',
        description: 'Área total de material incluyendo desperdicio técnico y traslapos.'
      },
      { 
        label: 'Remate Nivel/Muro', 
        value: `${slope1.remateNivel} m`, 
        numericValue: slope1.remateNivel,
        unit: 'm',
        color: 'slate',
        description: 'Longitud total de accesorios de remate lateral y superior.'
      },
      { 
        label: 'Remate Frontal', 
        value: `${slope1.remateFrontal} m`, 
        numericValue: slope1.remateFrontal,
        unit: 'm',
        color: 'slate',
        description: 'Accesorios necesarios para el cierre frontal de la vertiente.'
      },
      { 
        label: 'Kits de Anclaje (Tornillos)', 
        value: `${Math.round(slope1.tornillos)} und`, 
        numericValue: Math.round(slope1.tornillos),
        unit: 'und',
        color: 'red',
        description: 'Tornillería técnica recomendada para fijación a estructura.'
      }
    ];
  } else {
    const slope2 = calculateSingleSlope(ancho, proyeccion2 || 0, pendiente2 || 0, separacion);
    
    const totalAreaFaldon = slope1.areaFaldon + slope2.areaFaldon;
    const totalAreaReal = slope1.areaReal + slope2.areaReal;
    const totalTornillos = slope1.tornillos + slope2.tornillos;
    const totalRemateNivel = slope1.remateNivel + slope2.remateNivel;
    const totalRemateFrontal = slope1.remateFrontal + slope2.remateFrontal;
    const totalTraslapos = slope1.traslapos + slope2.traslapos;

    return [
      { 
        label: 'Longitud Vertiente 1', 
        value: `${slope1.longitudReal.toFixed(2)} m`, 
        numericValue: slope1.longitudReal,
        unit: 'm',
        color: 'blue',
        description: 'Longitud real de la primera vertiente.'
      },
      { 
        label: 'Longitud Vertiente 2', 
        value: `${slope2.longitudReal.toFixed(2)} m`, 
        numericValue: slope2.longitudReal,
        unit: 'm',
        color: 'blue',
        description: 'Longitud real de la segunda vertiente.'
      },
      { 
        label: 'Traslapos Totales', 
        value: `${totalTraslapos} und`, 
        numericValue: totalTraslapos,
        unit: 'und',
        color: 'amber',
        description: 'Suma de traslapos de ambas vertientes.'
      },
      { 
        label: 'Área Neta Total', 
        value: `${totalAreaFaldon.toFixed(2)} m²`, 
        numericValue: totalAreaFaldon,
        unit: 'm²',
        color: 'emerald',
        description: 'Superficie geométrica total de ambas vertientes.'
      },
      { 
        label: 'Área Real Panel Total', 
        value: `${totalAreaReal.toFixed(1)} m²`, 
        numericValue: totalAreaReal,
        unit: 'm²',
        color: 'indigo',
        description: 'Área total de material para ambas vertientes.'
      },
      { 
        label: 'Remate Caballete', 
        value: `${ancho.toFixed(2)} m`, 
        numericValue: ancho,
        unit: 'm',
        color: 'slate',
        description: 'Longitud de caballete necesaria para la unión de las dos aguas.'
      },
      { 
        label: 'Kits de Anclaje Totales', 
        value: `${Math.round(totalTornillos)} und`, 
        numericValue: Math.round(totalTornillos),
        unit: 'und',
        color: 'red',
        description: 'Tornillería total recomendada.'
      }
    ];
  }
};
