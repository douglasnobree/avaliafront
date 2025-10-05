import * as z from 'zod';

// Schema para Setor Hidráulico (Irrigação Localizada)
export const setorHidraulicoSchema = z.object({
  identificacao: z
    .string()
    .min(3, 'A identificação deve ter pelo menos 3 caracteres'),
  area_ha: z.string().min(1, 'A área é obrigatória'),
  tipo_setor: z.literal('SETOR_HIDRAULICO'),
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
  data_ultima_manutencao: z
    .string()
    .min(1, 'Data da última manutenção é obrigatória'),
});

// Schema para Pivô Central
export const pivoCentralSchema = z.object({
  tipo_setor: z.literal('PIVO_CENTRAL'),
  identificacao: z
    .string()
    .min(3, 'A identificação deve ter pelo menos 3 caracteres'),
  area_ha: z.string().min(1, 'A área é obrigatória'),
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
  tempo_funcionamento: z
    .string()
    .min(1, 'Tempo de funcionamento é obrigatório'),
  velocidade: z.string().min(1, 'Velocidade é obrigatória'),
  bocal_tipo: z.string().min(1, 'Tipo de bocal é obrigatório'),
  pressao_bocal: z.string().min(1, 'Pressão do bocal é obrigatória'),
  data_ultima_manutencao: z
    .string()
    .min(1, 'Data da última manutenção é obrigatória'),
  freq_manutencao: z.string().min(1, 'Frequência de manutenção é obrigatória'),
  problemas_observados: z.string().optional(),
  data_ultima_avaliacoes: z
    .string()
    .min(1, 'Data da última avaliação é obrigatória'),
});

export const createAreaSchema = z.discriminatedUnion('tipo_setor', [
  setorHidraulicoSchema,
  pivoCentralSchema,
]);

export type CreateAreaFormData = z.infer<typeof createAreaSchema>;