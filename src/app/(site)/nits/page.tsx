import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { ValidationTag } from "@/components/ui/ValidationTag";
import { getNits } from "@/services/endpoints/nits";
import { getInstitutions } from "@/services/endpoints/instituicoes";
import { getTerritories } from "@/services/endpoints/territorios";
import { getNITSituations } from "@/services/endpoints/nits";

export const metadata: Metadata = {
  title: "NITs",
};

type SearchParams = {
  search?: string;
  instituicao_id?: string;
  territorio_id?: string;
  situacao?: string;
  status_validacao?: string;
  page?: string;
};

function toNumber(value?: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function buildQuery(params: SearchParams, page?: number) {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.instituicao_id) query.set("instituicao_id", params.instituicao_id);
  if (params.territorio_id) query.set("territorio_id", params.territorio_id);
  if (params.situacao) query.set("situacao", params.situacao);
  if (params.status_validacao) query.set("status_validacao", params.status_validacao);
  if (page && page > 1) query.set("page", String(page));

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export default async function NitsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters = {
    search: params.search,
    instituicao_id: toNumber(params.instituicao_id),
    territorio_id: toNumber(params.territorio_id),
    situacao: params.situacao,
    status_validacao: params.status_validacao as
      | "PENDENTE"
      | "CONFIRMADA"
      | "NAO_CONFIRMADA"
      | "INCONCLUSIVA"
      | undefined,
    page: toNumber(params.page) ?? 1,
    page_size: 12,
  };

  const [result, institutions, territories, situations] = await Promise.all([
    getNits(filters),
    getInstitutions({ page: 1, page_size: 100 }),
    getTerritories({ page: 1, page_size: 100 }),
    getNITSituations(),
  ]);

  return (
    <>
      <PageHero
        title="NITs"
        description="Descubra os núcleos, suas instituições e a presença territorial. Use os filtros para encontrar o que procura."
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
              placeholder="Nome, sigla ou instituição"
            />
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
            Território
            <select name="territorio_id" defaultValue={params.territorio_id ?? ""}>
              <option value="">Todos</option>
              {territories.data.map((territory) => (
                <option key={territory.id} value={territory.id}>
                  {territory.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Situação
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
            <select
              name="status_validacao"
              defaultValue={params.status_validacao ?? ""}
            >
              <option value="">Todos</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="PENDENTE">Pendente</option>
              <option value="INCONCLUSIVA">Inconclusiva</option>
              <option value="NAO_CONFIRMADA">Não confirmada</option>
            </select>
          </label>
          <button className="button" type="submit">
            Filtrar
          </button>
        </FilterBar>

        {result.data.length === 0 ? (
          <EmptyState
            title="Nenhum NIT encontrado"
            description="Ajuste os filtros ou limpe a busca para ver outros registros."
          />
        ) : (
          <div className="compact-table" style={{ marginTop: 20 }}>
            <div className="table-row table-head">
              <span>NIT</span>
              <span>Instituição</span>
              <span>Situação</span>
              <span>Territórios</span>
              <span>Status</span>
            </div>
            {result.data.map((nit) => (
              <div className="table-row" key={nit.id}>
                <span>
                  <Link href={`/nits/${nit.id}`}>
                    <b>{nit.nome}</b>
                  </Link>
                  {nit.sigla ? <small>{nit.sigla}</small> : null}
                </span>
                <span>
                  <b>{nit.instituicao.nome}</b>
                  {nit.instituicao.sigla ? (
                    <small>{nit.instituicao.sigla}</small>
                  ) : null}
                </span>
                <span>{nit.situacao ?? "Não informado"}</span>
                <span>
                  {nit.territorios.length > 0
                    ? nit.territorios.map((territory) => territory.nome).join(", ")
                    : "Não informado"}
                </span>
                <span>
                  {nit.status_validacao.length > 0 ? (
                    nit.status_validacao.map((status) => (
                      <ValidationTag key={status} status={status} />
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
          getPageHref={(page) => `/nits${buildQuery(params, page)}`}
        />
      </section>
    </>
  );
}
