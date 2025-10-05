/**
 * Calcula a vazão em L/h a partir do volume em mL e tempo em segundos
 * Fórmula: Vazão (L/h) = (Volume em mL / Tempo em seg) * 3.6
 */
export function calculateVazao(volume: string, tempo: string): string {
  const vol = parseFloat(volume);
  const temp = parseFloat(tempo);
  
  if (vol > 0 && temp > 0) {
    const vazao = (vol / temp) * 3.6;
    return vazao.toFixed(2);
  }
  
  return '0.00';
}

/**
 * Calcula a média de vazão dos pontos medidos
 */
export function calculateMediaVazao(vazoes: number[]): number {
  if (vazoes.length === 0) return 0;
  
  const soma = vazoes.reduce((a, b) => a + b, 0);
  return soma / vazoes.length;
}
