import { describe, expect, it } from "vitest";
import { estadoMedida, legendaMedida, nomeEstrutura, estadoCategoria, plural } from "./apresentacao";
import type { Total } from "./types";

const medida = (processos: number | null, estado: string): Total => ({ modalidade: "DI", escopo: "RECORTE_BA",
  papel: "depositante", processos, estado, fonte: "Fixture estrutural de apresentação" });

describe("Semântica das medidas na interface", () => {
  it("distingue falta de cobertura de ausência de ocorrência e de zero observado", () => {
    expect(estadoMedida(medida(null, "BASE_NAO_EXTRAIDA"))).toBe("Informação não consolidada para esta medida");
    expect(estadoMedida(medida(null, "SEM_OCORRENCIA_NO_RECORTE_NAO_CONCLUI_ZERO"))).toContain("não permite concluir produção zero");
    expect(estadoMedida(medida(0, "OBSERVADO"))).toBe("Quantidade observada neste escopo");
    expect(estadoMedida(undefined)).toBe("Medida não disponível nesta consulta");
    expect(legendaMedida(medida(null, "BASE_NAO_EXTRAIDA"))).toBe("informação não consolidada");
    expect(legendaMedida(medida(0, "OBSERVADO"))).toBe("pedidos no recorte BA");
  });
  it("não apresenta o estado de competência pendente como nome de NIT", () => {
    expect(nomeEstrutura({ estrutura: "PENDENTE EVIDÊNCIA ESPECÍFICA DA UNIDADE", estado_estrutura: "COMPETÊNCIA LOCAL ATUAL PENDENTE" }))
      .toBe("Estrutura local de inovação não confirmada");
  });
  it("preserva o código da classe sem interpretá-lo como vigência da marca", () => {
    expect(estadoCategoria("CATEGORIA_OBSERVADA", "Y")).toBe("Situação da classe: código Y da fonte");
    expect(estadoCategoria("SEM_CATEGORIA_PREENCHIDA", "")).toBe("Categoria não preenchida na fonte");
  });
  it("mantém a concordância sem alterar o número observado", () => {
    expect(plural(1, "pedido", "pedidos")).toBe("pedido");
    expect(plural(0, "referência", "referências")).toBe("referências");
    expect(plural(1, "linha", "linhas")).toBe("linha");
  });
});
