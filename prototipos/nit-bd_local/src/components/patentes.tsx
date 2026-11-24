"use client";
import Link from "next/link";
import { useConsulta as useData } from "@/hooks/use-consulta";
import { useState } from "react";
import { DetalheProcessoPI } from "@/components/detalhe-processo-pi";
import { IndicadorAtos, type AtosObservados } from "@/components/atos-pi";
import { ListaProcessosPI, type ItemCatalogoPI } from "@/components/lista-processos-pi";
import styles from "./filtros-pi.module.css";

type Ref = {id:string;sigla:string;nome:string;municipio:string;codigo_ibge:string;territorio:string|null};
export type ReferenciaFiltroPI = Pick<Ref, "id" | "sigla" | "nome">;
type Opcoes = {instituicoes:Ref[];territorios:string[];classificacoes:{dimensao:string;codigo:string;versao:string|null;descricao?:string}[];eventos:string[];especificos?:Record<string,string[]>};
export type ResumoCatalogoPI = {meta?:{limites_modalidade:string[];estado_cobertura:string;amostra?:boolean};total:number;series:{ano:number|null;total:number}[];cobertura:{sem_titulo:number;sem_classificacao:number;sem_eventos:number};pendentes_no_piloto:number;pedidos_no_filtro:number;atos_observados:AtosObservados;compartilhados_no_filtro:number;territorios:{nome:string;total:number}[]};
type Lista = {total:number;items:ItemCatalogoPI[]};
export type ModalidadeCatalogo = "PTN"|"PRG"|"MRC"|"DI"|"IG"|"TCI";
export type FiltrosIniciaisPI = { instituicao?: string; territorio?: string; anoEvento?: string };
export const baseCatalogoPI = (modalidade: ModalidadeCatalogo) =>
  modalidade === "PTN" ? "/api/jd/patentes" : `/api/jd/pi-catalogos/${modalidade}`;
const configs:Record<ModalidadeCatalogo,{titulo:string;classificacao:string}> = {
 PTN:{titulo:"Patentes",classificacao:"IPC / campo tecnológico"},
 PRG:{titulo:"Programas de computador",classificacao:"Tipo de programa"},
 MRC:{titulo:"Marcas",classificacao:"Classe Nice e revisão"},
 DI:{titulo:"Desenhos industriais",classificacao:"Classificação Locarno e versão"},
 IG:{titulo:"Indicações geográficas",classificacao:"Classificação WIPO"},
 TCI:{titulo:"Topografias de circuitos integrados",classificacao:"Classificação não disponível nesta fonte"}
};
export function Patentes(){return <CatalogoPI modalidade="PTN"/>;}
export function CatalogoPI({instituicaoPerfil,modalidade="PTN",tituloSecundario=false,anoInicial,filtrosIniciais}:{
 instituicaoPerfil?:ReferenciaFiltroPI; modalidade?:ModalidadeCatalogo; tituloSecundario?:boolean;
 anoInicial?:string; filtrosIniciais?:FiltrosIniciaisPI;
}){
 const Titulo = tituloSecundario ? "h2" : "h1";
 const [somenteAtos, setSomenteAtos] = useState(!!filtrosIniciais?.anoEvento);
 const [soCompartilhados, setSoCompartilhados] = useState(false);
 const cfg=configs[modalidade];const base=baseCatalogoPI(modalidade);
 const [natureza,Snatureza]=useState("");const [apresentacao,Sapresentacao]=useState("");const [tipoIG,StipoIG]=useState("");const [servico,Sservico]=useState("");
 const anoExato = anoInicial === "SEM_ANO" ? "" : (anoInicial ?? "");
 const [de,Sde]=useState(anoExato);
 const [ate,Sate]=useState(anoExato);
 const [cob,Scob]=useState(anoInicial === "SEM_ANO" ? "SEM_ANO" : "");
 const [instituicaoSelecionada,Sinst]=useState(filtrosIniciais?.instituicao ?? "");
 const inst=instituicaoPerfil?.id ?? instituicaoSelecionada;
 const [ti,Sti]=useState(filtrosIniciais?.territorio ?? "");
 const [evAno,SevAno]=useState(filtrosIniciais?.anoEvento ?? "");
 const [q,Sq]=useState("");const [classe,Sclasse]=useState("");const [mun,Smun]=useState("");const [ev,Sev]=useState("");const [pagina,Spag]=useState(1);const [pid,Spid]=useState("");
 const escopoPerfil = instituicaoPerfil ? new URLSearchParams({ instituicao: instituicaoPerfil.id }).toString() : "";
 const op=useData<Opcoes>(`${base}/opcoes?${escopoPerfil}`);
 const params=new URLSearchParams();if(inst)params.set("instituicao",inst);if(q.trim())params.set("q",q.trim());if(de)params.set("ano_de",de);if(ate)params.set("ano_ate",ate);if(cob)params.set("cobertura",cob);if(mun)params.set("municipio",mun);if(ti)params.set("territorio",ti);if(ev)params.set("evento",ev);if(evAno)params.set("ano_evento",evAno);if(somenteAtos)params.set("medida","ATOS");if(soCompartilhados)params.set("compartilhados","true");
 if(classe){const [d,c,v]=JSON.parse(classe) as [string,string,string|null];params.set("dimensao",d);params.set("codigo",c);if(v!==null)params.set("versao",v);}
 if(natureza)params.set("natureza",natureza);if(apresentacao)params.set("apresentacao",apresentacao);if(tipoIG)params.set("tipo_ig",tipoIG);if(servico)params.set("servico",servico);
 const resumo=useData<ResumoCatalogoPI>(`${base}/resumo?${params}`);const list=useData<Lista>(`${base}?${params}&pagina=${pagina}&por_pagina=20`);
 function change(fn:(v:string)=>void,v:string){fn(v);Spag(1);Spid("");}
 function limparFiltros() {
   setSomenteAtos(false);
   setSoCompartilhados(false);
   [Sinst, Sq, Sde, Sate, Sclasse, Scob, Smun, Sti, Sev, SevAno, Snatureza, Sapresentacao, StipoIG, Sservico]
     .forEach(limpar => limpar(""));
   Spag(1);
   Spid("");
 }
 const err=resumo.erro||list.erro||op.erro;
 const vinculosPendentes = resumo.data?.meta?.estado_cobertura === "SEM_ASSOCIACAO_INSTITUCIONAL_CONFIRMADA";
 const especificos = op.data?.especificos;
 const municipios = [...new Map(op.data?.instituicoes.map(r => [r.codigo_ibge, r]) ?? []).values()];
 return <section className="jd-panel jd-patentes"><Titulo>{cfg.titulo}</Titulo>
 <p>Consulte pedidos das referências institucionais mapeadas.</p>
 {vinculosPendentes && <p><strong>Vínculos institucionais a confirmar.</strong> {modalidade === "IG"
   ? "Há nove processos com participante de UF Bahia declarada aguardando confirmação do vínculo."
   : "A edição da BADEPI não trouxe participante com UF Bahia declarada para TCI."}{" "}
   <Link className="jd-source" href="/cobertura">Consultar fontes e cobertura</Link>
 </p>}
 <details className="jd-processo-secao"><summary>Cobertura e limites dos dados</summary>
   <aside className="jd-notice"><strong>Consulta técnica em revisão</strong><p>Regra JD_BAHIA_1.0.0. A participação no processo e a situação jurídica têm critérios próprios de conferência.</p></aside>
   {resumo.data?.meta?.limites_modalidade && <ul>{resumo.data.meta.limites_modalidade.map(l=><li key={l}>{l}</li>)}</ul>}
   {resumo.data && <ul>
     <li>{resumo.data.cobertura.sem_titulo} sem título</li>
     <li>{resumo.data.cobertura.sem_classificacao} sem classificação</li>
     <li>{resumo.data.cobertura.sem_eventos} sem eventos associados</li>
   </ul>}
   {!instituicaoPerfil && resumo.data && !resumo.data.meta?.amostra && <p>{resumo.data.pendentes_no_piloto} casos pendentes das referências mapeadas, fora da lista elegível.</p>}
 </details>
 <fieldset className={styles.filtros}>
   <legend>Filtros</legend>
   <div className={styles.campos}>
     <label className={styles.instituicao}>Instituição
       <select value={inst} disabled={!!instituicaoPerfil}
         title={instituicaoPerfil ? `${instituicaoPerfil.sigla} · ${instituicaoPerfil.nome}` : undefined}
         onChange={e => change(Sinst, e.target.value)}>
         {instituicaoPerfil
           ? <option value={instituicaoPerfil.id}>{instituicaoPerfil.sigla} · {instituicaoPerfil.nome}</option>
           : <>
             <option value="">Todas as referências</option>
             {op.data?.instituicoes.map(r => <option value={r.id} key={r.id}>{r.sigla} · {r.nome}</option>)}
           </>}
       </select>
     </label>
     <label>{modalidade === "TCI" ? "Número do processo" : "Número ou título"}
       <input type="search" value={q} onChange={e => change(Sq, e.target.value)} />
     </label>
     <label>Ano inicial
       <input type="number" min="1000" max="9999" value={de} onChange={e => change(Sde, e.target.value)} />
     </label>
     <label>Ano final
       <input type="number" min="1000" max="9999" value={ate} onChange={e => change(Sate, e.target.value)} />
     </label>
     <label>{cfg.classificacao}
       <select value={classe} disabled={!op.data?.classificacoes.length} onChange={e => change(Sclasse, e.target.value)}>
         <option value="">{op.data && !op.data.classificacoes.length ? "Sem classificação disponível" : "Todas as classificações"}</option>
         {op.data?.classificacoes.map(c => {
           const chave = JSON.stringify([c.dimensao, c.codigo, c.versao]);
           return <option key={chave} value={chave}>
             {c.dimensao}: {c.codigo}{c.versao && ` · ${c.versao}`}{c.descricao && ` · ${c.descricao}`}
           </option>;
         })}
       </select>
     </label>
     {modalidade === "MRC" && <>
       <label>Natureza da marca
         <select value={natureza} disabled={!especificos?.CD_NATUREZ_MARCA?.length} onChange={e => change(Snatureza, e.target.value)}>
           <option value="">Todas</option>
           {especificos?.CD_NATUREZ_MARCA?.map(v => <option key={v}>{v}</option>)}
         </select>
       </label>
       <label>Apresentação da marca
         <select value={apresentacao} disabled={!especificos?.CD_APRESEN_MARCA?.length} onChange={e => change(Sapresentacao, e.target.value)}>
           <option value="">Todas</option>
           {especificos?.CD_APRESEN_MARCA?.map(v => <option key={v}>{v}</option>)}
         </select>
       </label>
     </>}
     {modalidade === "IG" && <label>Tipo de IG
       <select value={tipoIG} disabled={!especificos?.TIPO_IG?.length} onChange={e => change(StipoIG, e.target.value)}>
         <option value="">{especificos?.TIPO_IG?.length ? "Todos os tipos" : "Sem tipo disponível"}</option>
         {especificos?.TIPO_IG?.map(v => <option key={v}>{v}</option>)}
       </select>
     </label>}
     {modalidade === "TCI" && <label>Serviço protocolado
       <select value={servico} disabled={!especificos?.CODSERVICO?.length} onChange={e => change(Sservico, e.target.value)}>
         <option value="">{especificos?.CODSERVICO?.length ? "Todos os serviços" : "Sem serviço disponível"}</option>
         {especificos?.CODSERVICO?.map(v => <option key={v}>{v}</option>)}
       </select>
     </label>}
     <label>Participação institucional
       <select value={soCompartilhados ? "compartilhados" : ""} onChange={e => {
         setSoCompartilhados(!!e.target.value); Spag(1); Spid("");
       }}>
         <option value="">Todos os processos</option>
         <option value="compartilhados">Somente processos compartilhados</option>
       </select>
     </label>
     <label>Município da referência
       <select value={mun} onChange={e => change(Smun, e.target.value)}>
         <option value="">Todos</option>
         {municipios.map(r => <option key={r.codigo_ibge} value={r.codigo_ibge}>{r.municipio}</option>)}
       </select>
     </label>
     <label>Território da referência
       <select value={ti} disabled={!op.data?.territorios.length} onChange={e => change(Sti, e.target.value)}>
         <option value="">{op.data && !op.data.territorios.length ? "Validação territorial pendente" : "Todos os territórios"}</option>
         {op.data?.territorios.map(t => <option key={t} value={t}>{t}</option>)}
       </select>
     </label>
     <label>Lacuna
       <select value={cob} onChange={e => change(Scob, e.target.value)}>
         <option value="">Todas</option>
         <option value="SEM_TITULO">Sem título</option>
         <option value="SEM_CLASSE">Sem classificação</option>
         <option value="SEM_EVENTO">Sem eventos</option>
         <option value="SEM_ANO">Sem ano de entrada</option>
       </select>
     </label>
     <label>Medida
       <select value={somenteAtos ? "ATOS" : "PEDIDOS"} disabled={vinculosPendentes} onChange={e => {
         setSomenteAtos(e.target.value === "ATOS"); Spag(1); Spid("");
       }}>
         <option value="PEDIDOS">Pedidos</option>
         <option value="ATOS">Processos com ato publicado</option>
       </select>
     </label>
     <label>Código de evento
       <select value={ev} onChange={e => change(Sev, e.target.value)}>
         <option value="">Todos</option>
         {op.data?.eventos.map(c => <option key={c}>{c}</option>)}
       </select>
     </label>
     <label>Ano de publicação do evento
       <input type="number" min="1000" max="9999" value={evAno} onChange={e => change(SevAno, e.target.value)} />
     </label>
     <div className={styles.acoes}>
       <button className={styles.limpar} type="button" onClick={limparFiltros}>Limpar filtros</button>
       <a className={styles.exportar} href={`${base}/exportar?${params}`}>Exportar lista (CSV)</a>
     </div>
   </div>
 </fieldset>
 {err?<div role="alert" className="jd-error"><p>{err}</p><button onClick={()=>{resumo.retry();list.retry();op.retry();}}>Tentar novamente</button></div>:<>
 <details className="jd-processo-secao"><summary>Indicadores e séries</summary>
 {resumo.data ? <><IndicadorAtos atos={resumo.data.atos_observados} pedidos={vinculosPendentes ? null : resumo.data.pedidos_no_filtro}
   selecionarAno={vinculosPendentes ? undefined : ano=>{setSomenteAtos(true);change(SevAno,String(ano));}} /><details><summary>{somenteAtos ? "Ano de entrada dos processos com ato" : "Série por ano de entrada no INPI"}</summary><div className="jd-patentes-serie">{resumo.data.series.map(s=><button key={s.ano??"sem-ano"} onClick={()=>{const ano=s.ano ? String(s.ano) : "";Sde(ano);Sate(ano);Scob(ano ? "" : "SEM_ANO");Spag(1);Spid("");}}>{s.ano??"Sem ano"}: <strong>{s.total}</strong></button>)}</div><p>Mesmos filtros da lista. A série conta processos; categorias e instituições podem se sobrepor.</p></details>
 <p>{resumo.data.compartilhados_no_filtro.toLocaleString("pt-BR")} processos compartilhados neste filtro.</p>
 {!!resumo.data?.territorios.length && <details><summary>Processos por território validado</summary>
   <div className="jd-patentes-serie">{resumo.data.territorios.map(t=><button key={t.nome} type="button" onClick={()=>change(Sti,t.nome)}>{t.nome} · {t.total}</button>)}</div>
 </details>}
 </> : <p role="status">Consultando indicadores…</p>}
 </details>
 {list.data?<><h2>Processos encontrados ({list.data.total})</h2>{!list.data.total&&<p>{somenteAtos ? "Sem processo com ato documentado neste filtro. Consulte o período da fonte em Indicadores e séries." : "Sem ocorrência elegível neste filtro. Isso não comprova ausência de produção ou atividade institucional."}</p>}<ListaProcessosPI itens={list.data.items} abrir={Spid} rotulo={modalidade === "PTN" ? "Patentes encontradas" : cfg.titulo} /><nav className="jd-pagination" aria-label="Paginação de processos"><button disabled={pagina===1} onClick={()=>Spag(p=>p-1)}>Anterior</button><span>Página {pagina} de {Math.max(1,Math.ceil(list.data.total/20))}</span><button disabled={pagina*20>=list.data.total} onClick={()=>Spag(p=>p+1)}>Próxima</button></nav></>:<p role="status">Consultando lista…</p>}</>}
 {pid&&<DetalheProcessoPI key={pid} pid={pid} base={base} titulo={cfg.titulo} filtros={params.toString()} fechar={()=>{Spid("");requestAnimationFrame(()=>document.getElementById(`abrir-${pid}`)?.focus());}}/>}
 </section>;
}
