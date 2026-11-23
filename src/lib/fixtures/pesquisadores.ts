import type { ResearcherReference } from "@/types/common";
import type { Researcher } from "@/types/pesquisador";
import { institutionRef } from "./instituicoes";
import { researcherRefs } from "./refs";

type InstitutionLinkSeed = {
  instituicaoId: number;
  tipo_vinculo: string;
  data_inicio: string;
  data_fim?: string | null;
};

type ResearcherSeed = {
  id: number;
  id_simcc: string | null;
  id_lattes: string | null;
  orcid: string | null;
  instituicoes: InstitutionLinkSeed[];
};

const seeds: ResearcherSeed[] = [
  {
    id: 1,
    id_simcc: "0000000000000001",
    id_lattes: "DEMO-0001",
    orcid: "0000-0000-0000-0001",
    instituicoes: [
      {
        instituicaoId: 3,
        tipo_vinculo: "Servidor(a) permanente",
        data_inicio: "2018-03-01",
      },
      {
        instituicaoId: 2,
        tipo_vinculo: "Colaborador(a)",
        data_inicio: "2022-08-01",
      },
    ],
  },
  {
    id: 2,
    id_simcc: "0000000000000002",
    id_lattes: "DEMO-0002",
    orcid: null,
    instituicoes: [
      {
        instituicaoId: 1,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2014-02-01",
      },
    ],
  },
  {
    id: 3,
    id_simcc: null,
    id_lattes: "DEMO-0003",
    orcid: "0000-0000-0000-0003",
    instituicoes: [
      {
        instituicaoId: 6,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2016-04-01",
      },
      {
        instituicaoId: 5,
        tipo_vinculo: "Colaborador(a)",
        data_inicio: "2021-09-01",
      },
    ],
  },
  {
    id: 4,
    id_simcc: "0000000000000004",
    id_lattes: null,
    orcid: null,
    instituicoes: [
      {
        instituicaoId: 9,
        tipo_vinculo: "Pesquisador(a)",
        data_inicio: "2019-01-15",
      },
      {
        instituicaoId: 1,
        tipo_vinculo: "Colaborador(a)",
        data_inicio: "2023-02-01",
      },
    ],
  },
  {
    id: 5,
    id_simcc: "0000000000000005",
    id_lattes: "DEMO-0005",
    orcid: null,
    instituicoes: [
      {
        instituicaoId: 2,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2017-07-01",
      },
    ],
  },
  {
    id: 6,
    id_simcc: null,
    id_lattes: "DEMO-0006",
    orcid: "0000-0000-0000-0006",
    instituicoes: [
      {
        instituicaoId: 5,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2015-03-01",
      },
      {
        instituicaoId: 3,
        tipo_vinculo: "Colaborador(a)",
        data_inicio: "2020-05-01",
      },
    ],
  },
  {
    id: 7,
    id_simcc: "0000000000000007",
    id_lattes: "DEMO-0007",
    orcid: null,
    instituicoes: [
      {
        instituicaoId: 1,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2013-09-01",
      },
      {
        instituicaoId: 11,
        tipo_vinculo: "Colaborador(a)",
        data_inicio: "2022-03-01",
      },
    ],
  },
  {
    id: 8,
    id_simcc: "0000000000000008",
    id_lattes: null,
    orcid: "0000-0000-0000-0008",
    instituicoes: [
      {
        instituicaoId: 4,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2016-10-01",
      },
    ],
  },
  {
    id: 9,
    id_simcc: null,
    id_lattes: "DEMO-0009",
    orcid: null,
    instituicoes: [
      {
        instituicaoId: 7,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2018-06-01",
      },
    ],
  },
  {
    id: 10,
    id_simcc: "0000000000000010",
    id_lattes: "DEMO-0010",
    orcid: null,
    instituicoes: [
      {
        instituicaoId: 8,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2019-02-01",
      },
    ],
  },
  {
    id: 11,
    id_simcc: "0000000000000011",
    id_lattes: null,
    orcid: "0000-0000-0000-0011",
    instituicoes: [
      {
        instituicaoId: 12,
        tipo_vinculo: "Pesquisador(a)",
        data_inicio: "2015-11-01",
      },
      {
        instituicaoId: 1,
        tipo_vinculo: "Colaborador(a)",
        data_inicio: "2020-08-01",
      },
    ],
  },
  {
    id: 12,
    id_simcc: null,
    id_lattes: "DEMO-0012",
    orcid: null,
    instituicoes: [
      {
        instituicaoId: 10,
        tipo_vinculo: "Docente permanente",
        data_inicio: "2017-02-01",
      },
      {
        instituicaoId: 6,
        tipo_vinculo: "Colaborador(a)",
        data_inicio: "2021-04-01",
      },
    ],
  },
];

function researcherRef(id: number): ResearcherReference {
  const researcher = researcherRefs.find((item) => item.id === id);

  if (!researcher) {
    throw new Error(`Pesquisador não encontrado na fixture: ${id}`);
  }

  return researcher;
}

export const researcherFixtures: Researcher[] = seeds.map((seed) => ({
  ...researcherRef(seed.id),
  id_simcc: seed.id_simcc,
  id_lattes: seed.id_lattes,
  orcid: seed.orcid,
  instituicoes: seed.instituicoes.map((link) => ({
    instituicao: institutionRef(link.instituicaoId),
    tipo_vinculo: link.tipo_vinculo,
    data_inicio: link.data_inicio,
    data_fim: link.data_fim ?? null,
  })),
}));

export const researcherById = new Map(
  researcherFixtures.map((researcher) => [researcher.id, researcher]),
);
