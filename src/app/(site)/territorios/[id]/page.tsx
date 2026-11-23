import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { getTerritoryById } from "@/services/endpoints/territorios";

export const metadata: Metadata = {
  title: "Detalhe do território",
};

export default async function TerritoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const territory = await getTerritoryById(Number(id));

  if (!territory) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={territory.nome}
        description="Municípios, instituições, NITs, pesquisadores e propriedade intelectual associados ao território."
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Breadcrumb
          items={[
            { href: "/", label: "Início" },
            { href: "/territorios", label: "Territórios" },
            { label: territory.nome },
          ]}
        />

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Municípios</h2>
          {territory.municipios.length === 0 ? (
            <EmptyState title="Sem municípios informados" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Município</span>
                <span>Código IBGE</span>
              </div>
              {territory.municipios.map((municipio) => (
                <div className="table-row" key={municipio.id}>
                  <span>{municipio.nome}</span>
                  <span>{municipio.codigo_ibge}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Instituições</h2>
          {territory.instituicoes.length === 0 ? (
            <EmptyState title="Sem instituições informadas" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Instituição</span>
              </div>
              {territory.instituicoes.map((institution) => (
                <div className="table-row" key={institution.id}>
                  <span>
                    <Link href={`/instituicoes/${institution.id}`}>
                      {institution.nome}
                    </Link>
                    {institution.sigla ? ` (${institution.sigla})` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>NITs presentes</h2>
          {territory.nits.length === 0 ? (
            <EmptyState title="Sem NITs presentes" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>NIT</span>
              </div>
              {territory.nits.map((nit) => (
                <div className="table-row" key={nit.id}>
                  <span>
                    <Link href={`/nits/${nit.id}`}>{nit.nome}</Link>
                    {nit.sigla ? ` (${nit.sigla})` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Pesquisadores relacionados</h2>
          {territory.pesquisadores.length === 0 ? (
            <EmptyState title="Sem pesquisadores relacionados" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Pesquisador</span>
              </div>
              {territory.pesquisadores.map((pesquisador) => (
                <div className="table-row" key={pesquisador.id}>
                  <span>
                    <Link href={`/pesquisadores/${pesquisador.id}`}>
                      {pesquisador.nome}
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kit-panel">
          <h2>Propriedade intelectual</h2>
          {territory.propriedades_intelectuais.length === 0 ? (
            <EmptyState title="Sem registros de PI vinculados" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Propriedade intelectual</span>
                <span>Modalidade</span>
                <span>Número de processo</span>
              </div>
              {territory.propriedades_intelectuais.map((property) => (
                <div className="table-row" key={property.id}>
                  <span>
                    <Link href={`/propriedade-intelectual/${property.id}`}>
                      {property.titulo}
                    </Link>
                  </span>
                  <span>{property.tipo_pi}</span>
                  <span>{property.numero_processo ?? "Não informado"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
