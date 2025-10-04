'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GridPoint {
  linha: number;
  emissor: number;
  medido: boolean;
}

interface MeasurementGridProps {
  numLinhas: number; // 1ª, 2ª, 3ª, Última
  numEmissores: number; // 1º, 2º, 3º, 4º
  onGridChange: (grid: GridPoint[]) => void;
  initialGrid?: GridPoint[];
}

export function MeasurementGrid({
  numLinhas = 4,
  numEmissores = 4,
  onGridChange,
  initialGrid = [],
}: MeasurementGridProps) {
  const [grid, setGrid] = useState<GridPoint[]>([]);

  // Inicializar grid
  useEffect(() => {
    if (initialGrid.length > 0) {
      setGrid(initialGrid);
    } else {
      const newGrid: GridPoint[] = [];
      for (let linha = 1; linha <= numLinhas; linha++) {
        for (let emissor = 1; emissor <= numEmissores; emissor++) {
          newGrid.push({
            linha,
            emissor,
            medido: false,
          });
        }
      }
      setGrid(newGrid);
    }
  }, [numLinhas, numEmissores]);

  const togglePoint = (linha: number, emissor: number) => {
    const newGrid = grid.map(point => {
      if (point.linha === linha && point.emissor === emissor) {
        return { ...point, medido: !point.medido };
      }
      return point;
    });
    setGrid(newGrid);
    onGridChange(newGrid);
  };

  const getLinhaLabel = (linha: number) => {
    if (linha === 1) return '1ª';
    if (linha === 2) return '1/3';
    if (linha === 3) return '2/3';
    if (linha === numLinhas) return 'Última';
    return `${linha}ª`;
  };

  const getEmissorLabel = (emissor: number) => {
    if (emissor === 1) return '1º';
    if (emissor === 2) return '2º';
    if (emissor === 3) return '3º';
    if (emissor === 4) return '4º';
    return `${emissor}º`;
  };

  const getMedidosCount = () => {
    return grid.filter(p => p.medido).length;
  };

  const getTotalPoints = () => {
    return grid.length;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Pontos de Medição</CardTitle>
            <CardDescription className="text-sm">
              Marque os pontos já medidos
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {getMedidosCount()}/{getTotalPoints()}
            </p>
            <p className="text-xs text-muted-foreground">pontos</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-w-md mx-auto">
          {/* Header com labels dos emissores */}
          <div className="grid grid-cols-5 gap-1 mb-1">
            <div className="text-xs font-semibold text-center"></div>
            {Array.from({ length: numEmissores }).map((_, i) => (
              <div key={i} className="text-xs font-semibold text-center">
                {getEmissorLabel(i + 1)}
              </div>
            ))}
          </div>

          {/* Grid de pontos */}
          {Array.from({ length: numLinhas }).map((_, linhaIndex) => {
            const linha = linhaIndex + 1;
            return (
              <div key={linha} className="grid grid-cols-5 gap-1 mb-1">
                {/* Label da linha */}
                <div className="flex items-center justify-center text-xs font-semibold">
                  {getLinhaLabel(linha)}
                </div>

                {/* Pontos da linha */}
                {Array.from({ length: numEmissores }).map((_, emissorIndex) => {
                  const emissor = emissorIndex + 1;
                  const point = grid.find(
                    p => p.linha === linha && p.emissor === emissor
                  );
                  const isMedido = point?.medido || false;

                  return (
                    <button
                      key={`${linha}-${emissor}`}
                      type="button"
                      onClick={() => togglePoint(linha, emissor)}
                      className={cn(
                        'w-16 h-16 rounded-md border-2 transition-all duration-150 hover:scale-105',
                        isMedido
                          ? 'bg-teal-500 border-teal-600 hover:bg-teal-600'
                          : 'bg-gray-800 border-gray-700 hover:bg-gray-700 dark:bg-gray-900 dark:border-gray-800'
                      )}
                      title={`Linha ${getLinhaLabel(linha)} - Emissor ${getEmissorLabel(emissor)}`}
                    >
                      <span className="sr-only">
                        {isMedido ? 'Medido' : 'Não medido'}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legenda compacta */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-teal-500 border border-teal-600"></div>
            <span>Medido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-800 border border-gray-700 dark:bg-gray-900 dark:border-gray-800"></div>
            <span>Não medido</span>
          </div>
        </div>

        {/* Aviso compacto */}
        {getMedidosCount() < getTotalPoints() && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-center dark:bg-yellow-900/20 dark:border-yellow-800">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ Faltam {getTotalPoints() - getMedidosCount()} ponto(s)
            </p>
          </div>
        )}

        {getMedidosCount() === getTotalPoints() && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center dark:bg-green-900/20 dark:border-green-800">
            <p className="text-xs text-green-800 dark:text-green-200">
              ✅ Completo!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
