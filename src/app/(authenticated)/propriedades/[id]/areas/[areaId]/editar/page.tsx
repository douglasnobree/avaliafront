'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { SetorHidraulicoForm } from '@/components/createSectors/setor-hidraulico-form';
import { PivoCentralForm } from '@/components/createSectors/pivo-central-form';
import { createAreaSchema, type CreateAreaFormData } from '@/components/createSectors/form-schemas';

export default function EditarAreaPage() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [tipoSetor, setTipoSetor] = useState<'SETOR_HIDRAULICO' | 'PIVO_CENTRAL' | null>(null);
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;

  const form = useForm<CreateAreaFormData>({
    resolver: zodResolver(createAreaSchema),
  });

  useEffect(() => {
    loadAreaData();
  }, []);

  const loadAreaData = async () => {
    try {
      const response = await api.get(`/areas/${areaId}`);
      const data = response.data?.data || response.data;
      
      console.log('Dados da área:', data);

      // Identificar tipo de setor
      const tipo = data.tipo_setor as 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL';
      setTipoSetor(tipo);

      if (tipo === 'SETOR_HIDRAULICO' && data.setor_hidraulico) {
        const setor = data.setor_hidraulico;
        form.reset({
          tipo_setor: 'SETOR_HIDRAULICO',
          identificacao: data.indentificacao,
          area_ha: data.area_ha.toString(),
          fabricante: setor.fabricante || '',
          modelo: setor.modelo || '',
          emissor_type: setor.emissor_type,
          vazao_nominal: setor.vazao_nominal.toString(),
          pressao_trabalho: setor.pressao_trabalho.toString(),
          dist_emissores: setor.dist_emissores.toString(),
          dist_laterais: setor.dist_laterais.toString(),
          filtro_tipo: setor.filtro_tipo,
          malha_filtro: setor.malha_filtro,
          valvula_tipo: setor.valvula_tipo,
          energia_tipo: setor.energia_tipo,
          condicoes_gerais: setor.condicoes_gerais || '',
          freq_manutencao: setor.freq_manutencao,
          data_ultima_manutencao: new Date(setor.data_ultima_manutencao).toISOString().split('T')[0],
        });
      } else if (tipo === 'PIVO_CENTRAL' && data.pivo_central) {
        const pivo = data.pivo_central;
        form.reset({
          tipo_setor: 'PIVO_CENTRAL',
          identificacao: data.indentificacao,
          area_ha: data.area_ha.toString(),
          num_torres: pivo.num_torres.toString(),
          comprimento: pivo.comprimento.toString(),
          fabricante: pivo.fabricante || '',
          modelo: pivo.modelo || '',
          emissor_type: pivo.emissor_type,
          energia_tipo: pivo.energia_tipo,
          potencia_motor: pivo.potencia_motor.toString(),
          vazao_operacao: pivo.vazao_operacao.toString(),
          controle_tipo: pivo.controle_tipo,
          fertirrigacao: pivo.fertirrigacao ? 'true' : 'false',
          fonte_hidrica: pivo.fonte_hidrica,
          tempo_funcionamento: pivo.tempo_funcionamento.toString(),
          velocidade: pivo.velocidade.toString(),
          bocal_tipo: pivo.bocal_tipo,
          pressao_bocal: pivo.pressao_bocal.toString(),
          data_ultima_manutencao: new Date(pivo.data_ultima_manutencao).toISOString().split('T')[0],
          freq_manutencao: pivo.freq_manutencao,
          problemas_observados: pivo.problemas_observados || '',
          data_ultima_avaliacoes: new Date(pivo.data_ultima_avaliacoes).toISOString().split('T')[0],
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar área:', error);
      toast.error('Erro ao carregar dados da área');
      router.push(`/propriedades/${propertyId}`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    setLoading(true);

    try {
      const payload: any = {
        area: {
          indentificacao: formData.identificacao,
          area_ha: parseFloat(formData.area_ha),
        }
      };

      if (formData.tipo_setor === 'SETOR_HIDRAULICO') {
        payload.setor_hidraulico = {
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
        };
      } else if (formData.tipo_setor === 'PIVO_CENTRAL') {
        payload.pivo_central = {
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
      }

      console.log('Payload de atualização:', JSON.stringify(payload, null, 2));

      await api.patch(`/areas/${areaId}`, payload);

      toast.success('Área atualizada com sucesso!');
      router.push(`/propriedades/${propertyId}/areas/${areaId}`);
    } catch (error: any) {
      console.error('Erro ao atualizar área:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar área'
      );
    } finally {
      setLoading(false);
    }
  });

  const handleBack = () => {
    router.push(`/propriedades/${propertyId}/areas/${areaId}`);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tipoSetor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Tipo de setor não identificado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editar Área</h1>
        <p className="text-muted-foreground mt-2">
          Atualize todos os dados da área de irrigação
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {tipoSetor === 'SETOR_HIDRAULICO' ? (
          <SetorHidraulicoForm
            form={form}
            onSubmit={onSubmit}
            onBack={handleBack}
            loading={loading}
          />
        ) : (
          <PivoCentralForm
            form={form}
            onSubmit={onSubmit}
            onBack={handleBack}
            loading={loading}
          />
        )}
      </form>
    </div>
  );
}
