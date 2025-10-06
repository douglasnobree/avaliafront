export interface SetorHidraulico {
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
  propriedadeId: string;
  userId: string;
}
