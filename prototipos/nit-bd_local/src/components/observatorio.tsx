"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Lista, PerfilData, CoberturaData, PresencaTerritorialData } from "@/lib/types";
import { useConsulta } from "@/hooks/use-consulta";
import { linksInstitucionais } from "@/lib/links-institucionais";
import { PerfilPI } from "@/components/perfil-pi";
import { CartaoInstituicao, LogoInstitucional, MedidasInstitucionais } from "@/components/cartao-instituicao";
import { FaixaGeral } from "@/components/visao-geral";
import styles from "./institucional.module.css";

import { modalidades, numero, plural, papelLocalizacao, nomeEstrutura, estadoInstitucional, type ModalidadeIndicador } from "@/lib/apresentacao";

function Mensagem({ erro, repetir }: { erro?: string; repetir: () => void }) {
  return <div className={erro ? "jd-error" : "jd-loading"} role={erro ? "alert" : "status"}>
    <h2>{erro ? "Consulta indisponível" : "Consultando os dados…"}</h2>
    <p>{erro ?? "Carregando as referências e suas fontes."}</p>
    {erro && <button className="jd-button" onClick={repetir}>Tentar novamente</button>}
  </div>;
}

function linkPublico(href?: string) {
  return href && /^https?:\/\/\S+$/i.test(href) ? href : undefined;
}

function Fonte({ href, children = "Consultar fonte", className = "jd-source" }: { href?: string; children?: ReactNode; className?: string }) {
  const url = linkPublico(href);
  return url ? <a className={className} href={url} target="_blank" rel="noopener noreferrer">{children}</a> : <span>Fonte não disponível</span>;
}

export function Catalogo({ buscaInicial = "", tipoInicial = "INSTITUIÇÃO" }: {
  buscaInicial?: string;
  tipoInicial?: "INSTITUIÇÃO" | "UNIDADE";
}) {
  const [busca, setBusca] = useState(buscaInicial);
  const [q, setQ] = useState(buscaInicial.length >= 2 ? buscaInicial : "");
  const [municipio, setMunicipio] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [nit, setNit] = useState("");
  const [tipo, setTipo] = useState<string>(tipoInicial);
  const [visualizacao, setVisualizacao] = useState<"grande" | "lista">("grande");
  const termo = busca.trim();
  const termoValido = termo.length >= 2 ? termo : "";
  useEffect(() => {
    const espera = window.setTimeout(() => setQ(termoValido), termoValido ? 250 : 0);
    return () => window.clearTimeout(espera);
  }, [termoValido]);

  const params = new URLSearchParams({ tipo, todos: "true" });
  const opcoes = useConsulta<Lista>(`/api/jd/instituicoes?${params}`);
  if (q) {
    params.set("q", q);
    params.set("buscar_campi", "true");
  }
  if (municipio) params.set("municipio", municipio);
  if (modalidade) params.set("modalidade", modalidade);
  const filtrandoNaApi = Boolean(q || municipio || modalidade);
  const filtrados = useConsulta<Lista>(filtrandoNaApi ? `/api/jd/instituicoes?${params}` : null);
  const { data, erro, repetir } = filtrandoNaApi ? filtrados : opcoes;
  const resultado = nit ? data?.items.filter(item => item.id === nit) : data?.items;
  const total = resultado?.length ?? 0;
  const nits = opcoes.data?.items.filter(item =>
    item.estado_estrutura === "ESTRUTURA DOCUMENTADA NO PERÍODO DA FONTE" && item.estrutura.trim()
  ).sort((a, b) => a.estrutura.localeCompare(b.estrutura, "pt-BR"));
  const presenca = useConsulta<PresencaTerritorialData>("/api/jd/presenca-territorial").data;
  const porReferencia = new Map(presenca?.items.map(item => [item.id, item.territorio]));
  function limparFiltros() {
    setBusca("");
    setQ("");
    setTipo("INSTITUIÇÃO");
    setMunicipio("");
    setModalidade("");
    setNit("");
  }
  return <>
    <FaixaGeral titulo="NITs e Instituições"
      resumo={data ? <><strong>{numero(total)}</strong><b>{plural(total, "referência", "referências")}</b><small>no filtro atual</small></> : undefined} />
    <div className={styles.barraCatalogo}>
      <span>Referências do JD · <Link href="/cobertura">Fontes e cobertura</Link></span>
    </div>
    <form className={`jd-filters ${styles.filtrosCatalogo}`} role="search" onSubmit={e => { e.preventDefault(); setQ(termoValido); }}>
      <label className={styles.buscaCatalogo}>Buscar instituição, NIT ou campus
        <input type="search" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Nome, sigla ou município" maxLength={160} />
      </label>
      <label>Referências<select value={tipo} onChange={e => { setTipo(e.target.value); setMunicipio(""); setNit(""); }}><option value="INSTITUIÇÃO">Instituições</option><option value="UNIDADE">Campi / unidades</option></select></label>
      <label>NIT ou estrutura
        <select value={nit} onChange={e => setNit(e.target.value)} disabled={!nits?.length}>
          <option value="">{nits?.length || !opcoes.data ? "Todos os NITs" : "Sem estrutura documentada"}</option>
          {nits?.map(item => <option key={item.id} value={item.id}>{item.estrutura} · {item.sigla}</option>)}
        </select>
      </label>
      <label>Natureza institucional
        <select disabled><option>A integrar</option></select>
      </label>
      <label>Município da referência<select value={municipio} onChange={e => setMunicipio(e.target.value)}><option value="">Todos os municípios</option>{opcoes.data?.municipios.map(m => <option key={m}>{m}</option>)}</select></label>
      <label>Com pedidos de<select value={modalidade} onChange={e => setModalidade(e.target.value)}><option value="">Todas as modalidades</option>{modalidades.map(([mod, label]) => <option key={mod} value={mod}>{label}</option>)}</select></label>
      <button className="jd-button" type="button" onClick={limparFiltros}>Limpar filtros</button>
    </form>
    {!data ? <Mensagem erro={erro} repetir={repetir} /> : <section aria-label="Resultados da consulta">
      <div className="catalog-heading">
        <div>
          <h2>{tipo === "UNIDADE" ? "Campi e unidades referenciados" : "Instituições referenciadas"}</h2>
          <p role="status">{numero(total)} {plural(total, "referência", "referências")} neste filtro</p>
        </div>
        <div className={styles.visualizacao} role="group" aria-label="Visualização dos resultados">
          <button type="button" aria-pressed={visualizacao === "grande"} onClick={() => setVisualizacao("grande")}>Grande</button>
          <button type="button" aria-pressed={visualizacao === "lista"} onClick={() => setVisualizacao("lista")}>Lista</button>
        </div>
      </div>
      {!total ? <div className="catalog-empty"><h3>Nenhuma referência neste filtro</h3></div> : <div className={visualizacao === "lista" ? styles.lista : styles.cartoes}>
        {resultado?.map(item => <CartaoInstituicao key={item.id} item={item} territorio={porReferencia.get(item.id)} campi={data.campi_encontrados?.[item.id]} compacto={visualizacao === "lista"} />)}
      </div>}
    </section>}
    <details className={styles.nota}><summary>Como interpretar o recorte BA</summary><p>A regra JD_BAHIA_1.0.0 usa o documento exato e o papel elegível da pessoa jurídica. Para uma sede de outro estado, o processo precisa ter vínculo comprovado com a Bahia.</p><p>Os cartões contam pedidos pelo recorte, e “—” indica uma lacuna de contagem. Um pedido compartilhado pode aparecer nos cartões de mais de uma instituição. A localização da referência e a carteira de PI do NIT exigem leituras próprias.</p></details>
  </>;
}

const abasPerfil = [
  ["sobre", "Sobre"], ["indicadores", "Indicadores"], ["pesquisadores", "Pesquisadores"],
  ["tecnologias", "Tecnologias"], ["propriedade", "Propriedade intelectual"],
  ["servicos", "Serviços e equipe"], ["formacao", "Formação"], ["eventos", "Eventos"], ["fontes", "Fontes"],
] as const;

type AbaPerfil = (typeof abasPerfil)[number][0];

function IndicadoresPerfil({ dados, modalidade, setModalidade, abrirPedidos }: {
  dados: PerfilData;
  modalidade: ModalidadeIndicador;
  setModalidade: (modalidade: ModalidadeIndicador) => void;
  abrirPedidos: (ano: string) => void;
}) {
  const serie = dados.series.filter(item => item.modalidade === modalidade);
  const maior = Math.max(1, ...serie.map(item => item.processos));

  return <section>
    <h2>Indicadores da instituição</h2>
    <p>Pedidos BADEPI por modalidade no recorte baiano. A série usa o ano de entrada.</p>
    <MedidasInstitucionais totais={dados.instituicao.totais} />
    <div className={styles.seriePerfil}>
      <h3>Pedidos por ano de entrada</h3>
      <label>Modalidade <select value={modalidade} onChange={event => setModalidade(event.target.value as ModalidadeIndicador)}>
        {modalidades.map(([codigo, rotulo]) => <option key={codigo} value={codigo}>{rotulo}</option>)}
      </select></label>
      {serie.length > 0 && <p>Selecione um ano para ver os pedidos.</p>}
      {serie.length ? <ul aria-label="Série anual de pedidos">
        {serie.map(({ ano_entrada, processos }) => {
          const ano = ano_entrada === "SEM_ANO" ? "Sem ano informado" : ano_entrada;
          return <li key={ano_entrada}><button type="button" id={`serie-perfil-${ano_entrada}`} className={styles.linhaSerie}
            aria-label={`Ver ${numero(processos)} ${plural(processos, "pedido", "pedidos")} · ${ano}`}
            onClick={() => abrirPedidos(ano_entrada)}>
            <span>{ano}</span>
            <progress max={maior} value={processos} aria-hidden="true" />
            <strong>{numero(processos)}</strong>
          </button></li>;
        })}
      </ul> : <p>Sem série disponível para esta modalidade no recorte.</p>}
    </div>
  </section>;
}

function FontesPerfil({ dados, presenca }: { dados: PerfilData; presenca?: PresencaTerritorialData["items"][number] }) {
  const { instituicao, estruturas_historicas, pendencias } = dados;
  const cadastro = instituicao.cadastro_validado;
  const dataLocal = (data: string) => new Date(data).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  return <>
    <section>
      <h2>Fontes e atualização</h2>
      <div className={styles.gradeFontes}>
        <article><h3>Estrutura de inovação</h3><p>{instituicao.periodo_estrutura}</p><Fonte href={instituicao.fonte_estrutura} /></article>
        <article><h3>Município da referência</h3><p>{instituicao.periodo_municipio}</p><Fonte href={instituicao.fonte_municipio} /></article>
        {presenca && <article><h3>Vínculo territorial</h3><p>{presenca.territorio}</p><Fonte href={presenca.fonte} /></article>}
      </div>
    </section>
    {cadastro && <section className={styles.blocoPerfil}>
      <h3>Cadastro validado publicado</h3>
      <p>Versão aprovada em {dataLocal(cadastro.aprovado_em)} (São Paulo).</p>
      {cadastro.validacoes_publicas?.some(v => v.resultado === "Validado com ressalva") &&
        <p className="jd-notice"><strong>Validado com ressalvas.</strong> Consulte o período e os limites de cada evidência.</p>}
      {Object.entries(cadastro.dados).map(([campo, valor]) => {
        const revisao = cadastro.validacoes_publicas?.find(v => v.campo === campo);
        return <div className="jd-evidence" key={campo}>
          <strong>{campo}</strong><p className="jd-preserve">{valor}</p>
          {/^https?:\/\//.test(valor) && <Fonte href={valor} />}
          {revisao && <>
            <p><span className="jd-pill">{revisao.resultado}</span></p>
            {revisao.ressalva && <p><strong>Ressalva:</strong> {revisao.ressalva}</p>}
            <p className="jd-muted">Evidência utilizada: {revisao.evidencia}</p>
            <p className="jd-muted">Conferido em {dataLocal(revisao.validado_em)} (São Paulo).</p>
          </>}
        </div>;
      })}
    </section>}
    <section className={styles.blocoPerfil}>
      <h3>Histórico de estruturas</h3>
      {estruturas_historicas.length ? estruturas_historicas.map((item, n) => <div className="jd-evidence" key={n}>
        <strong>{item.nome}</strong><p>{item.periodo}</p><Fonte href={item.fonte} />
      </div>) : <p>Histórico não disponível para esta referência.</p>}
    </section>
    <section className={styles.blocoPerfil}>
      <h3>Pendências específicas</h3>
      {pendencias.length ? pendencias.map((item, n) => <details key={n}>
        <summary>{item.campo}</summary><p>{item.situacao}</p><p>{item.fonte_necessaria}</p>
      </details>) : <p>Nenhuma pendência listada no cadastro.</p>}
    </section>
  </>;
}

function PerfilConteudo({ dados, presenca }: { dados: PerfilData; presenca?: PresencaTerritorialData["items"][number] }) {
  const [aba, setAba] = useState<AbaPerfil>("sobre");
  const [visitouPi, setVisitouPi] = useState(false);
  const [modalidadeIndicador, setModalidadeIndicador] = useState<ModalidadeIndicador>("PTN");
  const [consultaIndicador, setConsultaIndicador] = useState<{ modalidade: ModalidadeIndicador; ano: string; versao: number } | null>(null);
  const abas = useRef<Array<HTMLButtonElement | null>>([]);
  const item = dados.instituicao;
  const campus = item.tipo === "UNIDADE";
  const catalogo = campus ? "/instituicoes?tipo=UNIDADE" : "/instituicoes";
  const estrutura = nomeEstrutura(item);
  const cadastro = item.cadastro_validado?.dados;
  const links = linksInstitucionais[item.sigla];
  const siteInstitucional = linkPublico(cadastro?.["Site oficial da instituição / unidade"]) ?? links?.instituicao;
  const paginaInovacao = linkPublico(cadastro?.["Página oficial do NIT / equivalente"]) ?? links?.inovacao;
  const fonteNit = paginaInovacao ?? item.fonte_estrutura;
  const rotuloInovacao = links?.nitDocumentado ? "NIT" : "NIT ou estrutura de inovação";
  const lacunas = {
    pesquisadores: "O catálogo de pesquisadores ainda está pendente de integração ao JD.",
    tecnologias: "O JD ainda não tem um catálogo de tecnologias vinculado a este perfil. Consulte os pedidos na aba Propriedade intelectual.",
    formacao: "O JD ainda não tem registros de formação e capacitação integrados a este perfil.",
    eventos: "O JD ainda não tem uma agenda de eventos integrada a este perfil.",
  };
  function abrirAba(proxima: AbaPerfil) {
    setAba(proxima);
    if (proxima === "propriedade") setVisitouPi(true);
  }

  function abrirPedidos(ano: string) {
    setConsultaIndicador(anterior => ({ modalidade: modalidadeIndicador, ano, versao: (anterior?.versao ?? 0) + 1 }));
    abrirAba("propriedade");
    requestAnimationFrame(() => {
      const painel = document.getElementById("painel-perfil-propriedade");
      painel?.focus({ preventScroll: true });
      painel?.scrollIntoView({ block: "start" });
    });
  }

  return <>
    <FaixaGeral titulo="Perfil institucional" descricao="Instituição, estrutura de inovação, presença territorial e propriedade intelectual."
      paginaMae={{ href: catalogo, rotulo: "NITs e Instituições" }} />
    <Link className={styles.voltar} href={catalogo}>Voltar para NITs e Instituições</Link>
    <section className={styles.perfil} aria-label="Identificação institucional">
      <LogoInstitucional sigla={item.sigla} />
      <div>
        <span className="jd-pill">{item.sigla} · {campus ? "Campus / unidade" : "Instituição"}</span>
        <h2>{item.nome}</h2>
        <p><strong>{rotuloInovacao}:</strong>{" "}
          {paginaInovacao ? <Fonte href={paginaInovacao} className={styles.linkInovacao}>{estrutura}</Fonte> : estrutura}
        </p>
        <div className={styles.localizacao}>
          <span>{papelLocalizacao(item.papel_localizacao)} · {item.municipio}/{item.uf}</span>
          {presenca && <span>{presenca.territorio}</span>}
        </div>
      </div>
      {siteInstitucional && <Fonte href={siteInstitucional}>{campus ? "Site da unidade" : "Site da instituição"}</Fonte>}
    </section>

    <div className={styles.secoesPerfil} role="tablist" aria-label="Seções do perfil institucional">
      {abasPerfil.map(([chave, rotulo], indice) => <button key={chave} type="button" role="tab"
        ref={elemento => { abas.current[indice] = elemento; }}
        id={`aba-perfil-${chave}`} aria-controls={`painel-perfil-${chave}`}
        aria-selected={aba === chave} tabIndex={aba === chave ? 0 : -1}
        onClick={() => abrirAba(chave)}
        onKeyDown={event => {
          const ultima = abasPerfil.length - 1;
          const destino = event.key === "ArrowRight" ? (indice + 1) % abasPerfil.length :
            event.key === "ArrowLeft" ? (indice + ultima) % abasPerfil.length :
              event.key === "Home" ? 0 : event.key === "End" ? ultima : null;
          if (destino === null) return;
          event.preventDefault();
          abrirAba(abasPerfil[destino][0]);
          abas.current[destino]?.focus();
        }}>{rotulo}</button>)}
    </div>

    {abasPerfil.map(([chave, rotulo]) => <div key={chave} role="tabpanel" tabIndex={0}
      id={`painel-perfil-${chave}`} aria-labelledby={`aba-perfil-${chave}`}
      className={styles.painelPerfil} hidden={aba !== chave}>
      {chave === "propriedade" && visitouPi && <>
        {consultaIndicador && <button className={styles.voltar} type="button" onClick={() => {
          setModalidadeIndicador(consultaIndicador.modalidade);
          abrirAba("indicadores");
          requestAnimationFrame(() => document.getElementById(`serie-perfil-${consultaIndicador.ano}`)?.focus());
        }}>Voltar aos indicadores</button>}
        <aside className="jd-notice">
          <p>Acompanhamento de PI pelo NIT: {estadoInstitucional(item.vinculo_pi_nit)}.</p>
          {campus && <p>Os processos deste perfil usam o documento da unidade. A estrutura e os pedidos da reitoria são consultados no perfil da instituição.</p>}
          {item.uf !== "BA" && <p>A referência está em {item.municipio}/{item.uf}. Este perfil inclui processos com evidência de vínculo com a Bahia.</p>}
        </aside>
        <PerfilPI key={consultaIndicador?.versao ?? 0} instituicao={item}
          modalidadeInicial={consultaIndicador?.modalidade} anoInicial={consultaIndicador?.ano} />
      </>}
      {aba === chave && chave === "sobre" && <>
        <div className={styles.detalhesPerfil}>
          <section>
            <h2>Instituição e NIT</h2>
            <h3>Estrutura responsável pela inovação</h3>
            <p><strong>{estrutura}</strong></p>
            <p>{estadoInstitucional(item.estado_estrutura)}</p>
            <p className="jd-muted">{item.periodo_estrutura}</p>
            <Fonte href={fonteNit} />
            {campus && <p className="jd-notice">Campus com referência própria. A competência local da estrutura de inovação depende de evidência específica.</p>}
          </section>
          <section>
            <h3>Identificação e presença territorial</h3>
            <dl className={styles.fatosPerfil}>
              <div><dt>{campus ? "Campus / unidade" : "Instituição"}</dt><dd>{item.nome}</dd></div>
              <div><dt>Município da referência</dt><dd>{item.municipio}/{item.uf} · {papelLocalizacao(item.papel_localizacao)}</dd></div>
              <div><dt>Território de Identidade</dt><dd>{presenca?.territorio ?? (item.uf === "BA" ? "Vínculo territorial indisponível na consulta" : "Referência localizada fora da Bahia")}</dd></div>
              <div><dt>Cobertura de atendimento do NIT</dt><dd>Pendente de confirmação para esta referência</dd></div>
            </dl>
          </section>
        </div>
        <section className={styles.blocoPerfil}><h3>Como ler o perfil</h3>
          <p>A presença territorial se refere à localização da sede ou unidade. A cobertura de atendimento e o acompanhamento de processos pelo NIT exigem evidências próprias.</p>
        </section>
      </>}
      {aba === chave && chave === "indicadores" && <IndicadoresPerfil dados={dados} modalidade={modalidadeIndicador}
        setModalidade={setModalidadeIndicador} abrirPedidos={abrirPedidos} />}
      {aba === chave && chave === "servicos" && <section>
        <h2>Serviços e equipe</h2>
        <p>O JD ainda não tem um catálogo de serviços e equipe vinculado a este perfil.</p>
        <h3>Canais institucionais</h3>
        <p><Fonte href={fonteNit}>Consultar a fonte da estrutura de inovação</Fonte></p>
        {siteInstitucional && <p><Fonte href={siteInstitucional}>Acessar site da instituição</Fonte></p>}
      </section>}
      {aba === chave && chave === "fontes" && <FontesPerfil dados={dados} presenca={presenca} />}
      {aba === chave && chave in lacunas && <section className={styles.lacunaPerfil}>
        <h2>{rotulo}</h2><p>{lacunas[chave as keyof typeof lacunas]}</p>
      </section>}
    </div>)}
  </>;
}

export function Perfil({ id }: { id: string }) {
  const consulta = useConsulta<PerfilData>(`/api/jd/instituicoes/${id}`);
  const presenca = useConsulta<PresencaTerritorialData>("/api/jd/presenca-territorial").data;
  if (!consulta.data) return <Mensagem erro={consulta.erro} repetir={consulta.repetir} />;
  return <PerfilConteudo key={id} dados={consulta.data} presenca={presenca?.items.find(r => r.id === id)} />;
}

export function Cobertura() {
  const { data, erro, repetir } = useConsulta<CoberturaData>("/api/jd/cobertura");
  if (!data) return <Mensagem erro={erro} repetir={repetir} />;
  if (data.ambiente === "AMOSTRA") return <section className="jd-panel">
    <h1>Fontes e cobertura</h1>
    <h2>Amostra do JD Local</h2>
    <p>{data.referencias} referências institucionais e {data.processos} pedidos selecionados da BADEPI v12 · INPI.</p>
    <p>Foram escolhidos até dois pedidos por referência e modalidade, quando disponíveis. Um mesmo processo pode aparecer em perfis diferentes e é contado uma vez no catálogo geral.</p>
    <p>Os indicadores de PI, as listas e os CSVs refletem a mesma amostra. As lacunas de dados e de cobertura permanecem identificadas.</p>
    <ul>{data.limites.map(limite => <li key={limite}>{limite}</li>)}</ul>
  </section>;
  const extraidos = data.datasets.filter(d => d.estado === "PROJETADO").length;
  return <><div className="page-heading"><span className="section-eyebrow">Fontes, recortes e qualidade</span><h1>Cobertura da consulta</h1><p>O que está disponível e o que ainda depende de outra etapa.</p></div><section className="jd-panel"><h2>Dados institucionais e operacionais</h2><p>11 instituições e dois campi separados. Perfis, indicadores e catálogos de patentes, programas de computador, marcas e desenhos industriais usam a mesma projeção elegível no PostgreSQL JD.</p><p>Na camada operacional, {extraidos} dos {data.datasets.length} arquivos têm extração e projeção completas, com {numero(data.contagens.observacao ?? 0)} ocorrências preservadas. As demais extrações permanecem pendentes, sem concluir produção zero.</p><p>Fotografia carregada em {new Date(data.atualizado_em_utc).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} (São Paulo).</p></section><section className="jd-panel"><h2>Limites das medidas</h2><ul>{data.limites.map(l => <li key={l}>{l}</li>)}</ul><p>Na reconciliação com o Anuário foram conferidos 318 pontos: 152 coincidências, 87 diferenças e 79 pendências. A coincidência numérica não determina situação jurídica.</p></section><section className="jd-panel"><h2>Arquivos operacionais</h2><div className="jd-table-wrap"><table><thead><tr><th>Arquivo BADEPI</th><th>Cobertura</th><th>Ocorrências</th></tr></thead><tbody>{data.datasets.map(d => <tr key={d.id}><td>{d.id}</td><td>{d.estado === "PROJETADO" ? "Extração e projeção completas" : "Extração pendente"}</td><td>{d.registros == null ? "Não avaliado" : numero(d.registros)}</td></tr>)}</tbody></table></div></section></>;
}
