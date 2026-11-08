/**
 * Cliente HTTP centralizado para a API.
 *
 * Concentra URL base, headers e tratamento de erros. A tipagem das respostas
 * será derivada dos contratos OpenAPI do backend quando disponibilizados
 * (ver docs/architecture.md, seção 8.2). Nenhum endpoint de domínio é
 * definido aqui: os recursos (NITs, instituições, etc.) serão adicionados
 * em src/services/endpoints conforme a API expõe cada um.
 */

import { getApiBaseUrl } from "./config";

/** Erro de resposta da API, preservando o status HTTP recebido. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "method">;

/**
 * Executa uma requisição GET e retorna o corpo JSON tipado.
 *
 * `path` é relativo a `baseUrl`. O formato do JSON (envoltório, paginação)
 * deve corresponder ao contrato do backend em vigor; nenhuma transformação
 * é aplicada nesta camada.
 */
async function request<T>(path: string, baseUrl: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `A requisição para ${path} falhou (HTTP ${response.status}).`);
  }

  return (await response.json()) as T;
}

/** Executa uma requisição GET à API e retorna o corpo JSON tipado. */
export async function get<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return request<T>(path, getApiBaseUrl(), options);
}

/**
 * Healthcheck (liveness) do backend.
 *
 * Único endpoint implementado no backend neste estágio (ver app/main.py,
 * onde /health está exposto na raiz, sem o prefixo /api/v1 previsto na
 * docs/architecture.md). Serve de verificação de integração do frontend;
 * não deve ser utilizado como fonte de dados de domínio.
 */
export async function getHealth(): Promise<{ status: string }> {
  const rootUrl = new URL(getApiBaseUrl()).origin;
  return request<{ status: string }>("/health", rootUrl);
}
