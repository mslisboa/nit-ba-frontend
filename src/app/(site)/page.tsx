import type { CSSProperties } from "react";
import Link from "next/link";
import { InstitutionLogo } from "@/components/ui/InstitutionLogo";
import { getIndicators } from "@/services/endpoints/indicadores";
import { getInstitutions } from "@/services/endpoints/instituicoes";
import { getTerritories } from "@/services/endpoints/territorios";

export default async function HomePage() {
  const [indicators, territories, institutions] = await Promise.all([
    getIndicators(),
    getTerritories({ page: 1, page_size: 100 }),
    getInstitutions({ page: 1, page_size: 4 }),
  ]);

  const topTerritories = territories.data
    .filter((territory) => territory.total_instituicoes > 0)
    .sort(
      (a, b) =>
        b.total_instituicoes - a.total_instituicoes ||
        a.nome.localeCompare(b.nome, "pt-BR"),
    )
    .slice(0, 5)
    .map((territory) => ({
      name: territory.nome,
      count: territory.total_instituicoes,
    }));

  const maxTerritoryCount = Math.max(
    ...topTerritories.map((territory) => territory.count),
    1,
  );

  const metrics = [
    {
      href: "/nits",
      value: indicators.nits,
      label: "NITs na amostra",
      detail: `${indicators.nits_ativos} ativos · ${indicators.nits_em_consolidacao} em consolidação`,
      symbol: "N",
    },
    {
      href: "/instituicoes",
      value: indicators.instituicoes,
      label: "Instituições",
      detail: "Sedes e presença territorial",
      symbol: "I",
    },
    {
      href: "/territorios",
      value: territories.pagination.total,
      label: "Territórios",
      detail: "Explore a distribuição na Bahia",
      symbol: "T",
    },
    {
      href: "/propriedade-intelectual",
      value: indicators.propriedades_intelectuais,
      label: "Registros de PI",
      detail: `${indicators.propriedades_intelectuais_validadas} validados`,
      symbol: "PI",
    },
  ];

  return (
    <div className="page kit-home v1-page">
      <section className="kit-welcome">
        <div className="wrap">
          <div className="kit-page-meta">
            <span className="kit-environment">
              <i /> Ambiente de demonstração
            </span>
          </div>
          <div className="kit-hero-grid">
            <div className="kit-hero-copy">
              <h1>
                Conheça quem transforma
                <br />
                a Bahia pela inovação<span>.</span>
              </h1>
              <p>
                Encontre Núcleos de Inovação Tecnológica, conheça suas
                instituições e explore as conexões em cada território.
              </p>
              <form
                action="/nits"
                method="get"
                className="kit-search"
                role="search"
              >
                <label className="sr-only" htmlFor="home-search">
                  Buscar NIT ou instituição
                </label>
                <span aria-hidden="true">⌕</span>
                <input
                  id="home-search"
                  name="search"
                  type="search"
                  placeholder="Busque por NIT, instituição ou município"
                  maxLength={120}
                />
                <button className="button" type="submit">
                  Explorar a base <span aria-hidden="true">→</span>
                </button>
              </form>
              <div className="kit-search-hints">
                <span>Explore por instituição:</span>
                {["UFBA", "UEFS", "UESC", "UNEB"].map((sigla) => (
                  <Link key={sigla} href={`/nits?search=${sigla}`}>
                    {sigla} <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </div>
            <aside className="kit-territory-spot">
              <div className="kit-orbit" aria-hidden="true">
                <i />
                <i />
                <i />
                <b>BA</b>
                <span className="orbit-dot one" />
                <span className="orbit-dot two" />
                <span className="orbit-dot three" />
              </div>
              <div>
                <strong>
                  Um estado.
                  <br />
                  Muitas conexões.
                </strong>
                <p>27 Territórios de Identidade para descobrir.</p>
                <Link href="/territorios">
                  Explorar os territórios <span aria-hidden="true">→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="kit-dashboard wrap" aria-label="Panorama da amostra">
        <div className="kit-stat-grid">
          {metrics.map((metric) => (
            <Link key={metric.href} className="kit-stat" href={metric.href}>
              <div>
                <span>{metric.label}</span>
                <i aria-hidden="true">{metric.symbol}</i>
              </div>
              <strong>{metric.value.toLocaleString("pt-BR")}</strong>
              <small>{metric.detail}</small>
            </Link>
          ))}
        </div>

        <div className="kit-section-heading">
          <div>
            <h2>A inovação tem muitos caminhos</h2>
          </div>
          <p>Escolha como você quer conhecer a rede.</p>
        </div>

        <div className="kit-paths">
          <Link href="/nits">
            <span className="kit-path-icon" aria-hidden="true">
              N
            </span>
            <span>
              <b>Encontre um NIT</b>
              <small>Atuação, situação e instituição vinculada.</small>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/pesquisadores">
            <span className="kit-path-icon" aria-hidden="true">
              P
            </span>
            <span>
              <b>Conheça os pesquisadores</b>
              <small>Pessoas, identificadores e conexões.</small>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/propriedade-intelectual">
            <span className="kit-path-icon" aria-hidden="true">
              PI
            </span>
            <span>
              <b>Explore a propriedade intelectual</b>
              <small>Patentes, softwares e outros ativos.</small>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="kit-insight-grid">
          <section className="kit-panel">
            <div className="kit-panel-heading">
              <div>
                <h2>Inovação pelo estado</h2>
              </div>
              <Link className="text-link" href="/territorios">
                Ver mapa <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="kit-panel-caption">
              Instituições da amostra com presença em cada território.
            </p>
            <div className="kit-territory-bars">
              {topTerritories.map((territory) => (
                <Link
                  key={territory.name}
                  href={`/nits?territorio=${encodeURIComponent(territory.name)}`}
                >
                  <span>{territory.name}</span>
                  <b>{territory.count}</b>
                  <i
                    style={
                      {
                        "--bar-width": `${(territory.count / maxTerritoryCount) * 100}%`,
                      } as CSSProperties
                    }
                  />
                </Link>
              ))}
            </div>
            <p className="kit-footnote">
              Uma instituição pode estar em vários territórios. Cada barra
              conta presenças institucionais, não unidades administrativas.
            </p>
          </section>

          <section className="kit-panel kit-directory">
            <div className="kit-panel-heading">
              <div>
                <h2>Parte dessa rede</h2>
              </div>
              <Link className="text-link" href="/instituicoes">
                Ver todas <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="kit-directory-list">
              {institutions.data.map((institution) => (
                <Link
                  key={institution.id}
                  href={`/instituicoes/${institution.id}`}
                >
                  <InstitutionLogo
                    sigla={institution.sigla ?? institution.nome}
                    variant="compact"
                  />
                  <span>
                    <b>{institution.sigla ?? institution.nome}</b>
                    <small>{institution.nome}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
            <Link className="kit-directory-footer" href="/nits">
              Consultar os 12 NITs <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>

        <aside className="kit-data-note">
          <span className="kit-note-icon" aria-hidden="true">
            i
          </span>
          <p>
            <b>Uma base em construção, com transparência.</b> Os registros
            operacionais deste protótipo são demonstrativos. Conheça as fontes
            previstas e os critérios de leitura.
          </p>
          <Link href="/fontes">
            Fontes e metodologia <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </section>
    </div>
  );
}
