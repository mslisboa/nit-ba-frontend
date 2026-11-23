import type {
  InstitutionReference,
  NITReference,
  ResearcherReference,
} from "@/types/common";

/**
 * Dados demonstrativos compartilhados entre fixtures.
 *
 * Manter as referências em um único módulo evita dependências circulares
 * entre NITs, instituições, pesquisadores e propriedades intelectuais.
 */

export const TERRITORY_NAMES = [
  "Irecê",
  "Velho Chico",
  "Chapada Diamantina",
  "Sisal",
  "Litoral Sul",
  "Baixo Sul",
  "Extremo Sul",
  "Médio Sudoeste da Bahia",
  "Vale do Jiquiriçá",
  "Sertão do São Francisco",
  "Bacia do Rio Grande",
  "Bacia do Paramirim",
  "Sertão Produtivo",
  "Piemonte do Paraguaçu",
  "Bacia do Jacuípe",
  "Piemonte da Diamantina",
  "Semiárido Nordeste II",
  "Litoral Norte e Agreste Baiano",
  "Portal do Sertão",
  "Sudoeste Baiano",
  "Recôncavo",
  "Médio Rio de Contas",
  "Bacia do Rio Corrente",
  "Itaparica",
  "Piemonte Norte do Itapicuru",
  "Metropolitano de Salvador",
  "Costa do Descobrimento",
] as const;

export const institutionRefs: InstitutionReference[] = [
  {
    id: 1,
    nome: "Universidade Federal da Bahia",
    sigla: "UFBA",
  },
  {
    id: 2,
    nome: "Universidade Estadual de Feira de Santana",
    sigla: "UEFS",
  },
  {
    id: 3,
    nome: "Universidade Estadual de Santa Cruz",
    sigla: "UESC",
  },
  {
    id: 4,
    nome: "Universidade Estadual do Sudoeste da Bahia",
    sigla: "UESB",
  },
  {
    id: 5,
    nome: "Universidade Federal do Recôncavo da Bahia",
    sigla: "UFRB",
  },
  {
    id: 6,
    nome: "Universidade do Estado da Bahia",
    sigla: "UNEB",
  },
  {
    id: 7,
    nome: "Universidade Federal do Oeste da Bahia",
    sigla: "UFOB",
  },
  {
    id: 8,
    nome: "Universidade Federal do Sul da Bahia",
    sigla: "UFSB",
  },
  {
    id: 9,
    nome: "Centro Universitário SENAI CIMATEC",
    sigla: "CIMATEC",
  },
  {
    id: 10,
    nome: "Escola Bahiana de Medicina e Saúde Pública",
    sigla: "BAHIANA",
  },
  {
    id: 11,
    nome: "Instituto Federal de Educação, Ciência e Tecnologia da Bahia",
    sigla: "IFBA",
  },
  {
    id: 12,
    nome: "Instituto Gonçalo Moniz — Fiocruz Bahia",
    sigla: "FIOCRUZ",
  },
];

export const nitRefs: NITReference[] = [
  {
    id: 1,
    nome: "Coordenação de Inovação — NIT UFBA",
    sigla: "NIT UFBA",
  },
  {
    id: 2,
    nome: "InovaUEFS",
    sigla: "InovaUEFS",
  },
  {
    id: 3,
    nome: "Núcleo de Inovação Tecnológica da UESC",
    sigla: "NIT UESC",
  },
  {
    id: 4,
    nome: "Núcleo de Inovação Tecnológica da UESB",
    sigla: "NIT UESB",
  },
  {
    id: 5,
    nome: "Coordenação de Criação e Inovação — CINOVA",
    sigla: "CINOVA",
  },
  {
    id: 6,
    nome: "Agência UNEB de Inovação",
    sigla: "Agência UNEB",
  },
  {
    id: 7,
    nome: "Propriedade Intelectual e Transferência de Tecnologia — PITT",
    sigla: "PITT",
  },
  {
    id: 8,
    nome: "Núcleo de Inovação Tecnológica da UFSB",
    sigla: "NIT UFSB",
  },
  {
    id: 9,
    nome: "Ecossistema de Pesquisa e Inovação SENAI CIMATEC",
    sigla: "CIMATEC",
  },
  {
    id: 10,
    nome: "Núcleo de Inovação da Bahiana",
    sigla: "NIT Bahiana",
  },
  {
    id: 11,
    nome: "Núcleo de Inovação Tecnológica do IFBA",
    sigla: "NIT IFBA",
  },
  {
    id: 12,
    nome: "Gestão de inovação e transferência de tecnologia",
    sigla: "Fiocruz Inovação",
  },
];

export const researcherRefs: ResearcherReference[] = [
  { id: 1, nome: "Pesquisadora demonstrativa 01" },
  { id: 2, nome: "Pesquisador demonstrativo 02" },
  { id: 3, nome: "Pesquisadora demonstrativa 03" },
  { id: 4, nome: "Pesquisador demonstrativo 04" },
  { id: 5, nome: "Pesquisadora demonstrativa 05" },
  { id: 6, nome: "Pesquisador demonstrativo 06" },
  { id: 7, nome: "Pesquisadora demonstrativa 07" },
  { id: 8, nome: "Pesquisador demonstrativo 08" },
  { id: 9, nome: "Pesquisadora demonstrativa 09" },
  { id: 10, nome: "Pesquisador demonstrativo 10" },
  { id: 11, nome: "Pesquisadora demonstrativa 11" },
  { id: 12, nome: "Pesquisador demonstrativo 12" },
];
