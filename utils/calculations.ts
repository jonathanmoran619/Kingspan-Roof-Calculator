
import { RoofInputs, CalculationResult } from '../types';

export const calculateRoofData = (inputs: RoofInputs): CalculationResult[] => {
  const { ancho, proyeccion, pendiente, separacion } = inputs;

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

  return [
    { 
      label: 'Longitud de Vertiente', 
      value: `${longitudReal.toFixed(2)} m`, 
      numericValue: longitudReal,
      unit: 'm',
      color: 'blue',
      description: 'Longitud real medida sobre la pendiente de la cubierta.'
    },
    { 
      label: 'Traslapos Necesarios', 
      value: `${traslapos} und`, 
      numericValue: traslapos,
      unit: 'und',
      color: 'amber',
      description: 'Cantidad de traslapos longitudinales por línea de panel.'
    },
    { 
      label: 'Área Neta Cubierta', 
      value: `${areaFaldon.toFixed(2)} m²`, 
      numericValue: areaFaldon,
      unit: 'm²',
      color: 'emerald',
      description: 'Superficie geométrica exacta de la cubierta.'
    },
    { 
      label: 'Área Real Panel (Compra)', 
      value: `${areaReal.toFixed(1)} m²`, 
      numericValue: areaReal,
      unit: 'm²',
      color: 'indigo',
      description: 'Área total de material incluyendo desperdicio técnico y traslapos.'
    },
    { 
      label: 'Remate Nivel/Muro', 
      value: `${remateNivel} m`, 
      numericValue: remateNivel,
      unit: 'm',
      color: 'slate',
      description: 'Longitud total de accesorios de remate lateral y superior.'
    },
    { 
      label: 'Remate Frontal', 
      value: `${remateFrontal} m`, 
      numericValue: remateFrontal,
      unit: 'm',
      color: 'slate',
      description: 'Accesorios necesarios para el cierre frontal de la vertiente.'
    },
    { 
      label: 'Kits de Anclaje (Tornillos)', 
      value: `${Math.round(tornillos)} und`, 
      numericValue: Math.round(tornillos),
      unit: 'und',
      color: 'red',
      description: 'Tornillería técnica recomendada para fijación a estructura.'
    }
  ];
};
