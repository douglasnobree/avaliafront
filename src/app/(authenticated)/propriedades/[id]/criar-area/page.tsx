'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  createAreaSchema,
  type CreateAreaFormData,
} from '../../../../../components/createSectors/form-schemas';
import { AreaTypeSelector } from '../../../../../components/createSectors/area-type-selector';
import { SetorHidraulicoForm } from '../../../../../components/createSectors/setor-hidraulico-form';
import { PivoCentralForm } from '../../../../../components/createSectors/pivo-central-form';
import api from '@/lib/api';
import { useSession } from '@/lib/auth-client';

export default function CreateAreaPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'tipo' | 'dados'>('tipo');
  const [tipo_setor, settipo_setor] = useState<
    'SETOR_HIDRAULICO' | 'PIVO_CENTRAL' | null
  >(null);
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const { data } = useSession();
  const userId = data?.user.id; 
  const form = useForm<CreateAreaFormData>({
    resolver: zodResolver(createAreaSchema),
  });

  const handleSubmit = async (data: CreateAreaFormData) => {
    setLoading(true);
    console.log('Dados do formulário:', data);

    try {
      // Preparar payload baseado no tipo de sistema
      let payload: any = {
        fabricante: data.fabricante,
        modelo: data.modelo,
        energia_tipo: data.energia_tipo,
        freq_manutencao: data.freq_manutencao,
        data_ultima_manutencao: new Date(
          data.data_ultima_manutencao
        ).toISOString(),
        emissor_type: data.emissor_type,
        propriedadeId: propertyId,
      };

      if (data.tipo_setor === 'SETOR_HIDRAULICO') {
        const setorData = data as any;
        payload = {
          ...payload,
          identificacao: String(setorData.identificacao),
          vazao_nominal: parseFloat(setorData.vazao_nominal),
          pressao_trabalho: parseFloat(setorData.pressao_trabalho),
          pressao_recomendada: parseFloat(setorData.pressao_recomendada),
          dist_emissores: parseFloat(setorData.dist_emissores),
          dist_laterais: parseFloat(setorData.dist_laterais),
          filtro_tipo: setorData.filtro_tipo,
          malha_filtro: setorData.malha_filtro,
          pressao_entrada: parseFloat(setorData.pressao_entrada),
          valvula_tipo: setorData.valvula_tipo,
          condicoes_gerais: setorData.condicoes_gerais,
          num_emissores: parseInt(setorData.num_emissores),
          tipo_setor: 'SETOR_HIDRAULICO',
          userId: userId,
        };

        console.log('Payload setor hidráulico:', payload);
        await api.post('/hydraulic-sector', payload);
      } else if (data.tipo_setor === 'PIVO_CENTRAL') {
        payload = {
          ...payload,
          num_torres: parseInt(data.num_torres),
          comprimento: parseFloat(data.comprimento),
          potencia_motor: parseFloat(data.potencia_motor),
          vazao_operacao: parseFloat(data.vazao_operacao),
          controle_tipo: data.controle_tipo,
          fertirrigacao: data.fertirrigacao === 'true',
          fonte_hidrica: data.fonte_hidrica,
          tempo_funcionamento: parseFloat(data.tempo_funcionamento),
          velocidade: parseFloat(data.velocidade),
          bocal_tipo: data.bocal_tipo,
          pressao_bocal: parseFloat(data.pressao_bocal),
          data_ultima_avaliacoes: new Date(
            data.data_ultima_avaliacoes
          ).toISOString(),
          problemas_observados: data.problemas_observados || '',
        };

        console.log('Payload pivô central:', payload);
        await api.post('/areas', payload);
      }

      toast.success('Área criada com sucesso!');
      router.push(`/propriedades/${propertyId}`);
    } catch (error: any) {
      console.error('Erro ao criar área:', error);
      toast.error(error?.response?.data?.message || 'Erro ao criar área');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTipo = (tipo: 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL') => {
    settipo_setor(tipo);
    form.setValue('tipo_setor', tipo);
    form.setValue('propriedade_id', propertyId);
    setStep('dados');
  };

  // Etapa 1: Escolher tipo de sistema
  if (step === 'tipo') {
    return (
      <AreaTypeSelector
        onSelectTipo={handleSelectTipo}
        onBack={() => router.push(`/propriedades/${propertyId}`)}
      />
    );
  }

  // Etapa 2: Formulário de dados
  const Form =
    tipo_setor === 'SETOR_HIDRAULICO' ? SetorHidraulicoForm : PivoCentralForm;

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>
          {tipo_setor === 'SETOR_HIDRAULICO'
            ? 'Setor Hidráulico'
            : 'Pivô Central'}
        </h1>
        <p className='text-muted-foreground mt-2'>
          Preencha os dados técnicos do sistema de irrigação
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <Form
          form={form}
          onBack={() => setStep('tipo')}
          onSubmit={form.handleSubmit(handleSubmit)}
          loading={loading}
        />
      </form>
    </div>
  );
}
