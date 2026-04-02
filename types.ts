
export interface RoofInputs {
  ancho: number;
  proyeccion: number;
  pendiente: number;
  proyeccion2?: number;
  pendiente2?: number;
  separacion: number;
  roofType: 'single' | 'double';
}

export interface CalculationResult {
  label: string;
  value: string;
  numericValue: number;
  unit: string;
  color: string;
  description: string;
}
