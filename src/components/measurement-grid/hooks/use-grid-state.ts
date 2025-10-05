import { useState, useEffect } from 'react';
import { GridPoint } from '../types';

interface UseGridStateProps {
  initialGrid?: GridPoint[];
  onGridChange: (grid: GridPoint[]) => void;
}

export function useGridState({ initialGrid = [], onGridChange }: UseGridStateProps) {
  const [numLinhas] = useState(4);
  const [numEmissores, setNumEmissores] = useState(4);
  const [grid, setGrid] = useState<GridPoint[]>([]);

  useEffect(() => {
    if (initialGrid.length > 0) {
      setGrid(initialGrid);
      const maxEmissor = Math.max(...initialGrid.map(p => p.emissor));
      setNumEmissores(Math.max(4, maxEmissor));
    } else {
      initializeGrid(numLinhas, numEmissores);
    }
  }, []);

  const initializeGrid = (linhas: number, emissores: number) => {
    const newGrid: GridPoint[] = [];
    for (let linha = 1; linha <= linhas; linha++) {
      for (let emissor = 1; emissor <= emissores; emissor++) {
        newGrid.push({
          linha,
          emissor,
          medido: false,
          repeticoes: [],
        });
      }
    }
    setGrid(newGrid);
    onGridChange(newGrid);
  };

  const updateGrid = (newGrid: GridPoint[]) => {
    setGrid(newGrid);
    onGridChange(newGrid);
  };

  const getMedidosCount = () => {
    return grid.filter(p => p.medido).length;
  };

  const getTotalPoints = () => {
    return grid.length;
  };

  const getVazoes = () => {
    return grid
      .filter(p => p.medido && p.mediaVazao)
      .map(p => p.mediaVazao!);
  };

  return {
    numLinhas,
    numEmissores,
    setNumEmissores,
    grid,
    updateGrid,
    getMedidosCount,
    getTotalPoints,
    getVazoes,
  };
}
