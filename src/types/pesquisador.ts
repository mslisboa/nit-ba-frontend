import type {
  InstitutionReference,
  IntellectualPropertyReference,
} from "./common";

export interface ResearcherInstitutionReference {
  instituicao: InstitutionReference;
  tipo_vinculo?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
}

export interface Researcher {
  id: number;
  nome: string;
  id_simcc?: string | null;
  id_lattes?: string | null;
  orcid?: string | null;
  instituicoes?: ResearcherInstitutionReference[];
}

export interface ResearcherListItem extends Researcher {
  instituicoes: ResearcherInstitutionReference[];
  total_propriedades_intelectuais: number;
}

export interface ResearcherDetail extends ResearcherListItem {
  propriedades_intelectuais: IntellectualPropertyReference[];
}
