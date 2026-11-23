import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { ValidationTag } from "@/components/ui/ValidationTag";
import { getNitById } from "@/services/endpoints/nits";
import {
  formatDate,
  formatMetodoIdentificacao,
  formatMetodoValidacao,
} from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Detalhe do NIT",
};

export default async function NitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const nit = await getNitById(Number(id));

  if (!nit) {
    notFound();
  }

  return (
    <>
      <PageHero title={nit.nome} description="Identificação e associações NIT–PI." />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Breadcrumb
          items={[
            { href: "/", label: "Início" },
            { href: "/nits", label: "NITs" },
            { label: nit.nome },
          ]}
        />

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Identificação</h2>
          <dl className="detail-list">
            <div>
              <dt>Sigla</dt>
              <dd>{nit.sigla ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Site</dt>
              <dd>
                {nit.site ? (
                  <a href={nit.site} target="_blank" rel="noreferrer">
                    {nit.site}
                  </a>
                ) : (
                  "Não informado"
                )}
              </dd>
            </div>
            <div>
              <dt>Situação</dt>
              <dd>{nit.situacao ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Instituição relacionada</dt>
              <dd>
                <Link href={`/instituicoes/${nit.instituicao.id}`}>
                  {nit.instituicao.nome}
                </Link>
                {nit.instituicao.sigla ? ` (${nit.instituicao.sigla})` : ""}
              </dd>
            </div>
            <div>
              <dt>Territórios</dt>
              <dd>
                {nit.territorios.length > 0
                  ? nit.territorios.map((territory) => territory.nome).join(", ")
                  : "Não informado"}
              </dd>
            </div>
            <div>
              <dt>PIs associadas</dt>
              <dd>{nit.propriedades_intelectuais.length}</dd>
            </div>
            <div>
              <dt>PIs validadas</dt>
              <dd>
                {
                  nit.propriedades_intelectuais.filter(
                    (association) => association.status_validacao === "CONFIRMADA",
                  ).length
                }
              </dd>
            </div>
            <div>
              <dt>Municípios de presença</dt>
              <dd>
                {nit.municipios.length > 0
                  ? nit.municipios.map((municipio) => municipio.nome).join(", ")
                  : "Não informado"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="kit-panel">
          <h2>Propriedades intelectuais associadas</h2>
          {nit.propriedades_intelectuais.length === 0 ? (
            <EmptyState
              title="Sem associações NIT–PI"
              description="A ausência de associação é distinta de uma associação não confirmada."
            />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Propriedade intelectual</span>
                <span>Status</span>
                <span>Método</span>
                <span>Datas</span>
                <span>Evidência</span>
              </div>
              {nit.propriedades_intelectuais.map((association) => (
                <div className="table-row" key={association.propriedade_intelectual.id}>
                  <span>
                    <Link
                      href={`/propriedade-intelectual/${association.propriedade_intelectual.id}`}
                    >
                      <b>{association.propriedade_intelectual.titulo}</b>
                    </Link>
                    <small>{association.propriedade_intelectual.tipo_pi}</small>
                  </span>
                  <span>
                    <ValidationTag
                      status={association.status_validacao}
                      nit={association.nit}
                      data_validacao={association.data_validacao}
                      referencia_evidencia={association.referencia_evidencia}
                    />
                  </span>
                  <span>
                    {formatMetodoIdentificacao(association.metodo_identificacao)}
                    {association.metodo_validacao
                      ? ` · ${formatMetodoValidacao(association.metodo_validacao)}`
                      : ""}
                  </span>
                  <span>
                    Identificação: {formatDate(association.data_identificacao)}
                    {association.data_validacao
                      ? ` · Validação: ${formatDate(association.data_validacao)}`
                      : ""}
                  </span>
                  <span>
                    {association.referencia_evidencia ?? "Não informada"}
                    {association.observacao ? ` · ${association.observacao}` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
