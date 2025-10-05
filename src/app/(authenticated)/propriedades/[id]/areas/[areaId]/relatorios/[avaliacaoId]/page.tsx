'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, TrendingUp, TrendingDown, BarChart3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { MeasurementGrid } from '@/components/measurement-grid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api from '@/lib/api';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente 3D para evitar problemas com SSR
const FlowVisualization3D = dynamic(
  () => import('@/components/flow-visualization-3d'),
  { ssr: false, loading: () => <Loader2 className='w-8 h-8 animate-spin' /> }
);

interface AvaliacaoDetalhada {
  id: string;
  data: string;
  area_irrigada: number;
  volume_agua: number;
  tempo_irrigacao: number;
  cud: number;
  cuc: number;
  pontos: Array<{
    vazao_l_h: number;
    eixo_x: number;
    eixo_y: number;
  }>;
}

export default function RelatorioDetalhadoPage() {
  const params = useParams();
  const router = useRouter();
  const [avaliacao, setAvaliacao] = useState<AvaliacaoDetalhada | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;
  const avaliacaoId = params?.avaliacaoId as string;

  useEffect(() => {
    loadAvaliacaoDetalhada();
  }, [avaliacaoId]);

  const loadAvaliacaoDetalhada = async () => {
    try {
      const response = await api.get(`/avaliacoes/${avaliacaoId}`);
      const data = response.data?.data || response.data;

      console.log('Dados da API:', data);
      console.log('Ponto_localizada:', data.Ponto_localizada);
      console.log('Ponto_pivo:', data.Ponto_pivo);

      // Mapear pontos do backend (pode ser Ponto_localizada ou Ponto_pivo)
      let pontos: any[] = [];
      
      if (data.Ponto_localizada && data.Ponto_localizada.length > 0) {
        pontos = data.Ponto_localizada.map((p: any) => ({
          vazao_l_h: p.vazao_l_h,
          eixo_x: p.eixo_x,
          eixo_y: p.eixo_y,
        }));
      } else if (data.Ponto_pivo && data.Ponto_pivo.length > 0) {
        pontos = data.Ponto_pivo.map((p: any) => ({
          vazao_l_h: p.vazao_l_h,
          eixo_x: p.sequencia,
          eixo_y: 0,
        }));
      }

      console.log('Pontos mapeados:', pontos);

      setAvaliacao({
        id: data.id,
        data: data.data,
        area_irrigada: data.area_irrigada,
        volume_agua: data.volume_agua,
        tempo_irrigacao: data.tempo_irrigacao,
        cud: data.cud,
        cuc: data.cuc,
        pontos,
      });
    } catch (error: any) {
      console.error('Erro ao carregar avaliação:', error);
      toast.error('Erro ao carregar dados da avaliação');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number) => {
    if (value >= 90) return 'bg-green-100 border-green-500 text-green-700';
    if (value >= 80) return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    return 'bg-red-100 border-red-500 text-red-700';
  };

  const getStatusLabel = (value: number) => {
    if (value >= 90) return 'Bom';
    if (value >= 80) return 'Aceitável';
    return 'Ruim';
  };

  const getIndicatorColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className='max-w-6xl mx-auto space-y-6'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <p className='text-muted-foreground'>Avaliação não encontrada</p>
            <Button
              onClick={() =>
                router.push(
                  `/propriedades/${propertyId}/areas/${areaId}/relatorios`
                )
              }
              className='mt-4'>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcular estatísticas de vazão
  const vazoes = avaliacao.pontos?.map((p) => p.vazao_l_h) || [];
  const vazaoMedia = vazoes.length > 0 
    ? vazoes.reduce((a, b) => a + b, 0) / vazoes.length 
    : 0;
  const vazaoMaxima = vazoes.length > 0 ? Math.max(...vazoes) : 0;
  const vazaoMinima = vazoes.length > 0 ? Math.min(...vazoes) : 0;
  const vazaoPadrao = vazoes.length > 0
    ? Math.sqrt(
        vazoes.reduce((sum, v) => sum + Math.pow(v - vazaoMedia, 2), 0) /
          vazoes.length
      )
    : 0;
  const coeficienteVariacao = vazaoMedia > 0 
    ? (vazaoPadrao / vazaoMedia) * 100 
    : 0;

  const handleDeleteAvaliacao = async () => {
    try {
      setDeleting(true);
      await api.delete(`/avaliacoes/${avaliacaoId}`);
      toast.success('Avaliação excluída com sucesso!');
      router.push(`/propriedades/${propertyId}/areas/${areaId}`);
    } catch (error: any) {
      console.error('Erro ao excluir avaliação:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao excluir avaliação'
      );
      setDeleting(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Relatório Detalhado</h1>
          <p className='text-muted-foreground mt-2'>
            Avaliação de{' '}
            {new Date(avaliacao.data).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='destructive'
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className='w-4 h-4 mr-2' />
            Excluir
          </Button>
          <Button
            variant='outline'
            onClick={() =>
              router.push(
                `/propriedades/${propertyId}/areas/${areaId}/relatorios`
              )
            }>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Voltar
          </Button>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteAvaliacao}
        title="Excluir Avaliação"
        description="Tem certeza que deseja excluir esta avaliação? Esta ação é irreversível e todos os dados e medições serão perdidos permanentemente."
        itemName={`Avaliação de ${new Date(avaliacao.data).toLocaleDateString('pt-BR')}`}
      />

      {/* Informações Gerais - REMOVIDOS: área irrigada, volume, tempo */}
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Data da Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {new Date(avaliacao.data).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CUD e CUC */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* CUD */}
        <Card
          className={`border-2 ${getStatusColor(avaliacao.cud)}`}>
          <CardHeader>
            <CardTitle className='text-2xl'>
              CUD - Coeficiente de Uniformidade de Distribuição
            </CardTitle>
            <CardDescription className='text-base'>
              Indica a uniformidade da aplicação de água
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-5xl font-bold'>{avaliacao.cud.toFixed(1)}%</p>
                <p className='text-lg font-semibold mt-2'>
                  {getStatusLabel(avaliacao.cud)}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <div
                  className={`w-16 h-4 rounded ${
                    avaliacao.cud >= 90 ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                <div
                  className={`w-16 h-4 rounded ${
                    avaliacao.cud >= 80 && avaliacao.cud < 90
                      ? 'bg-yellow-500'
                      : 'bg-gray-200'
                  }`}></div>
                <div
                  className={`w-16 h-4 rounded ${
                    avaliacao.cud < 80 ? 'bg-red-500' : 'bg-gray-200'
                  }`}></div>
              </div>
            </div>
            <div className='pt-4 border-t'>
              <p className='text-sm text-muted-foreground'>
                <strong>Bom:</strong> ≥ 90% |{' '}
                <strong>Aceitável:</strong> 80-90% |{' '}
                <strong>Ruim:</strong> &lt; 80%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CUC */}
        <Card
          className={`border-2 ${getStatusColor(avaliacao.cuc)}`}>
          <CardHeader>
            <CardTitle className='text-2xl'>
              CUC - Coeficiente de Uniformidade de Christiansen
            </CardTitle>
            <CardDescription className='text-base'>
              Mede a uniformidade geral do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-5xl font-bold'>{avaliacao.cuc.toFixed(1)}%</p>
                <p className='text-lg font-semibold mt-2'>
                  {getStatusLabel(avaliacao.cuc)}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <div
                  className={`w-16 h-4 rounded ${
                    avaliacao.cuc >= 90 ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                <div
                  className={`w-16 h-4 rounded ${
                    avaliacao.cuc >= 80 && avaliacao.cuc < 90
                      ? 'bg-yellow-500'
                      : 'bg-gray-200'
                  }`}></div>
                <div
                  className={`w-16 h-4 rounded ${
                    avaliacao.cuc < 80 ? 'bg-red-500' : 'bg-gray-200'
                  }`}></div>
              </div>
            </div>
            <div className='pt-4 border-t'>
              <p className='text-sm text-muted-foreground'>
                <strong>Bom:</strong> ≥ 90% |{' '}
                <strong>Aceitável:</strong> 80-90% |{' '}
                <strong>Ruim:</strong> &lt; 80%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Visual dos Pontos Medidos */}
      <MeasurementGrid
        onGridChange={() => {}}
        initialGrid={(() => {
          if (!avaliacao.pontos || avaliacao.pontos.length === 0) return [];
          
          // Agrupar pontos por linha e emissor
          const groupedPoints = new Map<string, any[]>();
          
          avaliacao.pontos.forEach((ponto: any) => {
            const linha = ponto.eixo_y + 1;
            const emissor = ponto.eixo_x + 1;
            const key = `${linha}-${emissor}`;
            
            if (!groupedPoints.has(key)) {
              groupedPoints.set(key, []);
            }
            
            groupedPoints.get(key)!.push({
              id: crypto.randomUUID(),
              volume: ponto.volume_ml,
              tempo: ponto.tempo_seg,
              vazao: ponto.vazao_l_h,
            });
          });
          
          // Converter para formato GridPoint
          const gridPoints: any[] = [];
          groupedPoints.forEach((repeticoes, key) => {
            const [linha, emissor] = key.split('-').map(Number);
            const mediaVazao = repeticoes.reduce((sum, r) => sum + r.vazao, 0) / repeticoes.length;
            
            gridPoints.push({
              linha,
              emissor,
              medido: true,
              repeticoes,
              mediaVazao,
            });
          });
          
          return gridPoints;
        })()}
      />

      {/* Gráfico 3D de Vazão */}
      <Card>
        <CardHeader>
          <CardTitle>Visualização 3D da Vazão</CardTitle>
          <CardDescription>
            Distribuição espacial da vazão na área irrigada (interativo - clique e arraste para rotacionar)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {avaliacao.pontos && avaliacao.pontos.length > 0 ? (
            <div className='h-[500px] w-full bg-secondary/20 rounded-lg overflow-hidden'>
              <FlowVisualization3D data={avaliacao.pontos} />
            </div>
          ) : (
            <div className='h-[500px] w-full bg-secondary/20 rounded-lg flex items-center justify-center'>
              <div className='text-center text-muted-foreground'>
                <p className='text-lg font-semibold mb-2'>Sem dados para visualizar</p>
                <p className='text-sm'>Nenhum ponto de medição foi registrado nesta avaliação</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análises de Vazão */}
      <Card>
        <CardHeader>
          <CardTitle>Análises de Vazão</CardTitle>
          <CardDescription>
            Estatísticas detalhadas dos {avaliacao.pontos?.length || 0} pontos de medição
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vazoes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
              <p>Nenhum ponto de medição encontrado</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800'>
                  <p className='text-sm text-blue-600 dark:text-blue-400 font-medium mb-1'>
                    Vazão Média
                  </p>
                  <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                    {vazaoMedia.toFixed(2)}
                  </p>
                  <p className='text-xs text-blue-600 dark:text-blue-400 mt-1'>L/h</p>
                </div>

                <div className='p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800'>
                  <div className='flex items-center gap-2 mb-1'>
                    <TrendingUp className='w-4 h-4 text-green-600 dark:text-green-400' />
                    <p className='text-sm text-green-600 dark:text-green-400 font-medium'>
                      Vazão Máxima
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-green-700 dark:text-green-300'>
                    {vazaoMaxima.toFixed(2)}
                  </p>
                  <p className='text-xs text-green-600 dark:text-green-400 mt-1'>
                    +{((vazaoMaxima - vazaoMedia) / vazaoMedia * 100).toFixed(1)}% da média
                  </p>
                </div>

                <div className='p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800'>
                  <div className='flex items-center gap-2 mb-1'>
                    <TrendingDown className='w-4 h-4 text-red-600 dark:text-red-400' />
                    <p className='text-sm text-red-600 dark:text-red-400 font-medium'>
                      Vazão Mínima
                    </p>
                  </div>
                  <p className='text-2xl font-bold text-red-700 dark:text-red-300'>
                    {vazaoMinima.toFixed(2)}
                  </p>
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1'>
                    -{((vazaoMedia - vazaoMinima) / vazaoMedia * 100).toFixed(1)}% da média
                  </p>
                </div>

                <div className='p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800'>
                  <p className='text-sm text-purple-600 dark:text-purple-400 font-medium mb-1'>
                    Desvio Padrão
                  </p>
                  <p className='text-2xl font-bold text-purple-700 dark:text-purple-300'>
                    {vazaoPadrao.toFixed(2)}
                  </p>
                  <p className='text-xs text-purple-600 dark:text-purple-400 mt-1'>
                    CV: {coeficienteVariacao.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 bg-muted rounded-lg'>
                  <h4 className='font-semibold mb-3 flex items-center gap-2'>
                    <BarChart3 className='w-4 h-4' />
                    Estatísticas Gerais
                  </h4>
                  <ul className='space-y-2 text-sm'>
                    <li className='flex justify-between'>
                      <span className='text-muted-foreground'>Total de pontos:</span>
                      <span className='font-semibold'>{vazoes.length}</span>
                    </li>
                    <li className='flex justify-between'>
                      <span className='text-muted-foreground'>Amplitude:</span>
                      <span className='font-semibold'>{(vazaoMaxima - vazaoMinima).toFixed(2)} L/h</span>
                    </li>
                    <li className='flex justify-between'>
                      <span className='text-muted-foreground'>Coef. Variação:</span>
                      <span className={`font-semibold ${
                        coeficienteVariacao < 10 ? 'text-green-600' :
                        coeficienteVariacao < 20 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {coeficienteVariacao.toFixed(1)}%
                        {coeficienteVariacao < 10 ? ' (Excelente)' :
                         coeficienteVariacao < 20 ? ' (Bom)' :
                         ' (Precisa Ajuste)'}
                      </span>
                    </li>
                    <li className='flex justify-between'>
                      <span className='text-muted-foreground'>Vazão Total:</span>
                      <span className='font-semibold'>
                        {(vazaoMedia * vazoes.length).toFixed(0)} L/h
                      </span>
                    </li>
                  </ul>
                </div>

                <div className='p-4 bg-muted rounded-lg'>
                  <h4 className='font-semibold mb-3'>📊 Interpretação</h4>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li>
                      • <strong>Vazão Média:</strong> Representa a vazão típica do sistema
                    </li>
                    <li>
                      • <strong>Desvio Padrão:</strong> Quanto menor, mais uniforme é a distribuição
                    </li>
                    <li>
                      • <strong>CV (Coef. Variação):</strong> Ideal &lt; 10%, Bom &lt; 20%
                    </li>
                    <li>
                      • <strong>Amplitude:</strong> Diferença entre maior e menor vazão
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
