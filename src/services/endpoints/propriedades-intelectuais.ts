import type { IntellectualPropertyFilters } from "@/types/filtros";
import type {
  IntellectualPropertyListItem,
} from "@/types/propriedade-intelectual";
import type { PaginatedResponse } from "@/types/common";
import type { PINitAssociation } from "@/types/associacao-nit-pi";
import {
  intellectualPropertyById,
  intellectualPropertyFixtures,
} from "@/lib/fixtures/propriedades-intelectuais";
import { matchesSearch } from "@/lib/text";
import {
  associationsOfProperty,
  buildQueryString,
  get,
  getApiBaseUrlOrNull,
  paginate,
} from "./shared";

function toListItem(
  property: (typeof intellectualPropertyFixtures)[number],
): IntellectualPropertyListItem {
  return {
    ...property,
    instituicoes: property.instituicoes ?? [],
    pesquisadores: property.pesquisadores ?? [],
    nits: associationsOfProperty(property.id),
  };
}

function sortProperties(items: IntellectualPropertyListItem[]) {
  return [...items].sort((a, b) => {
    const aDate = a.data_deposito ?? "";
    const bDate = b.data_deposito ?? "";

    if (aDate !== bDate) {
      return bDate.localeCompare(aDate);
    }

    return (a.titulo ?? "").localeCompare(b.titulo ?? "", "pt-BR", {
      sensitivity: "base",
    });
  });
}

export async function getIntellectualProperties(
  filters: IntellectualPropertyFilters = {},
): Promise<PaginatedResponse<IntellectualPropertyListItem>> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const path = `/propriedades-intelectuais${buildQueryString({
        search: filters.search,
        tipo_pi: filters.tipo_pi,
        instituicao_id: filters.instituicao_id,
        pesquisador_id: filters.pesquisador_id,
        nit_id: filters.nit_id,
        status_validacao: filters.status_validacao,
        situacao: filters.situacao,
        ano_deposito: filters.ano_deposito,
        page: filters.page,
        page_size: filters.page_size,
      })}`;

      return await get<PaginatedResponse<IntellectualPropertyListItem>>(path);
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const items = intellectualPropertyFixtures.filter((property) => {
    const associations = associationsOfProperty(property.id);

    if (
      !matchesSearch(
        filters.search,
        property.titulo,
        property.identificador_badepi,
        property.numero_processo,
        property.tipo_pi,
        property.situacao,
        ...(property.instituicoes ?? []).map((link) => link.instituicao.nome),
        ...(property.instituicoes ?? []).map((link) => link.instituicao.sigla),
        ...(property.pesquisadores ?? []).map((link) => link.nome_inventor),
      )
    ) {
      return false;
    }

    if (filters.tipo_pi && property.tipo_pi !== filters.tipo_pi) {
      return false;
    }

    if (
      filters.instituicao_id &&
      !(property.instituicoes ?? []).some(
        (link) => link.instituicao.id === filters.instituicao_id,
      )
    ) {
      return false;
    }

    if (
      filters.pesquisador_id &&
      !(property.pesquisadores ?? []).some(
        (link) => link.pesquisador?.id === filters.pesquisador_id,
      )
    ) {
      return false;
    }

    if (
      filters.nit_id &&
      !associations.some((association) => association.nit.id === filters.nit_id)
    ) {
      return false;
    }

    if (
      filters.status_validacao &&
      !associations.some(
        (association) =>
          association.status_validacao === filters.status_validacao,
      )
    ) {
      return false;
    }

    if (filters.situacao && property.situacao !== filters.situacao) {
      return false;
    }

    if (
      filters.ano_deposito &&
      property.data_deposito?.slice(0, 4) !== String(filters.ano_deposito)
    ) {
      return false;
    }

    return true;
  });

  return paginate(
    sortProperties(items.map(toListItem)),
    filters.page,
    filters.page_size,
  );
}

export async function getIntellectualPropertyById(
  id: number,
): Promise<IntellectualPropertyListItem | null> {
  const baseUrl = getApiBaseUrlOrNull();

  if (baseUrl) {
    try {
      const property = await get<IntellectualPropertyListItem>(
        `/propriedades-intelectuais/${id}`,
      );

      if (!property.nits) {
        const associations = await get<PaginatedResponse<PINitAssociation>>(
          `/propriedades-intelectuais/${id}/nits`,
        );
        property.nits = associations.data;
      }

      return property;
    } catch {
      // Fallback para fixtures em desenvolvimento.
    }
  }

  const property = intellectualPropertyById.get(id);

  if (!property) {
    return null;
  }

  return toListItem(property);
}

export async function getIntellectualPropertyTypes(): Promise<string[]> {
  return Array.from(
    new Set(intellectualPropertyFixtures.map((property) => property.tipo_pi)),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getIntellectualPropertySituations(): Promise<string[]> {
  return Array.from(
    new Set(
      intellectualPropertyFixtures
        .map((property) => property.situacao)
        .filter((situacao): situacao is string => Boolean(situacao)),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
