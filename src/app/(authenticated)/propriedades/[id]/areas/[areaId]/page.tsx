'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Loader2,
  Plus,
  Calendar,
  BarChart3,
  FileText,
  TrendingUp,
  Trash2,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api from '@/lib/api';
import Link from 'next/link';

interface Area {
  id: string;
  indentificacao: string;
  area_ha: number;
  propriedade_id: string;
}

interface Avaliacao {
  id: string;
  data: string;
  area_irrigada: number;
  volume_agua: number;
  tempo_irrigacao: number;
  cud: number;
  cuc: number;
}

export default function AreaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [area, setArea] = useState<Area | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;

  useEffect(() => {
    loadAreaAndAvaliacoes();
  }, [areaId]);

  const loadAreaAndAvaliacoes = async () => {
    try {
      // Carrega dados da área
      const areaResponse = await api.get(`/areas/${areaId}`);
      setArea(areaResponse.data);

      // Carrega avaliações da área
      const avaliacoesResponse = await api.get(`/avaliacoes/area/${areaId}`);
      setAvaliacoes(avaliacoesResponse.data);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da área');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, type: 'cud' | 'cuc') => {
    // CUD e CUC: >= 90% = bom (verde), 80-90% = aceitável (amarelo), < 80% = ruim (vermelho)
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusLabel = (value: number) => {
    if (value >= 90) return 'Bom';
    if (value >= 80) return 'Aceitável';
    return 'Ruim';
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!area) {
    return (
      <div className='max-w-6xl mx-auto space-y-6'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <p className='text-muted-foreground'>Área não encontrada</p>
            <Button
              onClick={() => router.push(`/propriedades/${propertyId}`)}
              className='mt-4'>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDeleteArea = async () => {
    try {
      setDeleting(true);
      await api.delete(`/areas/${areaId}`);
      toast.success('Área excluída com sucesso!');
      router.push(`/propriedades/${propertyId}`);
    } catch (error: any) {
      console.error('Erro ao excluir área:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao excluir área'
      );
      setDeleting(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{area.indentificacao}</h1>
          <p className='text-muted-foreground mt-2'>
            Área: {area.area_ha} hectares
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => router.push(`/propriedades/${propertyId}/areas/${areaId}/editar`)}
          >
            <Pencil className='w-4 h-4 mr-2' />
            Editar
          </Button>
          <Button
            variant='destructive'
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className='w-4 h-4 mr-2' />
            Excluir
          </Button>
          <Button
            variant='outline'
            onClick={() => router.push(`/propriedades/${propertyId}`)}>
            Voltar
          </Button>
          <Link
            href={`/propriedades/${propertyId}/areas/${areaId}/nova-avaliacao`}>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Nova Avaliação
            </Button>
          </Link>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteArea}
        title="Excluir Área"
        description="Tem certeza que deseja excluir esta área? Esta ação é irreversível e todos os dados de avaliações associados serão perdidos permanentemente."
        itemName={area.indentificacao}
      />

      {/* Última Avaliação (se existir) */}
      {avaliacoes.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>
                Última Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4 text-muted-foreground' />
                <p className='font-semibold'>
                  {new Date(avaliacoes[0].data).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>CUD</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${getStatusColor(
                  avaliacoes[0].cud,
                  'cud'
                )}`}>
                {avaliacoes[0].cud.toFixed(1)}%
              </p>
              <p className='text-sm text-muted-foreground'>
                {getStatusLabel(avaliacoes[0].cud)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>CUC</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${getStatusColor(
                  avaliacoes[0].cuc,
                  'cuc'
                )}`}>
                {avaliacoes[0].cuc.toFixed(1)}%
              </p>
              <p className='text-sm text-muted-foreground'>
                {getStatusLabel(avaliacoes[0].cuc)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botão para ver relatórios */}
      {avaliacoes.length > 0 && (
        <Card className='border-2 border-primary/20 hover:border-primary/40 transition-colors'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <BarChart3 className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold'>
                    Ver Relatórios e Análises
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Visualize gráficos comparativos e análises detalhadas
                  </p>
                </div>
              </div>
              <Link
                href={`/propriedades/${propertyId}/areas/${areaId}/relatorios`}>
                <Button size='lg'>
                  <TrendingUp className='w-4 h-4 mr-2' />
                  Ver Relatórios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Avaliações */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Histórico de Avaliações</CardTitle>
              <CardDescription className='mt-2'>
                Todas as avaliações realizadas nesta área
              </CardDescription>
            </div>
            <Link
              href={`/propriedades/${propertyId}/areas/${areaId}/nova-avaliacao`}>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Nova Avaliação
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {avaliacoes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <FileText className='w-12 h-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                Nenhuma avaliação realizada
              </h3>
              <p className='text-muted-foreground mb-4'>
                Comece realizando a primeira avaliação desta área
              </p>
              <Link
                href={`/propriedades/${propertyId}/areas/${areaId}/nova-avaliacao`}>
                <Button>
                  <Plus className='w-4 h-4 mr-2' />
                  Fazer Primeira Avaliação
                </Button>
              </Link>
            </div>
          ) : (
            <div className='space-y-3'>
              {avaliacoes.map((avaliacao) => (
                <Card
                  key={avaliacao.id}
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() =>
                    router.push(
                      `/propriedades/${propertyId}/areas/${areaId}/relatorios/${avaliacao.id}`
                    )
                  }>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-lg bg-secondary flex items-center justify-center'>
                          <Calendar className='w-5 h-5' />
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
                            Área irrigada: {avaliacao.area_irrigada} ha
                          </p>
                        </div>
                      </div>
                      <div className='flex gap-4'>
                        <div className='text-right'>
                          <p className='text-xs text-muted-foreground'>CUD</p>
                          <p
                            className={`font-semibold ${getStatusColor(
                              avaliacao.cud,
                              'cud'
                            )}`}>
                            {avaliacao.cud.toFixed(1)}%
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-xs text-muted-foreground'>CUC</p>
                          <p
                            className={`font-semibold ${getStatusColor(
                              avaliacao.cuc,
                              'cuc'
                            )}`}>
                            {avaliacao.cuc.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
