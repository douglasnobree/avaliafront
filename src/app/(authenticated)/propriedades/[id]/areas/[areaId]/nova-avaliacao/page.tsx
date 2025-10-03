'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api from '@/lib/api';

const medicaoSchema = z.object({
  volume: z.string().min(1, 'Volume é obrigatório'),
  tempo: z.string().min(1, 'Tempo é obrigatório'),
  vazao: z.string().optional(),
});

const novaAvaliacaoSchema = z.object({
  area_irrigada: z.string().min(1, 'Área irrigada é obrigatória'),
  medicoes: z.array(medicaoSchema).min(1, 'Adicione pelo menos uma medição'),
  comentarios: z.string().optional(),
  recomendacoes: z.string().optional(),
});

type NovaAvaliacaoFormData = z.infer<typeof novaAvaliacaoSchema>;

export default function NovaAvaliacaoPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NovaAvaliacaoFormData>({
    resolver: zodResolver(novaAvaliacaoSchema),
    defaultValues: {
      medicoes: [{ volume: '', tempo: '', vazao: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicoes',
  });

  // Calcular vazão automaticamente
  const calcularVazao = (index: number) => {
    const medicoes = watch('medicoes');
    const medicao = medicoes[index];
    
    if (medicao?.volume && medicao?.tempo) {
      const volume = parseFloat(medicao.volume);
      const tempo = parseFloat(medicao.tempo);
      
      if (volume > 0 && tempo > 0) {
        // Vazão em L/h = (Volume em L / Tempo em minutos) * 60
        const vazao = (volume / tempo) * 60;
        setValue(`medicoes.${index}.vazao`, vazao.toFixed(2));
      }
    }
  };

  const onSubmit = async (data: NovaAvaliacaoFormData) => {
    setLoading(true);

    try {
      // Calcular CUD e CUC (simplificado - em produção use cálculos reais)
      const vazoes = data.medicoes
        .map((m) => parseFloat(m.vazao || '0'))
        .filter((v) => v > 0);
      
      const vazaoMedia = vazoes.reduce((a, b) => a + b, 0) / vazoes.length;
      
      // CUC simplificado
      const desvios = vazoes.map((v) => Math.abs(v - vazaoMedia));
      const somaDesvios = desvios.reduce((a, b) => a + b, 0);
      const cuc = (1 - somaDesvios / (vazaoMedia * vazoes.length)) * 100;
      
      // CUD simplificado (25% menores vazões)
      const vazoesSorted = [...vazoes].sort((a, b) => a - b);
      const n25 = Math.ceil(vazoes.length * 0.25);
      const media25Menores =
        vazoesSorted.slice(0, n25).reduce((a, b) => a + b, 0) / n25;
      const cud = (media25Menores / vazaoMedia) * 100;

      const avaliacaoData = {
        area_irrigada: parseFloat(data.area_irrigada),
        volume_agua: data.medicoes.reduce(
          (sum, m) => sum + parseFloat(m.volume),
          0
        ),
        tempo_irrigacao: data.medicoes.reduce(
          (sum, m) => sum + parseFloat(m.tempo),
          0
        ),
        cud: Math.min(100, Math.max(0, cud)),
        cuc: Math.min(100, Math.max(0, cuc)),
        data: new Date().toISOString(),
        unidade_id: areaId,
        offline_status: false,
        avaliador_id: 'current-user-id', // Substituir pelo ID real do usuário
        unidade_type: 'SETOR_HIDRAULICO',
        pontos: data.medicoes.map((m, index) => ({
          eixo_x: index % 5,
          eixo_y: Math.floor(index / 5),
          volume_ml: parseFloat(m.volume) * 1000,
          tempo_seg: parseFloat(m.tempo) * 60,
          vazao_l_h: parseFloat(m.vazao || '0'),
        })),
        comentarios: data.comentarios,
        recomendacoes: data.recomendacoes,
      };

      // Você precisará criar este endpoint no backend
      await api.post('/avaliacoes', avaliacaoData);

      toast.success('Avaliação criada com sucesso!');
      router.push(`/propriedades/${propertyId}/areas/${areaId}`);
    } catch (error: any) {
      console.error('Erro ao criar avaliação:', error);
      toast.error(error?.response?.data?.message || 'Erro ao criar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Nova Avaliação</h1>
        <p className='text-muted-foreground mt-2'>
          Registre as medições de irrigação da área
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>
              Dados básicos da avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='area_irrigada'>Área Irrigada (hectares) *</Label>
              <Input
                id='area_irrigada'
                type='number'
                step='0.01'
                placeholder='Ex: 15.5'
                {...register('area_irrigada')}
              />
              {errors.area_irrigada && (
                <p className='text-sm text-red-500'>
                  {errors.area_irrigada.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medições */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Medições por Linha de Irrigação</CardTitle>
                <CardDescription>
                  Adicione as medições de volume, tempo e vazão
                </CardDescription>
              </div>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => append({ volume: '', tempo: '', vazao: '' })}>
                <Plus className='w-4 h-4 mr-2' />
                Adicionar Linha
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {fields.map((field, index) => (
                <Card key={field.id} className='bg-secondary/20'>
                  <CardContent className='pt-6'>
                    <div className='flex items-start gap-4'>
                      <div className='flex-1 space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor={`medicoes.${index}.volume`}>
                              Volume (L) *
                            </Label>
                            <Input
                              id={`medicoes.${index}.volume`}
                              type='number'
                              step='0.01'
                              placeholder='Ex: 150'
                              {...register(`medicoes.${index}.volume`)}
                              onBlur={() => calcularVazao(index)}
                            />
                            {errors.medicoes?.[index]?.volume && (
                              <p className='text-sm text-red-500'>
                                {errors.medicoes[index]?.volume?.message}
                              </p>
                            )}
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor={`medicoes.${index}.tempo`}>
                              Tempo (min) *
                            </Label>
                            <Input
                              id={`medicoes.${index}.tempo`}
                              type='number'
                              step='0.01'
                              placeholder='Ex: 60'
                              {...register(`medicoes.${index}.tempo`)}
                              onBlur={() => calcularVazao(index)}
                            />
                            {errors.medicoes?.[index]?.tempo && (
                              <p className='text-sm text-red-500'>
                                {errors.medicoes[index]?.tempo?.message}
                              </p>
                            )}
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor={`medicoes.${index}.vazao`}>
                              Vazão (L/h)
                            </Label>
                            <Input
                              id={`medicoes.${index}.vazao`}
                              type='number'
                              step='0.01'
                              placeholder='Calculado'
                              {...register(`medicoes.${index}.vazao`)}
                              readOnly
                              className='bg-muted'
                            />
                          </div>
                        </div>
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          onClick={() => remove(index)}
                          className='mt-8'>
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {errors.medicoes?.root && (
                <p className='text-sm text-red-500'>
                  {errors.medicoes.root.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comentários e Recomendações */}
        <Card>
          <CardHeader>
            <CardTitle>Comentários e Recomendações</CardTitle>
            <CardDescription>
              Adicione observações profissionais para o proprietário
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='comentarios'>Comentários</Label>
              <Textarea
                id='comentarios'
                placeholder='Adicione comentários sobre a avaliação...'
                rows={4}
                {...register('comentarios')}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='recomendacoes'>
                Recomendações Profissionais
              </Label>
              <Textarea
                id='recomendacoes'
                placeholder='Adicione recomendações técnicas para melhoria do sistema...'
                rows={4}
                {...register('recomendacoes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className='flex gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() =>
              router.push(`/propriedades/${propertyId}/areas/${areaId}`)
            }
            className='flex-1'>
            Cancelar
          </Button>
          <Button type='submit' disabled={loading} className='flex-1'>
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <>
                <Save className='w-4 h-4 mr-2' />
                Salvar Avaliação
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
