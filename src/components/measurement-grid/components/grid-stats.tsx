import { calculateMediaVazao } from '../utils/calculations';

interface GridStatsProps {
  medidosCount: number;
  totalPoints: number;
  vazoes: number[];
}

export function GridStats({ medidosCount, totalPoints, vazoes }: GridStatsProps) {
  const mediaVazao = calculateMediaVazao(vazoes);
  
  return (
    <div className="space-y-2">
      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-teal-500 border border-teal-600"></div>
          <span>Medido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-700 dark:bg-gray-900 dark:border-gray-800"></div>
          <span>Não medido</span>
        </div>
      </div>

      {/* Média de vazão */}
      {medidosCount > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-center dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
            média vazão: {mediaVazao.toFixed(2)} L/h
          </p>
        </div>
      )}

      {/* Avisos */}
      {medidosCount < totalPoints && medidosCount > 0 && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-center dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ Faltam {totalPoints - medidosCount} ponto(s)
          </p>
        </div>
      )}

      {medidosCount === totalPoints && totalPoints > 0 && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-center dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ✅ Todos os pontos medidos!
          </p>
        </div>
      )}
    </div>
  );
}
