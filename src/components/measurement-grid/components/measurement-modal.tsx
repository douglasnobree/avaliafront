import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { GridPoint, Repeticao } from '../types';
import { calculateVazao } from '../utils/calculations';
import { getLinhaLabel, getEmissorLabel } from '../utils/labels';

interface MeasurementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPoint: { linha: number; emissor: number } | null;
  grid: GridPoint[];
  numLinhas: number;
  numEmissores: number;
  onSave: (repeticoes: Repeticao[]) => void;
  onRemove: () => void;
}

const REPETICAO_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function MeasurementModal({
  open,
  onOpenChange,
  selectedPoint,
  grid,
  numLinhas,
  numEmissores,
  onSave,
  onRemove,
}: MeasurementModalProps) {
  const [repeticoes, setRepeticoes] = useState<Repeticao[]>([
    { id: crypto.randomUUID(), volume: 0, tempo: 0, vazao: 0 },
  ]);

  // Carregar dados existentes quando o modal abre
  useEffect(() => {
    if (open && selectedPoint) {
      const point = grid.find(
        (p) => p.linha === selectedPoint.linha && p.emissor === selectedPoint.emissor
      );

      if (point && point.repeticoes && point.repeticoes.length > 0) {
        setRepeticoes(point.repeticoes);
      } else {
        // Inicializar com 3 repetições vazias por padrão
        setRepeticoes([
          { id: crypto.randomUUID(), volume: 0, tempo: 0, vazao: 0 },
          { id: crypto.randomUUID(), volume: 0, tempo: 0, vazao: 0 },
          { id: crypto.randomUUID(), volume: 0, tempo: 0, vazao: 0 },
        ]);
      }
    }
  }, [open, selectedPoint, grid]);

  const handleVolumeChange = (id: string, value: string) => {
    setRepeticoes((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          const volume = parseFloat(value) || 0;
          const vazao = rep.tempo > 0 ? parseFloat(calculateVazao(value, rep.tempo.toString())) : 0;
          return { ...rep, volume, vazao };
        }
        return rep;
      })
    );
  };

  const handleTempoChange = (id: string, value: string) => {
    setRepeticoes((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          const tempo = parseFloat(value) || 0;
          const vazao = rep.volume > 0 ? parseFloat(calculateVazao(rep.volume.toString(), value)) : 0;
          return { ...rep, tempo, vazao };
        }
        return rep;
      })
    );
  };

  const addRepeticao = () => {
    if (repeticoes.length < REPETICAO_LABELS.length) {
      setRepeticoes([
        ...repeticoes,
        { id: crypto.randomUUID(), volume: 0, tempo: 0, vazao: 0 },
      ]);
    }
  };

  const removeRepeticao = (id: string) => {
    if (repeticoes.length > 1) {
      setRepeticoes(repeticoes.filter((rep) => rep.id !== id));
    }
  };

  const handleSave = () => {
    // Filtrar apenas repetições com dados válidos
    const validRepeticoes = repeticoes.filter((rep) => rep.volume > 0 && rep.tempo > 0);
    
    if (validRepeticoes.length === 0) {
      alert('Preencha pelo menos uma medição válida!');
      return;
    }

    onSave(validRepeticoes);
    onOpenChange(false);
  };

  const handleRemove = () => {
    onRemove();
    onOpenChange(false);
  };

  const calculateMedia = () => {
    const validRepeticoes = repeticoes.filter((rep) => rep.vazao > 0);
    if (validRepeticoes.length === 0) return 0;
    
    const soma = validRepeticoes.reduce((acc, rep) => acc + rep.vazao, 0);
    return (soma / validRepeticoes.length).toFixed(2);
  };

  if (!selectedPoint) return null;

  const pointIsMedido = grid.find(
    (p) => p.linha === selectedPoint.linha && p.emissor === selectedPoint.emissor
  )?.medido;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Rep. {getLinhaLabel(selectedPoint.linha, numLinhas)} - Vol.{' '}
            {getEmissorLabel(selectedPoint.emissor, numEmissores)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabela de repetições */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Rep.</th>
                  <th className="px-4 py-2 text-left font-medium">Volume (mL)</th>
                  <th className="px-4 py-2 text-left font-medium">Tempo (seg)</th>
                  <th className="px-4 py-2 text-left font-medium">Vazão (L/h)</th>
                  <th className="px-4 py-2 text-center font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {repeticoes.map((rep, index) => (
                  <tr key={rep.id} className="border-t">
                    <td className="px-4 py-2 font-semibold">{REPETICAO_LABELS[index]}</td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={rep.volume || ''}
                        onChange={(e) => handleVolumeChange(rep.id, e.target.value)}
                        placeholder="0"
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={rep.tempo || ''}
                        onChange={(e) => handleTempoChange(rep.id, e.target.value)}
                        placeholder="0"
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="text"
                        value={rep.vazao.toFixed(2)}
                        readOnly
                        className="w-full bg-gray-50 dark:bg-gray-900"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRepeticao(rep.id)}
                        disabled={repeticoes.length === 1}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-teal-50 dark:bg-teal-950 border-t-2">
                <tr>
                  <td className="px-4 py-3 font-bold" colSpan={3}>
                    Média
                  </td>
                  <td className="px-4 py-3 font-bold text-lg text-teal-600 dark:text-teal-400" colSpan={2}>
                    {calculateMedia()} L/h
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Botão para adicionar repetição */}
          {repeticoes.length < REPETICAO_LABELS.length && (
            <Button
              type="button"
              variant="outline"
              onClick={addRepeticao}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Repetição ({repeticoes.length}/{REPETICAO_LABELS.length})
            </Button>
          )}

          {/* Botões de ação */}
          <div className="flex gap-2 pt-4">
            {pointIsMedido && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Todas
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              onClick={handleSave}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
