'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import api from '@/lib/api';

import { AreaTypeSelector } from '../../../../../components/createSectors/area-type-selector';
import { SetorHidraulicoForm } from '../../../../../components/createSectors/setor-hidraulico-form';
import { PivoCentralForm } from '../../../../../components/createSectors/pivo-central-form';
import {
  createAreaSchema,
  type CreateAreaFormData,
} from '../../../../../components/createSectors/form-schemas';

export default function CreateAreaPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'tipo' | 'dados'>('tipo');
  const [tipoSetor, setTipoSetor] = useState<
    'SETOR_HIDRAULICO' | 'PIVO_CENTRAL' | null
  >(null);

  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const { data } = useSession();
  const userId = data?.user?.id;

  const form = useForm<CreateAreaFormData>({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      tipo_setor: 'SETOR_HIDRAULICO',
    },
  });

  const handleSelectTipo = (tipo: 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL') => {
    setTipoSetor(tipo);
    form.setValue('tipo_setor', tipo);
    setStep('dados');
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    setLoading(true);
    console.log('Dados do formulário:', formData);

    try {
      let payload: any = {
        identificacao: formData.identificacao,
        propriedadeId: propertyId,
      };

      if (formData.tipo_setor === 'SETOR_HIDRAULICO') {
        payload = {
          ...payload,
          fabricante: formData.fabricante || undefined,
          modelo: formData.modelo || undefined,
          vazao_nominal: parseFloat(formData.vazao_nominal),
          pressao_trabalho: parseFloat(formData.pressao_trabalho),
          dist_emissores: parseFloat(formData.dist_emissores),
          dist_laterais: parseFloat(formData.dist_laterais),
          filtro_tipo: formData.filtro_tipo,
          malha_filtro: formData.malha_filtro,
          valvula_tipo: formData.valvula_tipo,
          energia_tipo: formData.energia_tipo,
          condicoes_gerais: formData.condicoes_gerais || undefined,
          freq_manutencao: formData.freq_manutencao,
          data_ultima_manutencao: formData.data_ultima_manutencao,
          emissor_type: formData.emissor_type,
          tipo_setor: 'SETOR_HIDRAULICO',
          userId: userId,
        };
        console.log('📤 Payload SETOR_HIDRAULICO:', JSON.stringify(payload, null, 2));
        const response = await api.post('/hydraulic-sector', payload);
        console.log('✅ Resposta do servidor:', response.data);
        toast.success('Área criada com sucesso!');
        router.push(`/propriedades/${propertyId}`);
      } else if (formData.tipo_setor === 'PIVO_CENTRAL') {
        payload = {
          ...payload,
          num_torres: parseInt(formData.num_torres),
          comprimento: parseFloat(formData.comprimento),
          fabricante: formData.fabricante || undefined,
          modelo: formData.modelo || undefined,
          emissor_type: formData.emissor_type,
          energia_tipo: formData.energia_tipo,
          potencia_motor: parseFloat(formData.potencia_motor),
          vazao_operacao: parseFloat(formData.vazao_operacao),
          controle_tipo: formData.controle_tipo,
          fertirrigacao: formData.fertirrigacao === 'true',
          fonte_hidrica: formData.fonte_hidrica,
          tempo_funcionamento: parseFloat(formData.tempo_funcionamento),
          velocidade: parseFloat(formData.velocidade),
          bocal_tipo: formData.bocal_tipo,
          pressao_bocal: parseFloat(formData.pressao_bocal),
          data_ultima_manutencao: formData.data_ultima_manutencao,
          freq_manutencao: formData.freq_manutencao,
          problemas_observados: formData.problemas_observados || undefined,
          data_ultima_avaliacoes: formData.data_ultima_avaliacoes,
        };
        await api.post('/middle-pivot', payload);
        toast.success('Área criada com sucesso!');
        router.push(`/propriedades/${propertyId}`);
      }

      console.log(
        'Payload final sendo enviado:',
        JSON.stringify(payload, null, 2)
      );
    } catch (error: any) {
      console.error('Erro ao criar área:', error);
      toast.error(error?.response?.data?.message || 'Erro ao criar área');
    } finally {
      setLoading(false);
    }
  });

  const handleBack = () => {
    if (step === 'dados') {
      setStep('tipo');
      setTipoSetor(null);
      form.reset();
    } else {
      router.push(`/propriedades/${propertyId}`);
    }
  };

  if (step === 'tipo') {
    return (
      <AreaTypeSelector
        onSelectTipo={handleSelectTipo}
        onBack={() => router.push(`/propriedades/${propertyId}`)}
      />
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <form onSubmit={onSubmit} className='space-y-6'>
        {tipoSetor === 'SETOR_HIDRAULICO' ? (
          <SetorHidraulicoForm
            form={form}
            onSubmit={onSubmit}
            onBack={handleBack}
            loading={loading}
          />
        ) : tipoSetor === 'PIVO_CENTRAL' ? (
          <PivoCentralForm
            form={form}
            onSubmit={onSubmit}
            onBack={handleBack}
            loading={loading}
          />
        ) : null}
      </form>
    </div>
  );
}
