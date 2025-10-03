'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSession } from '@/lib/auth-client';

export enum UnitModel {
  SETOR_HIDRAULICO = 'SETOR_HIDRAULICO',
  PIVO_CENTRAL = 'PIVO_CENTRAL',
}

export enum EmissorType {
  MICROMICROASPERSOR = 'MICROMICROASPERSOR',
  GOTEJAMENTO = 'GOTEJAMENTO',
}

interface SetorForm {
  fabricante: string;
  modelo: string;
  vazao_nominal: number;
  pressao_trabalho: number;
  pressao_recomendada: number;
  dist_emissores: number;
  dist_laterais: number;
  filtro_tipo: string;
  malha_filtro: string;
  pressao_entrada: number;
  valvula_tipo: string;
  energia_tipo: string;
  condicoes_gerais: string;
  num_emissores: number;
  freq_manutencao: string;
  data_ultima_manutencao: Date;
  emissor_type: EmissorType;
}

export default function SetorPage() {
  const { propertyId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const { register, handleSubmit, reset } = useForm<SetorForm>();

  const { data: setores, isLoading } = useQuery({
    queryKey: ['setores', propertyId],
    queryFn: async () => {
      const res = await api.get(`/hydraulic-sector/my-sectors`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SetorForm) => {
      setLoading(true);
      const userId = session?.user?.id;
      await api.post(`/hydraulic-sector`, { ...data, userId });
      setLoading(false);
    },
    onSuccess: () => {
      toast.success('Setor criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['setores', propertyId] });
      reset();
    },
    onError: () => {
      toast.error('Erro ao criar setor');
      setLoading(false);
    },
  });

  return (
    <div className='max-w-3xl mx-auto py-8 space-y-8'>
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
          >
            <div>
              <Label>Fabricante</Label>
              <Input {...register('fabricante', { required: true })} />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input {...register('modelo', { required: true })} />
            </div>
            <div>
              <Label>Vazão Nominal</Label>
              <Input
                type='number'
                step='any'
                {...register('vazao_nominal', { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Pressão de Trabalho</Label>
              <Input
                type='number'
                step='any'
                {...register('pressao_trabalho', { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Pressão Recomendada</Label>
              <Input
                type='number'
                step='any'
                {...register('pressao_recomendada', { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Distância entre Emissores</Label>
              <Input
                type='number'
                step='any'
                {...register('dist_emissores', { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Distância entre Laterais</Label>
              <Input
                type='number'
                step='any'
                {...register('dist_laterais', { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Tipo de Filtro</Label>
              <Input {...register('filtro_tipo', { required: true })} />
            </div>
            <div>
              <Label>Malha do Filtro</Label>
              <Input {...register('malha_filtro', { required: true })} />
            </div>
            <div>
              <Label>Pressão de Entrada</Label>
              <Input
                type='number'
                step='any'
                {...register('pressao_entrada', { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Tipo de Válvula</Label>
              <Input {...register('valvula_tipo', { required: true })} />
            </div>
            <div>
              <Label>Tipo de Energia</Label>
              <Input {...register('energia_tipo', { required: true })} />
            </div>
            <div>
              <Label>Condições Gerais</Label>
              <Input {...register('condicoes_gerais', { required: true })} />
            </div>
            <div>
              <Label>Número de Emissores</Label>
              <Input
                type='number'
                {...register('num_emissores', { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Frequência de Manutenção</Label>
              <Input {...register('freq_manutencao', { required: true })} />
            </div>
            <div>
              <Label>Data da Última Manutenção</Label>
              <Input
                type='date'
                {...register('data_ultima_manutencao', { required: true, valueAsDate: true })}
              />
            </div>
            <div>
              <Label>Tipo de Emissor</Label>
              <select
                {...register('emissor_type', { required: true })}
                className='w-full border rounded px-2 py-1'
              >
                <option value={EmissorType.MICROMICROASPERSOR}>Micromicroaspersor</option>
                <option value={EmissorType.GOTEJAMENTO}>Gotejamento</option>
              </select>
            </div>
            <div className='md:col-span-2 flex justify-end mt-4'>
              <Button type='submit' disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Setor'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        {isLoading ? (
          <div>Carregando setores...</div>
        ) : setores && setores.length > 0 ? (
          setores.map((setor: any) => (
            <Card key={setor.id} className='border'>
              <CardHeader>
                <CardTitle>
                  {setor.modelo} - {setor.fabricante}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  <div><strong>Tipo:</strong> {setor.tipo_setor}</div>
                  <div><strong>Vazão Nominal:</strong> {setor.vazao_nominal} m³/h</div>
                  <div><strong>Pressão Trabalho:</strong> {setor.pressao_trabalho} kgf/cm²</div>
                  <div><strong>Pressão Recomendada:</strong> {setor.pressao_recomendada} kgf/cm²</div>
                  <div><strong>Dist. Emissores:</strong> {setor.dist_emissores} m</div>
                  <div><strong>Dist. Laterais:</strong> {setor.dist_laterais} m</div>
                  <div><strong>Filtro:</strong> {setor.filtro_tipo} ({setor.malha_filtro})</div>
                  <div><strong>Válvula:</strong> {setor.valvula_tipo}</div>
                  <div><strong>Energia:</strong> {setor.energia_tipo}</div>
                  <div><strong>Condições Gerais:</strong> {setor.condicoes_gerais}</div>
                  <div><strong>Emissores:</strong> {setor.num_emissores}</div>
                  <div><strong>Freq. Manutenção:</strong> {setor.freq_manutencao}</div>
                  <div><strong>Última Manutenção:</strong> {setor.data_ultima_manutencao?.slice(0, 10)}</div>
                  <div><strong>Tipo Emissor:</strong> {setor.emissor_type}</div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div>Nenhum setor cadastrado.</div>
        )}
      </div>
    </div>
  );
}
