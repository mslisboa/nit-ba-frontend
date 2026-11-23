import type {
  IntellectualPropertyReference,
  MunicipalityReference,
  NITReference,
  ResearcherReference,
  TerritoryReference,
} from "./common";

export type InstitutionMunicipalityLocationType =
  | "SEDE"
  | "CAMPUS"
  | "UNIDADE"
  | string;

export interface InstitutionMunicipalityReference {
  municipio: MunicipalityReference;
  tipo_localizacao?: InstitutionMunicipalityLocationType | null;
}

export interface Institution {
  id: number;
  nome: string;
  sigla?: string | null;
  natureza?: string | null;
  tipo?: string | null;
  site?: string | null;
  nit?: NITReference | null;
  municipios?: InstitutionMunicipalityReference[];
}

export interface InstitutionListItem extends Institution {
  territorios: TerritoryReference[];
  total_pesquisadores: number;
  total_propriedades_intelectuais: number;
}

export interface InstitutionDetail extends InstitutionListItem {
  pesquisadores: ResearcherReference[];
  propriedades_intelectuais: IntellectualPropertyReference[];
}
