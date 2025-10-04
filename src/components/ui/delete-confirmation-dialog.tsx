'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  itemName: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'EXCLUIR',
  itemName,
}: DeleteConfirmationDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmInput, setConfirmInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setStep(1);
    setConfirmInput('');
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = async () => {
    if (confirmInput !== confirmText) {
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (step === 2) {
      setStep(1);
      setConfirmInput('');
    } else {
      handleClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            {step === 1 ? (
              <>
                <p>{description}</p>
                <p className="font-semibold text-foreground">
                  Item: <span className="text-red-600">{itemName}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Esta ação não pode ser desfeita!
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground">
                  Para confirmar, digite <span className="font-mono bg-red-100 px-2 py-1 rounded text-red-600">{confirmText}</span> abaixo:
                </p>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="confirm-input">Confirmação</Label>
                  <Input
                    id="confirm-input"
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder={confirmText}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {confirmInput && confirmInput !== confirmText && (
                  <p className="text-sm text-red-600 mt-2">
                    O texto não corresponde. Digite exatamente: {confirmText}
                  </p>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {step === 2 ? 'Voltar' : 'Cancelar'}
          </AlertDialogCancel>
          {step === 1 ? (
            <AlertDialogAction
              onClick={handleFirstConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Continuar
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={handleFinalConfirm}
              disabled={confirmInput !== confirmText || isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Excluindo...' : 'Excluir Definitivamente'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
