import type { Metadata } from "next";

import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Fontes e metodologia",
};

export default function FontesPage() {
  return (
    <>
      <PageHero
        title="Fontes e metodologia"
        description="Procedência, período de referência e critérios de integração dos registros."
      />

      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Procedência dos registros</h2>
          <p>
            Os registros apresentados são demonstrativos e seguem o modelo
            simplificado do observatório. Cada registro preserva os campos de
            procedência disponíveis, como identificador BADEPI e data de
            atualização da fonte, além das referências de evidência das
            associações NIT–PI.
          </p>
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Dicionário de campos relevantes</h2>
          <div className="compact-table">
            <div className="table-row table-head">
              <span>Campo</span>
              <span>Significado</span>
            </div>
            {[
              ["identificador_badepi", "Identificador do registro de propriedade intelectual na fonte."],
              ["data_atualizacao_fonte", "Data de atualização do registro na fonte."],
              ["referencia_evidencia", "Referência usada para validar uma associação NIT–PI."],
              ["id_simcc", "Identificador institucional disponível para o pesquisador."],
              ["id_lattes", "Identificador Lattes disponível para o pesquisador."],
              ["orcid", "Identificador ORCID disponível para o pesquisador."],
              ["tipo_localizacao", "Tipo de presença da instituição no município: sede, campus ou unidade."],
            ].map(([field, description]) => (
              <div className="table-row" key={field}>
                <span>
                  <code>{field}</code>
                </span>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="kit-panel" style={{ marginBottom: 24 }}>
          <h2>Identificação e validação NIT–PI</h2>
          <p>
            A relação entre uma propriedade intelectual e um NIT é registrada
            como associação NIT–PI. A associação pode ser identificada por
            vínculo de pesquisador ou por nome de inventor e possui um status de
            validação: pendente, confirmada, não confirmada ou inconclusiva.
          </p>
          <p>
            A ausência de associação é distinta de uma associação não
            confirmada. “PI validada” significa apenas
            <code> status_validacao = CONFIRMADA</code>. O frontend não altera
            o status da associação.
          </p>
        </div>

        <div className="kit-panel">
          <h2>Critérios de leitura</h2>
          <ul>
            <li>NIT e instituição têm relação de um para um.</li>
            <li>Uma instituição pode existir sem NIT identificado.</li>
            <li>Uma PI pode envolver múltiplas instituições e pesquisadores.</li>
            <li>Municípios são relacionados aos Territórios de Identidade.</li>
            <li>Dados ausentes não são convertidos em zero.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
