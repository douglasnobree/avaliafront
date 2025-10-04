'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  createAreaSchema,
  type CreateAreaFormData,
} from '../../../../../components/createSectors/form-schemas';
import { AreaTypeSelector } from '../../../../../components/createSectors/area-type-selector';
import { SetorHidraulicoForm } from '../../../../../components/createSectors/setor-hidraulico-form';
import { PivoCentralForm } from '../../../../../components/createSectors/pivo-central-form';
import api from '@/lib/api';

// Schema para Setor Hidráulico (Irrigação Localizada)
const setorHidraulicoSchema = z.object({
  tipo_sistema: z.literal('SETOR_HIDRAULICO'),
  indentificacao: z.string().min(3, 'A identificação deve ter pelo menos 3 caracteres'),
  area_ha: z.string().min(1, 'A área é obrigatória'),
  // Dados técnicos do setor
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  emissor_type: z.enum(['MICROMICROASPERSOR', 'GOTEJAMENTO']),
  vazao_nominal: z.string().min(1, 'Vazão nominal é obrigatória'),
  pressao_trabalho: z.string().min(1, 'Pressão de trabalho é obrigatória'),
  dist_emissores: z.string().min(1, 'Distância entre emissores é obrigatória'),
  dist_laterais: z.string().min(1, 'Distância entre laterais é obrigatória'),
  filtro_tipo: z.string().min(1, 'Tipo de filtro é obrigatório'),
  malha_filtro: z.string().min(1, 'Malha do filtro é obrigatória'),
  valvula_tipo: z.string().min(1, 'Tipo de válvula é obrigatório'),
  energia_tipo: z.string().min(1, 'Tipo de energia é obrigatório'),
  condicoes_gerais: z.string().optional(),
  freq_manutencao: z.string().min(1, 'Frequência de manutenção é obrigatória'),
  data_ultima_manutencao: z.string().min(1, 'Data da última manutenção é obrigatória'),
});

// Schema para Pivô Central
const pivoCentralSchema = z.object({
  tipo_sistema: z.literal('PIVO_CENTRAL'),
  indentificacao: z.string().min(3, 'A identificação deve ter pelo menos 3 caracteres'),
  area_ha: z.string().min(1, 'A área é obrigatória'),
  // Dados técnicos do pivô
  num_torres: z.string().min(1, 'Número de torres é obrigatório'),
  comprimento: z.string().min(1, 'Comprimento é obrigatório'),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  emissor_type: z.enum(['MICROMICROASPERSOR', 'GOTEJAMENTO']),
  energia_tipo: z.string().min(1, 'Tipo de energia é obrigatório'),
  potencia_motor: z.string().min(1, 'Potência do motor é obrigatória'),
  vazao_operacao: z.string().min(1, 'Vazão de operação é obrigatória'),
  controle_tipo: z.string().min(1, 'Tipo de controle é obrigatório'),
  fertirrigacao: z.enum(['true', 'false']),
  fonte_hidrica: z.string().min(1, 'Fonte hídrica é obrigatória'),
  tempo_funcionamento: z.string().min(1, 'Tempo de funcionamento é obrigatório'),
  velocidade: z.string().min(1, 'Velocidade é obrigatória'),
  bocal_tipo: z.string().min(1, 'Tipo de bocal é obrigatório'),
  pressao_bocal: z.string().min(1, 'Pressão do bocal é obrigatória'),
  data_ultima_manutencao: z.string().min(1, 'Data da última manutenção é obrigatória'),
  freq_manutencao: z.string().min(1, 'Frequência de manutenção é obrigatória'),
  problemas_observados: z.string().optional(),
  data_ultima_avaliacoes: z.string().min(1, 'Data da última avaliação é obrigatória'),
});

const createAreaSchema = z.discriminatedUnion('tipo_sistema', [
  setorHidraulicoSchema,
  pivoCentralSchema,
]);

type CreateAreaFormData = z.infer<typeof createAreaSchema>;

export default function CreateAreaPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'tipo' | 'dados'>('tipo');
  const [tipo_setor, settipo_setor] = useState<
    'SETOR_HIDRAULICO' | 'PIVO_CENTRAL' | null
  >(null);
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const { data } = useSession();
  const userId = data?.user.id; 
  const form = useForm<CreateAreaFormData>({
    resolver: zodResolver(createAreaSchema),
  });

  const handleSubmit = async (data: CreateAreaFormData) => {
    setLoading(true);
    console.log('Dados do formulário:', data);

    try {
      // Preparar payload baseado no tipo de sistema
      let payload: any = {
        area: {
          indentificacao: data.indentificacao,
          area_ha: parseFloat(data.area_ha),
          propriedade_id: propertyId,
        }
      };

      if (data.tipo_sistema === 'SETOR_HIDRAULICO') {
        payload.setor_hidraulico = {
          fabricante: data.fabricante || undefined,
          modelo: data.modelo || undefined,
          vazao_nominal: parseFloat(data.vazao_nominal),
          pressao_trabalho: parseFloat(data.pressao_trabalho),
          dist_emissores: parseFloat(data.dist_emissores),
          dist_laterais: parseFloat(data.dist_laterais),
          filtro_tipo: data.filtro_tipo,
          malha_filtro: data.malha_filtro,
          valvula_tipo: data.valvula_tipo,
          energia_tipo: data.energia_tipo,
          condicoes_gerais: data.condicoes_gerais || undefined,
          freq_manutencao: data.freq_manutencao,
          data_ultima_manutencao: new Date(data.data_ultima_manutencao).toISOString(),
          emissor_type: data.emissor_type,
          tipo_setor: 'SETOR_HIDRAULICO',
          userId: userId,
        };

        console.log('Payload setor hidráulico:', payload);
        await api.post('/hydraulic-sector', payload);
      } else if (data.tipo_setor === 'PIVO_CENTRAL') {
        payload = {
          ...payload,
          num_torres: parseInt(data.num_torres),
          comprimento: parseFloat(data.comprimento),
          fabricante: data.fabricante || undefined,
          modelo: data.modelo || undefined,
          emissor_type: data.emissor_type,
          energia_tipo: data.energia_tipo,
          potencia_motor: parseFloat(data.potencia_motor),
          vazao_operacao: parseFloat(data.vazao_operacao),
          controle_tipo: data.controle_tipo,
          fertirrigacao: data.fertirrigacao === 'true',
          fonte_hidrica: data.fonte_hidrica,
          tempo_funcionamento: parseFloat(data.tempo_funcionamento),
          velocidade: parseFloat(data.velocidade),
          bocal_tipo: data.bocal_tipo,
          pressao_bocal: parseFloat(data.pressao_bocal),
          data_ultima_avaliacoes: new Date(
            data.data_ultima_avaliacoes
          ).toISOString(),
          problemas_observados: data.problemas_observados || '',
        };
      }

      await api.post('/areas', payload);

      toast.success('Área criada com sucesso!');
      router.push(`/propriedades/${propertyId}`);
    } catch (error: any) {
      console.error('Erro ao criar área:', error);
      toast.error(error?.response?.data?.message || 'Erro ao criar área');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTipo = (tipo: 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL') => {
    settipo_setor(tipo);
    form.setValue('tipo_setor', tipo);
    form.setValue('propriedade_id', propertyId);
    setStep('dados');
  };

  // Etapa 1: Escolher tipo de sistema
  if (step === 'tipo') {
    return (
      <AreaTypeSelector
        onSelectTipo={handleSelectTipo}
        onBack={() => router.push(`/propriedades/${propertyId}`)}
      />
    );
  }

  // Etapa 2: Formulário de dados
  const Form =
    tipo_setor === 'SETOR_HIDRAULICO' ? SetorHidraulicoForm : PivoCentralForm;

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>
          {tipo_setor === 'SETOR_HIDRAULICO'
            ? 'Setor Hidráulico'
            : 'Pivô Central'}
        </h1>
        <p className='text-muted-foreground mt-2'>
          Preencha os dados técnicos do sistema de irrigação
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='indentificacao'>Identificação do Sistema *</Label>
                <Input
                  id='indentificacao'
                  type='text'
                  placeholder={tipoSistema === 'SETOR_HIDRAULICO' ? 'Ex: Setor 1 - Bananal' : 'Ex: Pivô 01 - Milho Leste'}
                  {...register('indentificacao')}
                />
                {errors.indentificacao && (
                  <p className='text-sm text-red-500'>{errors.indentificacao.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='area_ha'>Área (hectares) *</Label>
                <Input
                  id='area_ha'
                  type='number'
                  step='0.01'
                  placeholder='Ex: 10.5'
                  {...register('area_ha')}
                />
                {errors.area_ha && (
                  <p className='text-sm text-red-500'>{errors.area_ha.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Técnicos - Setor Hidráulico */}
        {tipoSistemaWatch === 'SETOR_HIDRAULICO' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Emissores</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Tipo de Emissor *</Label>
                    <Controller
                      name='emissor_type'
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='GOTEJAMENTO'>Gotejador</SelectItem>
                            <SelectItem value='MICROMICROASPERSOR'>Microaspersor</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.emissor_type && (
                      <p className='text-sm text-red-500'>{errors.emissor_type.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='fabricante'>Fabricante do Emissor (Opcional)</Label>
                    <Input
                      id='fabricante'
                      type='text'
                      placeholder='Ex: Netafim, Naandanjain'
                      {...register('fabricante')}
                    />
                    {errors.fabricante && (
                      <p className='text-sm text-red-500'>{errors.fabricante.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='modelo'>Modelo do Emissor (Opcional)</Label>
                    <Input
                      id='modelo'
                      type='text'
                      placeholder='Ex: UniRam'
                      {...register('modelo')}
                    />
                    {errors.modelo && (
                      <p className='text-sm text-red-500'>{errors.modelo.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='vazao_nominal'>Vazão Nominal (L/h) *</Label>
                    <Input
                      id='vazao_nominal'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 2.5'
                      {...register('vazao_nominal')}
                    />
                    {errors.vazao_nominal && (
                      <p className='text-sm text-red-500'>{errors.vazao_nominal.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pressões e Espaçamentos</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='pressao_trabalho'>Pressão de Trabalho (mca) *</Label>
                    <Input
                      id='pressao_trabalho'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 10'
                      {...register('pressao_trabalho')}
                    />
                    {errors.pressao_trabalho && (
                      <p className='text-sm text-red-500'>{errors.pressao_trabalho.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='dist_emissores'>Distância entre Emissores (m) *</Label>
                    <Input
                      id='dist_emissores'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 0.5'
                      {...register('dist_emissores')}
                    />
                    {errors.dist_emissores && (
                      <p className='text-sm text-red-500'>{errors.dist_emissores.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='dist_laterais'>Distância entre Linhas Laterais (m) *</Label>
                    <Input
                      id='dist_laterais'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 1.5'
                      {...register('dist_laterais')}
                    />
                    {errors.dist_laterais && (
                      <p className='text-sm text-red-500'>{errors.dist_laterais.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtragem e Controle</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='filtro_tipo'>Tipo de Filtro *</Label>
                    <Input
                      id='filtro_tipo'
                      type='text'
                      placeholder='Ex: Tela, Disco, Areia'
                      {...register('filtro_tipo')}
                    />
                    {errors.filtro_tipo && (
                      <p className='text-sm text-red-500'>{errors.filtro_tipo.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='malha_filtro'>Malha/Grau de Filtragem *</Label>
                    <Input
                      id='malha_filtro'
                      type='text'
                      placeholder='Ex: 130 mesh, 120 micras'
                      {...register('malha_filtro')}
                    />
                    {errors.malha_filtro && (
                      <p className='text-sm text-red-500'>{errors.malha_filtro.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='valvula_tipo'>Tipo de Válvula de Controle *</Label>
                    <Input
                      id='valvula_tipo'
                      type='text'
                      placeholder='Ex: Manual, Elétrica, Hidráulica'
                      {...register('valvula_tipo')}
                    />
                    {errors.valvula_tipo && (
                      <p className='text-sm text-red-500'>{errors.valvula_tipo.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='energia_tipo'>Tipo de Energia *</Label>
                    <Input
                      id='energia_tipo'
                      type='text'
                      placeholder='Ex: Elétrica, Fotovoltaica, Combustível'
                      {...register('energia_tipo')}
                    />
                    {errors.energia_tipo && (
                      <p className='text-sm text-red-500'>{errors.energia_tipo.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manutenção e Observações</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='freq_manutencao'>Frequência de Manutenção *</Label>
                    <Input
                      id='freq_manutencao'
                      type='text'
                      placeholder='Ex: Semanal, Quinzenal, Mensal'
                      {...register('freq_manutencao')}
                    />
                    {errors.freq_manutencao && (
                      <p className='text-sm text-red-500'>{errors.freq_manutencao.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='data_ultima_manutencao'>Data da Última Manutenção *</Label>
                    <Input
                      id='data_ultima_manutencao'
                      type='date'
                      {...register('data_ultima_manutencao')}
                    />
                    {errors.data_ultima_manutencao && (
                      <p className='text-sm text-red-500'>{errors.data_ultima_manutencao.message}</p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='condicoes_gerais'>Condições Gerais do Setor (Opcional)</Label>
                  <Textarea
                    id='condicoes_gerais'
                    placeholder='Descreva as condições gerais, observações sobre manutenção, limpeza, obstruções, etc.'
                    rows={4}
                    {...register('condicoes_gerais')}
                  />
                  {errors.condicoes_gerais && (
                    <p className='text-sm text-red-500'>{errors.condicoes_gerais.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Dados Técnicos - Pivô Central */}
        {tipoSistemaWatch === 'PIVO_CENTRAL' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Estrutura do Pivô</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='fabricante'>Fabricante (Opcional)</Label>
                    <Input
                      id='fabricante'
                      type='text'
                      placeholder='Ex: Valley, Lindsay, Bauer'
                      {...register('fabricante')}
                    />
                    {errors.fabricante && (
                      <p className='text-sm text-red-500'>{errors.fabricante.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='modelo'>Modelo (Opcional)</Label>
                    <Input
                      id='modelo'
                      type='text'
                      placeholder='Ex: 8000'
                      {...register('modelo')}
                    />
                    {errors.modelo && (
                      <p className='text-sm text-red-500'>{errors.modelo.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='num_torres'>Número de Torres Móveis *</Label>
                    <Input
                      id='num_torres'
                      type='number'
                      placeholder='Ex: 5'
                      {...register('num_torres')}
                    />
                    {errors.num_torres && (
                      <p className='text-sm text-red-500'>{errors.num_torres.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='comprimento'>Comprimento Total (m) *</Label>
                    <Input
                      id='comprimento'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 380'
                      {...register('comprimento')}
                    />
                    {errors.comprimento && (
                      <p className='text-sm text-red-500'>{errors.comprimento.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sistema de Emissão</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Tipo de Emissores *</Label>
                    <Controller
                      name='emissor_type'
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='MICROMICROASPERSOR'>Sprays/Sprinklers</SelectItem>
                            <SelectItem value='GOTEJAMENTO'>LEPA/Bocais</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.emissor_type && (
                      <p className='text-sm text-red-500'>{errors.emissor_type.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='bocal_tipo'>Tipo de Bocal *</Label>
                    <Input
                      id='bocal_tipo'
                      type='text'
                      placeholder='Ex: Spray, Rotativo, LEPA'
                      {...register('bocal_tipo')}
                    />
                    {errors.bocal_tipo && (
                      <p className='text-sm text-red-500'>{errors.bocal_tipo.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='pressao_bocal'>Pressão dos Bocais (mca) *</Label>
                    <Input
                      id='pressao_bocal'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 20'
                      {...register('pressao_bocal')}
                    />
                    {errors.pressao_bocal && (
                      <p className='text-sm text-red-500'>{errors.pressao_bocal.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operação</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='energia_tipo'>Tipo de Energia *</Label>
                    <Input
                      id='energia_tipo'
                      type='text'
                      placeholder='Ex: Elétrica trifásica, Diesel'
                      {...register('energia_tipo')}
                    />
                    {errors.energia_tipo && (
                      <p className='text-sm text-red-500'>{errors.energia_tipo.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='potencia_motor'>Potência do Motor (cv) *</Label>
                    <Input
                      id='potencia_motor'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 125'
                      {...register('potencia_motor')}
                    />
                    {errors.potencia_motor && (
                      <p className='text-sm text-red-500'>{errors.potencia_motor.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='vazao_operacao'>Vazão de Operação (m³/h) *</Label>
                    <Input
                      id='vazao_operacao'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 150'
                      {...register('vazao_operacao')}
                    />
                    {errors.vazao_operacao && (
                      <p className='text-sm text-red-500'>{errors.vazao_operacao.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='controle_tipo'>Tipo de Controle *</Label>
                    <Input
                      id='controle_tipo'
                      type='text'
                      placeholder='Ex: Manual, Painel Digital, GPS'
                      {...register('controle_tipo')}
                    />
                    {errors.controle_tipo && (
                      <p className='text-sm text-red-500'>{errors.controle_tipo.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label>Possui Fertirrigação? *</Label>
                    <Controller
                      name='fertirrigacao'
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='true'>Sim</SelectItem>
                            <SelectItem value='false'>Não</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.fertirrigacao && (
                      <p className='text-sm text-red-500'>{errors.fertirrigacao.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='fonte_hidrica'>Fonte Hídrica *</Label>
                    <Input
                      id='fonte_hidrica'
                      type='text'
                      placeholder='Ex: Poço profundo, Reservatório'
                      {...register('fonte_hidrica')}
                    />
                    {errors.fonte_hidrica && (
                      <p className='text-sm text-red-500'>{errors.fonte_hidrica.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='tempo_funcionamento'>Tempo Médio de Funcionamento (h/dia) *</Label>
                    <Input
                      id='tempo_funcionamento'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 18'
                      {...register('tempo_funcionamento')}
                    />
                    {errors.tempo_funcionamento && (
                      <p className='text-sm text-red-500'>{errors.tempo_funcionamento.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='velocidade'>Velocidade de Deslocamento (%) *</Label>
                    <Input
                      id='velocidade'
                      type='number'
                      step='0.01'
                      placeholder='Ex: 100'
                      {...register('velocidade')}
                    />
                    {errors.velocidade && (
                      <p className='text-sm text-red-500'>{errors.velocidade.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manutenção</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='freq_manutencao'>Frequência de Manutenção *</Label>
                    <Input
                      id='freq_manutencao'
                      type='text'
                      placeholder='Ex: Mensal, Trimestral'
                      {...register('freq_manutencao')}
                    />
                    {errors.freq_manutencao && (
                      <p className='text-sm text-red-500'>{errors.freq_manutencao.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='data_ultima_manutencao'>Data da Última Manutenção *</Label>
                    <Input
                      id='data_ultima_manutencao'
                      type='date'
                      {...register('data_ultima_manutencao')}
                    />
                    {errors.data_ultima_manutencao && (
                      <p className='text-sm text-red-500'>{errors.data_ultima_manutencao.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='data_ultima_avaliacoes'>Data da Última Avaliação *</Label>
                    <Input
                      id='data_ultima_avaliacoes'
                      type='date'
                      {...register('data_ultima_avaliacoes')}
                    />
                    {errors.data_ultima_avaliacoes && (
                      <p className='text-sm text-red-500'>{errors.data_ultima_avaliacoes.message}</p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='problemas_observados'>Problemas Observados</Label>
                  <Textarea
                    id='problemas_observados'
                    placeholder='Descreva entupimentos, baixa pressão, falhas de painel, vazamentos, etc.'
                    rows={4}
                    {...register('problemas_observados')}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className='flex gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setStep('tipo')}
            className='flex-1'>
            <ChevronLeft className='w-4 h-4 mr-2' />
            Voltar
          </Button>
          <Button type='submit' disabled={loading} className='flex-1'>
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <>
                Criar Área
                <ChevronRight className='w-4 h-4 ml-2' />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
