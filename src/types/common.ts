/**
 * Estruturas comuns, referências e envelopes de resposta.
 *
 * As referências ficam centralizadas neste arquivo para evitar dependências
 * circulares entre os tipos das entidades.
 */

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  data: T;
}

export interface DataProvenance {
  identificador_badepi?: string | null;
  data_atualizacao_fonte?: string | null;
  referencia_evidencia?: string | null;
}

export interface InstitutionReference {
  id: number;
  nome: string;
  sigla?: string | null;
}

export interface NITReference {
  id: number;
  nome: string;
  sigla?: string | null;
}

export interface MunicipalityReference {
  id: number;
  codigo_ibge?: string;
  nome: string;
}

export interface TerritoryReference {
  id: number;
  nome: string;
}

export interface ResearcherReference {
  id: number;
  nome: string;
}

export interface IntellectualPropertyReference {
  id: number;
  titulo?: string | null;
  tipo_pi: string;
  numero_processo?: string | null;
}
