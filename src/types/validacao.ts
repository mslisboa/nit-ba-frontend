import type { NITReference } from "./common";

export type StatusValidacao =
  | "PENDENTE"
  | "CONFIRMADA"
  | "NAO_CONFIRMADA"
  | "INCONCLUSIVA";

export type MetodoIdentificacao = "VINCULO_PESQUISADOR" | "NOME_INVENTOR";

export type MetodoValidacao = "RELATORIO_NIT" | "VALIDACAO_MANUAL";

export type ValidationTone = "neutral" | "success" | "danger" | "warning";

export interface ValidationTag {
  status: StatusValidacao;
  label: string;
  tone: ValidationTone;
  nit?: NITReference | null;
  data_validacao?: string | null;
  referencia_evidencia?: string | null;
}
