import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { ValidationTag } from "@/components/ui/ValidationTag";
import {
  getIntellectualProperties,
  getIntellectualPropertySituations,
  getIntellectualPropertyTypes,
} from "@/services/endpoints/propriedades-intelectuais";
import { getInstitutions } from "@/services/endpoints/instituicoes";
import { getResearchers } from "@/services/endpoints/pesquisadores";
import { getNits } from "@/services/endpoints/nits";

export const metadata: Metadata = {
  title: "Propriedade intelectual",
};

type SearchParams = {
  search?: string;
  tipo_pi?: string;
  instituicao_id?: string;
  pesquisador_id?: string;
  nit_id?: string;
  status_validacao?: string;
  situacao?: string;
  ano_deposito?: string;
  page?: string;
};

function toNumber(value?: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function buildQuery(params: SearchParams, page?: number) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (key !== "page" && value) query.set(key, value);
  });
  if (page && page > 1) query.set("page", String(page));
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export default async function PropriedadeIntelectualPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [
    result,
    institutions,
    researchers,
    nits,
    types,
    situations,
  ] = await Promise.all([
    getIntellectualProperties({
      search: params.search,
      tipo_pi: params.tipo_pi,
      instituicao_id: toNumber(params.instituicao_id),
      pesquisador_id: toNumber(params.pesquisador_id),
      nit_id: toNumber(params.nit_id),
      status_validacao: params.status_validacao as
        | "PENDENTE"
        | "CONFIRMADA"
        | "NAO_CONFIRMADA"
        | "INCONCLUSIVA"
        | undefined,
      situacao: params.situacao,
      ano_deposito: toNumber(params.ano_deposito),
      page: toNumber(params.page) ?? 1,
      page_size: 12,
    }),
    getInstitutions({ page: 1, page_size: 100 }),
    getResearchers({ page: 1, page_size: 100 }),
    getNits({ page: 1, page_size: 100 }),
    getIntellectualPropertyTypes(),
    getIntellectualPropertySituations(),
  ]);

  return (
    <>
      <PageHero
        title="Propriedade intelectual"
        description="Ativos protegidos ou em proteção, com situação da PI e status de validação da associação com o NIT."
        count={result.pagination.total}
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <FilterBar>
          <label>
            Busca
            <input
              type="search"
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Título, identificador ou número"
            />
          </label>
          <label>
            Modalidade
            <select name="tipo_pi" defaultValue={params.tipo_pi ?? ""}>
              <option value="">Todas</option>
              {types.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>
          <label>
            Instituição
            <select name="instituicao_id" defaultValue={params.instituicao_id ?? ""}>
              <option value="">Todas</option>
              {institutions.data.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.sigla ?? institution.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Pesquisador
            <select name="pesquisador_id" defaultValue={params.pesquisador_id ?? ""}>
              <option value="">Todos</option>
              {researchers.data.map((researcher) => (
                <option key={researcher.id} value={researcher.id}>
                  {researcher.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            NIT
            <select name="nit_id" defaultValue={params.nit_id ?? ""}>
              <option value="">Todos</option>
              {nits.data.map((nit) => (
                <option key={nit.id} value={nit.id}>
                  {nit.sigla ?? nit.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Situação da PI
            <select name="situacao" defaultValue={params.situacao ?? ""}>
              <option value="">Todas</option>
              {situations.map((situacao) => (
                <option key={situacao} value={situacao}>
                  {situacao}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status de validação
            <select name="status_validacao" defaultValue={params.status_validacao ?? ""}>
              <option value="">Todos</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="PENDENTE">Pendente</option>
              <option value="INCONCLUSIVA">Inconclusiva</option>
              <option value="NAO_CONFIRMADA">Não confirmada</option>
            </select>
          </label>
          <label>
            Ano de depósito
            <input
              type="number"
              name="ano_deposito"
              defaultValue={params.ano_deposito ?? ""}
              min={2000}
              max={2100}
            />
          </label>
          <button className="button" type="submit">
            Filtrar
          </button>
        </FilterBar>

        {result.data.length === 0 ? (
          <EmptyState title="Nenhuma propriedade intelectual encontrada" />
        ) : (
          <div className="compact-table property-table" style={{ marginTop: 20 }}>
            <div className="table-row table-head">
              <span>Identificador</span>
              <span>Título</span>
              <span>Modalidade</span>
              <span>Situação da PI</span>
              <span>Status</span>
            </div>
            {result.data.map((property) => (
              <div className="table-row" key={property.id}>
                <span>
                  <Link href={`/propriedade-intelectual/${property.id}`}>
                    <b>{property.identificador_badepi ?? `PI ${property.id}`}</b>
                  </Link>
                </span>
                <span>
                  <Link href={`/propriedade-intelectual/${property.id}`}>
                    {property.titulo ?? "Sem título"}
                  </Link>
                </span>
                <span>{property.tipo_pi}</span>
                <span>{property.situacao ?? "Não informado"}</span>
                <span>
                  {property.nits.length > 0 ? (
                    property.nits.map((association) => (
                      <ValidationTag
                        key={`${association.nit.id}-${association.propriedade_intelectual.id}`}
                        status={association.status_validacao}
                        nit={association.nit}
                        data_validacao={association.data_validacao}
                        referencia_evidencia={association.referencia_evidencia}
                      />
                    ))
                  ) : (
                    <span className="tag">Sem associação</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={result.pagination.page}
          totalPages={result.pagination.total_pages}
          getPageHref={(page) => `/propriedade-intelectual${buildQuery(params, page)}`}
        />
      </section>
    </>
  );
}
