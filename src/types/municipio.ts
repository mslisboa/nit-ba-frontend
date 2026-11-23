import type { TerritoryReference } from "./common";

export interface Municipality {
  id: number;
  codigo_ibge: string;
  nome: string;
  territorio?: TerritoryReference | null;
}
