import type { NITFilters } from "@/types/filtros";
import type { NITDetail, NITListItem } from "@/types/nit";
import type { PINitAssociation } from "@/types/associacao-nit-pi";
import type { PaginatedResponse } from "@/types/common";
import { nitFixtures, nitById } from "@/lib/fixtures/nits";
import { matchesSearch, sortByName } from "@/lib/text";
import {
  getApiBaseUrlOrNull,
  associationsOfNit,
  buildQueryString,
  get,
  municipalitiesOfInstitution,
  paginate,
  researchersOfInstitution,
  statusesOfNit,
  territoriesOfInstitution,
} from "./shared";

function toListItem(nit: (typeof nitFixtures)[number]): NITListItem {
  return {
    ...nit,
    municipios: municipalitiesOfInstitution(nit.instituicao.id),
    territorios: territoriesOfInstitution(nit.instituicao.id),
    total_pesquisadores: researchersOfInstitution(nit.instituicao.id).length,
    total_propriedades_intelectuais: associationsOfNit(nit.id).length,
    status_validacao: statusesOfNit(nit.id),
  };
}

export async function getNits(
  filters: NITFilters = {},
): Promise<PaginatedResponse<NITListItem>> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const path = `/nits${buildQueryString({
        search: filters.search,
        instituicao_id: filters.instituicao_id,
        territorio_id: filters.territorio_id,
        situacao: filters.situacao,
        status_validacao: filters.status_validacao,
        page: filters.page,
        page_size: filters.page_size,
      })}`;

      return await get<PaginatedResponse<NITListItem>>(path);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const items = nitFixtures.filter((nit) => {
    const municipios = municipalitiesOfInstitution(nit.instituicao.id);
    const territorios = territoriesOfInstitution(nit.instituicao.id);

    if (
      !matchesSearch(
        filters.search,
        nit.nome,
        nit.sigla,
        nit.instituicao.nome,
        nit.instituicao.sigla,
        ...municipios.map((municipio) => municipio.nome),
        ...territorios.map((territorio) => territorio.nome),
      )
    ) {
      return false;
    }

    if (filters.instituicao_id && nit.instituicao.id !== filters.instituicao_id) {
      return false;
    }

    if (
      filters.territorio_id &&
      !territorios.some((territorio) => territorio.id === filters.territorio_id)
    ) {
      return false;
    }

    if (filters.situacao && nit.situacao !== filters.situacao) {
      return false;
    }

    if (
      filters.status_validacao &&
      !statusesOfNit(nit.id).includes(filters.status_validacao)
    ) {
      return false;
    }

    return true;
  });

  const sorted = sortByName(items.map(toListItem));

  return paginate(sorted, filters.page, filters.page_size);
}

export async function getNitById(id: number): Promise<NITDetail | null> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const nit = await get<NITDetail>(`/nits/${id}`);

      if (!nit.propriedades_intelectuais) {
        const associations = await get<PaginatedResponse<PINitAssociation>>(
          `/nits/${id}/propriedades-intelectuais`,
        );
        nit.propriedades_intelectuais = associations.data;
      }

      return nit;
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const nit = nitById.get(id);

  if (!nit) {
    return null;
  }

  const associations = associationsOfNit(id).sort((a, b) => {
    const aTitle = a.propriedade_intelectual.titulo ?? "";
    const bTitle = b.propriedade_intelectual.titulo ?? "";

    return aTitle.localeCompare(bTitle, "pt-BR", { sensitivity: "base" });
  });

  return {
    ...toListItem(nit),
    propriedades_intelectuais: associations,
  };
}

export async function getNITSituations(): Promise<string[]> {
  return Array.from(
    new Set(
      nitFixtures
        .map((nit) => nit.situacao)
        .filter((situacao): situacao is string => Boolean(situacao)),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
