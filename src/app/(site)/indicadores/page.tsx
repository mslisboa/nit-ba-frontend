import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHero } from "@/components/ui/PageHero";
import { getIndicators } from "@/services/endpoints/indicadores";

export const metadata: Metadata = {
  title: "Indicadores",
};

export default async function IndicadoresPage() {
  const indicators = await getIndicators();

  return (
    <>
      <PageHero
        title="Indicadores"
        description="Leitura transparente dos registros disponíveis, com distribuição por modalidade, território e status de validação."
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="kit-stat-grid" style={{ marginBottom: 24 }}>
          <MetricCard
            value={indicators.nits}
            label="NITs"
            detail={`${indicators.nits_ativos} ativos · ${indicators.nits_em_consolidacao} em consolidação`}
            icon="N"
          />
          <MetricCard value={indicators.instituicoes} label="Instituições" icon="I" />
          <MetricCard value={indicators.pesquisadores} label="Pesquisadores" icon="P" />
          <MetricCard
            value={indicators.propriedades_intelectuais}
            label="Registros de PI"
            detail={`${indicators.propriedades_intelectuais_validadas} validados`}
            icon="PI"
          />
        </div>

        <div className="kit-insight-grid">
          <section className="kit-panel">
            <h2>Status de validação NIT–PI</h2>
            <div className="compact-table">
              <div className="table-row table-head">
                <span>Status</span>
                <span>Quantidade</span>
              </div>
              {indicators.por_status_validacao.map((item) => (
                <div className="table-row" key={item.status}>
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="kit-panel">
            <h2>Modalidades de PI</h2>
            {indicators.por_modalidade.length === 0 ? (
              <EmptyState title="Sem modalidades informadas" />
            ) : (
              <div className="compact-table">
                <div className="table-row table-head">
                  <span>Modalidade</span>
                  <span>Quantidade</span>
                </div>
                {indicators.por_modalidade.map((item) => (
                  <div className="table-row" key={item.label}>
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="kit-panel" style={{ marginTop: 24 }}>
          <h2>Distribuição por território</h2>
          <div className="compact-table">
            <div className="table-row table-head">
              <span>Território</span>
              <span>Instituições</span>
              <span>NITs</span>
              <span>Pesquisadores</span>
              <span>PIs</span>
            </div>
            {indicators.por_territorio.map((item) => (
              <div className="table-row" key={item.territorio.id}>
                <span>{item.territorio.nome}</span>
                <span>{item.instituicoes}</span>
                <span>{item.nits}</span>
                <span>{item.pesquisadores}</span>
                <span>{item.propriedades_intelectuais}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="kit-panel" style={{ marginTop: 24 }}>
          <h2>Distribuição por município</h2>
          <div className="compact-table">
            <div className="table-row table-head">
              <span>Município</span>
              <span>Instituições</span>
            </div>
            {indicators.por_municipio.map((item) => (
              <div className="table-row" key={item.municipio.id}>
                <span>{item.municipio.nome}</span>
                <span>{item.instituicoes}</span>
              </div>
            ))}
          </div>
          <p className="kit-footnote" style={{ marginTop: 12 }}>
            Período de referência: {indicators.data_referencia ?? "Não informado"}.
            “PI validada” considera apenas associações com status
            <code> CONFIRMADA</code>.
          </p>
        </section>
      </section>
    </>
  );
}
