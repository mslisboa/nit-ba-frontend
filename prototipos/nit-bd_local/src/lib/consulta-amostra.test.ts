import { describe, expect, it } from "vitest";
import { consultarAmostra } from "./consulta-amostra";

const consulta = (path: string[], params = "") => consultarAmostra(path, new URLSearchParams(params));

describe("amostra pública do JD", () => {
  it("abre os perfis das 11 instituições e dos dois campi", async () => {
    const instituicoes = await consulta(["instituicoes"], "todos=true").json();
    const campi = await consulta(["instituicoes"], "tipo=UNIDADE&todos=true").json();
    expect(instituicoes.total).toBe(11);
    expect(campi.total).toBe(2);
    for (const item of [...instituicoes.items, ...campi.items]) {
      expect((await consulta(["instituicoes", item.id]).json()).instituicao.sigla).toBe(item.sigla);
    }
  });

  it("mantém a seleção do indicador anual no perfil, na lista, no detalhe e no CSV", async () => {
    const { items } = await consulta(["instituicoes"], "q=IFBA").json();
    const ifba = items.find((i: { sigla: string }) => i.sigla === "IFBA");
    const { series } = await consulta(["instituicoes", ifba.id]).json();
    const ano = series.find((s: { modalidade: string }) => s.modalidade === "PTN");
    const filtros = `instituicao=${ifba.id}&ano_de=${ano.ano_entrada}&ano_ate=${ano.ano_entrada}`;
    const lista = await consulta(["patentes"], filtros).json();
    expect(lista.total).toBe(ano.processos);
    expect((await consulta(["patentes", "resumo"], filtros).json()).total).toBe(lista.total);
    const csv = await consulta(["patentes", "exportar"], filtros).text();
    for (const pedido of lista.items) {
      expect(csv).toContain(pedido.numero_original);
      expect((await consulta(["patentes", pedido.processo_id], filtros).json()).processo.numero_original).toBe(pedido.numero_original);
    }
  });
});
