import type { Instituicao, Total } from "./types";

export const modalidades = [["PTN", "Patentes"], ["PRG", "Programas de computador"], ["MRC", "Marcas"], ["DI", "Desenho industrial"]] as const;
export type ModalidadeIndicador = (typeof modalidades)[number][0];
export const numero = (n: number) => n.toLocaleString("pt-BR");
export const plural = (n: number, singular: string, varios: string) => n === 1 ? singular : varios;

export function papelLocalizacao(papel: string) {
  return ({ "REITORIA": "Reitoria", "ADMINISTRAÇÃO CENTRAL": "Administração central",
    "SEDE ADMINISTRATIVA / REITORIA": "Sede administrativa / reitoria", "SEDE INSTITUCIONAL": "Sede institucional",
    "CAMPUS / ENDEREÇO INSTITUCIONAL": "Campus / endereço institucional", "CAMPUS SEDE / REITORIA": "Campus sede / reitoria",
    "CAMPUS": "Campus" } as Record<string, string>)[papel] ?? papel;
}

export function nomeEstrutura(item: Pick<Instituicao, "estrutura" | "estado_estrutura">) {
  return !item.estrutura || item.estrutura.startsWith("PENDENTE") ? "Estrutura local de inovação não confirmada" : item.estrutura;
}

export function estadoInstitucional(estado: string) {
  return ({ "ESTRUTURA DOCUMENTADA NO PERÍODO DA FONTE": "Estrutura documentada para o período da fonte",
    "COMPETÊNCIA LOCAL ATUAL PENDENTE": "Competência local pendente de confirmação",
    "ATUAÇÃO/ATIVIDADE RELATADA NO PERÍODO DA FONTE": "Atuação ou atividade relatada no período da fonte",
    "PENDENTE CONTRATO/EXECUÇÃO COMPROBATÓRIA": "Execução de transferência pendente de comprovação",
    "NÃO DEMONSTRADO PARA PROCESSOS ESPECÍFICOS": "Não demonstrado para processos específicos" } as Record<string, string>)[estado] ?? estado;
}

export function estadoMedida(total: Total | undefined) {
  if (!total) return "Medida não disponível nesta consulta";
  if (total.processos !== null) return "Quantidade observada neste escopo";
  if (total.estado.includes("SEM_OCORRENCIA") || total.estado.includes("SEM OCORRÊNCIA")) {
    return "Sem ocorrência neste escopo; não permite concluir produção zero";
  }
  return "Informação não consolidada para esta medida";
}

export function legendaMedida(total: Total | undefined) {
  if (!total) return "medida não disponível";
  if (total.processos !== null) return `${plural(total.processos, "pedido", "pedidos")} no recorte BA`;
  return estadoMedida(total).startsWith("Sem ocorrência") ? "sem ocorrência no recorte" : "informação não consolidada";
}

export function nomeModalidade(codigo: string) {
  return modalidades.find(([mod]) => mod === codigo)?.[1] ??
    ({ IG: "Indicações geográficas", TCI: "Topografias de circuitos integrados", CTT: "Processos contratuais CTT" } as Record<string, string>)[codigo] ?? codigo;
}

export function papelParticipacao(papel: string) {
  return ({ depositante: "Depositante", cedente: "Cedente", cessionario: "Cessionário" } as Record<string, string>)[papel] ?? papel;
}

export function dimensaoClassificacao(dimensao: string) {
  return ({ IPC: "IPC", CAMPO_TEC: "Campo tecnológico", TIPO_PROGRAMA: "Tipo de programa",
    NICE: "Nice", LOCARNO: "Locarno" } as Record<string, string>)[dimensao] ?? dimensao;
}

export function estadoCategoria(estado: string, classe: string) {
  if (classe) return `Situação da classe: código ${classe} da fonte`;
  return ({ CATEGORIA_OBSERVADA: "Categoria informada", SEM_CATEGORIA_PREENCHIDA: "Categoria não preenchida na fonte" } as Record<string, string>)[estado] ?? estado;
}

export function naturezaEvidencia(natureza: string) {
  return ({ "ATUAÇÃO AUTODECLARADA": "Atuação autodeclarada", "COTITULARIDADE RELATADA": "Cotitularidade relatada",
    "RENDIMENTO AUTODECLARADO": "Rendimento autodeclarado", "ATUAÇÃO RELATADA": "Atuação relatada", "NORMA": "Norma",
    "ATIVIDADE REALIZADA RELATADA": "Atividade realizada, conforme relato", "ATIVIDADE PREVISTA": "Atividade prevista",
    "EVENTO ANUNCIADO": "Evento anunciado", "PORTFÓLIO / OFERTA": "Portfólio / oferta", "AGENDA / ATIVIDADE PREVISTA": "Agenda / atividade prevista",
    "INAUGURAÇÃO RELATADA": "Inauguração relatada", "EVENTO DIVULGADO": "Evento divulgado", "PROCEDIMENTO": "Procedimento" } as Record<string, string>)[natureza] ?? natureza;
}
