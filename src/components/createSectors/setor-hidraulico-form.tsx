'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, UseFormReturn } from 'react-hook-form';
import { CreateAreaFormData } from './form-schemas';
import { BasicInfoForm } from './basic-info-form';
import { MaintenanceForm } from './maintenance-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SetorHidraulicoFormProps {
  form: UseFormReturn<CreateAreaFormData>;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export function SetorHidraulicoForm({
  form,
  onBack,
  onSubmit,
  loading,
}: SetorHidraulicoFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <BasicInfoForm form={form} tipo_setor='SETOR_HIDRAULICO' />

      <Card>
        <CardHeader>
          <CardTitle>Emissores</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Tipo de Emissor *</Label>
              <Controller
                name='emissor_type'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='GOTEJAMENTO'>Gotejador</SelectItem>
                      <SelectItem value='MICROMICROASPERSOR'>
                        Microaspersor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {'emissor_type' in errors && errors.emissor_type && (
                <p className='text-sm text-red-500'>
                  {errors.emissor_type.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='fabricante'>Fabricante do Emissor *</Label>
              <Input
                id='fabricante'
                type='text'
                placeholder='Ex: Netafim, Naandanjain'
                {...register('fabricante')}
              />
              {'fabricante' in errors && errors.fabricante && (
                <p className='text-sm text-red-500'>
                  {errors.fabricante.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='modelo'>Modelo do Emissor *</Label>
              <Input
                id='modelo'
                type='text'
                placeholder='Ex: UniRam'
                {...register('modelo')}
              />
              {'modelo' in errors && errors.modelo && (
                <p className='text-sm text-red-500'>{errors.modelo.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='vazao_nominal'>Vazão Nominal (L/h) *</Label>
              <Input
                id='vazao_nominal'
                type='number'
                step='0.01'
                placeholder='Ex: 2.5'
                {...register('vazao_nominal')}
              />
              {'vazao_nominal' in errors && errors.vazao_nominal && (
                <p className='text-sm text-red-500'>
                  {errors.vazao_nominal.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pressões e Espaçamentos</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='pressao_trabalho'>
                Pressão de Trabalho (mca) *
              </Label>
              <Input
                id='pressao_trabalho'
                type='number'
                step='0.01'
                placeholder='Ex: 10'
                {...register('pressao_trabalho')}
              />
              {'pressao_trabalho' in errors && errors.pressao_trabalho && (
                <p className='text-sm text-red-500'>
                  {errors.pressao_trabalho.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='dist_emissores'>
                Distância entre Emissores (m) *
              </Label>
              <Input
                id='dist_emissores'
                type='number'
                step='0.01'
                placeholder='Ex: 0.5'
                {...register('dist_emissores')}
              />
              {'dist_emissores' in errors && errors.dist_emissores && (
                <p className='text-sm text-red-500'>
                  {errors.dist_emissores.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='dist_laterais'>
                Distância entre Linhas Laterais (m) *
              </Label>
              <Input
                id='dist_laterais'
                type='number'
                step='0.01'
                placeholder='Ex: 1.5'
                {...register('dist_laterais')}
              />
              {'dist_laterais' in errors && errors.dist_laterais && (
                <p className='text-sm text-red-500'>
                  {errors.dist_laterais.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtragem e Controle</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='filtro_tipo'>Tipo de Filtro *</Label>
              <Input
                id='filtro_tipo'
                type='text'
                placeholder='Ex: Tela, Disco, Areia'
                {...register('filtro_tipo')}
              />
              {'filtro_tipo' in errors && errors.filtro_tipo && (
                <p className='text-sm text-red-500'>
                  {errors.filtro_tipo.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='malha_filtro'>Malha/Grau de Filtragem *</Label>
              <Input
                id='malha_filtro'
                type='text'
                placeholder='Ex: 130 mesh, 120 micras'
                {...register('malha_filtro')}
              />
              {'malha_filtro' in errors && errors.malha_filtro && (
                <p className='text-sm text-red-500'>
                  {errors.malha_filtro.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='valvula_tipo'>
                Tipo de Válvula de Controle *
              </Label>
              <Input
                id='valvula_tipo'
                type='text'
                placeholder='Ex: Manual, Elétrica, Hidráulica'
                {...register('valvula_tipo')}
              />
              {'valvula_tipo' in errors && errors.valvula_tipo && (
                <p className='text-sm text-red-500'>
                  {errors.valvula_tipo.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='energia_tipo'>Tipo de Energia *</Label>
              <Input
                id='energia_tipo'
                type='text'
                placeholder='Ex: Elétrica, Fotovoltaica, Combustível'
                {...register('energia_tipo')}
              />
              {'energia_tipo' in errors && errors.energia_tipo && (
                <p className='text-sm text-red-500'>
                  {errors.energia_tipo.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <MaintenanceForm form={form} tipo_setor='SETOR_HIDRAULICO' />

      <div className='flex gap-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onBack}
          className='flex-1'>
          <ChevronLeft className='w-4 h-4 mr-2' />
          Voltar
        </Button>
        <Button
          type='button'
          onClick={onSubmit}
          disabled={loading}
          className='flex-1'>
          Criar Área
          <ChevronRight className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </>
  );
}
