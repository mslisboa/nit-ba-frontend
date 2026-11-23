import type {
  InstitutionReference,
  MunicipalityReference,
  NITReference,
  ResearcherReference,
  IntellectualPropertyReference,
} from "./common";

export interface Territory {
  id: number;
  codigo?: string | null;
  nome: string;
  municipios?: MunicipalityReference[];
}

export interface TerritoryListItem extends Territory {
  total_instituicoes: number;
  total_nits: number;
  total_pesquisadores: number;
  total_propriedades_intelectuais: number;
}

export interface TerritoryDetail extends TerritoryListItem {
  municipios: MunicipalityReference[];
  instituicoes: InstitutionReference[];
  nits: NITReference[];
  pesquisadores: ResearcherReference[];
  propriedades_intelectuais: IntellectualPropertyReference[];
}
