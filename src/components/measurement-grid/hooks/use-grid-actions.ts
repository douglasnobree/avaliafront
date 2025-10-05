import { GridPoint, Repeticao } from '../types';

interface UseGridActionsProps {
  numLinhas: number;
  numEmissores: number;
  setNumEmissores: (value: number) => void;
  grid: GridPoint[];
  updateGrid: (grid: GridPoint[]) => void;
}

export function useGridActions({
  numLinhas,
  numEmissores,
  setNumEmissores,
  grid,
  updateGrid,
}: UseGridActionsProps) {
  
  const addColumn = () => {
    const newNumEmissores = numEmissores + 1;
    const newGrid = [...grid];
    
    for (let linha = 1; linha <= numLinhas; linha++) {
      newGrid.push({
        linha,
        emissor: newNumEmissores,
        medido: false,
        repeticoes: [],
      });
    }
    
    setNumEmissores(newNumEmissores);
    updateGrid(newGrid);
  };

  const removeLastColumn = () => {
    if (numEmissores <= 4) return;
    
    const newGrid = grid.filter(p => p.emissor !== numEmissores);
    setNumEmissores(numEmissores - 1);
    updateGrid(newGrid);
  };

  const saveMeasurement = (
    selectedPoint: { linha: number; emissor: number },
    repeticoes: Repeticao[]
  ) => {
    if (repeticoes.length === 0) return;

    const mediaVazao =
      repeticoes.reduce((acc, rep) => acc + rep.vazao, 0) / repeticoes.length;

    const newGrid = grid.map(p => {
      if (p.linha === selectedPoint.linha && p.emissor === selectedPoint.emissor) {
        return {
          ...p,
          medido: true,
          repeticoes,
          mediaVazao,
        };
      }
      return p;
    });
    
    updateGrid(newGrid);
  };

  const removeMeasurement = (selectedPoint: { linha: number; emissor: number }) => {
    const newGrid = grid.map(p => {
      if (p.linha === selectedPoint.linha && p.emissor === selectedPoint.emissor) {
        return {
          ...p,
          medido: false,
          repeticoes: [],
          mediaVazao: undefined,
        };
      }
      return p;
    });
    
    updateGrid(newGrid);
  };

  return {
    addColumn,
    removeLastColumn,
    saveMeasurement,
    removeMeasurement,
  };
}
