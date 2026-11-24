"use client";

import Link from "next/link";
import { useState } from "react";
import { useConsulta } from "@/hooks/use-consulta";
import { numero } from "@/lib/apresentacao";
import type { PresencaTerritorialData } from "@/lib/types";
import mapa from "@/lib/territorios-mapa.json";
import { baseCatalogoPI, type ModalidadeCatalogo, type ResumoCatalogoPI } from "./patentes";
import { MedidaGeral } from "./visao-geral";
import geral from "./visao-geral.module.css";
import styles from "./indicadores-jd.module.css";

const modalidades = [
  ["PTN", "Patentes", "PT"], ["PRG", "Programas de computador", "SW"], ["MRC", "Marcas", "MR"],
  ["DI", "Desenhos industriais", "DI"], ["IG", "Indicações geográficas", "IG"], ["TCI", "Topografias de circuitos integrados", "TCI"],
] as const;

type AnoPI = ResumoCatalogoPI["series"][number];
type OpcoesPI = { instituicoes: { id: string; sigla: string; nome: string }[]; territorios: string[] };
type Presenca = PresencaTerritorialData["items"][number];

function consultaPI(modalidade: ModalidadeCatalogo, filtros: URLSearchParams, ano?: AnoPI["ano"], publicacao = false) {
  const params = new URLSearchParams(filtros);
  params.set("modalidade", modalidade);
  if (ano !== undefined) {
    if (publicacao && ano !== null) params.set("ano_evento", String(ano));
    else params.set("ano", ano === null ? "SEM_ANO" : String(ano));
  }
  return `/propriedade-intelectual?${params}#consulta-pi`;
}

function SerieAnual({ itens, destino }: { itens: AnoPI[]; destino: (ano: AnoPI["ano"]) => string }) {
  const maior = Math.max(1, ...itens.map(item => item.total));
  return <ul className={styles.serie}>
    {itens.map(({ ano, total }) => <li key={ano ?? "SEM_ANO"}>
      <Link href={destino(ano)} aria-label={`Consultar ${numero(total)} processos · ${ano ?? "Sem ano informado"}`}>
        <span>{ano ?? "Sem ano informado"}</span>
        <progress max={maior} value={total} aria-hidden="true" />
        <strong>{numero(total)}</strong>
      </Link>
    </li>)}
  </ul>;
}

function agruparPresenca(itens: Presenca[], campo: "territorio" | "municipio") {
  const grupos = new Map<string, { instituicoes: number; unidades: number }>();
  for (const item of itens) {
    const grupo = grupos.get(item[campo]) ?? { instituicoes: 0, unidades: 0 };
    if (item.tipo === "UNIDADE") grupo.unidades++;
    else grupo.instituicoes++;
    grupos.set(item[campo], grupo);
  }
  return [...grupos].sort(([a], [b]) => a.localeCompare(b, "pt-BR"));
}

function QuadroPresenca({ dados, campo, titulo }: {
  dados: Presenca[]; campo: "territorio" | "municipio"; titulo: string;
}) {
  const grupos = agruparPresenca(dados, campo);
  return <div className="jd-panel">
    <h3>{titulo}</h3>
    <div className="jd-table-wrap">
      <table className={styles.tabela} aria-label={titulo}>
        <thead><tr><th scope="col">{campo === "territorio" ? "Território" : "Município"}</th>
          <th scope="col">Instituições</th><th scope="col">Campi / unidades</th></tr></thead>
        <tbody>{grupos.map(([nome, grupo]) => <tr key={nome}>
          <th scope="row">{nome}</th><td>{numero(grupo.instituicoes)}</td><td>{numero(grupo.unidades)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    {!grupos.length && <p>Nenhum vínculo territorial publicado.</p>}
  </div>;
}

function PresencaNosIndicadores() {
  const { data, erro, repetir } = useConsulta<PresencaTerritorialData>("/api/jd/presenca-territorial");
  const totalTerritorios = data && new Set(data.items.map(item => item.territorio)).size;
  return <section aria-labelledby="titulo-presenca-indicadores">
    <h2 id="titulo-presenca-indicadores">Presença institucional</h2>
    {erro ? <p role="alert">{erro} <button type="button" onClick={repetir}>Tentar novamente</button></p> :
      data ? <>
        <p><strong>{numero(totalTerritorios ?? 0)} de {numero(mapa.length)} territórios</strong> têm vínculos publicados.
          As tabelas contam referências cadastradas de sede, campus ou unidade.</p>
        <div className={styles.paineis}>
          <QuadroPresenca dados={data.items} campo="territorio" titulo="Por território" />
          <QuadroPresenca dados={data.items} campo="municipio" titulo="Por município" />
        </div>
        <p><Link className="jd-source" href="/#presenca-territorial">Abrir mapa de presença institucional</Link></p>
      </> : <p role="status">Consultando a presença institucional…</p>}
  </section>;
}

export function IndicadoresJD() {
  const [instituicao, setInstituicao] = useState("");
  const [territorio, setTerritorio] = useState("");
  const [modalidade, setModalidade] = useState<ModalidadeCatalogo>("PTN");
  const opcoes = useConsulta<OpcoesPI>("/api/jd/patentes/opcoes");
  const filtros = new URLSearchParams();
  if (instituicao) filtros.set("instituicao", instituicao);
  if (territorio) filtros.set("territorio", territorio);
  const rota = (codigo: ModalidadeCatalogo) => `${baseCatalogoPI(codigo)}/resumo?${filtros}`;
  const patentes = useConsulta<ResumoCatalogoPI>(rota("PTN"));
  const programas = useConsulta<ResumoCatalogoPI>(rota("PRG"));
  const marcas = useConsulta<ResumoCatalogoPI>(rota("MRC"));
  const desenhos = useConsulta<ResumoCatalogoPI>(rota("DI"));
  const indicacoes = useConsulta<ResumoCatalogoPI>(rota("IG"));
  const topografias = useConsulta<ResumoCatalogoPI>(rota("TCI"));
  const consultas = { PTN: patentes, PRG: programas, MRC: marcas, DI: desenhos, IG: indicacoes, TCI: topografias };
  const atual = consultas[modalidade];
  const dados = atual.data;
  const atos = dados?.atos_observados;
  const confirmacaoPendente = dados?.meta?.estado_cobertura === "SEM_ASSOCIACAO_INSTITUCIONAL_CONFIRMADA";
  const falhas = Object.values(consultas).filter(consulta => consulta.erro);

  return <div className={styles.conteudo}>
    <section aria-labelledby="titulo-pi-indicadores">
      <h2 id="titulo-pi-indicadores">Propriedade intelectual</h2>
      <div className={styles.filtros} role="group" aria-label="Filtros de propriedade intelectual">
        <label>Instituição
          <select value={instituicao} disabled={!opcoes.data} onChange={event => setInstituicao(event.target.value)}>
            <option value="">Todas as referências</option>
            {opcoes.data?.instituicoes.map(item => <option key={item.id} value={item.id}>{item.sigla} · {item.nome}</option>)}
          </select>
        </label>
        <label>Território da referência
          <select value={territorio} disabled={!opcoes.data} onChange={event => setTerritorio(event.target.value)}>
            <option value="">Todos os territórios</option>
            {opcoes.data?.territorios.map(nome => <option key={nome}>{nome}</option>)}
          </select>
        </label>
        <button className="jd-button" type="button" onClick={() => { setInstituicao(""); setTerritorio(""); setModalidade("PTN"); }}>Limpar filtros</button>
      </div>
      {opcoes.erro && <p role="alert">{opcoes.erro} <button type="button" onClick={opcoes.repetir}>Tentar novamente</button></p>}
      <div className={`${geral.gradeMedidas} ${styles.cartoes}`}>
        {modalidades.map(([codigo, rotulo, icone]) => {
          const consulta = consultas[codigo];
          const contagem = consulta.data;
          const pendente = contagem?.meta?.estado_cobertura === "SEM_ASSOCIACAO_INSTITUCIONAL_CONFIRMADA";
          const valor = consulta.erro ? "Indisponível" : !contagem ? "…" : pendente ? "A confirmar" : numero(contagem.total);
          return <Link key={codigo} className={geral.medida} href={consultaPI(codigo, filtros)}>
            <MedidaGeral icone={icone} rotulo={rotulo} valor={valor} fonte="BADEPI v12 · INPI"
              detalhe={pendente ? "Vínculos institucionais sem confirmação" : "Pedidos no recorte baiano"} />
          </Link>;
        })}
      </div>
      {falhas.length > 0 && <p role="alert">Parte dos indicadores está indisponível.{" "}
        <button type="button" onClick={() => falhas.forEach(consulta => consulta.repetir())}>Tentar novamente</button></p>}
      <label className={styles.modalidade}>Modalidade das séries
        <select value={modalidade} onChange={event => setModalidade(event.target.value as ModalidadeCatalogo)}>
          {modalidades.map(([codigo, rotulo]) => <option key={codigo} value={codigo}>{rotulo}</option>)}
        </select>
      </label>
      {atual.erro ? <p role="status">As séries desta modalidade estão indisponíveis nesta consulta.</p> :
        !dados ? <p role="status">Consultando séries…</p> : <div className={styles.paineis}>
          <section className="jd-panel">
            <h3>Pedidos por ano de entrada</h3>
            {confirmacaoPendente ? <p>Vínculos institucionais a confirmar.</p> : dados.series.length ?
              <SerieAnual itens={dados.series} destino={ano => consultaPI(modalidade, filtros, ano)} /> :
              <p>Sem pedidos elegíveis neste filtro.</p>}
          </section>
          <section className="jd-panel">
            <h3>Atos por ano de publicação</h3>
            {atos && <p>{atos.rotulo}. A série conta processos distintos por ano de publicação.</p>}
            {atos?.series.length ? <SerieAnual itens={atos.series} destino={ano => consultaPI(modalidade, filtros, ano, true)} /> :
              <p>{atos?.total == null ? "Medida indisponível para esta modalidade no recorte." : "Sem atos publicados neste filtro."}</p>}
            <p><Link className="jd-source" href="/cobertura">Consultar fontes e cobertura</Link></p>
          </section>
        </div>}
    </section>
    <PresencaNosIndicadores />
    <section className={styles.lacunas} aria-label="Integrações pendentes">
      <p><strong>Pesquisadores</strong> · A integrar</p>
      <p><strong>Tecnologias</strong> · A integrar</p>
    </section>
  </div>;
}
