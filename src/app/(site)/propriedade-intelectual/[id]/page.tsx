import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { ValidationTag } from "@/components/ui/ValidationTag";
import { getIntellectualPropertyById } from "@/services/endpoints/propriedades-intelectuais";
import {
  formatDate,
  formatMetodoIdentificacao,
  formatMetodoValidacao,
} from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Detalhe da propriedade intelectual",
};

export default async function IntellectualPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getIntellectualPropertyById(Number(id));

  if (!property) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={property.titulo ?? "Propriedade intelectual"}
        description="Título, modalidade, número de processo, datas, situação, instituições, pesquisadores e associações NIT–PI."
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Breadcrumb
          items={[
            { href: "/", label: "Início" },
            { href: "/propriedade-intelectual", label: "Propriedade intelectual" },
            { label: property.titulo ?? `PI ${property.id}` },
          ]}
        />

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Identificação</h2>
          <dl className="detail-list">
            <div>
              <dt>Identificador BADEPI</dt>
              <dd>{property.identificador_badepi ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Modalidade</dt>
              <dd>{property.tipo_pi}</dd>
            </div>
            <div>
              <dt>Número de processo</dt>
              <dd>{property.numero_processo ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Situação da PI</dt>
              <dd>{property.situacao ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Data de depósito</dt>
              <dd>{formatDate(property.data_deposito)}</dd>
            </div>
            <div>
              <dt>Data de publicação</dt>
              <dd>{formatDate(property.data_publicacao)}</dd>
            </div>
            <div>
              <dt>Data de atualização da fonte</dt>
              <dd>{formatDate(property.data_atualizacao_fonte)}</dd>
            </div>
          </dl>
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Instituições participantes</h2>
          {property.instituicoes.length === 0 ? (
            <EmptyState title="Sem instituições informadas" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Instituição</span>
                <span>Papel</span>
              </div>
              {property.instituicoes.map((link, index) => (
                <div className="table-row" key={index}>
                  <span>
                    <Link href={`/instituicoes/${link.instituicao.id}`}>
                      {link.instituicao.nome}
                    </Link>
                    {link.instituicao.sigla ? ` (${link.instituicao.sigla})` : ""}
                  </span>
                  <span>{link.papel}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Pesquisadores e inventores</h2>
          {property.pesquisadores.length === 0 ? (
            <EmptyState title="Sem pesquisadores ou inventores informados" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Inventor</span>
                <span>Papel</span>
                <span>Ordem</span>
              </div>
              {property.pesquisadores.map((link, index) => (
                <div className="table-row" key={index}>
                  <span>
                    {link.pesquisador ? (
                      <Link href={`/pesquisadores/${link.pesquisador.id}`}>
                        {link.nome_inventor}
                      </Link>
                    ) : (
                      link.nome_inventor
                    )}
                  </span>
                  <span>{link.papel ?? "Não informado"}</span>
                  <span>{link.ordem ?? "Não informado"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="kit-panel">
          <h2>Associações NIT–PI</h2>
          {property.nits.length === 0 ? (
            <EmptyState
              title="Sem associações NIT–PI"
              description="A ausência de associação é distinta de uma associação não confirmada."
            />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>NIT</span>
                <span>Status</span>
                <span>Método de identificação</span>
                <span>Método de validação</span>
                <span>Identificação</span>
                <span>Validação</span>
                <span>Evidência</span>
              </div>
              {property.nits.map((association) => (
                <div
                  className="table-row"
                  key={`${association.nit.id}-${association.propriedade_intelectual.id}`}
                >
                  <span>
                    <Link href={`/nits/${association.nit.id}`}>
                      {association.nit.nome}
                    </Link>
                  </span>
                  <span>
                    <ValidationTag
                      status={association.status_validacao}
                      nit={association.nit}
                      data_validacao={association.data_validacao}
                      referencia_evidencia={association.referencia_evidencia}
                    />
                  </span>
                  <span>{formatMetodoIdentificacao(association.metodo_identificacao)}</span>
                  <span>{formatMetodoValidacao(association.metodo_validacao)}</span>
                  <span>{formatDate(association.data_identificacao)}</span>
                  <span>{formatDate(association.data_validacao)}</span>
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
