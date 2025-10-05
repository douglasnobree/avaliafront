/**
 * Retorna o label formatado para uma linha
 */
export function getLinhaLabel(linha: number, totalLinhas: number): string {
  if (linha === 1) return '1ª';
  if (linha === 2) return '1/3';
  if (linha === 3) return '2/3';
  if (linha === totalLinhas) return 'Últ.';
  return `${linha}ª`;
}

/**
 * Retorna o label formatado para um emissor
 */
export function getEmissorLabel(emissor: number, totalEmissores: number): string {
  if (emissor === 1) return '1º';
  if (emissor === 2) return '1/3';
  if (emissor === 3) return '2/3';
  if (emissor === totalEmissores) return 'Últ.';
  return `${emissor}º`;
}
