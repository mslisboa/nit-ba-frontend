import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { getResearchers } from "@/services/endpoints/pesquisadores";
import { getInstitutions } from "@/services/endpoints/instituicoes";

export const metadata: Metadata = {
  title: "Pesquisadores",
};

type SearchParams = {
  search?: string;
  instituicao_id?: string;
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
  if (page && page > 1) query.set("page", String(page));
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export default async function PesquisadoresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [result, institutions] = await Promise.all([
    getResearchers({
      search: params.search,
      instituicao_id: toNumber(params.instituicao_id),
      page: toNumber(params.page) ?? 1,
      page_size: 12,
    }),
    getInstitutions({ page: 1, page_size: 100 }),
  ]);

  return (
    <>
      <PageHero
        title="Pesquisadores"
        description="Pessoas, identificadores disponíveis, vínculos institucionais e participações em propriedade intelectual."
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
              placeholder="Nome ou identificador"
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
          <button className="button" type="submit">
            Filtrar
          </button>
        </FilterBar>

        {result.data.length === 0 ? (
          <EmptyState title="Nenhum pesquisador encontrado" />
        ) : (
          <div className="compact-table" style={{ marginTop: 20 }}>
            <div className="table-row table-head">
              <span>Pesquisador</span>
              <span>Instituições</span>
              <span>PIs</span>
            </div>
            {result.data.map((researcher) => (
              <div className="table-row" key={researcher.id}>
                <span>
                  <Link href={`/pesquisadores/${researcher.id}`}>
                    <b>{researcher.nome}</b>
                  </Link>
                </span>
                <span>
                  {researcher.instituicoes
                    .map((link) => link.instituicao.sigla ?? link.instituicao.nome)
                    .join(", ")}
                </span>
                <span>{researcher.total_propriedades_intelectuais}</span>
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={result.pagination.page}
          totalPages={result.pagination.total_pages}
          getPageHref={(page) => `/pesquisadores${buildQuery(params, page)}`}
        />
      </section>
    </>
  );
}
