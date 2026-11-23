import type {
  MunicipalityReference,
  TerritoryReference,
} from "./common";
import type { StatusValidacao } from "./validacao";

export interface IndicatorCategoryCount {
  label: string;
  count: number;
}

export interface IndicatorStatusCount {
  status: StatusValidacao;
  label: string;
  count: number;
}

export interface IndicatorTerritoryCount {
  territorio: TerritoryReference;
  instituicoes: number;
  nits: number;
  pesquisadores: number;
  propriedades_intelectuais: number;
}

export interface IndicatorMunicipalityCount {
  municipio: MunicipalityReference;
  instituicoes: number;
}

export interface Indicators {
  nits: number;
  instituicoes: number;
  pesquisadores: number;
  propriedades_intelectuais: number;
  propriedades_intelectuais_validadas: number;
  nits_ativos: number;
  nits_em_consolidacao: number;
  associacoes: number;
  por_status_validacao: IndicatorStatusCount[];
  por_modalidade: IndicatorCategoryCount[];
  por_territorio: IndicatorTerritoryCount[];
  por_municipio: IndicatorMunicipalityCount[];
  data_referencia: string | null;
}
