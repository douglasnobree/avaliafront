'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient, useSession } from '@/lib/auth-client';
import api from '@/lib/api';

// Schema de validação
const createPropertySchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  proprietario: z.string().min(3, 'O nome do proprietário é obrigatório'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  municipio: z.string().min(2, 'Município é obrigatório'),
  estado: z.string().length(2, 'Use a sigla do estado (ex: SP)').toUpperCase(),
  latitude: z.string().min(1, 'Latitude é obrigatória'),
  longitude: z.string().min(1, 'Longitude é obrigatória'),
  area_total: z.string().min(1, 'Área total é obrigatória'),
  area_irrigada: z.string().min(1, 'Área irrigada é obrigatória'),
  observacoes: z.string().optional(),
});

type CreatePropertyFormData = z.infer<typeof createPropertySchema>;

export default function CreatePropertyPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { data: organization } = authClient.useActiveOrganization();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      estado: '',
    },
  });

  const onSubmit = async (data: CreatePropertyFormData) => {
    if (!session?.user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!organization?.id) {
      toast.error('Nenhuma organização ativa');
      return;
    }

    setLoading(true);

    try {
      const propertyData = {
        nome: data.nome,
        proprietario: data.proprietario,
        telefone: data.telefone,
        email: data.email,
        municipio: data.municipio,
        estado: data.estado.toUpperCase(),
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        area_total: parseFloat(data.area_total),
        area_irrigada: parseFloat(data.area_irrigada),
        observacoes: data.observacoes || '',
        userId: session.user.id,
        organizationId: organization.id,
      };

      const response = await api.post('/property', propertyData);

      if (response.data) {
        toast.success('Propriedade criada com sucesso!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro ao criar propriedade:', error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Erro ao criar propriedade'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Criar Propriedade</h1>
        <p className='text-muted-foreground mt-2'>
          Cadastre sua primeira propriedade para começar a usar o sistema
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais da propriedade</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='nome'>Nome da Propriedade *</Label>
                <Input
                  id='nome'
                  type='text'
                  placeholder='Ex: Fazenda Santa Maria'
                  {...register('nome')}
                />
                {errors.nome && (
                  <p className='text-sm text-red-500'>{errors.nome.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='proprietario'>Proprietário *</Label>
                <Input
                  id='proprietario'
                  type='text'
                  placeholder='Nome do proprietário'
                  {...register('proprietario')}
                />
                {errors.proprietario && (
                  <p className='text-sm text-red-500'>
                    {errors.proprietario.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='telefone'>Telefone *</Label>
                <Input
                  id='telefone'
                  type='tel'
                  placeholder='(00) 00000-0000'
                  {...register('telefone')}
                />
                {errors.telefone && (
                  <p className='text-sm text-red-500'>
                    {errors.telefone.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='contato@exemplo.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle>Localização</CardTitle>
            <CardDescription>
              Endereço e coordenadas da propriedade
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-2 space-y-2'>
                <Label htmlFor='municipio'>Município *</Label>
                <Input
                  id='municipio'
                  type='text'
                  placeholder='Ex: São Paulo'
                  {...register('municipio')}
                />
                {errors.municipio && (
                  <p className='text-sm text-red-500'>
                    {errors.municipio.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='estado'>Estado (UF) *</Label>
                <Input
                  id='estado'
                  type='text'
                  placeholder='Ex: SP'
                  maxLength={2}
                  {...register('estado')}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    register('estado').onChange(e);
                  }}
                />
                {errors.estado && (
                  <p className='text-sm text-red-500'>
                    {errors.estado.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='latitude'>Latitude *</Label>
                <Input
                  id='latitude'
                  type='number'
                  step='any'
                  placeholder='Ex: -23.550520'
                  {...register('latitude')}
                />
                {errors.latitude && (
                  <p className='text-sm text-red-500'>
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='longitude'>Longitude *</Label>
                <Input
                  id='longitude'
                  type='number'
                  step='any'
                  placeholder='Ex: -46.633308'
                  {...register('longitude')}
                />
                {errors.longitude && (
                  <p className='text-sm text-red-500'>
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Áreas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Área</CardTitle>
            <CardDescription>
              Medidas da propriedade em hectares
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='area_total'>Área Total (ha) *</Label>
                <Input
                  id='area_total'
                  type='number'
                  step='0.01'
                  placeholder='Ex: 100.50'
                  {...register('area_total')}
                />
                {errors.area_total && (
                  <p className='text-sm text-red-500'>
                    {errors.area_total.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='area_irrigada'>Área Irrigada (ha) *</Label>
                <Input
                  id='area_irrigada'
                  type='number'
                  step='0.01'
                  placeholder='Ex: 50.25'
                  {...register('area_irrigada')}
                />
                {errors.area_irrigada && (
                  <p className='text-sm text-red-500'>
                    {errors.area_irrigada.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>Informações adicionais (opcional)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label htmlFor='observacoes'>Observações</Label>
              <textarea
                id='observacoes'
                rows={4}
                placeholder='Adicione informações complementares sobre a propriedade...'
                className='w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                {...register('observacoes')}
              />
              {errors.observacoes && (
                <p className='text-sm text-red-500'>
                  {errors.observacoes.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className='flex gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/dashboard')}
            disabled={loading}
            className='flex-1'>
            Pular por enquanto
          </Button>
          <Button type='submit' disabled={loading} className='flex-1'>
            {loading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              'Criar Propriedade'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
