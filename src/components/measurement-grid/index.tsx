import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementGridProps, Repeticao } from './types';
import { useGridState } from './hooks/use-grid-state';
import { useGridActions } from './hooks/use-grid-actions';
import { GridControls } from './components/grid-controls';
import { GridDisplay } from './components/grid-display';
import { GridStats } from './components/grid-stats';
import { MeasurementModal } from './components/measurement-modal';

export function MeasurementGrid({ onGridChange, initialGrid = [] }: MeasurementGridProps) {
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Marcação de Pontos</CardTitle>
            <CardDescription className="text-sm">
              Clique nas bolinhas para fazer a avaliação de cada ponto
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {getMedidosCount()}/{getTotalPoints()}
            </p>
            <p className="text-xs text-muted-foreground">medidos</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
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
