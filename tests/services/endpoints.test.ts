import { describe, expect, it } from "vitest";

import { associationFixtures } from "@/lib/fixtures/associacoes-nit-pi";
import { institutionFixtures } from "@/lib/fixtures/instituicoes";
import { municipalityFixtures } from "@/lib/fixtures/municipios";
import { nitFixtures } from "@/lib/fixtures/nits";
import { researcherFixtures } from "@/lib/fixtures/pesquisadores";
import { intellectualPropertyFixtures } from "@/lib/fixtures/propriedades-intelectuais";
import { territoryFixtures } from "@/lib/fixtures/territorios";
import { getIndicators } from "@/services/endpoints/indicadores";
import { getIntellectualProperties } from "@/services/endpoints/propriedades-intelectuais";
import { getMunicipalities } from "@/services/endpoints/municipios";
import { getNits } from "@/services/endpoints/nits";
import { getTerritories } from "@/services/endpoints/territorios";
import { getValidationTag } from "@/lib/validation-tags";

describe("fixtures do MVP", () => {
  it("mantém as 12 duplas NIT-instituição previstas", () => {
    expect(nitFixtures).toHaveLength(12);
    expect(institutionFixtures).toHaveLength(12);
  });

  it("cobre os quatro status de validação", () => {
    const statuses = new Set(
      associationFixtures.map((association) => association.status_validacao),
    );

    expect(statuses).toEqual(
      new Set(["CONFIRMADA", "PENDENTE", "NAO_CONFIRMADA", "INCONCLUSIVA"]),
    );
  });

  it("mantém uma PI sem associação e uma PI com múltiplas associações", () => {
    const associationsByProperty = new Map<number, number>();

    for (const association of associationFixtures) {
      const propertyId = association.propriedade_intelectual.id;
      associationsByProperty.set(
        propertyId,
        (associationsByProperty.get(propertyId) ?? 0) + 1,
      );
    }

    expect(associationsByProperty.get(8)).toBeUndefined();
    expect(associationsByProperty.get(5)).toBe(2);
  });

  it("mantém municípios com código IBGE e território de identidade", () => {
    expect(municipalityFixtures.length).toBeGreaterThan(0);

    for (const municipality of municipalityFixtures) {
      expect(municipality.codigo_ibge).toMatch(/^\d{7}$/);
      expect(municipality.territorio?.id).toBeTypeOf("number");
    }
  });

  it("possui os 27 territórios e um inventor sem pesquisador vinculado", () => {
    expect(territoryFixtures).toHaveLength(27);

    const externalInventor = intellectualPropertyFixtures
      .flatMap((property) => property.pesquisadores ?? [])
      .find((link) => link.pesquisador === null);

    expect(externalInventor?.nome_inventor).toBe(
      "Inventor externo demonstrativo",
    );
  });

  it("possui pesquisadores com vínculos institucionais", () => {
    expect(researcherFixtures).toHaveLength(12);

    for (const researcher of researcherFixtures) {
      expect(researcher.instituicoes?.length).toBeGreaterThan(0);
    }
  });
});

describe("serviços de domínio", () => {
  it("filtra NITs pelo status de validação da associação", async () => {
    const result = await getNits({ status_validacao: "NAO_CONFIRMADA" });

    expect(result.data.map((nit) => nit.id)).toEqual([4]);
    expect(result.data[0].status_validacao).toEqual(["NAO_CONFIRMADA"]);
  });

  it("filtra propriedades intelectuais por NIT e por status", async () => {
    const byNit = await getIntellectualProperties({ nit_id: 1 });
    const byStatus = await getIntellectualProperties({
      status_validacao: "PENDENTE",
    });

    expect(byNit.data.map((property) => property.id).sort()).toEqual([2, 5]);
    expect(byStatus.data.map((property) => property.id).sort()).toEqual([3, 5]);
  });

  it("expõe contagens consolidadas nos indicadores", async () => {
    const indicators = await getIndicators();
    const statusCounts = Object.fromEntries(
      indicators.por_status_validacao.map((item) => [item.status, item.count]),
    );

    expect(indicators.nits).toBe(12);
    expect(indicators.instituicoes).toBe(12);
    expect(indicators.pesquisadores).toBe(12);
    expect(indicators.propriedades_intelectuais).toBe(8);
    expect(indicators.propriedades_intelectuais_validadas).toBe(4);
    expect(indicators.associacoes).toBe(8);
    expect(indicators.nits_ativos).toBe(10);
    expect(indicators.nits_em_consolidacao).toBe(2);
    expect(statusCounts).toMatchObject({
      CONFIRMADA: 4,
      PENDENTE: 2,
      INCONCLUSIVA: 1,
      NAO_CONFIRMADA: 1,
    });
  });

  it("retorna os 27 territórios com contagens por território", async () => {
    const result = await getTerritories({ page_size: 100 });
    const metropolitan = result.data.find(
      (territory) => territory.nome === "Metropolitano de Salvador",
    );
    const reconcavo = result.data.find(
      (territory) => territory.nome === "Recôncavo",
    );

    expect(result.pagination.total).toBe(27);
    expect(metropolitan?.total_instituicoes).toBe(6);
    expect(reconcavo?.total_instituicoes).toBe(3);
  });

  it("lista municípios paginados com território", async () => {
    const result = await getMunicipalities({ search: "Cachoeira" });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].territorio?.nome).toBe("Recôncavo");
  });
});

describe("adaptador de tags de validação", () => {
  it("mantém a correspondência entre status, rótulo e tom visual", () => {
    expect(getValidationTag("PENDENTE")).toMatchObject({
      label: "Pendente",
      tone: "neutral",
    });
    expect(getValidationTag("CONFIRMADA")).toMatchObject({
      label: "Confirmada",
      tone: "success",
    });
    expect(getValidationTag("NAO_CONFIRMADA")).toMatchObject({
      label: "Não confirmada",
      tone: "danger",
    });
    expect(getValidationTag("INCONCLUSIVA")).toMatchObject({
      label: "Inconclusiva",
      tone: "warning",
    });
  });
});
