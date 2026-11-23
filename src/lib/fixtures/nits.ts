import type { InstitutionReference, NITReference } from "@/types/common";
import type { NIT } from "@/types/nit";
import { institutionRef } from "./instituicoes";
import { nitRefs } from "./refs";

type NITSeed = {
  id: number;
  site: string | null;
  situacao: "Ativo" | "Em consolidação";
};

const seeds: NITSeed[] = [
  { id: 1, site: "https://nit.ufba.br/", situacao: "Ativo" },
  { id: 2, site: "https://inova.uefs.br/", situacao: "Ativo" },
  { id: 3, site: "https://www.uesc.br/nucleos/nit/", situacao: "Ativo" },
  { id: 4, site: "http://www2.uesb.br/nit/", situacao: "Ativo" },
  {
    id: 5,
    site: "https://ufrb.edu.br/ppgci/coordenacao-de-criacao-e-inovacao-cinova",
    situacao: "Ativo",
  },
  { id: 6, site: "https://inovacao.uneb.br/", situacao: "Ativo" },
  {
    id: 7,
    site: "https://ufob.edu.br/a-ufob/inovacao/propriedade-intelectual-e-transferencia-de-tecnologia",
    situacao: "Em consolidação",
  },
  { id: 8, site: "https://ufsb.edu.br/", situacao: "Em consolidação" },
  {
    id: 9,
    site: "https://www.senaicimatec.com.br/pesquisa-e-inovacao/",
    situacao: "Ativo",
  },
  {
    id: 10,
    site: "https://www.bahiana.edu.br/inovacao-parcerias/",
    situacao: "Ativo",
  },
  { id: 11, site: null, situacao: "Ativo" },
  { id: 12, site: null, situacao: "Ativo" },
];

function nitRef(id: number): NITReference {
  const nit = nitRefs.find((item) => item.id === id);

  if (!nit) {
    throw new Error(`NIT não encontrado na fixture: ${id}`);
  }

  return nit;
}

export const nitFixtures: NIT[] = seeds.map((seed) => {
  const reference = nitRef(seed.id);
  const institution: InstitutionReference = institutionRef(seed.id);

  return {
    ...reference,
    site: seed.site,
    email: null,
    situacao: seed.situacao,
    instituicao: institution,
  };
});

export const nitById = new Map(nitFixtures.map((nit) => [nit.id, nit]));
