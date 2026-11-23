import type { ResearcherFilters } from "@/types/filtros";
import type {
  ResearcherDetail,
  ResearcherListItem,
} from "@/types/pesquisador";
import type { PaginatedResponse } from "@/types/common";
import {
  researcherById,
  researcherFixtures,
} from "@/lib/fixtures/pesquisadores";
import { intellectualPropertyFixtures } from "@/lib/fixtures/propriedades-intelectuais";
import { matchesSearch, sortByName } from "@/lib/text";
import { buildQueryString, get, getApiBaseUrlOrNull, paginate } from "./shared";

function propertiesOfResearcher(researcherId: number) {
  return intellectualPropertyFixtures.filter((property) =>
    (property.pesquisadores ?? []).some(
      (link) => link.pesquisador?.id === researcherId,
    ),
  );
}

function toListItem(
  researcher: (typeof researcherFixtures)[number],
): ResearcherListItem {
  return {
    ...researcher,
    instituicoes: researcher.instituicoes ?? [],
    total_propriedades_intelectuais: propertiesOfResearcher(researcher.id).length,
  };
}

export async function getResearchers(
  filters: ResearcherFilters = {},
): Promise<PaginatedResponse<ResearcherListItem>> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const path = `/pesquisadores${buildQueryString({
        search: filters.search,
        instituicao_id: filters.instituicao_id,
        page: filters.page,
        page_size: filters.page_size,
      })}`;

      return await get<PaginatedResponse<ResearcherListItem>>(path);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const items = researcherFixtures.filter((researcher) => {
    const institutions = researcher.instituicoes ?? [];

    if (
      !matchesSearch(
        filters.search,
        researcher.nome,
        researcher.id_simcc,
        researcher.id_lattes,
        researcher.orcid,
        ...institutions.map((link) => link.instituicao.nome),
        ...institutions.map((link) => link.instituicao.sigla),
      )
    ) {
      return false;
    }

    if (
      filters.instituicao_id &&
      !institutions.some(
        (link) => link.instituicao.id === filters.instituicao_id,
      )
    ) {
      return false;
    }

    return true;
  });

  const sorted = sortByName(items.map(toListItem));

  return paginate(sorted, filters.page, filters.page_size);
}

export async function getResearcherById(
  id: number,
): Promise<ResearcherDetail | null> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      return await get<ResearcherDetail>(`/pesquisadores/${id}`);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const researcher = researcherById.get(id);

  if (!researcher) {
    return null;
  }

  return {
    ...toListItem(researcher),
    propriedades_intelectuais: propertiesOfResearcher(id).map((property) => ({
      id: property.id,
      titulo: property.titulo,
      tipo_pi: property.tipo_pi,
      numero_processo: property.numero_processo,
    })),
  };
}
