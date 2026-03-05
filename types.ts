
export interface RoofInputs {
  ancho: number;
  proyeccion: number;
  pendiente: number;
  separacion: number;
}

export interface CalculationResult {
  label: string;
  value: string;
  numericValue: number;
  unit: string;
  color: string;
  description: string;
}
