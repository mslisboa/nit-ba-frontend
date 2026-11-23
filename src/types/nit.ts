import type {
  InstitutionReference,
  MunicipalityReference,
  TerritoryReference,
} from "./common";
import type { PINitAssociation } from "./associacao-nit-pi";
import type { StatusValidacao } from "./validacao";

export interface NIT {
  id: number;
  nome: string;
  sigla?: string | null;
  site?: string | null;
  email?: string | null;
  situacao?: string | null;
  instituicao: InstitutionReference;
}

export interface NITListItem extends NIT {
  municipios: MunicipalityReference[];
  territorios: TerritoryReference[];
  total_pesquisadores: number;
  total_propriedades_intelectuais: number;
  status_validacao: StatusValidacao[];
}

export interface NITDetail extends NITListItem {
  propriedades_intelectuais: PINitAssociation[];
}
