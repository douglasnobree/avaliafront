'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { CreateAreaFormData } from './form-schemas';

interface BasicInfoFormProps {
  form: UseFormReturn<CreateAreaFormData>;
  tipo_setor: 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL';
}

export function BasicInfoForm({ form, tipo_setor }: BasicInfoFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='identificacao'>Identificação do Sistema *</Label>
            <Input
              id='identificacao'
              type='text'
              placeholder={
                tipo_setor === 'SETOR_HIDRAULICO'
                  ? 'Ex: Setor 1 - Bananal'
                  : 'Ex: Pivô 01 - Milho Leste'
              }
              {...register('identificacao')}
            />
            {errors.identificacao && (
              <p className='text-sm text-red-500'>
                {errors.identificacao.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='area_ha'>Área (hectares) *</Label>
            <Input
              id='area_ha'
              type='number'
              step='0.01'
              placeholder='Ex: 10.5'
              {...register('area_ha')}
            />
            {errors.area_ha && (
              <p className='text-sm text-red-500'>{errors.area_ha.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
