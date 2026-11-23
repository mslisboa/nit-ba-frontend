import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/EmptyState";
import { InstituicoesView } from "@/components/views/InstituicoesView";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import {
  getInstitutionNatures,
  getInstitutionTypes,
  getInstitutions,
} from "@/services/endpoints/instituicoes";
import { getTerritories } from "@/services/endpoints/territorios";

export const metadata: Metadata = {
  title: "Instituições",
};

type SearchParams = {
  search?: string;
  territorio_id?: string;
  natureza?: string;
  tipo?: string;
  page?: string;
};

function toNumber(value?: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function buildQuery(params: SearchParams, page?: number) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.territorio_id) query.set("territorio_id", params.territorio_id);
  if (params.natureza) query.set("natureza", params.natureza);
  if (params.tipo) query.set("tipo", params.tipo);
  if (page && page > 1) query.set("page", String(page));
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export default async function InstituicoesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [result, territories, natures, types] = await Promise.all([
    getInstitutions({
      search: params.search,
      territorio_id: toNumber(params.territorio_id),
      natureza: params.natureza,
      tipo: params.tipo,
      page: toNumber(params.page) ?? 1,
      page_size: 12,
    }),
    getTerritories({ page: 1, page_size: 100 }),
    getInstitutionNatures(),
    getInstitutionTypes(),
  ]);

  return (
    <>
      <PageHero
        title="Instituições"
        description="Conheça as organizações da amostra, seus municípios e o NIT relacionado."
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
              placeholder="Nome ou sigla"
            />
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
            Natureza
            <select name="natureza" defaultValue={params.natureza ?? ""}>
              <option value="">Todas</option>
              {natures.map((natureza) => (
                <option key={natureza} value={natureza}>
                  {natureza}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tipo
            <select name="tipo" defaultValue={params.tipo ?? ""}>
              <option value="">Todos</option>
              {types.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>
          <button className="button" type="submit">
            Filtrar
          </button>
        </FilterBar>

        {result.data.length === 0 ? (
          <EmptyState title="Nenhuma instituição encontrada" />
        ) : (
          <div style={{ marginTop: 20 }}>
            <InstituicoesView items={result.data} />
          </div>
        )}

        <Pagination
          page={result.pagination.page}
          totalPages={result.pagination.total_pages}
          getPageHref={(page) => `/instituicoes${buildQuery(params, page)}`}
        />
      </section>
    </>
  );
}
