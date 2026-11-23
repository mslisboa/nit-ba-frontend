import type {
  InstitutionReference,
  ResearcherReference,
} from "./common";
import type { PINitAssociation } from "./associacao-nit-pi";

export type TipoPI =
  | "Patente"
  | "Programa de computador"
  | "Marca"
  | "Desenho industrial"
  | "Indicação geográfica"
  | "Cultivar"
  | string;

export interface PIInstitutionReference {
  instituicao: InstitutionReference;
  papel: string;
}

export interface PIResearcherReference {
  pesquisador?: ResearcherReference | null;
  nome_inventor: string;
  papel?: string | null;
  ordem?: number | null;
}

export interface IntellectualProperty {
  id: number;
  identificador_badepi?: string | null;
  titulo?: string | null;
  tipo_pi: TipoPI;
  numero_processo?: string | null;
  data_deposito?: string | null;
  data_publicacao?: string | null;
  situacao?: string | null;
  data_atualizacao_fonte?: string | null;
  instituicoes?: PIInstitutionReference[];
  pesquisadores?: PIResearcherReference[];
}

export interface IntellectualPropertyListItem extends IntellectualProperty {
  instituicoes: PIInstitutionReference[];
  pesquisadores: PIResearcherReference[];
  nits: PINitAssociation[];
}
