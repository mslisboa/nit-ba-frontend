export type AtosObservados = {
  rotulo: string;
  total: number | null;
  processos_com_codigo_sem_data: number | null;
  estado: "ATOS_DOCUMENTADOS" | "SEM_ANO_NA_FONTE" | "SEM_VINCULO_INSTITUCIONAL" | "CODIGO_AMBIGUO";
  anos: [number, number][];
  codigos: Record<string, string>;
  fontes_adicionais?: string[];
  arquivo: string;
  limite: string;
  series: { ano: number; total: number }[];
};

const motivo: Record<AtosObservados["estado"], string> = {
  ATOS_DOCUMENTADOS: "",
  SEM_ANO_NA_FONTE: "A fonte recebida não contém publicações datadas no ano selecionado.",
  SEM_VINCULO_INSTITUCIONAL: "A contagem institucional depende da confirmação dos vínculos.",
  CODIGO_AMBIGUO: "A interpretação do código depende de conferência por ocorrência.",
};

export function IndicadorAtos({ atos, pedidos, selecionarAno }: {
  atos: AtosObservados;
  pedidos: number | null;
  selecionarAno?: (ano: number) => void;
}) {
  const formatar = (n: number | null) => n === null ? "Indisponível" : n.toLocaleString("pt-BR");
  const anos = atos.anos.map(([de, ate]) => de === ate ? String(de) : `${de}–${ate}`).join(", ");
  return <section aria-label="Pedidos e atos publicados">
    <h2>Pedidos e atos publicados</h2>
    <div className="jd-metrics">
      <div><span>Pedidos observados no filtro</span><strong>{formatar(pedidos)}</strong></div>
      <div><span>Processos com ato publicado no filtro</span><strong>{formatar(atos.total)}</strong></div>
    </div>
    <p><strong>{atos.rotulo}.</strong> Anos com publicação datada no arquivo nacional <code>{atos.arquivo}</code> · {anos}.</p>
    {motivo[atos.estado] && <p>{motivo[atos.estado]}</p>}
    <p>{atos.limite} As contagens indicam publicações observadas e não determinam vigência atual.</p>
    {!!atos.processos_com_codigo_sem_data && <p>{atos.processos_com_codigo_sem_data} processo(s) com código verificado e despacho sem data utilizável, fora da contagem desse ato.</p>}
    {!!atos.series.length && <details><summary>Série por ano de publicação do ato</summary>
      <div className="jd-patentes-serie">{atos.series.map(s => selecionarAno ? <button type="button" key={s.ano} onClick={() => selecionarAno(s.ano)}>
        {s.ano} · <strong>{s.total}</strong>
      </button> : <span key={s.ano}>{s.ano} · {s.total}</span>)}</div>
      <p>Cada processo conta uma vez no total do filtro e pode aparecer em mais de um ano.</p>
    </details>}
    <details><summary>Códigos e referências do INPI</summary>
      <ul>{Object.entries(atos.codigos).map(([codigo, url]) => <li key={codigo}><a href={url} target="_blank" rel="noopener noreferrer">Código {codigo} no INPI</a></li>)}
        {atos.fontes_adicionais?.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">Referência histórica {index + 1}</a></li>)}</ul>
    </details>
  </section>;
}
