'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

const propriedadeSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  proprietario: z.string().min(3, 'O nome do proprietário deve ter pelo menos 3 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  municipio: z.string().min(2, 'Município é obrigatório'),
  estado: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  latitude: z.string().min(1, 'Latitude é obrigatória'),
  longitude: z.string().min(1, 'Longitude é obrigatória'),
  area_total: z.string().min(1, 'Área total é obrigatória'),
  area_irrigada: z.string().min(1, 'Área irrigada é obrigatória'),
  observacoes: z.string().optional(),
});

type PropriedadeFormData = z.infer<typeof propriedadeSchema>;

export default function EditarPropriedadePage() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropriedadeFormData>({
    resolver: zodResolver(propriedadeSchema),
  });

  useEffect(() => {
    loadPropertyData();
  }, []);

  const loadPropertyData = async () => {
    try {
      const response = await api.get(`/property/${propertyId}`);
      const data = response.data;
      
      reset({
        nome: data.nome,
        proprietario: data.proprietario,
        telefone: data.telefone,
        email: data.email,
        municipio: data.municipio,
        estado: data.estado,
        latitude: data.latitude.toString(),
        longitude: data.longitude.toString(),
        area_total: data.area_total.toString(),
        area_irrigada: data.area_irrigada.toString(),
        observacoes: data.observacoes || '',
      });
    } catch (error: any) {
      console.error('Erro ao carregar propriedade:', error);
      toast.error('Erro ao carregar dados da propriedade');
      router.push('/propriedades');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: PropriedadeFormData) => {
    setLoading(true);

    try {
      const propertyData = {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        area_total: parseFloat(data.area_total),
        area_irrigada: parseFloat(data.area_irrigada),
      };

      await api.patch(`/property/${propertyId}`, propertyData);

      toast.success('Propriedade atualizada com sucesso!');
      router.push(`/propriedades/${propertyId}`);
    } catch (error: any) {
      console.error('Erro ao atualizar propriedade:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar propriedade'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Propriedade</h1>
        <p className="text-muted-foreground mt-2">
          Atualize os dados da propriedade
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados gerais da propriedade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Propriedade *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Fazenda Santa Clara"
                  {...register('nome')}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proprietario">Proprietário *</Label>
                <Input
                  id="proprietario"
                  placeholder="Nome do proprietário"
                  {...register('proprietario')}
                />
                {errors.proprietario && (
                  <p className="text-sm text-red-500">{errors.proprietario.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  {...register('telefone')}
                />
                {errors.telefone && (
                  <p className="text-sm text-red-500">{errors.telefone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="municipio">Município *</Label>
                <Input
                  id="municipio"
                  placeholder="Ex: Piracicaba"
                  {...register('municipio')}
                />
                {errors.municipio && (
                  <p className="text-sm text-red-500">{errors.municipio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado (UF) *</Label>
                <Input
                  id="estado"
                  placeholder="Ex: SP"
                  maxLength={2}
                  {...register('estado')}
                />
                {errors.estado && (
                  <p className="text-sm text-red-500">{errors.estado.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="Ex: -22.7089"
                  {...register('latitude')}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="Ex: -47.6484"
                  {...register('longitude')}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Áreas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area_total">Área Total (ha) *</Label>
                <Input
                  id="area_total"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100.5"
                  {...register('area_total')}
                />
                {errors.area_total && (
                  <p className="text-sm text-red-500">{errors.area_total.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_irrigada">Área Irrigada (ha) *</Label>
                <Input
                  id="area_irrigada"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 50.25"
                  {...register('area_irrigada')}
                />
                {errors.area_irrigada && (
                  <p className="text-sm text-red-500">{errors.area_irrigada.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre a propriedade"
                rows={4}
                {...register('observacoes')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/propriedades/${propertyId}`)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
