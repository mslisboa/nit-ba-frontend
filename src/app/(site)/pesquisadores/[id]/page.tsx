import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { getResearcherById } from "@/services/endpoints/pesquisadores";

export const metadata: Metadata = {
  title: "Detalhe do pesquisador",
};

export default async function ResearcherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const researcher = await getResearcherById(Number(id));

  if (!researcher) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={researcher.nome}
        description="Identificadores, vínculos institucionais e propriedade intelectual associada."
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Breadcrumb
          items={[
            { href: "/", label: "Início" },
            { href: "/pesquisadores", label: "Pesquisadores" },
            { label: researcher.nome },
          ]}
        />

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Identificadores</h2>
          <dl className="detail-list">
            <div>
              <dt>id_simcc</dt>
              <dd>{researcher.id_simcc ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>id_lattes</dt>
              <dd>{researcher.id_lattes ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>ORCID</dt>
              <dd>{researcher.orcid ?? "Não informado"}</dd>
            </div>
          </dl>
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Vínculos institucionais</h2>
          {researcher.instituicoes.length === 0 ? (
            <EmptyState title="Sem vínculos institucionais" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Instituição</span>
                <span>Tipo de vínculo</span>
                <span>Início</span>
                <span>Fim</span>
              </div>
              {researcher.instituicoes.map((link, index) => (
                <div className="table-row" key={index}>
                  <span>
                    <Link href={`/instituicoes/${link.instituicao.id}`}>
                      {link.instituicao.nome}
                    </Link>
                    {link.instituicao.sigla ? ` (${link.instituicao.sigla})` : ""}
                  </span>
                  <span>{link.tipo_vinculo ?? "Não informado"}</span>
                  <span>{link.data_inicio ?? "Não informado"}</span>
                  <span>{link.data_fim ?? "Não informado"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kit-panel">
          <h2>Propriedade intelectual associada</h2>
          {researcher.propriedades_intelectuais.length === 0 ? (
            <EmptyState title="Sem registros de PI associados" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Propriedade intelectual</span>
                <span>Modalidade</span>
                <span>Número de processo</span>
              </div>
              {researcher.propriedades_intelectuais.map((property) => (
                <div className="table-row" key={property.id}>
                  <span>
                    <Link href={`/propriedade-intelectual/${property.id}`}>
                      <b>{property.titulo}</b>
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
