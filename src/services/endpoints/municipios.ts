import type { MunicipalityFilters } from "@/types/filtros";
import type { Municipality } from "@/types/municipio";
import type { PaginatedResponse } from "@/types/common";
import {
  municipalityFixtures,
} from "@/lib/fixtures/municipios";
import { matchesSearch, sortByName } from "@/lib/text";
import { buildQueryString, get, getApiBaseUrlOrNull, paginate } from "./shared";

import { municipalityById } from "@/lib/fixtures/municipios";

export async function getMunicipalityById(
  id: number,
): Promise<Municipality | null> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      return await get<Municipality>(`/municipios/${id}`);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  return municipalityById.get(id) ?? null;
}

export async function getMunicipalities(
  filters: MunicipalityFilters = {},
): Promise<PaginatedResponse<Municipality>> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const path = `/municipios${buildQueryString({
        search: filters.search,
        territorio_id: filters.territorio_id,
        page: filters.page,
        page_size: filters.page_size,
      })}`;

      return await get<PaginatedResponse<Municipality>>(path);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const items = municipalityFixtures.filter((municipality) => {
    if (
      !matchesSearch(
        filters.search,
        municipality.nome,
        municipality.codigo_ibge,
        municipality.territorio?.nome,
      )
    ) {
      return false;
    }

    if (
      filters.territorio_id &&
      municipality.territorio?.id !== filters.territorio_id
    ) {
      return false;
    }

    return true;
  });

  return paginate(sortByName(items), filters.page, filters.page_size);
}
