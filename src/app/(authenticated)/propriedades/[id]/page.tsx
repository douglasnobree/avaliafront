'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, Loader2, Plus, Calendar, BarChart3, Pencil, Trash2 } from 'lucide-react';
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

interface Area {
  id: string;
  indentificacao: string;
  area_ha: number;
  propriedade_id: string;
  ultimaAvaliacao?: {
    data: string;
    cud: number;
    cuc: number;
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
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
      setProperty(propertyResponse.data);

      // Carrega áreas (unidades avaliadas) da propriedade
      const areasResponse = await api.get(`/areas/property/${propertyId}`);
      setAreas(areasResponse.data);
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
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header com info da propriedade */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{property.nome}</h1>
          <div className='flex items-center gap-2 text-muted-foreground mt-2'>
            <MapPin className='w-4 h-4' />
            <span>
              {property.municipio} - {property.estado}
            </span>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => router.push(`/propriedades/${propertyId}/editar`)}
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
          <Button onClick={() => router.push('/propriedades')}>Voltar</Button>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Propriedade"
        description="Tem certeza que deseja excluir esta propriedade? Esta ação é irreversível e todos os dados associados serão perdidos permanentemente."
        itemName={property.nome}
      />

      {/* Cards com informações da propriedade */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Proprietário</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <p className='text-sm text-muted-foreground'>Nome</p>
              <p className='font-medium'>{property.proprietario}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Telefone</p>
              <p className='font-medium'>{property.telefone}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Email</p>
              <p className='font-medium'>{property.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados da Propriedade</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <p className='text-sm text-muted-foreground'>Área Total</p>
              <p className='font-medium'>{property.area_total} ha</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Área Irrigada</p>
              <p className='font-medium'>{property.area_irrigada} ha</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Coordenadas</p>
              <p className='font-medium'>
                {property.latitude}, {property.longitude}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {property.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>{property.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Áreas da Fazenda */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Áreas da {property.nome}</CardTitle>
              <CardDescription className='mt-2'>
                Gerencie as áreas de cultivo e irrigação da propriedade
              </CardDescription>
            </div>
            <Link href={`/propriedades/${property.id}/criar-area`}>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Nova Área
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {areas.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <BarChart3 className='w-12 h-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                Nenhuma área cadastrada
              </h3>
              <p className='text-muted-foreground mb-4'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {areas.map((area) => (
                <Card
                  key={area.id}
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() =>
                    router.push(
                      `/propriedades/${property.id}/areas/${area.id}`
                    )
                  }>
                  <CardHeader>
                    <CardTitle className='text-lg'>
                      {area.indentificacao}
                    </CardTitle>
                    <CardDescription>{area.area_ha} ha</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {area.ultimaAvaliacao ? (
                      <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2 text-muted-foreground'>
                          <Calendar className='w-4 h-4' />
                          <span>
                            Última avaliação:{' '}
                            {new Date(
                              area.ultimaAvaliacao.data
                            ).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className='grid grid-cols-2 gap-2 mt-3'>
                          <div className='p-2 bg-secondary rounded-md'>
                            <p className='text-xs text-muted-foreground'>
                              CUD
                            </p>
                            <p className='font-semibold'>
                              {area.ultimaAvaliacao.cud.toFixed(1)}%
                            </p>
                          </div>
                          <div className='p-2 bg-secondary rounded-md'>
                            <p className='text-xs text-muted-foreground'>
                              CUC
                            </p>
                            <p className='font-semibold'>
                              {area.ultimaAvaliacao.cuc.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className='text-sm text-muted-foreground'>
                        Nenhuma avaliação realizada
                      </p>
                    )}
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
