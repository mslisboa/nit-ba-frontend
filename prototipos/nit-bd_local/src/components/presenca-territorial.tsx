"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useConsulta } from "@/hooks/use-consulta";
import { plural } from "@/lib/apresentacao";
import type { PresencaTerritorialData } from "@/lib/types";
import mapa from "@/lib/territorios-mapa.json";
import { LogoInstitucional } from "./cartao-instituicao";
import styles from "./presenca-territorial.module.css";

const nomes = mapa.map(({ nome }) => nome).sort((a, b) => a.localeCompare(b, "pt-BR"));
const normalizar = (texto: string) => texto.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR").trim();
type FiltroReferencia = { tipo: "estrutura" | "instituicao"; id: string };

export function PresencaTerritorial({ id }: { id?: string }) {
  const titulo = useId();
  const campoBusca = useRef<HTMLInputElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const [selecionado, setSelecionado] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroReferencia, setFiltroReferencia] = useState<FiltroReferencia | null>(null);
  const [seletorRedefinido, setSeletorRedefinido] = useState<FiltroReferencia["tipo"] | null>(null);
  const { data, erro, repetir } = useConsulta<PresencaTerritorialData>("/api/jd/presenca-territorial");
  const referencias = data?.referencias ?? [];
  const porId = new Map(referencias.map(ref => [ref.id, ref]));
  const publicados = data?.items ?? [];
  const associados = new Set(publicados.map(item => item.territorio));
  const termo = normalizar(busca);
  const filtrando = Boolean(termo || filtroReferencia);
  const consultaAtiva = Boolean(selecionado || filtrando);
  const referenciaSelecionada = filtroReferencia ? porId.get(filtroReferencia.id) : undefined;
  const tituloReferencia = filtroReferencia?.tipo === "estrutura" ? referenciaSelecionada?.estrutura : referenciaSelecionada?.nome;
  const tituloResultado = selecionado || tituloReferencia ||
    (termo ? `Resultados para “${busca.trim()}”` : "");
  const filtrados = publicados.filter(item =>
    (!filtroReferencia || item.id === filtroReferencia.id) &&
    normalizar([item.nome, item.sigla, item.municipio, item.territorio, porId.get(item.id)?.estrutura].join(" ")).includes(termo)
  );
  const relacionados = new Set(filtrados.map(item => item.territorio));
  const opcoes = filtrando ? nomes.filter(nome =>
    relacionados.has(nome) || (!filtroReferencia && normalizar(nome).includes(termo))
  ) : nomes;
  const resultados = consultaAtiva ? filtrados.filter(item => !selecionado || item.territorio === selecionado) : [];
  const contagens = nomes.map(nome => ({ nome, total: publicados.filter(item => item.territorio === nome).length }))
    .filter(item => item.total > 0).sort((a, b) => b.total - a.total);
  const barras = contagens.filter((item, indice) => indice < 5 || item.nome === selecionado);
  const statusBusca = filtrando
    ? `${opcoes.length} ${plural(opcoes.length, "território relacionado à busca", "territórios relacionados à busca")}`
    : `${mapa.length} territórios disponíveis`;

  function selecionarReferencia(tipo: FiltroReferencia["tipo"], id: string) {
    setSeletorRedefinido(id && filtroReferencia && filtroReferencia.tipo !== tipo ? filtroReferencia.tipo : null);
    setFiltroReferencia(id ? { tipo, id } : null);
    setSelecionado("");
  }

  function limpar() {
    setBusca("");
    setFiltroReferencia(null);
    setSeletorRedefinido(null);
    setSelecionado("");
    campoBusca.current?.focus();
  }

  return <>
    <section id={id} className={`jd-panel ${styles.secao}`} aria-labelledby={titulo}>
      <div className={styles.cabecalho}>
        <div>
          <h2 id={titulo}>Presença institucional por território</h2>
          <p>Explore os {mapa.length} territórios da Bahia. Selecione uma região para conhecer as instituições e estruturas de inovação com vínculo territorial publicado.</p>
        </div>
        <Link href="/instituicoes">Consultar catálogo</Link>
      </div>
      <div className={styles.busca} role="search" aria-label="Busca territorial">
        <label>Buscar território, instituição ou NIT
          <input ref={campoBusca} type="search" value={busca} maxLength={120}
            placeholder="Ex.: Recôncavo, UFBA ou Salvador"
            onChange={event => { setBusca(event.target.value); setSelecionado(""); }} />
        </label>
        <button type="button" onClick={limpar}>Limpar filtros</button>
        <span role="status">{statusBusca}</span>
      </div>

      <div className={styles.grade}>
        <div className={styles.cartografia}>
          <svg viewBox="0 0 620 680" role="group" aria-label="Mapa dos Territórios de Identidade da Bahia">
            {mapa.map(({ id: codigo, nome, d }) => <path key={codigo} d={d} fillRule="evenodd"
              role="button" tabIndex={0} aria-label={nome} aria-pressed={nome === selecionado}
              data-presenca={associados.has(nome)} data-atenuado={!opcoes.includes(nome)}
              onClick={() => setSelecionado(nome)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelecionado(nome);
                }
              }}>
              <title>{nome}</title>
            </path>)}
          </svg>
          <div className={styles.legenda}>
            <span>Território de Identidade</span><span>Com vínculo publicado</span>
          </div>
          <a className="jd-source" href="https://www.ba.gov.br/seplan/iniciativas/acesse-informacoes-sobre-territorios-de-identidade-planejamento-e-gestao-territorial-0">Limites territoriais · SEI Bahia / SEPLAN</a>
        </div>

        <div className={styles.painel}>
          <label>Escolha um território
            <select value={selecionado} onChange={event => setSelecionado(event.target.value)}>
              <option value="">Todos os territórios</option>
              {nomes.filter(nome => opcoes.includes(nome) || nome === selecionado).map(nome => <option key={nome}>{nome}</option>)}
            </select>
          </label>
          <div className={styles.filtros}>
            <label>Nome do NIT ou estrutura de inovação
              <select value={filtroReferencia?.tipo === "estrutura" ? filtroReferencia.id : ""}
                data-redefinido={seletorRedefinido === "estrutura"}
                onChange={event => selecionarReferencia("estrutura", event.target.value)}>
                <option value="">Todas as estruturas</option>
                {referencias.filter(ref => ref.estrutura).map(ref => <option key={ref.id} value={ref.id}>{ref.estrutura} — {ref.sigla}</option>)}
              </select>
            </label>
            <label>Nome da instituição
              <select value={filtroReferencia?.tipo === "instituicao" ? filtroReferencia.id : ""}
                data-redefinido={seletorRedefinido === "instituicao"}
                onChange={event => selecionarReferencia("instituicao", event.target.value)}>
                <option value="">Todas as instituições e unidades</option>
                {referencias.map(ref => <option key={ref.id} value={ref.id}>{ref.sigla} — {ref.nome}</option>)}
              </select>
            </label>
          </div>

          <div className={styles.resultados} ref={painel} tabIndex={-1} hidden={!consultaAtiva && !erro} aria-live="polite" aria-atomic="true">
            {tituloResultado && <h3>{tituloResultado}</h3>}
            {!data && !erro && <p>Consultando a presença institucional…</p>}
            {erro && <p>Presença institucional indisponível. <button type="button" onClick={repetir}>Tentar novamente</button></p>}
            {consultaAtiva && data && !resultados.length && <p>{selecionado
              ? associados.has(selecionado) ? "Nenhum vínculo publicado neste território corresponde aos filtros." : "O JD ainda não tem vínculo institucional publicado para este território."
              : "Nenhum vínculo territorial publicado corresponde à busca."}</p>}
            {!!resultados.length && <>
              <p>{resultados.length} {plural(resultados.length, "referência com vínculo publicado", "referências com vínculo publicado")}</p>
              <ul className={styles.referencias}>
                {resultados.map(item => <li key={item.id}>
                  <Link href={`/instituicoes/${item.id}`}>
                    <div className={styles.logoReferencia} aria-hidden="true"><LogoInstitucional sigla={item.sigla} /></div>
                    <div>
                      <strong>{item.nome} — {item.sigla}</strong>
                      {porId.get(item.id)?.estrutura && <small>{porId.get(item.id)?.estrutura}</small>}
                      <small>{item.municipio} · {item.tipo === "UNIDADE" ? "Campus / unidade" : "Instituição"} · {item.territorio}</small>
                    </div>
                  </Link>
                </li>)}
              </ul>
            </>}
          </div>
          {data && <ul className={styles.cobertura}>
            <li><b>{publicados.length}</b> {plural(publicados.length, "referência publicada", "referências publicadas")} em <b>{associados.size}</b> {plural(associados.size, "território", "territórios")}</li>
            <li><b>{data.sem_territorio_publicado}</b> {plural(data.sem_territorio_publicado, "referência baiana", "referências baianas")} sem vínculo territorial publicado</li>
            <li><b>{data.fora_bahia}</b> {plural(data.fora_bahia, "referência", "referências")} com localização fora da Bahia</li>
          </ul>}
          <p className={styles.nota}>O mapa indica a localização da sede ou unidade. A área de atendimento do NIT depende de evidência própria.</p>
        </div>
      </div>
    </section>
    {!!barras.length && <section className={`jd-panel ${styles.grafico}`}>
      <h2>Inovação pelo estado</h2>
      <p>Selecione uma barra para consultar as referências publicadas no território.</p>
      {barras.map(item => <button key={item.nome} type="button" className={styles.barra} aria-pressed={selecionado === item.nome}
        onClick={() => {
          setBusca("");
          setFiltroReferencia(null);
          setSeletorRedefinido(null);
          setSelecionado(item.nome);
          requestAnimationFrame(() => painel.current?.focus());
        }}>
        <span>{item.nome} <b>{item.total}</b></span>
        <progress value={item.total} max={contagens[0].total} aria-label={`Referências publicadas em ${item.nome}`} />
      </button>)}
    </section>}
  </>;
}
