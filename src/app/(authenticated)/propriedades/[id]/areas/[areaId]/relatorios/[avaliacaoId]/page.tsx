'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;
  const avaliacaoId = params?.avaliacaoId as string;

  useEffect(() => {
    loadAvaliacaoDetalhada();
  }, [avaliacaoId]);

  const loadAvaliacaoDetalhada = async () => {
    try {
      // Mock temporário com dados de exemplo
      const mockPontos = Array.from({ length: 25 }, (_, i) => ({
        vazao_l_h: 45 + Math.random() * 20,
        eixo_x: (i % 5) * 2,
        eixo_y: Math.floor(i / 5) * 2,
      }));

      setAvaliacao({
        id: avaliacaoId,
        data: '2025-10-02',
        area_irrigada: 15.5,
        volume_agua: 12500,
        tempo_irrigacao: 180,
        cud: 90.8,
        cuc: 92.3,
        pontos: mockPontos,
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
  const vazoes = avaliacao.pontos.map((p) => p.vazao_l_h);
  const vazaoMedia = vazoes.reduce((a, b) => a + b, 0) / vazoes.length;
  const vazaoMaxima = Math.max(...vazoes);
  const vazaoMinima = Math.min(...vazoes);
  const vazaoPadrao = Math.sqrt(
    vazoes.reduce((sum, v) => sum + Math.pow(v - vazaoMedia, 2), 0) /
      vazoes.length
  );

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

      {/* Informações Gerais */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Área Irrigada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{avaliacao.area_irrigada} ha</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Volume de Água</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {avaliacao.volume_agua.toLocaleString('pt-BR')} L
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Tempo de Irrigação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {avaliacao.tempo_irrigacao} min
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

      {/* Gráfico 3D de Vazão */}
      <Card>
        <CardHeader>
          <CardTitle>Visualização 3D da Vazão</CardTitle>
          <CardDescription>
            Distribuição espacial da vazão na área irrigada (interativo)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[500px] w-full bg-secondary/20 rounded-lg'>
            <FlowVisualization3D data={avaliacao.pontos} />
          </div>
        </CardContent>
      </Card>

      {/* Análises de Vazão */}
      <Card>
        <CardHeader>
          <CardTitle>Análises de Vazão</CardTitle>
          <CardDescription>
            Estatísticas detalhadas da vazão coletada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <p className='text-sm text-blue-600 font-medium mb-1'>
                Vazão Média
              </p>
              <p className='text-2xl font-bold text-blue-700'>
                {vazaoMedia.toFixed(2)}
              </p>
              <p className='text-xs text-blue-600 mt-1'>L/h</p>
            </div>

            <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4 text-green-600' />
                <p className='text-sm text-green-600 font-medium'>
                  Vazão Máxima
                </p>
              </div>
              <p className='text-2xl font-bold text-green-700 mt-1'>
                {vazaoMaxima.toFixed(2)}
              </p>
              <p className='text-xs text-green-600 mt-1'>L/h</p>
            </div>

            <div className='p-4 bg-red-50 rounded-lg border border-red-200'>
              <div className='flex items-center gap-2'>
                <TrendingDown className='w-4 h-4 text-red-600' />
                <p className='text-sm text-red-600 font-medium'>
                  Vazão Mínima
                </p>
              </div>
              <p className='text-2xl font-bold text-red-700 mt-1'>
                {vazaoMinima.toFixed(2)}
              </p>
              <p className='text-xs text-red-600 mt-1'>L/h</p>
            </div>

            <div className='p-4 bg-purple-50 rounded-lg border border-purple-200'>
              <p className='text-sm text-purple-600 font-medium mb-1'>
                Desvio Padrão
              </p>
              <p className='text-2xl font-bold text-purple-700'>
                {vazaoPadrao.toFixed(2)}
              </p>
              <p className='text-xs text-purple-600 mt-1'>L/h</p>
            </div>
          </div>

          <div className='mt-6 p-4 bg-muted rounded-lg'>
            <h4 className='font-semibold mb-2'>Interpretação</h4>
            <ul className='space-y-1 text-sm text-muted-foreground'>
              <li>
                • <strong>Vazão Média:</strong> Representa a vazão típica do
                sistema
              </li>
              <li>
                • <strong>Desvio Padrão:</strong> Quanto menor, mais uniforme é
                a distribuição
              </li>
              <li>
                • <strong>Variação (Max-Min):</strong>{' '}
                {(vazaoMaxima - vazaoMinima).toFixed(2)} L/h
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
