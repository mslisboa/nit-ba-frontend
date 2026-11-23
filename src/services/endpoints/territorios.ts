import type { TerritoryFilters } from "@/types/filtros";
import type { TerritoryDetail, TerritoryListItem } from "@/types/territorio";
import type { PaginatedResponse } from "@/types/common";
import {
  territoryById,
  territoryFixtures,
} from "@/lib/fixtures/territorios";
import { institutionById } from "@/lib/fixtures/instituicoes";
import { municipalityFixtures } from "@/lib/fixtures/municipios";
import { matchesSearch } from "@/lib/text";
import {
  buildQueryString,
  get,
  getApiBaseUrlOrNull,
  institutionIdsOfTerritory,
  nitsOfInstitutions,
  paginate,
  propertiesOfInstitutions,
  researchersOfInstitutions,
} from "./shared";

function statisticsOfTerritory(territoryId: number) {
  const institutionIds = institutionIdsOfTerritory(territoryId);
  const institutions = institutionIds.length;
  const nits = nitsOfInstitutions(institutionIds);
  const researchers = researchersOfInstitutions(institutionIds);
  const properties = propertiesOfInstitutions(institutionIds);

  return {
    institutions,
    nits,
    researchers,
    properties,
  };
}

function toListItem(
  territory: (typeof territoryFixtures)[number],
): TerritoryListItem {
  const stats = statisticsOfTerritory(territory.id);

  return {
    ...territory,
    total_instituicoes: stats.institutions,
    total_nits: stats.nits.length,
    total_pesquisadores: stats.researchers.length,
    total_propriedades_intelectuais: stats.properties.length,
  };
}

export async function getTerritories(
  filters: TerritoryFilters = {},
): Promise<PaginatedResponse<TerritoryListItem>> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const path = `/territorios${buildQueryString({
        search: filters.search,
        page: filters.page,
        page_size: filters.page_size,
      })}`;

      return await get<PaginatedResponse<TerritoryListItem>>(path);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const items = territoryFixtures
    .filter((territory) => matchesSearch(filters.search, territory.nome))
    .map(toListItem)
    .sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
    );

  return paginate(items, filters.page, filters.page_size);
}

export async function getTerritoryById(
  id: number,
): Promise<TerritoryDetail | null> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      return await get<TerritoryDetail>(`/territorios/${id}`);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const territory = territoryById.get(id);

  if (!territory) {
    return null;
  }

  const institutionIds = institutionIdsOfTerritory(id);
  const nits = nitsOfInstitutions(institutionIds);
  const researchers = researchersOfInstitutions(institutionIds);
  const properties = propertiesOfInstitutions(institutionIds);
  const municipalities = municipalityFixtures.filter(
    (municipality) => municipality.territorio?.id === id,
  );

  return {
    ...toListItem(territory),
    municipios: municipalities.map((municipality) => ({
      id: municipality.id,
      codigo_ibge: municipality.codigo_ibge,
      nome: municipality.nome,
    })),
    instituicoes: institutionIds.map((institutionId) => {
      const institution = institutionById.get(institutionId);

      if (!institution) {
        throw new Error(`Instituição não encontrada na fixture: ${institutionId}`);
      }

      return {
        id: institution.id,
        nome: institution.nome,
        sigla: institution.sigla,
      };
    }),
    nits: nits.map((nit) => ({
      id: nit.id,
      nome: nit.nome,
      sigla: nit.sigla,
    })),
    pesquisadores: researchers.map((researcher) => ({
      id: researcher.id,
      nome: researcher.nome,
    })),
    propriedades_intelectuais: properties.map((property) => ({
      id: property.id,
      titulo: property.titulo,
      tipo_pi: property.tipo_pi,
      numero_processo: property.numero_processo,
    })),
  };
}
