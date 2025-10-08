'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  MapPin,
  Loader2,
  Plus,
  Calendar,
  BarChart3,
  Pencil,
  Trash2,
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

interface Property {
  id: string;
  nome: string;
  proprietario: string;
  telefone: string;
  email: string;
  municipio: string;
  estado: string;
  latitude: number;
  longitude: number;
  area_total: number;
  area_irrigada: number;
  observacoes?: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
}

interface SetorHidraulico {
  id: string;
  identificacao: string;
  fabricante: string;
  modelo: string;
  vazao_nominal: number;
  pressao_trabalho: number;
  dist_emissores: number;
  dist_laterais: number;
  filtro_tipo: string;
  malha_filtro: string;
  valvula_tipo: string;
  energia_tipo: string;
  condicoes_gerais: string;
  freq_manutencao: string;
  data_ultima_manutencao: string;
  emissor_type: string;
  tipo_setor: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  ultimasAvaliacoes: any[];
  totalAvaliacoes: number;
  totalPontos: number;
}

interface PivoCentral {
  id: string;
  identificacao: string;
  // Adicionar outras propriedades conforme necessário
}

interface AreasResponse {
  propriedadeId: string;
  propriedadeNome: string;
  setores_hidraulicos: SetorHidraulico[];
  pivo_centrais: PivoCentral[];
  totalSetores: number;
  totalPivos: number;
  totalAreas: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [areasData, setAreasData] = useState<AreasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const propertyId = params?.id as string;

  useEffect(() => {
    loadPropertyAndAreas();
  }, [propertyId]);

  const loadPropertyAndAreas = async () => {
    try {
      // Carrega dados da propriedade
      const propertyResponse = await api.get(`/property/${propertyId}`);
      const propertyData = propertyResponse.data?.data || propertyResponse.data;
      setProperty(propertyData);

      // Carrega áreas (unidades avaliadas) da propriedade
    const areasResponse = await api.get(`/areas/property/${propertyId}`);
      const responseData = areasResponse.data?.data || areasResponse.data;
      setAreasData(responseData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da propriedade');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/property/${propertyId}`);
      toast.success('Propriedade excluída com sucesso!');
      router.push('/propriedades');
    } catch (error: any) {
      console.error('Erro ao excluir propriedade:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao excluir propriedade'
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!property) {
    return (
      <div className='max-w-6xl mx-auto space-y-6'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <p className='text-muted-foreground'>Propriedade não encontrada</p>
            <Button
              onClick={() => router.push('/propriedades')}
              className='mt-4'>
              Voltar para propriedades
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0'>
      {/* Header com info da propriedade */}
      <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <h1 className='text-2xl md:text-3xl font-bold truncate'>
            {property.nome}
          </h1>
          <div className='flex items-center gap-2 text-muted-foreground mt-2'>
            <MapPin className='w-4 h-4 flex-shrink-0' />
            <span className='text-sm md:text-base truncate'>
              {property.municipio} - {property.estado}
            </span>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2'>
          <Button
            variant='outline'
            onClick={() => router.push(`/propriedades/${propertyId}/editar`)}
            className='w-full sm:w-auto'>
            <Pencil className='w-4 h-4 mr-2' />
            Editar
          </Button>
          <Button
            variant='destructive'
            onClick={() => setDeleteDialogOpen(true)}
            className='w-full sm:w-auto'>
            <Trash2 className='w-4 h-4 mr-2' />
            Excluir
          </Button>
          <Button
            onClick={() => router.push('/propriedades')}
            className='w-full sm:w-auto'>
            Voltar
          </Button>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title='Excluir Propriedade'
        description='Tem certeza que deseja excluir esta propriedade? Esta ação é irreversível e todos os dados associados serão perdidos permanentemente.'
        itemName={property.nome}
      />

      {/* Cards com informações da propriedade */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
        <Card>
          <CardHeader className='p-4 md:p-6'>
            <CardTitle className='text-base md:text-lg'>
              Informações do Proprietário
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 p-4 pt-0 md:p-6 md:pt-0'>
            <div>
              <p className='text-xs md:text-sm text-muted-foreground'>Nome</p>
              <p className='font-medium text-sm md:text-base break-words'>
                {property.proprietario}
              </p>
            </div>
            <div>
              <p className='text-xs md:text-sm text-muted-foreground'>
                Telefone
              </p>
              <p className='font-medium text-sm md:text-base'>
                {property.telefone}
              </p>
            </div>
            <div>
              <p className='text-xs md:text-sm text-muted-foreground'>Email</p>
              <p className='font-medium text-sm md:text-base break-all'>
                {property.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='p-4 md:p-6'>
            <CardTitle className='text-base md:text-lg'>
              Dados da Propriedade
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 p-4 pt-0 md:p-6 md:pt-0'>
            <div>
              <p className='text-xs md:text-sm text-muted-foreground'>
                Área Total
              </p>
              <p className='font-medium text-sm md:text-base'>
                {property.area_total} ha
              </p>
            </div>
            <div>
              <p className='text-xs md:text-sm text-muted-foreground'>
                Área Irrigada
              </p>
              <p className='font-medium text-sm md:text-base'>
                {property.area_irrigada} ha
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {property.observacoes && (
        <Card>
          <CardHeader className='p-4 md:p-6'>
            <CardTitle className='text-base md:text-lg'>Observações</CardTitle>
          </CardHeader>
          <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
            <p className='text-sm md:text-base text-muted-foreground'>
              {property.observacoes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Áreas da Fazenda */}
      <Card>
        <CardHeader className='p-4 md:p-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              <CardTitle className='text-base md:text-lg truncate'>
                Áreas da {property.nome}
              </CardTitle>
              <CardDescription className='mt-2 text-xs md:text-sm'>
                {areasData ? (
                  <>
                    {areasData.totalSetores} setores hidráulicos e{' '}
                    {areasData.totalPivos} pivôs centrais
                  </>
                ) : (
                  'Gerencie as áreas de cultivo e irrigação da propriedade'
                )}
              </CardDescription>
            </div>
            <Link
              href={`/propriedades/${property.id}/criar-area`}
              className='w-full md:w-auto'>
              <Button className='w-full md:w-auto'>
                <Plus className='w-4 h-4 mr-2' />
                Nova Área
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
          {!areasData ||
          (areasData.setores_hidraulicos.length === 0 &&
            areasData.pivo_centrais.length === 0) ? (
            <div className='flex flex-col items-center justify-center py-8 md:py-12 text-center px-4'>
              <BarChart3 className='w-10 h-10 md:w-12 md:h-12 text-muted-foreground mb-4' />
              <h3 className='text-base md:text-lg font-semibold mb-2'>
                Nenhuma área cadastrada
              </h3>
              <p className='text-sm md:text-base text-muted-foreground mb-4'>
                Comece cadastrando a primeira área desta propriedade
              </p>
              <Link href={`/propriedades/${property.id}/criar-area`}>
                <Button>
                  <Plus className='w-4 h-4 mr-2' />
                  Cadastrar Área
                </Button>
              </Link>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Setores Hidráulicos */}
              {areasData.setores_hidraulicos.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    Setores Hidráulicos ({areasData.setores_hidraulicos.length})
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {areasData.setores_hidraulicos.map((setor) => (
                      <Card
                        key={setor.id}
                        className='cursor-pointer hover:shadow-md transition-shadow'
                        onClick={() =>
                          router.push(
                            `/propriedades/${property.id}/areas/${setor.id}?tipo=setor_hidraulico`
                          )
                        }>
                        <CardHeader>
                          <CardTitle className='text-lg'>
                            {setor.identificacao}
                          </CardTitle>
                          <CardDescription>
                            {setor.fabricante} - {setor.modelo}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className='space-y-2 text-sm'>
                            <div className='grid grid-cols-2 gap-2'>
                              <div className='p-2 bg-secondary rounded-md'>
                                <p className='text-xs text-muted-foreground'>
                                  Vazão
                                </p>
                                <p className='font-semibold'>
                                  {setor.vazao_nominal} L/h
                                </p>
                              </div>
                              <div className='p-2 bg-secondary rounded-md'>
                                <p className='text-xs text-muted-foreground'>
                                  Pressão
                                </p>
                                <p className='font-semibold'>
                                  {setor.pressao_trabalho} bar
                                </p>
                              </div>
                            </div>
                            <div className='mt-3'>
                              <p className='text-xs text-muted-foreground'>
                                Tipo de Emissor
                              </p>
                              <p className='font-medium'>
                                {setor.emissor_type}
                              </p>
                            </div>
                            {setor.totalAvaliacoes > 0 ? (
                              <div className='mt-3 p-2 bg-green-50 rounded-md border border-green-200'>
                                <p className='text-xs text-green-700'>
                                  {setor.totalAvaliacoes} avaliações realizadas
                                </p>
                              </div>
                            ) : (
                              <div className='mt-3 p-2 bg-orange-50 rounded-md border border-orange-200'>
                                <p className='text-xs text-orange-700'>
                                  Nenhuma avaliação realizada
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Pivôs Centrais */}
              {areasData.pivo_centrais.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    Pivôs Centrais ({areasData.pivo_centrais.length})
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {areasData.pivo_centrais.map((pivo) => (
                      <Card
                        key={pivo.id}
                        className='cursor-pointer hover:shadow-md transition-shadow'
                        onClick={() =>
                          router.push(
                            `/propriedades/${property.id}/areas/${pivo.id}?tipo=pivo_central`
                          )
                        }>
                        <CardHeader>
                          <CardTitle className='text-lg'>
                            {pivo.identificacao}
                          </CardTitle>
                          <CardDescription>Pivô Central</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className='text-sm text-muted-foreground'>
                            Nenhuma avaliação realizada
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
