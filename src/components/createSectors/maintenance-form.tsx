'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { CreateAreaFormData } from './form-schemas';

interface MaintenanceFormProps {
  form: UseFormReturn<CreateAreaFormData>;
  tipo_setor: 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL';
}

export function MaintenanceForm({ form, tipo_setor }: MaintenanceFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const errorMessages = errors as any; // Type assertion para evitar erros

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {tipo_setor === 'SETOR_HIDRAULICO'
            ? 'Manutenção e Observações'
            : 'Manutenção'}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='freq_manutencao'>Frequência de Manutenção *</Label>
            <Input
              id='freq_manutencao'
              type='text'
              placeholder={
                tipo_setor === 'SETOR_HIDRAULICO'
                  ? 'Ex: Semanal, Quinzenal, Mensal'
                  : 'Ex: Mensal, Trimestral'
              }
              {...register('freq_manutencao')}
            />
            {errorMessages.freq_manutencao && (
              <p className='text-sm text-red-500'>
                {errorMessages.freq_manutencao.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='data_ultima_manutencao'>
              Data da Última Manutenção *
            </Label>
            <Input
              id='data_ultima_manutencao'
              type='date'
              {...register('data_ultima_manutencao')}
            />
            {errorMessages.data_ultima_manutencao && (
              <p className='text-sm text-red-500'>
                {errorMessages.data_ultima_manutencao.message}
              </p>
            )}
          </div>

          {tipo_setor === 'PIVO_CENTRAL' && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='data_ultima_avaliacoes'>
                  Data da Última Avaliação *
                </Label>
                <Input
                  id='data_ultima_avaliacoes'
                  type='date'
                  {...register('data_ultima_avaliacoes')}
                />
                {errorMessages.data_ultima_avaliacoes && (
                  <p className='text-sm text-red-500'>
                    {errorMessages.data_ultima_avaliacoes.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {tipo_setor === 'SETOR_HIDRAULICO' ? (
          <div className='space-y-2'>
            <Label htmlFor='condicoes_gerais'>
              Condições Gerais do Setor *
            </Label>
            <Textarea
              id='condicoes_gerais'
              placeholder='Descreva as condições gerais, observações sobre manutenção, limpeza, obstruções, etc.'
              rows={4}
              {...register('condicoes_gerais')}
            />
            {errorMessages.condicoes_gerais && (
              <p className='text-sm text-red-500'>
                {errorMessages.condicoes_gerais.message}
              </p>
            )}
          </div>
        ) : (
          <div className='space-y-2'>
            <Label htmlFor='problemas_observados'>Problemas Observados</Label>
            <Textarea
              id='problemas_observados'
              placeholder='Descreva entupimentos, baixa pressão, falhas de painel, vazamentos, etc.'
              rows={4}
              {...register('problemas_observados')}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
