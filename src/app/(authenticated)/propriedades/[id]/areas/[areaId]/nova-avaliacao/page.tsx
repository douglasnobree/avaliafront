'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MeasurementGrid } from '@/components/measurement-grid';
import api from '@/lib/api';
import { useSession } from '@/lib/auth-client';

const novaAvaliacaoSchema = z.object({
  comentarios: z.string().optional(),
  recomendacoes: z.string().optional(),
});

type NovaAvaliacaoFormData = z.infer<typeof novaAvaliacaoSchema>;

export default function NovaAvaliacaoPage() {
  const [loading, setLoading] = useState(false);
  const [areaInfo, setAreaInfo] = useState<any>(null);
  const [gridPoints, setGridPoints] = useState<any[]>([]);
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NovaAvaliacaoFormData>({
    resolver: zodResolver(novaAvaliacaoSchema),
    defaultValues: {
      comentarios: '',
      recomendacoes: '',
    },
  });

  // Buscar informações da área
  useEffect(() => {
    const fetchAreaInfo = async () => {
      try {
        const response = await api.get(`/areas/${areaId}`);
        setAreaInfo(response.data);
      } catch (error) {
        console.error('Erro ao buscar área:', error);
        toast.error('Erro ao carregar informações da área');
      }
    };

    if (areaId) {
      fetchAreaInfo();
    }
  }, [areaId]);

  const onSubmit = async (data: NovaAvaliacaoFormData) => {
    if (!session?.user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    // Validar que todos os pontos foram medidos
    const pontosMedidos = gridPoints.filter(p => p.medido);
    if (pontosMedidos.length === 0) {
      toast.error('Marque e meça pelo menos um ponto no grid');
      return;
    }

    setLoading(true);

    try {
      // Usar médias das vazões de cada ponto
      const vazoes = pontosMedidos
        .filter(p => p.mediaVazao && p.mediaVazao > 0)
        .map(p => p.mediaVazao!);
      
      if (vazoes.length === 0) {
        toast.error('Nenhuma vazão válida foi medida');
        setLoading(false);
        return;
      }

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

      // Calcular total de volume e tempo somando todas as repetições
      const totalVolume = pontosMedidos.reduce(
        (sum, p) => sum + p.repeticoes.reduce((s: number, r: any) => s + r.volume, 0),
        0
      );
      const totalTempo = pontosMedidos.reduce(
        (sum, p) => sum + p.repeticoes.reduce((s: number, r: any) => s + r.tempo, 0),
        0
      );

      // Criar um ponto de avaliação para cada repetição
      const pontos: any[] = [];
      let sequencia = 1;
      
      pontosMedidos.forEach((p) => {
        p.repeticoes.forEach((rep: any) => {
          pontos.push({
            sequencia: sequencia++,
            eixo_x: p.emissor - 1,
            eixo_y: p.linha - 1,
            distancia: (p.emissor - 1) * 10,
            diametro_coletor: 100,
            volume_ml: rep.volume,
            tempo_seg: rep.tempo,
            vazao_l_h: rep.vazao,
          });
        });
      });

      const avaliacaoData = {
        unidade_id: areaId,
        area_irrigada: areaInfo?.area_ha || 0,
        volume_agua: totalVolume,
        tempo_irrigacao: totalTempo,
        cud: Math.min(100, Math.max(0, cud)),
        cuc: Math.min(100, Math.max(0, cuc)),
        offline_status: false,
        unidade_type: 'SETOR_HIDRAULICO',
        pontos: pontos,
        comentarios: data.comentarios || undefined,
        recomendacoes: data.recomendacoes || undefined,
      };

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
              <Label>Área Irrigada (hectares)</Label>
              <div className='p-3 bg-secondary rounded-md'>
                <p className='text-lg font-semibold text-green-600'>
                  {areaInfo?.area_ha || 0} ha
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  Área cadastrada para esta unidade avaliada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Visual de Pontos de Medição */}
        <MeasurementGrid
          onGridChange={setGridPoints}
        />

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
