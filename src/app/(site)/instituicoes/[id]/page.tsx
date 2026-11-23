import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { getInstitutionById } from "@/services/endpoints/instituicoes";
import { getMunicipalityById } from "@/services/endpoints/municipios";
import { formatLocationType } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Detalhe da instituição",
};

export default async function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const institution = await getInstitutionById(Number(id));

  if (!institution) {
    notFound();
  }

  const municipalities = await Promise.all(
    (institution.municipios ?? []).map(async (item) => ({
      ...item,
      territorio:
        (await getMunicipalityById(item.municipio.id))?.territorio ?? null,
    })),
  );

  return (
    <>
      <PageHero
        title={institution.nome}
        description="Informações gerais, NIT relacionado, presença territorial, pesquisadores e propriedade intelectual."
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Breadcrumb
          items={[
            { href: "/", label: "Início" },
            { href: "/instituicoes", label: "Instituições" },
            { label: institution.nome },
          ]}
        />

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Informações gerais</h2>
          <dl className="detail-list">
            <div>
              <dt>Sigla</dt>
              <dd>{institution.sigla ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Natureza</dt>
              <dd>{institution.natureza ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{institution.tipo ?? "Não informado"}</dd>
            </div>
            <div>
              <dt>Site</dt>
              <dd>
                {institution.site ? (
                  <a href={institution.site} target="_blank" rel="noreferrer">
                    {institution.site}
                  </a>
                ) : (
                  "Não informado"
                )}
              </dd>
            </div>
            <div>
              <dt>NIT relacionado</dt>
              <dd>
                {institution.nit ? (
                  <Link href={`/nits/${institution.nit.id}`}>
                    {institution.nit.nome}
                  </Link>
                ) : (
                  "Sem NIT identificado"
                )}
              </dd>
            </div>
            <div>
              <dt>Territórios</dt>
              <dd>
                {institution.territorios.length > 0
                  ? institution.territorios.map((territory) => territory.nome).join(", ")
                  : "Não informado"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Presença em municípios</h2>
          {municipalities.length ? (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Município</span>
                <span>Tipo de localização</span>
                <span>Território</span>
              </div>
              {municipalities.map((item, index) => (
                <div className="table-row" key={`${item.municipio.id}-${index}`}>
                  <span>{item.municipio.nome}</span>
                  <span>{formatLocationType(item.tipo_localizacao)}</span>
                  <span>{item.territorio?.nome ?? "Não informado"}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem presença municipal informada" />
          )}
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Pesquisadores</h2>
          {institution.pesquisadores.length === 0 ? (
            <EmptyState title="Sem pesquisadores vinculados" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Pesquisador</span>
              </div>
              {institution.pesquisadores.map((pesquisador) => (
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
          {institution.propriedades_intelectuais.length === 0 ? (
            <EmptyState title="Sem registros de PI vinculados" />
          ) : (
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Propriedade intelectual</span>
                <span>Modalidade</span>
                <span>Número de processo</span>
              </div>
              {institution.propriedades_intelectuais.map((property) => (
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
