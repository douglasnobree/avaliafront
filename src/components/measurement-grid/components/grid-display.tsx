import { cn } from '@/lib/utils';
import { GridPoint } from '../types';
import { getLinhaLabel, getEmissorLabel } from '../utils/labels';

interface GridDisplayProps {
  numLinhas: number;
  numEmissores: number;
  grid: GridPoint[];
  onPointClick: (linha: number, emissor: number) => void;
}

export function GridDisplay({ numLinhas, numEmissores, grid, onPointClick }: GridDisplayProps) {
  return (
    <div className="max-w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <div className="inline-block min-w-min">
        {/* Header com labels dos emissores */}
        <div className="flex gap-0.5 md:gap-1 mb-0.5 md:mb-1">
          <div className="w-8 md:w-12 text-[10px] md:text-xs font-semibold text-center"></div>
          {Array.from({ length: numEmissores }).map((_, i) => (
            <div key={i} className="w-12 md:w-16 text-[10px] md:text-xs font-semibold text-center">
              {getEmissorLabel(i + 1, numEmissores)}
            </div>
          ))}
        </div>

        {/* Grid de pontos */}
        {Array.from({ length: numLinhas }).map((_, linhaIndex) => {
          const linha = linhaIndex + 1;
          return (
            <div key={linha} className="flex gap-0.5 md:gap-1 mb-0.5 md:mb-1">
              {/* Label da linha */}
              <div className="w-8 md:w-12 flex items-center justify-center text-[10px] md:text-xs font-semibold">
                {getLinhaLabel(linha, numLinhas)}
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
                    onClick={() => onPointClick(linha, emissor)}
                    className={cn(
                      'w-12 h-12 md:w-16 md:h-16 rounded-full border-2 transition-all duration-150 hover:scale-105 active:scale-95',
                      isMedido
                        ? 'bg-teal-500 border-teal-600 hover:bg-teal-600'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700 dark:bg-gray-900 dark:border-gray-800'
                    )}
                    title={`Linha ${getLinhaLabel(linha, numLinhas)} - Emissor ${getEmissorLabel(emissor, numEmissores)}`}
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
    </div>
  );
}
