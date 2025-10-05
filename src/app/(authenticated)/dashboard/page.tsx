'use client';

import { authClient, useSession } from '@/lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus, Bell, MapPin, BarChart3, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface DashboardStats {
  totalPropriedades: number;
  totalAvaliacoes: number;
  propriedadesRecentes: Array<{
    id: string;
    nome: string;
    createdAt: string;
  }>;
  avaliacoesRecentes: Array<{
    id: string;
    data: string;
    cud: number;
    cuc: number;
    unidade: {
      id: string;
      indentificacao: string;
      propriedade_id: string;
    };
  }>;
}

export default function DashboardPage() {
  api.get('/protected/user');
  const { data: session } = useSession();
  const { data: organization } = authClient.useActiveOrganization();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Buscar apenas as propriedades do usuário logado
      const propriedadesResponse = await api.get('/property/my-properties');
      const propriedadesData = propriedadesResponse.data?.data || propriedadesResponse.data || [];
      const propriedades = Array.isArray(propriedadesData) ? propriedadesData : [];

      // Buscar todas as avaliações de todas as áreas
      let todasAvaliacoes: any[] = [];
      
      for (const propriedade of propriedades) {
        try {
          const areasResponse = await api.get(`/areas/property/${propriedade.id}`);
          const areasData = areasResponse.data?.data || areasResponse.data || [];
          const areas = Array.isArray(areasData) ? areasData : [];
          
          for (const area of areas) {
            try {
              const avaliacoesResponse = await api.get(`/avaliacoes/area/${area.id}`);
              const avaliacoesData = avaliacoesResponse.data?.data || avaliacoesResponse.data || [];
              const avaliacoes = (Array.isArray(avaliacoesData) ? avaliacoesData : []).map((av: any) => ({
                ...av,
                unidade: {
                  id: area.id,
                  indentificacao: area.indentificacao,
                  propriedade_id: propriedade.id,
                },
              }));
              todasAvaliacoes = [...todasAvaliacoes, ...avaliacoes];
            } catch (error) {
              console.error(`Erro ao buscar avaliações da área ${area.id}:`, error);
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar áreas da propriedade ${propriedade.id}:`, error);
        }
      }

      // Ordenar avaliações por data (mais recentes primeiro)
      todasAvaliacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      // Ordenar propriedades por data de criação
      const propriedadesComData = propriedades.map((p: any) => ({
        id: p.id,
        nome: p.nome,
        createdAt: p.createdAt || new Date().toISOString(),
      }));
      propriedadesComData.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setStats({
        totalPropriedades: propriedades.length,
        totalAvaliacoes: todasAvaliacoes.length,
        propriedadesRecentes: propriedadesComData.slice(0, 3),
        avaliacoesRecentes: todasAvaliacoes.slice(0, 5),
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0'>
      {/* Welcome Card */}
      <Card>
        <CardHeader className='p-4 md:p-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-center gap-3 md:gap-4'>
              {session?.user?.image ? (
                <div className='relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0'>
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                  <User className='w-6 h-6 md:w-8 md:h-8 text-primary' />
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <CardTitle className='text-lg md:text-2xl truncate'>
                  Bem-vindo, {session?.user?.name}!
                </CardTitle>
                <CardDescription className='text-xs md:text-sm truncate'>{session?.user?.email}</CardDescription>
                {organization && (
                  <p className='text-xs md:text-sm text-muted-foreground mt-1 truncate'>
                    Organização:{' '}
                    <span className='font-medium'>{organization.name}</span>
                  </p>
                )}
              </div>
            </div>
            <Link href='/criar-propriedade' className='w-full md:w-auto'>
              <Button className='w-full md:w-auto'>
                <Plus className='w-4 h-4 mr-2' />
                Nova Propriedade
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Você está logado no dashboard. Esta é a sua área pessoal.
          </p>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
            <Card>
              <CardHeader className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base md:text-lg'>Propriedades</CardTitle>
                  <MapPin className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
              </CardHeader>
              <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
                <p className='text-2xl md:text-3xl font-bold text-primary'>
                  {stats?.totalPropriedades || 0}
                </p>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {stats?.totalPropriedades === 0
                    ? 'Nenhuma propriedade ainda'
                    : stats?.totalPropriedades === 1
                    ? '1 propriedade cadastrada'
                    : `${stats?.totalPropriedades} propriedades cadastradas`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base md:text-lg'>Avaliações</CardTitle>
                  <BarChart3 className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
              </CardHeader>
              <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
                <p className='text-2xl md:text-3xl font-bold text-primary'>
                  {stats?.totalAvaliacoes || 0}
                </p>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {stats?.totalAvaliacoes === 0
                    ? 'Nenhuma avaliação realizada'
                    : stats?.totalAvaliacoes === 1
                    ? '1 avaliação realizada'
                    : `${stats?.totalAvaliacoes} avaliações realizadas`}
                </p>
              </CardContent>
            </Card>

            <Card className='sm:col-span-2 lg:col-span-1'>
              <CardHeader className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base md:text-lg'>Notificações</CardTitle>
                  <Bell className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
              </CardHeader>
              <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
                <p className='text-2xl md:text-3xl font-bold text-primary'>1</p>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  1 notificação nova
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notificações de Boas-vindas */}
          <Card className='border-l-4 border-l-primary'>
            <CardHeader className='p-4 md:p-6'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                  <Bell className='w-4 h-4 md:w-5 md:h-5 text-primary' />
                </div>
                <div className='min-w-0 flex-1'>
                  <CardTitle className='text-sm md:text-base'>Bem-vindo ao AVAlia!</CardTitle>
                  <CardDescription className='text-xs'>
                    {new Date().toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
              <p className='text-xs md:text-sm text-muted-foreground'>
                🎉 Sua conta foi criada com sucesso! Comece criando propriedades e
                realizando avaliações de irrigação para monitorar a eficiência do seu
                sistema.
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className='p-4 md:p-6'>
              <CardTitle className='text-base md:text-lg'>Atividade Recente</CardTitle>
              <CardDescription className='text-xs md:text-sm'>
                Suas últimas ações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
              {!stats?.avaliacoesRecentes?.length &&
              !stats?.propriedadesRecentes?.length ? (
                <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
                  <Calendar className='w-12 h-12 mb-4 opacity-50' />
                  <p>Nenhuma atividade recente</p>
                  <p className='text-sm mt-2'>
                    Crie uma propriedade para começar
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {/* Avaliações Recentes */}
                  {stats?.avaliacoesRecentes?.map((avaliacao) => (
                    <Link
                      key={avaliacao.id}
                      href={`/propriedades/${avaliacao.unidade.propriedade_id}/areas/${avaliacao.unidade.id}/relatorios/${avaliacao.id}`}
                      className='block'>
                      <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer'>
                        <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                          <CheckCircle2 className='w-5 h-5 text-green-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm'>
                            Nova avaliação realizada
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {avaliacao.unidade.indentificacao} • CUD:{' '}
                            {avaliacao.cud.toFixed(1)}% • CUC:{' '}
                            {avaliacao.cuc.toFixed(1)}%
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            {new Date(avaliacao.data).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Propriedades Recentes */}
                  {stats?.propriedadesRecentes?.map((propriedade) => (
                    <Link
                      key={propriedade.id}
                      href={`/propriedades/${propriedade.id}`}
                      className='block'>
                      <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer'>
                        <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                          <MapPin className='w-5 h-5 text-blue-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm'>
                            Propriedade cadastrada
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {propriedade.nome}
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            {new Date(propriedade.createdAt).toLocaleDateString(
                              'pt-BR',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
