import type { TerritoryReference } from "@/types/common";
import type { Territory } from "@/types/territorio";
import { TERRITORY_NAMES } from "./refs";

export const territoryFixtures: Territory[] = TERRITORY_NAMES.map(
  (nome, index) => ({
    id: index + 1,
    codigo: String(index + 1).padStart(2, "0"),
    nome,
  }),
);

export const territoryById = new Map(
  territoryFixtures.map((territory) => [territory.id, territory]),
);

export const territoryByName = new Map(
  territoryFixtures.map((territory) => [territory.nome, territory]),
);

export function territoryRefByName(nome: string): TerritoryReference {
  const territory = territoryByName.get(nome);

  if (!territory) {
    throw new Error(`Território de Identidade não encontrado na fixture: ${nome}`);
  }

  return { id: territory.id, nome: territory.nome };
}
