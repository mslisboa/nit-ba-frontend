import { afterEach, describe, expect, it, vi } from "vitest";
import { consultar } from "./client";

afterEach(() => vi.unstubAllGlobals());

describe("Consultas de leitura do MVP", () => {
  it("preserva ausência e zero informado pela API", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ausente: null, observado: 0 })));
    vi.stubGlobal("fetch", fetchMock);
    expect(await consultar("/api/jd/cobertura", controller.signal)).toEqual({ ausente: null, observado: 0 });
    expect(fetchMock).toHaveBeenCalledWith("/api/jd/cobertura", { signal: controller.signal, cache: "no-store" });
  });
  it("informa falha da API sem fabricar uma lista vazia", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: "Base indisponível" }), { status: 503 })));
    await expect(consultar("/api/jd/instituicoes")).rejects.toThrow("Base indisponível");
  });
  it("não aceita uma resposta inválida como dados", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>Erro</html>", { status: 502 })));
    await expect(consultar("/api/jd/instituicoes")).rejects.toThrow();
  });
});
