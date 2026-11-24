import type { ItemPI } from "@/lib/pi-types";

export type ItemCatalogoPI = ItemPI & {
  titulo: string | null;
  compartilhado: boolean;
  instituicoes_confirmadas: { sigla: string; nome: string; ancora_bahia: boolean }[];
  codigos_classificacao: string[];
  campos_modalidade: Record<string, string | null>;
};

const classificacao: Partial<Record<ItemPI["modalidade"], string>> = {
  PRG: "Tipo de programa", MRC: "Classe Nice", DI: "Locarno", IG: "Classificação WIPO",
};

export function ListaProcessosPI({ itens, abrir, rotulo }: {
  itens: ItemCatalogoPI[]; abrir: (id: string) => void; rotulo: string;
}) {
  return <ul className="jd-lista-processos" aria-label={rotulo}>
    {itens.map(p => <li key={p.processo_id}>
      <button className="jd-lista-processos-titulo" id={`abrir-${p.processo_id}`} onClick={() => abrir(p.processo_id)}
        aria-label={`Ver detalhe de ${p.numero_original}`}>
        {p.titulo || "Título indisponível na fonte"}
      </button>
      <dl>
        <div><dt>Número do processo</dt><dd>{p.numero_original}</dd></div>
        <div><dt>Ano de entrada</dt><dd>{p.ano_entrada ?? "Não informado"}</dd></div>
        <div><dt>{p.instituicoes_confirmadas.length === 1 ? "Instituição" : "Instituições"}</dt>
          <dd>{p.instituicoes_confirmadas.map(i => <span key={i.sigla}>{i.nome}{!i.ancora_bahia && " (coparticipante externa)"}</span>)}</dd>
        </div>
      </dl>
      {classificacao[p.modalidade] && <p className="jd-lista-processos-campo"><strong>{classificacao[p.modalidade]}</strong>{" · "}
        {p.codigos_classificacao.slice(0, 3).join(", ") || "Sem classificação na fonte"}
        {p.codigos_classificacao.length > 3 && ` · mais ${p.codigos_classificacao.length - 3} no detalhe`}</p>}
      {p.modalidade === "IG" && p.campos_modalidade.TIPO_IG && <p>Tipo de IG · {p.campos_modalidade.TIPO_IG}</p>}
      {p.modalidade === "TCI" && p.campos_modalidade.CODSERVICO && <p>Serviço protocolado · {p.campos_modalidade.CODSERVICO}</p>}
    </li>)}
  </ul>;
}
