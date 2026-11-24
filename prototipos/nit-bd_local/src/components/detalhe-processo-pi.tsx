"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useConsulta } from "@/hooks/use-consulta";
import { dimensaoClassificacao, papelParticipacao } from "@/lib/apresentacao";
import type { DetalhePI, FontePI } from "@/lib/pi-types";

type Participante = {
  id: string; nome: string; municipio: string; uf: string; ancora_bahia: boolean;
  papeis: string[]; fonte_identidade: string; fontes: FontePI[];
  territorio: { nome: string; fonte: string; ressalva: string } | null;
};

type Detalhe = DetalhePI & {
  processo: DetalhePI["processo"] & { titulo: string | null };
  compartilhado: boolean;
  participantes_confirmados: Participante[];
  campos_especificos?: { campo: string; rotulo: string; valor: string | null }[];
};

function dataLegivel(valor: string | null) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:[ T]|$)/.exec(valor?.trim() ?? "");
  const br = /^(\d{2})\/(\d{2})\/(\d{4})(?: |$)/.exec(valor?.trim() ?? "");
  const [ano, mes, dia] = iso ? [iso[1], iso[2], iso[3]] : br ? [br[3], br[2], br[1]] : [];
  if (!ano || !mes || !dia) return null;
  const data = new Date(Date.UTC(+ano, +mes - 1, +dia));
  return data.getUTCFullYear() === +ano && data.getUTCMonth() === +mes - 1 && data.getUTCDate() === +dia
    ? `${dia}/${mes}/${ano}` : null;
}

function FonteTecnica({ fonte }: { fonte: FontePI }) {
  return <details className="jd-processo-origem">
    <summary>{fonte.arquivo} · ocorrência {fonte.registro_logico}</summary>
    {fonte.row_hash && <dl><dt>ID da ocorrência</dt><dd>{fonte.raw_id}</dd><dt>Hash da linha</dt><dd>{fonte.row_hash}</dd>
      <dt>Execução do ETL</dt><dd>{fonte.execucao_etl_id}</dd><dt>Hash do arquivo</dt><dd>{fonte.membro_sha256}</dd>
      <dt>Hash do ZIP</dt><dd>{fonte.zip_sha256}</dd></dl>}
    {fonte.url_oficial && <a href={fonte.url_oficial} target="_blank" rel="noopener noreferrer">Fonte oficial do INPI</a>}
  </details>;
}

function Andamentos({ url, inicial }: { url: string; inicial: Detalhe["despachos"] }) {
  const [pagina, setPagina] = useState(1);
  const consulta = useConsulta<Detalhe>(pagina === 1 ? null : `${url}&pagina=${pagina}`);
  const eventos = pagina === 1 ? inicial : consulta.data?.despachos;
  const paginas = Math.ceil(inicial.total / 10);

  if (!inicial.total) return <p>Nenhum andamento associado nesta edição da fonte.</p>;

  return <>
    <p>Publicações da Revista da Propriedade Industrial (RPI). O histórico pode conter repetições da fonte.</p>
    {consulta.erro && pagina > 1 ? <p role="alert">{consulta.erro} <button onClick={consulta.retry}>Tentar novamente</button></p>
      : eventos ? <ol className="jd-processo-eventos">{eventos.items.map(e => <li key={e.fonte.raw_id}>
        <strong>{e.descricao_original?.trim() || "Despacho sem descrição na fonte"}</strong>
        <p>{dataLegivel(e.data_publicacao) ?? "Sem data utilizável"}{e.rpi_original?.trim() && ` · RPI ${e.rpi_original.trim()}`}
          {e.codigo_original?.trim() && ` · Código ${e.codigo_original.trim()}`}</p>
        <FonteTecnica fonte={e.fonte} />
      </li>)}</ol> : <p role="status">Consultando andamentos…</p>}
    {paginas > 1 && <nav className="jd-pagination" aria-label="Paginação dos andamentos">
      <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>Anteriores</button>
      <span>Página {pagina} de {paginas}</span>
      <button disabled={pagina >= paginas} onClick={() => setPagina(p => p + 1)}>Próximos</button>
    </nav>}
  </>;
}

export function DetalheProcessoPI({ pid, fechar, base, titulo, filtros }: {
  pid: string; fechar: () => void; base: string; titulo: string; filtros: string;
}) {
  const url = `${base}/${encodeURIComponent(pid)}?${filtros}`;
  const { data: detalhe, erro, retry } = useConsulta<Detalhe>(url);
  const cabecalho = useRef<HTMLElement>(null);
  useEffect(() => {
    cabecalho.current?.focus();
    cabecalho.current?.scrollIntoView({ block: "start" });
  }, []);

  const entrada = dataLegivel(detalhe?.data_entrada_original ?? null);
  const deposito = dataLegivel(detalhe?.data_deposito_original ?? null);
  return <article className="jd-pi-detalhe jd-processo" ref={cabecalho} tabIndex={-1} aria-label="Detalhe do processo">
    <header className="jd-processo-cabecalho">
      <div><p className="section-eyebrow">{titulo}{detalhe && ` · Processo ${detalhe.processo.numero_original}`}</p>
        <h2>{detalhe ? detalhe.processo.titulo || "Título indisponível na fonte" : "Detalhe do processo"}</h2></div>
      <button onClick={fechar}>Fechar detalhe</button>
    </header>
    {erro ? <p role="alert">{erro} <button onClick={retry}>Tentar novamente</button></p>
      : !detalhe ? <p role="status">Consultando detalhe…</p> : <>
        <dl className="jd-processo-datas">
          {entrada && entrada === deposito ? <div><dt>Entrada e depósito no INPI</dt><dd>{entrada}</dd></div> : <>
            <div><dt>Entrada no INPI</dt><dd>{entrada ?? (detalhe.processo.ano_entrada || "Sem data utilizável")}</dd></div>
            <div><dt>Depósito no INPI</dt><dd>{deposito ?? "Sem data utilizável"}</dd></div>
          </>}
          <div><dt>Situação jurídica atual</dt><dd>Não verificada</dd></div>
        </dl>
        <section className="jd-processo-partes">
          <h3>{detalhe.compartilhado ? "Processo compartilhado" : "Participação institucional confirmada"}</h3>
          <ul>{detalhe.participantes_confirmados.map(p => <li key={p.id}>
            <Link href={`/instituicoes/${p.id}`}>{p.nome}</Link>
            <p>{p.papeis.map(papel => papelParticipacao(papel.toLowerCase())).join(", ")} · {p.municipio}/{p.uf}
              {!p.ancora_bahia && " · Coparticipante externa"}{p.territorio && ` · ${p.territorio.nome}`}</p>
          </li>)}</ul>
          <p className="jd-muted">Acompanhamento do processo pelo NIT sem confirmação na fonte.</p>
        </section>
        <details className="jd-processo-secao"><summary>Histórico no INPI ({detalhe.despachos.total})</summary>
          <Andamentos url={url} inicial={detalhe.despachos} />
        </details>
        <details className="jd-processo-secao"><summary>Classificações e dados do pedido</summary>
          {detalhe.classificacoes.length ? <ul>{detalhe.classificacoes.map(c => <li key={c.fonte.raw_id+c.dimensao}>
            <strong>{dimensaoClassificacao(c.dimensao)} · {c.codigo_original.trim() || "Sem código"}</strong>
            {c.descricao_original?.trim() && <p>{c.descricao_original}</p>}
            {c.versao_original?.trim() && <small>Versão {c.versao_original}</small>}
            <FonteTecnica fonte={c.fonte} />
          </li>)}</ul> : <p>Sem classificação associada nesta edição.</p>}
          {!!detalhe.campos_especificos?.length && <dl>{detalhe.campos_especificos.map(c => <div key={c.campo}>
            <dt>{c.rotulo}</dt><dd>{c.valor?.trim() || "Sem informação na fonte"}</dd></div>)}</dl>}
        </details>
        <details className="jd-processo-secao"><summary>Fontes e rastreabilidade</summary>
          <h4>Dados do pedido</h4>
          <p>Entrada original: {detalhe.data_entrada_original || "Sem informação"}. Depósito original: {detalhe.data_deposito_original || "Sem informação"}.</p>
          <ul>{detalhe.processo.titulos_originais.map((t, i) => <li key={i}>{t.trim() || "Título ausente na ocorrência"}</li>)}</ul>
          {detalhe.fontes_centrais.map(f => <FonteTecnica key={f.raw_id} fonte={f} />)}
          <h4>Vínculos institucionais</h4>
          <p>A participação documentada no processo sustenta a consulta. Parceria formal e titularidade atual exigem evidências próprias.</p>
          {detalhe.participantes_confirmados.map(p => <div key={p.id} className="jd-evidence">
            <strong>{p.nome}</strong>{p.fonte_identidade && <p><a href={p.fonte_identidade} target="_blank" rel="noopener noreferrer">Evidência de identidade</a></p>}
            {p.territorio && <p>{p.territorio.ressalva} <a href={p.territorio.fonte} target="_blank" rel="noopener noreferrer">Fonte territorial</a></p>}
            {p.fontes.map(f => <FonteTecnica key={f.raw_id} fonte={f} />)}
          </div>)}
          <h4>Lacunas da fonte</h4>
          <ul>{detalhe.processo.achados.map((a,i) => <li key={i}>{a.codigo.replaceAll("_", " ")} · {a.campo}</li>)}
            {detalhe.lacunas.map((l,i) => <li key={i}>{l.dataset_filho}: {l.estado.replaceAll("_", " ")}</li>)}
            {Object.entries(detalhe.pendencias_por_estado).map(([k,n]) => <li key={k}>{k.replaceAll("_", " ")}: {n} ocorrências</li>)}</ul>
          {detalhe.participantes_resumo.map(p => <p key={p.papel}>{papelParticipacao(p.papel.toLowerCase())}: {p.ocorrencias} ocorrências na fonte.</p>)}
        </details>
      </>}
  </article>;
}
