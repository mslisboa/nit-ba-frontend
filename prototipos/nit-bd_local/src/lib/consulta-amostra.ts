import dados from "./amostra-jd.json";
import type { ItemCatalogoPI } from "@/components/lista-processos-pi";
import type { AtosObservados } from "@/components/atos-pi";
import type { ModPI, DetalhePI } from "./pi-types";
import type { CampusEncontrado, PerfilData } from "./types";

type Referencia = { id: string; sigla: string; nome: string; municipio: string; codigo_ibge: string; territorio: string | null };
type Registro = {
  processo: ItemCatalogoPI;
  referencias: string[];
  classificacoes: DetalhePI["classificacoes"];
  eventos: DetalhePI["despachos"]["items"];
};
type Modalidade = {
  referencias: Referencia[];
  meta: { estado_cobertura?: string; limites_modalidade?: string[] };
  atos: Omit<AtosObservados, "total" | "series" | "processos_com_codigo_sem_data">;
};

const perfis = dados.perfis as unknown as Record<string, Omit<PerfilData, "series">>;
const campi = dados.campi as Record<string, CampusEncontrado[]>;
const modalidades = dados.modalidades as unknown as Record<ModPI, Modalidade>;
const processos = dados.processos as unknown as Record<ModPI, Registro[]>;
const aviso = "Amostra de processos públicos da BADEPI v12, com até dois pedidos selecionados por referência e modalidade. As contagens se limitam à amostra.";
export const dataAmostra = dados.data;

const unico = (valores: string[]) => Array.from(new Set(valores)).sort();
const normal = (texto: string) => texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function paginar<T>(items: T[], params: URLSearchParams, padrao = 20) {
  const pagina = Math.max(1, Math.trunc(Number(params.get("pagina"))) || 1);
  const por_pagina = Math.min(100, Math.max(1, Math.trunc(Number(params.get("por_pagina"))) || padrao));
  return { total: items.length, pagina, por_pagina, items: items.slice((pagina - 1) * por_pagina, pagina * por_pagina) };
}

function serie(anos: (number | null)[]) {
  const contagens = new Map<number | null, number>();
  for (const ano of anos) contagens.set(ano, (contagens.get(ano) ?? 0) + 1);
  return [...contagens].sort(([a], [b]) => (a ?? 0) - (b ?? 0)).map(([ano, total]) => ({ ano, total }));
}

const codigos = Object.keys(processos) as ModPI[];
function perfil(id: string) {
  const base = perfis[id];
  if (!base) return null;
  const selecionados = codigos.map(modalidade => ({
    modalidade,
    items: processos[modalidade].filter(r => r.referencias.includes(id)),
  }));
  const totais = selecionados.map(({ modalidade, items }) => ({
    modalidade, escopo: "RECORTE_BA", papel: "CONSOLIDADO", processos: items.length || null,
    estado: items.length ? "PILOTO_TECNICO" : "SEM_OCORRENCIA_ELEGIVEL", fonte: "Amostra · BADEPI v12",
  }));
  const series = selecionados.flatMap(({ modalidade, items }) => serie(items.map(r => r.processo.ano_entrada)).map(({ ano, total }) => ({
    modalidade, ano_entrada: ano === null ? "SEM_ANO" : String(ano), processos: total,
  })));
  return { ...base, instituicao: { ...base.instituicao, totais }, series };
}

function listarInstituicoes(params: URLSearchParams) {
  const tipo = params.get("tipo") ?? "INSTITUIÇÃO";
  const termo = normal(params.get("q") ?? "");
  const universo = Object.keys(perfis).map(id => perfil(id)!.instituicao).filter(ref => ref.tipo === tipo);
  const campi_encontrados: Record<string, CampusEncontrado[]> = {};
  const items = universo.filter(ref => {
    const unidades = termo && params.get("buscar_campi") === "true"
      ? (campi[ref.id] ?? []).filter(c => normal(`${c.sigla} ${c.nome} ${c.municipio}`).includes(termo)) : [];
    if (unidades.length) campi_encontrados[ref.id] = unidades;
    return (!params.has("municipio") || ref.municipio === params.get("municipio")) &&
      (!params.has("modalidade") || ref.totais.some(t => t.modalidade === params.get("modalidade") && t.processos)) &&
      (params.get("estrutura_documentada") !== "true" || ref.estado_estrutura === "ESTRUTURA DOCUMENTADA NO PERÍODO DA FONTE") &&
      (unidades.length > 0 || normal(`${ref.nome} ${ref.sigla} ${ref.estrutura} ${ref.municipio}`).includes(termo));
  }).sort((a,b) => a.sigla.localeCompare(b.sigla,"pt-BR"));
  const resultado = params.get("todos") === "true"
    ? { items, total: items.length, pagina: 1, por_pagina: Math.max(1, items.length) } : paginar(items, params, 8);
  return { ...resultado, municipios: unico(universo.map(ref => ref.municipio)), campi_encontrados };
}

const campos = { natureza: "CD_NATUREZ_MARCA", apresentacao: "CD_APRESEN_MARCA", tipo_ig: "TIPO_IG", servico: "CODSERVICO" };
const faltas = { SEM_TITULO: "sem_titulo", SEM_CLASSE: "sem_classificacao", SEM_EVENTO: "sem_eventos", SEM_ANO: "sem_ano" } as const;
function lacunas(r: Registro) {
  return { sem_titulo: !r.processo.titulo, sem_classificacao: !r.classificacoes.length, sem_eventos: !r.eventos.length, sem_ano: r.processo.ano_entrada === null };
}

function consultarPI(codigo: ModPI, operacao: string | undefined, params: URLSearchParams) {
  const base = modalidades[codigo];
  const registros = processos[codigo];
  const filtro = (campo: string) => params.get(campo) || "";
  const instituicao = filtro("instituicao");
  const refs = (r: Registro) => base.referencias.filter(ref => r.referencias.includes(ref.id) &&
    (!instituicao || ref.id === instituicao) && (!filtro("municipio") || ref.codigo_ibge === filtro("municipio")) &&
    (!filtro("territorio") || ref.territorio === filtro("territorio")));
  const candidatos = registros.filter(r => !instituicao || r.referencias.includes(instituicao));

  if (operacao === "opcoes") {
    const classificacoes = new Map<string, { dimensao: string; codigo: string; versao: string | null; descricao: string | null }>();
    for (const r of candidatos) for (const c of r.classificacoes) {
      const chave = JSON.stringify([c.dimensao, c.codigo_original, c.versao_original]);
      classificacoes.set(chave, { dimensao: c.dimensao, codigo: c.codigo_original, versao: c.versao_original, descricao: c.descricao_original });
    }
    return Response.json({ instituicoes: base.referencias, territorios: unico(base.referencias.flatMap(r => r.territorio ? [r.territorio] : [])),
      classificacoes: [...classificacoes.values()], eventos: unico(candidatos.flatMap(r => r.eventos.flatMap(e => e.codigo_original ? [e.codigo_original] : []))),
      especificos: Object.fromEntries(Object.values(campos).map(campo => [campo, unico(candidatos.flatMap(r => r.processo.campos_modalidade[campo] || []))])) });
  }

  const anoEvento = filtro("ano_evento");
  const eventos = (r: Registro) => r.eventos.filter(e => (!filtro("evento") || e.codigo_original === filtro("evento")) &&
    (!anoEvento || e.data_publicacao?.slice(0, 4) === anoEvento));
  const atos = (r: Registro) => eventos(r).filter(e => e.codigo_original && Object.hasOwn(base.atos.codigos, e.codigo_original.trim()));
  const termo = normal(filtro("q"));
  const falta = faltas[filtro("cobertura") as keyof typeof faltas];
  const pedidos = candidatos.filter(r => {
    const p = r.processo;
    return (!(instituicao || filtro("municipio") || filtro("territorio")) || refs(r).length > 0) &&
      (!termo || normal(`${p.numero_original} ${p.titulo ?? ""}`).includes(termo)) &&
      (!filtro("compartilhados") || p.compartilhado) && (!falta || lacunas(r)[falta]) &&
      (!filtro("ano_de") || p.ano_entrada !== null && p.ano_entrada >= Number(filtro("ano_de"))) &&
      (!filtro("ano_ate") || p.ano_entrada !== null && p.ano_entrada <= Number(filtro("ano_ate"))) &&
      (!filtro("codigo") || r.classificacoes.some(c => c.codigo_original === filtro("codigo") &&
        (!filtro("dimensao") || c.dimensao === filtro("dimensao")) && (!filtro("versao") || c.versao_original === filtro("versao")))) &&
      (!(filtro("evento") || anoEvento) || eventos(r).length > 0) &&
      Object.entries(campos).every(([f, c]) => !filtro(f) || p.campos_modalidade[c] === filtro(f));
  });
  const filtrados = filtro("medida") === "ATOS" ? pedidos.filter(r => atos(r).some(e => e.data_publicacao)) : pedidos;

  if (operacao === "resumo") {
    const anosAtos = pedidos.map(r => unico(atos(r).flatMap(e => e.data_publicacao ? [e.data_publicacao.slice(0, 4)] : [])));
    const estado = base.atos.estado === "ATOS_DOCUMENTADOS" && anoEvento &&
      !base.atos.anos.some(([de, ate]) => de <= Number(anoEvento) && Number(anoEvento) <= ate) ? "SEM_ANO_NA_FONTE" : base.atos.estado;
    const temAtos = estado === "ATOS_DOCUMENTADOS";
    const territorios = unico(filtrados.flatMap(r => refs(r).flatMap(ref => ref.territorio ? [ref.territorio] : [])));
    return Response.json({
      meta: { ...base.meta, limites_modalidade: [aviso, ...(base.meta.limites_modalidade ?? [])], amostra: true },
      total: filtrados.length, pedidos_no_filtro: pedidos.length,
      series: serie(filtrados.map(r => r.processo.ano_entrada)),
      compartilhados_no_filtro: filtrados.filter(r => r.processo.compartilhado).length,
      territorios: territorios.map(nome => ({ nome, total: filtrados.filter(r => refs(r).some(ref => ref.territorio === nome)).length })),
      cobertura: Object.fromEntries(["sem_titulo", "sem_classificacao", "sem_eventos"].map(c => [c, filtrados.filter(r => lacunas(r)[c as keyof ReturnType<typeof lacunas>]).length])),
      atos_observados: { ...base.atos, estado, limite: `${aviso} ${base.atos.limite}`,
        total: temAtos ? anosAtos.filter(a => a.length).length : null,
        processos_com_codigo_sem_data: temAtos ? pedidos.filter(r => atos(r).some(e => !e.data_publicacao)).length : null,
        series: temAtos ? serie(anosAtos.flat().map(Number)) : [] },
    });
  }
  if (operacao === "exportar") {
    const csv = (v: string | number | null) => {
      const texto = String(v ?? "");
      return '"' + (/^\s*[=+@-]/.test(texto) ? "'" + texto : texto).replaceAll('"', '""') + '"';
    };
    const linhas = filtrados.map(({ processo: p }) => [p.numero_original, p.titulo, p.modalidade, p.ano_entrada,
      p.instituicoes_confirmadas.map(i => i.sigla).join(", "), dataAmostra].map(csv).join(","));
    return new Response("\uFEFF" + ["numero_processo,titulo,modalidade,ano_entrada,instituicoes,data_amostra", ...linhas].join("\r\n"),
      { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="amostra-jd-${codigo.toLowerCase()}.csv"` } });
  }
  if (operacao) {
    const registro = filtrados.find(r => r.processo.processo_id === operacao);
    if (!registro) return indisponivel();
    const { eventos, referencias, ...detalhe } = registro;
    return Response.json({ ...detalhe, referencias_na_amostra: referencias.length, despachos: paginar(eventos, params, 10) });
  }
  return Response.json(paginar(filtrados.map(r => r.processo), params));
}

const indisponivel = () => Response.json({ detail: "Consulta indisponível na amostra." }, { status: 404 });

export function consultarAmostra(path: string[], params: URLSearchParams): Response {
  if (path[0] === "instituicoes" && path.length === 1) return Response.json(listarInstituicoes(params));
  if (path[0] === "instituicoes" && path.length === 2) {
    const dadosPerfil = perfil(path[1]);
    return dadosPerfil ? Response.json(dadosPerfil) : indisponivel();
  }
  if (path[0] === "presenca-territorial") return Response.json(dados.presenca);
  if (path[0] === "cobertura") return Response.json({ ...dados.cobertura, ambiente: "AMOSTRA", data: dataAmostra,
    referencias: Object.keys(perfis).length, processos: codigos.reduce((total, c) => total + processos[c].length, 0) });
  const modalidade = (path[0] === "patentes" ? "PTN" : path[0] === "pi-catalogos" ? path[1] : undefined) as ModPI | undefined;
  if (!modalidade || !Object.hasOwn(processos, modalidade)) return indisponivel();
  return consultarPI(modalidade, path[path[0] === "patentes" ? 1 : 2], params);
}
