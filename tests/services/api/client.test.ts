/**
 * Testes do cliente HTTP centralizado (src/services/api/client.ts).
 *
 * Utilizam respostas controladas (mock de fetch), conforme
 * docs/architecture.md, seção 15. Não dependem de dados fictícios
 * de domínio: cobrem apenas o comportamento genérico do client.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, get, getHealth } from "@/services/api/client";

const API_URL = "http://localhost:8000/api/v1";

function mockFetch(response: { ok: boolean; status: number; json: () => Promise<unknown> }) {
  return vi.fn().mockResolvedValue(response);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("get", () => {
  it("requisita o basePath com a URL base configurada e retorna o JSON", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL);
    const fetchMock = mockFetch({ ok: true, status: 200, json: async () => ({ status: "ok" }) });
    vi.stubGlobal("fetch", fetchMock);

    const result = await get<{ status: string }>("/health");

    expect(result).toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/health",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("remove barras finais da URL base", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", `${API_URL}/`);
    const fetchMock = mockFetch({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    await get("/health");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/health",
      expect.anything(),
    );
  });

  it("lança ApiError com o status HTTP em respostas de erro", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL);
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: false, status: 404, json: async () => ({}) }),
    );

    await expect(get("/inexistente")).rejects.toMatchObject({ status: 404 });
  });
});

describe("getHealth", () => {
  it("requisita /health na raiz do host da API", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL);
    const fetchMock = mockFetch({ ok: true, status: 200, json: async () => ({ status: "ok" }) });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getHealth();

    expect(result).toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/health",
      expect.objectContaining({ method: "GET" }),
    );
  });
});

describe("getApiBaseUrl", () => {
  it("falha de forma explícita quando NEXT_PUBLIC_API_URL não está configurada", async () => {
    // Armazenar a variável em cache para restaurar o valor original
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    await expect(get("/health")).rejects.toThrow(
      /NEXT_PUBLIC_API_URL/,
    );
  });
});

describe("ApiError", () => {
  it("preserva o status HTTP", () => {
    const error = new ApiError(503, "Serviço indisponível");

    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(503);
    expect(error.message).toBe("Serviço indisponível");
  });
});
