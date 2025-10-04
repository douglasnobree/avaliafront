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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

const areaSchema = z.object({
  indentificacao: z.string().min(3, 'A identificação deve ter pelo menos 3 caracteres'),
  area_ha: z.string().min(1, 'A área é obrigatória'),
});

type AreaFormData = z.infer<typeof areaSchema>;

export default function EditarAreaPage() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const areaId = params?.areaId as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
  });

  useEffect(() => {
    loadAreaData();
  }, []);

  const loadAreaData = async () => {
    try {
      const response = await api.get(`/areas/${areaId}`);
      const data = response.data;
      
      reset({
        indentificacao: data.indentificacao,
        area_ha: data.area_ha.toString(),
      });
    } catch (error: any) {
      console.error('Erro ao carregar área:', error);
      toast.error('Erro ao carregar dados da área');
      router.push(`/propriedades/${propertyId}`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: AreaFormData) => {
    setLoading(true);

    try {
      await api.patch(`/areas/${areaId}`, {
        indentificacao: data.indentificacao,
        area_ha: parseFloat(data.area_ha),
      });

      toast.success('Área atualizada com sucesso!');
      router.push(`/propriedades/${propertyId}/areas/${areaId}`);
    } catch (error: any) {
      console.error('Erro ao atualizar área:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar área'
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Área</h1>
        <p className="text-muted-foreground mt-2">
          Atualize os dados da área
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Área</CardTitle>
            <CardDescription>Dados básicos da área de irrigação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="indentificacao">Identificação *</Label>
              <Input
                id="indentificacao"
                placeholder="Ex: Setor 1 - Banana"
                {...register('indentificacao')}
              />
              {errors.indentificacao && (
                <p className="text-sm text-red-500">{errors.indentificacao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area_ha">Área (hectares) *</Label>
              <Input
                id="area_ha"
                type="number"
                step="0.01"
                placeholder="Ex: 10.5"
                {...register('area_ha')}
              />
              {errors.area_ha && (
                <p className="text-sm text-red-500">{errors.area_ha.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/propriedades/${propertyId}/areas/${areaId}`)}
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
