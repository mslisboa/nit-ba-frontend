import type { InstitutionFilters } from "@/types/filtros";
import {
  buildQueryString,
  get,
  getApiBaseUrlOrNull,
} from "./shared";
import type {
  InstitutionDetail,
  InstitutionListItem,
} from "@/types/instituicao";
import type { PaginatedResponse } from "@/types/common";
import {
  institutionById,
  institutionFixtures,
} from "@/lib/fixtures/instituicoes";
import { matchesSearch, sortByName } from "@/lib/text";
import {
  municipalitiesOfInstitution,
  paginate,
  propertiesOfInstitution,
  researchersOfInstitution,
  territoriesOfInstitution,
} from "./shared";

function toListItem(
  institution: (typeof institutionFixtures)[number],
): InstitutionListItem {
  return {
    ...institution,
    territorios: territoriesOfInstitution(institution.id),
    total_pesquisadores: researchersOfInstitution(institution.id).length,
    total_propriedades_intelectuais: propertiesOfInstitution(institution.id)
      .length,
  };
}

export async function getInstitutions(
  filters: InstitutionFilters = {},
): Promise<PaginatedResponse<InstitutionListItem>> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const path = `/instituicoes${buildQueryString({
        search: filters.search,
        nit_id: filters.nit_id,
        municipio_id: filters.municipio_id,
        territorio_id: filters.territorio_id,
        natureza: filters.natureza,
        tipo: filters.tipo,
        page: filters.page,
        page_size: filters.page_size,
      })}`;

      return await get<PaginatedResponse<InstitutionListItem>>(path);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const items = institutionFixtures.filter((institution) => {
    const municipios = municipalitiesOfInstitution(institution.id);
    const territorios = territoriesOfInstitution(institution.id);

    if (
      !matchesSearch(
        filters.search,
        institution.nome,
        institution.sigla,
        ...municipios.map((municipio) => municipio.nome),
        ...territorios.map((territorio) => territorio.nome),
      )
    ) {
      return false;
    }

    if (filters.nit_id && institution.nit?.id !== filters.nit_id) {
      return false;
    }

    if (
      filters.municipio_id &&
      !municipios.some((municipio) => municipio.id === filters.municipio_id)
    ) {
      return false;
    }

    if (
      filters.territorio_id &&
      !territorios.some((territorio) => territorio.id === filters.territorio_id)
    ) {
      return false;
    }

    if (filters.natureza && institution.natureza !== filters.natureza) {
      return false;
    }

    if (filters.tipo && institution.tipo !== filters.tipo) {
      return false;
    }

    return true;
  });

  const sorted = sortByName(items.map(toListItem));

  return paginate(sorted, filters.page, filters.page_size);
}

export async function getInstitutionById(
  id: number,
): Promise<InstitutionDetail | null> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      return await get<InstitutionDetail>(`/instituicoes/${id}`);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const institution = institutionById.get(id);

  if (!institution) {
    return null;
  }

  return {
    ...toListItem(institution),
    pesquisadores: researchersOfInstitution(id).map((researcher) => ({
      id: researcher.id,
      nome: researcher.nome,
    })),
    propriedades_intelectuais: propertiesOfInstitution(id).map((property) => ({
      id: property.id,
      titulo: property.titulo,
      tipo_pi: property.tipo_pi,
      numero_processo: property.numero_processo,
    })),
  };
}

export async function getInstitutionNatures(): Promise<string[]> {
  return Array.from(
    new Set(
      institutionFixtures
        .map((institution) => institution.natureza)
        .filter((natureza): natureza is string => Boolean(natureza)),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getInstitutionTypes(): Promise<string[]> {
  return Array.from(
    new Set(
      institutionFixtures
        .map((institution) => institution.tipo)
        .filter((tipo): tipo is string => Boolean(tipo)),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
