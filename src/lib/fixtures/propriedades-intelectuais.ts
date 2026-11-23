import type {
  IntellectualPropertyReference,
  ResearcherReference,
} from "@/types/common";
import type {
  IntellectualProperty,
  PIResearcherReference,
} from "@/types/propriedade-intelectual";
import { institutionRef } from "./instituicoes";
import { researcherRefs } from "./refs";

type InstitutionLinkSeed = {
  instituicaoId: number;
  papel: string;
};

type ResearcherLinkSeed = {
  pesquisadorId?: number;
  nome_inventor?: string;
  papel: string;
  ordem: number;
};

type IntellectualPropertySeed = {
  id: number;
  identificador_badepi: string;
  titulo: string;
  tipo_pi: string;
  numero_processo: string;
  data_deposito: string;
  data_publicacao: string | null;
  situacao: string;
  data_atualizacao_fonte: string;
  instituicoes: InstitutionLinkSeed[];
  pesquisadores: ResearcherLinkSeed[];
};

const seeds: IntellectualPropertySeed[] = [
  {
    id: 1,
    identificador_badepi: "BADEPI-2026-0001",
    titulo: "Biossensor portátil para análise rápida",
    tipo_pi: "Patente",
    numero_processo: "BR 10 2026 001234 5",
    data_deposito: "2026-02-18",
    data_publicacao: null,
    situacao: "Em exame",
    data_atualizacao_fonte: "2026-11-06",
    instituicoes: [{ instituicaoId: 3, papel: "Titular" }],
    pesquisadores: [{ pesquisadorId: 1, papel: "Inventora", ordem: 1 }],
  },
  {
    id: 2,
    identificador_badepi: "BADEPI-2026-0002",
    titulo: "Plataforma de gestão de ativos de PI",
    tipo_pi: "Programa de computador",
    numero_processo: "BR 51 2026 000987 0",
    data_deposito: "2026-01-22",
    data_publicacao: "2026-03-10",
    situacao: "Registrado",
    data_atualizacao_fonte: "2026-11-06",
    instituicoes: [{ instituicaoId: 1, papel: "Titular" }],
    pesquisadores: [{ pesquisadorId: 2, papel: "Inventor", ordem: 1 }],
  },
  {
    id: 3,
    identificador_badepi: "BADEPI-2025-0014",
    titulo: "Bioinsumo para agricultura sustentável",
    tipo_pi: "Patente",
    numero_processo: "BR 10 2025 014567 8",
    data_deposito: "2025-08-14",
    data_publicacao: null,
    situacao: "Depositado",
    data_atualizacao_fonte: "2026-10-28",
    instituicoes: [
      { instituicaoId: 5, papel: "Titular" },
      { instituicaoId: 3, papel: "Cotitular" },
    ],
    pesquisadores: [{ pesquisadorId: 6, papel: "Inventor", ordem: 1 }],
  },
  {
    id: 4,
    identificador_badepi: "BADEPI-2025-0021",
    titulo: "Programa Conecta NIT",
    tipo_pi: "Marca",
    numero_processo: "BR 84 2025 002145 3",
    data_deposito: "2025-06-03",
    data_publicacao: "2025-09-16",
    situacao: "Registrada",
    data_atualizacao_fonte: "2026-09-30",
    instituicoes: [{ instituicaoId: 6, papel: "Titular" }],
    pesquisadores: [{ pesquisadorId: 3, papel: "Inventora", ordem: 1 }],
  },
  {
    id: 5,
    identificador_badepi: "BADEPI-2025-0028",
    titulo: "Sistema inteligente de eficiência energética",
    tipo_pi: "Programa de computador",
    numero_processo: "BR 51 2025 004321 9",
    data_deposito: "2025-09-30",
    data_publicacao: "2026-01-12",
    situacao: "Registrado",
    data_atualizacao_fonte: "2026-10-15",
    instituicoes: [
      { instituicaoId: 9, papel: "Titular" },
      { instituicaoId: 1, papel: "Cotitular" },
    ],
    pesquisadores: [
      { pesquisadorId: 4, papel: "Inventor", ordem: 1 },
      { pesquisadorId: 7, papel: "Inventora", ordem: 2 },
    ],
  },
  {
    id: 6,
    identificador_badepi: "BADEPI-2024-0033",
    titulo: "Material compósito de fonte renovável",
    tipo_pi: "Patente",
    numero_processo: "BR 10 2024 033210 7",
    data_deposito: "2024-11-11",
    data_publicacao: null,
    situacao: "Em exame",
    data_atualizacao_fonte: "2026-08-22",
    instituicoes: [
      { instituicaoId: 4, papel: "Titular" },
      { instituicaoId: 1, papel: "Cotitular" },
    ],
    pesquisadores: [
      { pesquisadorId: 8, papel: "Inventor", ordem: 1 },
      { pesquisadorId: 2, papel: "Inventor", ordem: 2 },
    ],
  },
  {
    id: 7,
    identificador_badepi: "BADEPI-2024-0041",
    titulo: "Dispositivo assistivo de baixo custo",
    tipo_pi: "Desenho industrial",
    numero_processo: "BR 30 2024 001122 4",
    data_deposito: "2024-04-09",
    data_publicacao: "2024-10-01",
    situacao: "Concedido",
    data_atualizacao_fonte: "2026-07-18",
    instituicoes: [{ instituicaoId: 2, papel: "Titular" }],
    pesquisadores: [{ pesquisadorId: 5, papel: "Inventora", ordem: 1 }],
  },
  {
    id: 8,
    identificador_badepi: "BADEPI-2024-0052",
    titulo: "Variedade demonstrativa de feijão-caupi",
    tipo_pi: "Cultivar",
    numero_processo: "BR 10 2024 052341 1",
    data_deposito: "2024-07-25",
    data_publicacao: null,
    situacao: "Em avaliação",
    data_atualizacao_fonte: "2026-06-05",
    instituicoes: [{ instituicaoId: 7, papel: "Titular" }],
    pesquisadores: [
      { pesquisadorId: 9, papel: "Inventora", ordem: 1 },
      {
        nome_inventor: "Inventor externo demonstrativo",
        papel: "Inventor",
        ordem: 2,
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

function buildResearchers(
  researchers: ResearcherLinkSeed[],
): PIResearcherReference[] {
  return researchers.map((link) => {
    if (link.pesquisadorId) {
      const researcher = researcherRef(link.pesquisadorId);
      return {
        pesquisador: researcher,
        nome_inventor: researcher.nome,
        papel: link.papel,
        ordem: link.ordem,
      };
    }

    return {
      pesquisador: null,
      nome_inventor: link.nome_inventor ?? "Inventor não identificado",
      papel: link.papel,
      ordem: link.ordem,
    };
  });
}

export const intellectualPropertyFixtures: IntellectualProperty[] = seeds.map(
  (seed) => ({
    id: seed.id,
    identificador_badepi: seed.identificador_badepi,
    titulo: seed.titulo,
    tipo_pi: seed.tipo_pi,
    numero_processo: seed.numero_processo,
    data_deposito: seed.data_deposito,
    data_publicacao: seed.data_publicacao,
    situacao: seed.situacao,
    data_atualizacao_fonte: seed.data_atualizacao_fonte,
    instituicoes: seed.instituicoes.map((link) => ({
      instituicao: institutionRef(link.instituicaoId),
      papel: link.papel,
    })),
    pesquisadores: buildResearchers(seed.pesquisadores),
  }),
);

export const intellectualPropertyById = new Map(
  intellectualPropertyFixtures.map((property) => [property.id, property]),
);

export const intellectualPropertyRefs: IntellectualPropertyReference[] =
  intellectualPropertyFixtures.map((property) => ({
    id: property.id,
    titulo: property.titulo,
    tipo_pi: property.tipo_pi,
    numero_processo: property.numero_processo,
  }));
