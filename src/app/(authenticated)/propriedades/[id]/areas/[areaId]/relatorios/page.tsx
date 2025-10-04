'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api from '@/lib/api';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Area {
  id: string;
  identificacao: string;
  area_ha: number;
}

interface Avaliacao {
  id: string;
  data: string;
  cud: number;
  cuc: number;
}

export default function RelatoriosPage() {
  const params = useParams();
  const router = useRouter();
  const [area, setArea] = useState<Area | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;

  useEffect(() => {
    loadData();
  }, [areaId]);

  const loadData = async () => {
    try {
      // Carrega dados da área
      const areaResponse = await api.get(`/areas/${areaId}`);
      setArea(areaResponse.data);

      // Carrega avaliações da área
      const avaliacoesResponse = await api.get(`/avaliacoes/area/${areaId}`);
      setAvaliacoes(avaliacoesResponse.data);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const chartData = avaliacoes.map((avaliacao) => ({
    data: new Date(avaliacao.data).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    }),
    CUD: avaliacao.cud,
    CUC: avaliacao.cuc,
  }));

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>
            Relatórios - {area?.identificacao}
          </h1>
          <p className='text-muted-foreground mt-2'>
            Análise comparativa das avaliações realizadas
          </p>
        </div>
        <Button
          variant='outline'
          onClick={() =>
            router.push(`/propriedades/${propertyId}/areas/${areaId}`)
          }>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Voltar
        </Button>
      </div>

      {/* Gráfico de Barras - CUD por Avaliação */}
      <Card>
        <CardHeader>
          <CardTitle>CUD e CUC por Avaliação</CardTitle>
          <CardDescription>
            Comparação dos coeficientes de uniformidade ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[400px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='data' />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey='CUD' fill='#3b82f6' name='CUD (%)' />
                <Bar dataKey='CUC' fill='#10b981' name='CUC (%)' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatórios Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>
            Selecione uma avaliação para ver o relatório completo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {avaliacoes.map((avaliacao) => (
              <Card
                key={avaliacao.id}
                className='cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/40'
                onClick={() =>
                  router.push(
                    `/propriedades/${propertyId}/areas/${areaId}/relatorios/${avaliacao.id}`
                  )
                }>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                        <Calendar className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='font-semibold'>
                          {new Date(avaliacao.data).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Clique para ver detalhes
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <div className='text-center'>
                        <p className='text-xs text-muted-foreground'>CUD</p>
                        <p className='font-bold text-blue-600'>
                          {avaliacao.cud.toFixed(1)}%
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-xs text-muted-foreground'>CUC</p>
                        <p className='font-bold text-green-600'>
                          {avaliacao.cuc.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
