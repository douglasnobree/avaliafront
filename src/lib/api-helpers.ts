/**
 * Helpers para lidar com respostas da API
 * 
 * O backend retorna respostas no formato:
 * {
 *   success: true,
 *   data: <dados reais>,
 *   statusCode: 200,
 *   timestamp: "..."
 * }
 */

/**
 * Extrai os dados da resposta da API, lidando com o formato padrão do backend
 */
export function extractApiData<T>(response: any): T {
  return response.data?.data || response.data;
}

/**
 * Extrai array de dados da resposta da API, garantindo sempre retornar um array
 */
export function extractApiArray<T>(response: any): T[] {
  const data = response.data?.data || response.data || [];
  return Array.isArray(data) ? data : [];
}

/**
 * Verifica se a resposta da API foi bem-sucedida
 */
export function isApiSuccess(response: any): boolean {
  return response.data?.success !== false;
}
