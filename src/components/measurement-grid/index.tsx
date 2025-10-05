import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementGridProps, Repeticao } from './types';
import { useGridState } from './hooks/use-grid-state';
import { useGridActions } from './hooks/use-grid-actions';
import { GridControls } from './components/grid-controls';
import { GridDisplay } from './components/grid-display';
import { GridStats } from './components/grid-stats';
import { MeasurementModal } from './components/measurement-modal';

export function MeasurementGrid({ onGridChange, initialGrid = [], readOnly = false }: MeasurementGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{ linha: number; emissor: number } | null>(
    null
  );

  const { numLinhas, numEmissores, setNumEmissores, grid, updateGrid, getMedidosCount, getTotalPoints, getVazoes } = useGridState({
    initialGrid,
    onGridChange,
  });

  const { addColumn, removeLastColumn, saveMeasurement, removeMeasurement } = useGridActions({
    numLinhas,
    numEmissores,
    setNumEmissores,
    grid,
    updateGrid,
  });

  const handlePointClick = (linha: number, emissor: number) => {
    if (readOnly) return; // Não abre modal em modo somente leitura
    setSelectedPoint({ linha, emissor });
    setModalOpen(true);
  };

  const handleSave = (repeticoes: Repeticao[]) => {
    if (selectedPoint) {
      saveMeasurement(selectedPoint, repeticoes);
    }
  };

  const handleRemove = () => {
    if (selectedPoint) {
      removeMeasurement(selectedPoint);
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base md:text-lg">Marcação de Pontos</CardTitle>
            <CardDescription className="text-xs md:text-sm mt-1">
              Clique nas bolinhas para fazer a avaliação de cada ponto
            </CardDescription>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-xl md:text-2xl font-bold text-foreground">
              {getMedidosCount()}/{getTotalPoints()}
            </p>
            <p className="text-xs text-muted-foreground">medidos</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="space-y-3 md:space-y-4">
          <GridControls
            numEmissores={numEmissores}
            onAddColumn={addColumn}
            onRemoveColumn={removeLastColumn}
          />

          <GridDisplay
            numLinhas={numLinhas}
            numEmissores={numEmissores}
            grid={grid}
            onPointClick={handlePointClick}
          />

          <GridStats medidosCount={getMedidosCount()} totalPoints={getTotalPoints()} vazoes={getVazoes()} />
        </div>
      </CardContent>

      <MeasurementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedPoint={selectedPoint}
        grid={grid}
        numLinhas={numLinhas}
        numEmissores={numEmissores}
        onSave={handleSave}
        onRemove={handleRemove}
      />
    </Card>
  );
}
