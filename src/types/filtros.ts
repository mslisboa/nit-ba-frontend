import type { MetodoIdentificacao, MetodoValidacao, StatusValidacao } from "./validacao";

export interface NITFilters {
  search?: string;
  instituicao_id?: number;
  territorio_id?: number;
  situacao?: string;
  status_validacao?: StatusValidacao;
  page?: number;
  page_size?: number;
}

export interface InstitutionFilters {
  search?: string;
  nit_id?: number;
  municipio_id?: number;
  territorio_id?: number;
  natureza?: string;
  tipo?: string;
  page?: number;
  page_size?: number;
}

export interface ResearcherFilters {
  search?: string;
  instituicao_id?: number;
  page?: number;
  page_size?: number;
}

export interface IntellectualPropertyFilters {
  search?: string;
  tipo_pi?: string;
  instituicao_id?: number;
  pesquisador_id?: number;
  nit_id?: number;
  status_validacao?: StatusValidacao;
  situacao?: string;
  ano_deposito?: number;
  page?: number;
  page_size?: number;
}

export interface NITPIAssociationFilters {
  nit_id?: number;
  propriedade_intelectual_id?: number;
  status_validacao?: StatusValidacao;
  metodo_identificacao?: MetodoIdentificacao;
  metodo_validacao?: MetodoValidacao;
  page?: number;
  page_size?: number;
}

export interface TerritoryFilters {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface MunicipalityFilters {
  search?: string;
  territorio_id?: number;
  page?: number;
  page_size?: number;
}
