import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { getTerritories } from "@/services/endpoints/territorios";
import { OfficialTerritoryMap } from "@/components/maps/OfficialTerritoryMap";

export const metadata: Metadata = {
  title: "Territórios",
};

type SearchParams = {
  search?: string;
  page?: string;
};

function toNumber(value?: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function buildQuery(params: SearchParams, page?: number) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (page && page > 1) query.set("page", String(page));
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export default async function TerritoriosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const result = await getTerritories({
    search: params.search,
    page: toNumber(params.page) ?? 1,
    page_size: 100,
  });

  return (
    <>
      <PageHero
        title="Territórios"
        description="Presença das instituições e NITs nos 27 Territórios de Identidade da Bahia."
        count={result.pagination.total}
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 16 }}>
        <div className="bahia-map-panel observatory-territory-map">
          <OfficialTerritoryMap territories={result.data} />
          <aside className="map-legend territory-map-sidebar">
            <div className="map-sidebar-head">
              <div>
                <h2>Territórios de Identidade</h2>
              </div>
            </div>
            <div className="coverage-layer-note">
              <b>Camada exibida</b>
              <span>Sedes, campi e unidades das instituições.</span>
              <b>Observação</b>
              <span>A presença institucional é derivada dos municípios onde a instituição atua.</span>
            </div>
            <p>Selecione um território para abrir seus detalhes.</p>
            <div className="territory-filter-list">
              {result.data.map((territory, index) => (
                <a
                  key={territory.id}
                  className="territory-filter-row"
                  href={`/territorios/${territory.id}`}
                >
                  <i />
                  <span>
                    {index + 1} · {territory.nome}
                  </span>
                  <b>{territory.total_nits}</b>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 0, paddingBottom: 48 }}>
        <FilterBar>
          <label>
            Busca
            <input
              type="search"
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Nome do território"
            />
          </label>
          <button className="button" type="submit">
            Filtrar
          </button>
        </FilterBar>

        {result.data.length === 0 ? (
          <EmptyState title="Nenhum território encontrado" />
        ) : (
          <div className="compact-table" style={{ marginTop: 20 }}>
            <div className="table-row table-head">
              <span>Território</span>
              <span>Instituições</span>
              <span>NITs</span>
              <span>Pesquisadores</span>
              <span>PIs</span>
            </div>
            {result.data.map((territory) => (
              <div className="table-row" key={territory.id}>
                <span>
                  <Link href={`/territorios/${territory.id}`}>
                    <b>{territory.nome}</b>
                  </Link>
                </span>
                <span>{territory.total_instituicoes}</span>
                <span>{territory.total_nits}</span>
                <span>{territory.total_pesquisadores}</span>
                <span>{territory.total_propriedades_intelectuais}</span>
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={result.pagination.page}
          totalPages={result.pagination.total_pages}
          getPageHref={(page) => `/territorios${buildQuery(params, page)}`}
        />
      </section>
    </>
  );
}
