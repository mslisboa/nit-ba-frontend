import type {
  IndicatorCategoryCount,
  IndicatorMunicipalityCount,
  IndicatorStatusCount,
  IndicatorTerritoryCount,
  Indicators,
} from "@/types/indicadores";
import { associationFixtures } from "@/lib/fixtures/associacoes-nit-pi";
import { get, getApiBaseUrlOrNull } from "./shared";
import { institutionFixtures } from "@/lib/fixtures/instituicoes";
import { municipalityFixtures } from "@/lib/fixtures/municipios";
import { nitFixtures } from "@/lib/fixtures/nits";
import { researcherFixtures } from "@/lib/fixtures/pesquisadores";
import { intellectualPropertyFixtures } from "@/lib/fixtures/propriedades-intelectuais";
import { territoryFixtures } from "@/lib/fixtures/territorios";
import { VALIDATION_TAG_CONFIG, VALIDATION_STATUS_ORDER } from "@/lib/validation-tags";
import {
  institutionIdsOfTerritory,
  nitsOfInstitutions,
  propertiesOfInstitutions,
  researchersOfInstitutions,
} from "./shared";

function countByStatus(): IndicatorStatusCount[] {
  return VALIDATION_STATUS_ORDER.map((status) => ({
    status,
    label: VALIDATION_TAG_CONFIG[status].label,
    count: associationFixtures.filter(
      (association) => association.status_validacao === status,
    ).length,
  }));
}

function countByType(): IndicatorCategoryCount[] {
  const counts = new Map<string, number>();

  for (const property of intellectualPropertyFixtures) {
    counts.set(property.tipo_pi, (counts.get(property.tipo_pi) ?? 0) + 1);
  }

  return Array.from(counts, ([label, count]) => ({ label, count })).sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, "pt-BR"),
  );
}

function countByTerritory(): IndicatorTerritoryCount[] {
  return territoryFixtures
    .map((territory) => {
      const institutionIds = institutionIdsOfTerritory(territory.id);

      return {
        territorio: { id: territory.id, nome: territory.nome },
        instituicoes: institutionIds.length,
        nits: nitsOfInstitutions(institutionIds).length,
        pesquisadores: researchersOfInstitutions(institutionIds).length,
        propriedades_intelectuais:
          propertiesOfInstitutions(institutionIds).length,
      };
    })
    .sort(
      (a, b) =>
        b.instituicoes - a.instituicoes ||
        a.territorio.nome.localeCompare(b.territorio.nome, "pt-BR"),
    );
}

function countByMunicipality(): IndicatorMunicipalityCount[] {
  const counts = municipalityFixtures
    .map((municipality) => {
      const instituicoes = institutionFixtures.filter((institution) =>
        (institution.municipios ?? []).some(
          (item) => item.municipio.id === municipality.id,
        ),
      ).length;

      return {
        municipio: {
          id: municipality.id,
          codigo_ibge: municipality.codigo_ibge,
          nome: municipality.nome,
        },
        instituicoes,
      };
    })
    .filter((item) => item.instituicoes > 0);

  return counts.sort(
    (a, b) =>
      b.instituicoes - a.instituicoes ||
      a.municipio.nome.localeCompare(b.municipio.nome, "pt-BR"),
  );
}

function latestSourceUpdate(): string | null {
  const dates = intellectualPropertyFixtures
    .map((property) => property.data_atualizacao_fonte)
    .filter((date): date is string => Boolean(date))
    .sort();

  return dates.at(-1) ?? null;
}

export async function getIndicators(): Promise<Indicators> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      return await get<Indicators>("/indicadores");
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  return {
    nits: nitFixtures.length,
    instituicoes: institutionFixtures.length,
    pesquisadores: researcherFixtures.length,
    propriedades_intelectuais: intellectualPropertyFixtures.length,
    propriedades_intelectuais_validadas: new Set(
      associationFixtures
        .filter(
          (association) =>
            association.status_validacao === "CONFIRMADA",
        )
        .map((association) => association.propriedade_intelectual.id),
    ).size,
    nits_ativos: nitFixtures.filter((nit) => nit.situacao === "Ativo").length,
    nits_em_consolidacao: nitFixtures.filter(
      (nit) => nit.situacao === "Em consolidação",
    ).length,
    associacoes: associationFixtures.length,
    por_status_validacao: countByStatus(),
    por_modalidade: countByType(),
    por_territorio: countByTerritory(),
    por_municipio: countByMunicipality(),
    data_referencia: latestSourceUpdate(),
  };
}
