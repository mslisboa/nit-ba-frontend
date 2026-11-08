/**
 * Configuração central da comunicação com a API do backend FastAPI.
 *
 * A URL base é configurável por variável de ambiente (ver .env.example).
 * Não armazenar credenciais ou segredos em variáveis NEXT_PUBLIC_.
 */

/**
 * Retorna a URL base da API, sem barra final.
 *
 * Falha de forma explícita quando NEXT_PUBLIC_API_URL não está configurada,
 * evitando requisições silenciosas para endereço incorreto.
 */
export function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "Variável de ambiente NEXT_PUBLIC_API_URL não configurada. " +
        "Copie .env.example para .env.local e defina a URL base da API.",
    );
  }

  return apiBaseUrl.replace(/\/+$/, "");
}
