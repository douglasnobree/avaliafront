import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface GridControlsProps {
  numEmissores: number;
  onAddColumn: () => void;
  onRemoveColumn: () => void;
}

export function GridControls({ numEmissores, onAddColumn, onRemoveColumn }: GridControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemoveColumn}
        disabled={numEmissores <= 4}
        className="gap-2 w-full sm:w-auto text-xs md:text-sm"
      >
        <Minus className="w-3 h-3 md:w-4 md:h-4" />
        <span className="hidden xs:inline">Remover coluna</span>
        <span className="xs:hidden">Remover</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddColumn}
        className="gap-2 w-full sm:w-auto text-xs md:text-sm"
      >
        <Plus className="w-3 h-3 md:w-4 md:h-4" />
        <span className="hidden xs:inline">Adicionar coluna</span>
        <span className="xs:hidden">Adicionar</span>
      </Button>
    </div>
  );
}
