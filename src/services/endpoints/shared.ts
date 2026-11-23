import type {
  MunicipalityReference,
  PaginatedResponse,
  TerritoryReference,
} from "@/types/common";
import { get } from "@/services/api/client";
import { getApiBaseUrl } from "@/services/api/config";
import type { PINitAssociation } from "@/types/associacao-nit-pi";
import type { StatusValidacao } from "@/types/validacao";
import { associationFixtures } from "@/lib/fixtures/associacoes-nit-pi";
import { institutionFixtures } from "@/lib/fixtures/instituicoes";
import { municipalityById } from "@/lib/fixtures/municipios";
import { nitFixtures } from "@/lib/fixtures/nits";
import { researcherFixtures } from "@/lib/fixtures/pesquisadores";
import { intellectualPropertyFixtures } from "@/lib/fixtures/propriedades-intelectuais";
import { uniqueBy } from "@/lib/text";
import { VALIDATION_STATUS_ORDER } from "@/lib/validation-tags";

export const DEFAULT_PAGE_SIZE = 12;

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginatedResponse<T> {
  const safePage = Math.max(1, Math.trunc(page) || 1);
  const safePageSize = Math.max(1, Math.trunc(pageSize) || DEFAULT_PAGE_SIZE);
  const total = items.length;
  const totalPages = Math.ceil(total / safePageSize);
  const start = (safePage - 1) * safePageSize;

  return {
    data: items.slice(start, start + safePageSize),
    pagination: {
      page: safePage,
      page_size: safePageSize,
      total,
      total_pages: totalPages,
    },
  };
}

export function territoryOfMunicipality(
  municipio: MunicipalityReference,
): TerritoryReference | null {
  return municipalityById.get(municipio.id)?.territorio ?? null;
}

export function municipalitiesOfInstitution(
  institutionId: number,
): MunicipalityReference[] {
  const institution = institutionFixtures.find((item) => item.id === institutionId);

  return uniqueBy(
    (institution?.municipios ?? []).map((item) => item.municipio),
    (municipio) => municipio.id,
  );
}

export function territoriesOfInstitution(
  institutionId: number,
): TerritoryReference[] {
  return uniqueBy(
    municipalitiesOfInstitution(institutionId)
      .map((municipio) => territoryOfMunicipality(municipio))
      .filter((territory): territory is TerritoryReference => Boolean(territory)),
    (territory) => territory.id,
  );
}

export function researchersOfInstitution(institutionId: number) {
  return researcherFixtures.filter((researcher) =>
    (researcher.instituicoes ?? []).some(
      (link) => link.instituicao.id === institutionId,
    ),
  );
}

export function propertiesOfInstitution(institutionId: number) {
  return intellectualPropertyFixtures.filter((property) =>
    (property.instituicoes ?? []).some(
      (link) => link.instituicao.id === institutionId,
    ),
  );
}

export function associationsOfNit(nitId: number): PINitAssociation[] {
  return associationFixtures.filter((association) => association.nit.id === nitId);
}

export function associationsOfProperty(
  propertyId: number,
): PINitAssociation[] {
  return associationFixtures.filter(
    (association) => association.propriedade_intelectual.id === propertyId,
  );
}

export function statusesOfNit(nitId: number): StatusValidacao[] {
  const statuses = new Set(
    associationsOfNit(nitId).map((association) => association.status_validacao),
  );

  return VALIDATION_STATUS_ORDER.filter((status) => statuses.has(status));
}

export function institutionIdsOfTerritory(territoryId: number): number[] {
  return institutionFixtures
    .filter((institution) =>
      (institution.municipios ?? []).some(
        (item) => territoryOfMunicipality(item.municipio)?.id === territoryId,
      ),
    )
    .map((institution) => institution.id);
}

export function institutionIdsOfMunicipality(municipalityId: number): number[] {
  return institutionFixtures
    .filter((institution) =>
      (institution.municipios ?? []).some(
        (item) => item.municipio.id === municipalityId,
      ),
    )
    .map((institution) => institution.id);
}

export function nitsOfInstitutions(institutionIds: number[]) {
  const ids = new Set(institutionIds);

  return nitFixtures.filter((nit) => ids.has(nit.instituicao.id));
}

export function researchersOfInstitutions(institutionIds: number[]) {
  const ids = new Set(institutionIds);

  return researcherFixtures.filter((researcher) =>
    (researcher.instituicoes ?? []).some((link) =>
      ids.has(link.instituicao.id),
    ),
  );
}

export function propertiesOfInstitutions(institutionIds: number[]) {
  const ids = new Set(institutionIds);

  return intellectualPropertyFixtures.filter((property) =>
    (property.instituicoes ?? []).some((link) => ids.has(link.instituicao.id)),
  );
}

export function getApiBaseUrlOrNull(): string | null {
  try {
    return getApiBaseUrl();
  } catch {
    return null;
  }
}

export function buildQueryString(
  params: Record<string, string | number | undefined | null>,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export { get };
