import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface GridControlsProps {
  numEmissores: number;
  onAddColumn: () => void;
  onRemoveColumn: () => void;
}

export function GridControls({ numEmissores, onAddColumn, onRemoveColumn }: GridControlsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemoveColumn}
        disabled={numEmissores <= 4}
        className="gap-2"
      >
        <Minus className="w-4 h-4" />
        Remover coluna
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddColumn}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Adicionar coluna
      </Button>
    </div>
  );
}
