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
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PivoCentralFormProps {
  form: UseFormReturn<CreateAreaFormData>;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export function PivoCentralForm({
  form,
  onBack,
  onSubmit,
  loading,
}: PivoCentralFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const errorMessages = errors as any;

  return (
    <>
      <BasicInfoForm form={form} tipo_setor='PIVO_CENTRAL' />

      <Card>
        <CardHeader>
          <CardTitle>Estrutura do Pivô</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='fabricante'>Fabricante *</Label>
              <Input
                id='fabricante'
                type='text'
                placeholder='Ex: Valley, Lindsay, Bauer'
                {...register('fabricante')}
              />
              {errorMessages.fabricante && (
                <p className='text-sm text-red-500'>
                  {errorMessages.fabricante.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='modelo'>Modelo *</Label>
              <Input
                id='modelo'
                type='text'
                placeholder='Ex: 8000'
                {...register('modelo')}
              />
              {errorMessages.modelo && (
                <p className='text-sm text-red-500'>
                  {errorMessages.modelo.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='num_torres'>Número de Torres Móveis *</Label>
              <Input
                id='num_torres'
                type='number'
                placeholder='Ex: 5'
                {...register('num_torres')}
              />
              {errorMessages.num_torres && (
                <p className='text-sm text-red-500'>
                  {errorMessages.num_torres.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='comprimento'>Comprimento Total (m) *</Label>
              <Input
                id='comprimento'
                type='number'
                step='0.01'
                placeholder='Ex: 380'
                {...register('comprimento')}
              />
              {errorMessages.comprimento && (
                <p className='text-sm text-red-500'>
                  {errorMessages.comprimento.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Emissão</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Tipo de Emissores *</Label>
              <Controller
                name='emissor_type'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MICROASPERSOR'>
                        Sprays/Sprinklers
                      </SelectItem>
                      <SelectItem value='GOTEJAMENTO'>LEPA/Bocais</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errorMessages.emissor_type && (
                <p className='text-sm text-red-500'>
                  {errorMessages.emissor_type.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bocal_tipo'>Tipo de Bocal *</Label>
              <Input
                id='bocal_tipo'
                type='text'
                placeholder='Ex: Spray, Rotativo, LEPA'
                {...register('bocal_tipo')}
              />
              {errorMessages.bocal_tipo && (
                <p className='text-sm text-red-500'>
                  {errorMessages.bocal_tipo.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='pressao_bocal'>Pressão dos Bocais (mca) *</Label>
              <Input
                id='pressao_bocal'
                type='number'
                step='0.01'
                placeholder='Ex: 20'
                {...register('pressao_bocal')}
              />
              {errorMessages.pressao_bocal && (
                <p className='text-sm text-red-500'>
                  {errorMessages.pressao_bocal.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operação</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='energia_tipo'>Tipo de Energia *</Label>
              <Input
                id='energia_tipo'
                type='text'
                placeholder='Ex: Elétrica trifásica, Diesel'
                {...register('energia_tipo')}
              />
              {errorMessages.energia_tipo && (
                <p className='text-sm text-red-500'>
                  {errorMessages.energia_tipo.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='potencia_motor'>Potência do Motor (cv) *</Label>
              <Input
                id='potencia_motor'
                type='number'
                step='0.01'
                placeholder='Ex: 125'
                {...register('potencia_motor')}
              />
              {errorMessages.potencia_motor && (
                <p className='text-sm text-red-500'>
                  {errorMessages.potencia_motor.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='vazao_operacao'>Vazão de Operação (m³/h) *</Label>
              <Input
                id='vazao_operacao'
                type='number'
                step='0.01'
                placeholder='Ex: 150'
                {...register('vazao_operacao')}
              />
              {errorMessages.vazao_operacao && (
                <p className='text-sm text-red-500'>
                  {errorMessages.vazao_operacao.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='controle_tipo'>Tipo de Controle *</Label>
              <Input
                id='controle_tipo'
                type='text'
                placeholder='Ex: Manual, Painel Digital, GPS'
                {...register('controle_tipo')}
              />
              {errorMessages.controle_tipo && (
                <p className='text-sm text-red-500'>
                  {errorMessages.controle_tipo.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label>Possui Fertirrigação? *</Label>
              <Controller
                name='fertirrigacao'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='true'>Sim</SelectItem>
                      <SelectItem value='false'>Não</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errorMessages.fertirrigacao && (
                <p className='text-sm text-red-500'>
                  {errorMessages.fertirrigacao.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='fonte_hidrica'>Fonte Hídrica *</Label>
              <Input
                id='fonte_hidrica'
                type='text'
                placeholder='Ex: Poço profundo, Reservatório'
                {...register('fonte_hidrica')}
              />
              {errorMessages.fonte_hidrica && (
                <p className='text-sm text-red-500'>
                  {errorMessages.fonte_hidrica.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tempo_funcionamento'>
                Tempo Médio de Funcionamento (h/dia) *
              </Label>
              <Input
                id='tempo_funcionamento'
                type='number'
                step='0.01'
                placeholder='Ex: 18'
                {...register('tempo_funcionamento')}
              />
              {errorMessages.tempo_funcionamento && (
                <p className='text-sm text-red-500'>
                  {errorMessages.tempo_funcionamento.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='velocidade'>
                Velocidade de Deslocamento (%) *
              </Label>
              <Input
                id='velocidade'
                type='number'
                step='0.01'
                placeholder='Ex: 100'
                {...register('velocidade')}
              />
              {errorMessages.velocidade && (
                <p className='text-sm text-red-500'>
                  {errorMessages.velocidade.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <MaintenanceForm form={form} tipo_setor='PIVO_CENTRAL' />

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
          {loading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <>
              Criar Área
              <ChevronRight className='w-4 h-4 ml-2' />
            </>
          )}
        </Button>
      </div>
    </>
  );
}
