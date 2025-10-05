export interface Repeticao {
  id: string;
  volume: number;
  tempo: number;
  vazao: number;
}

export interface GridPoint {
  linha: number;
  emissor: number;
  medido: boolean;
  repeticoes: Repeticao[];
  mediaVazao?: number;
}

export interface MeasurementGridProps {
  onGridChange: (grid: GridPoint[]) => void;
  initialGrid?: GridPoint[];
  readOnly?: boolean;
}
