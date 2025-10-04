'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AreaTypeSelectorProps {
  onSelectTipo: (tipo: 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL') => void;
  onBack: () => void;
}

export function AreaTypeSelector({
  onSelectTipo,
  onBack,
}: AreaTypeSelectorProps) {
  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Criar Nova Área</h1>
        <p className='text-muted-foreground mt-2'>
          Escolha o tipo de sistema de irrigação
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <Card
          className='cursor-pointer hover:border-primary transition-colors'
          onClick={() => onSelectTipo('SETOR_HIDRAULICO')}>
          <CardHeader>
            <CardTitle>🌊 Irrigação Localizada</CardTitle>
            <CardDescription>
              Setor Hidráulico (Gotejamento ou Microaspersão)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Sistema de irrigação localizada com emissores (gotejadores ou
              microaspersores). Ideal para culturas em linha, pomares e
              hortaliças.
            </p>
          </CardContent>
        </Card>

        <Card
          className='cursor-pointer hover:border-primary transition-colors'
          onClick={() => onSelectTipo('PIVO_CENTRAL')}>
          <CardHeader>
            <CardTitle>🎡 Pivô Central</CardTitle>
            <CardDescription>
              Sistema de irrigação por aspersão mecanizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Sistema de irrigação mecanizado com torres móveis em movimento
              circular. Ideal para grandes áreas de grãos e pastagens.
            </p>
          </CardContent>
        </Card>
      </div>

      <Button type='button' variant='outline' onClick={onBack}>
        <ChevronLeft className='w-4 h-4 mr-2' />
        Voltar
      </Button>
    </div>
  );
}
