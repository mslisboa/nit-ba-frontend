import type { NITPIAssociationFilters } from "@/types/filtros";
import type { PINitAssociation } from "@/types/associacao-nit-pi";
import type { PaginatedResponse } from "@/types/common";
import { associationFixtures } from "@/lib/fixtures/associacoes-nit-pi";
import { buildQueryString, get, getApiBaseUrlOrNull, paginate } from "./shared";

function sortAssociations(items: PINitAssociation[]) {
  return [...items].sort((a, b) =>
    b.data_identificacao.localeCompare(a.data_identificacao),
  );
}

export async function getAssociations(
  filters: NITPIAssociationFilters = {},
): Promise<PaginatedResponse<PINitAssociation>> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const path = `/associacoes-nit-pi${buildQueryString({
        nit_id: filters.nit_id,
        propriedade_intelectual_id: filters.propriedade_intelectual_id,
        status_validacao: filters.status_validacao,
        metodo_identificacao: filters.metodo_identificacao,
        metodo_validacao: filters.metodo_validacao,
        page: filters.page,
        page_size: filters.page_size,
      })}`;

      return await get<PaginatedResponse<PINitAssociation>>(path);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const items = associationFixtures.filter((association) => {
    if (filters.nit_id && association.nit.id !== filters.nit_id) {
      return false;
    }

    if (
      filters.propriedade_intelectual_id &&
      association.propriedade_intelectual.id !==
        filters.propriedade_intelectual_id
    ) {
      return false;
    }

    if (
      filters.status_validacao &&
      association.status_validacao !== filters.status_validacao
    ) {
      return false;
    }

    if (
      filters.metodo_identificacao &&
      association.metodo_identificacao !== filters.metodo_identificacao
    ) {
      return false;
    }

    if (
      filters.metodo_validacao &&
      association.metodo_validacao !== filters.metodo_validacao
    ) {
      return false;
    }

    return true;
  });

  return paginate(
    sortAssociations(items),
    filters.page,
    filters.page_size,
  );
}
