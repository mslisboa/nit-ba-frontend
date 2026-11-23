import type { PINitAssociation } from "@/types/associacao-nit-pi";
import {
  intellectualPropertyRefs,
} from "./propriedades-intelectuais";
import { nitRefs } from "./refs";

type AssociationSeed = {
  nitId: number;
  propriedadeIntelectualId: number;
  status_validacao: PINitAssociation["status_validacao"];
  metodo_identificacao: PINitAssociation["metodo_identificacao"];
  metodo_validacao: PINitAssociation["metodo_validacao"];
  data_identificacao: string;
  data_validacao: string | null;
  referencia_evidencia: string | null;
  observacao: string | null;
};

const seeds: AssociationSeed[] = [
  {
    nitId: 3,
    propriedadeIntelectualId: 1,
    status_validacao: "CONFIRMADA",
    metodo_identificacao: "VINCULO_PESQUISADOR",
    metodo_validacao: "RELATORIO_NIT",
    data_identificacao: "2026-03-10",
    data_validacao: "2026-05-12",
    referencia_evidencia: "Relatório anual do NIT UESC (2026), item 14",
    observacao: "Inventora vinculada à UESC e à PI.",
  },
  {
    nitId: 1,
    propriedadeIntelectualId: 2,
    status_validacao: "CONFIRMADA",
    metodo_identificacao: "VINCULO_PESQUISADOR",
    metodo_validacao: "VALIDACAO_MANUAL",
    data_identificacao: "2026-02-05",
    data_validacao: "2026-04-18",
    referencia_evidencia: "Validação manual a partir do registro do software",
    observacao: null,
  },
  {
    nitId: 5,
    propriedadeIntelectualId: 3,
    status_validacao: "PENDENTE",
    metodo_identificacao: "VINCULO_PESQUISADOR",
    metodo_validacao: null,
    data_identificacao: "2026-02-20",
    data_validacao: null,
    referencia_evidencia: null,
    observacao: "Identificação automática por vínculo do inventor.",
  },
  {
    nitId: 6,
    propriedadeIntelectualId: 4,
    status_validacao: "INCONCLUSIVA",
    metodo_identificacao: "NOME_INVENTOR",
    metodo_validacao: "VALIDACAO_MANUAL",
    data_identificacao: "2026-01-15",
    data_validacao: "2026-06-01",
    referencia_evidencia:
      "Divergência entre o nome do inventor e o cadastro institucional",
    observacao: "Não foi possível confirmar a participação do NIT.",
  },
  {
    nitId: 9,
    propriedadeIntelectualId: 5,
    status_validacao: "CONFIRMADA",
    metodo_identificacao: "NOME_INVENTOR",
    metodo_validacao: "RELATORIO_NIT",
    data_identificacao: "2026-01-28",
    data_validacao: "2026-03-20",
    referencia_evidencia: "Relatório do NIT CIMATEC (2026), p. 8",
    observacao: null,
  },
  {
    nitId: 1,
    propriedadeIntelectualId: 5,
    status_validacao: "PENDENTE",
    metodo_identificacao: "VINCULO_PESQUISADOR",
    metodo_validacao: null,
    data_identificacao: "2026-02-10",
    data_validacao: null,
    referencia_evidencia: null,
    observacao: "Aguardando validação do NIT UFBA.",
  },
  {
    nitId: 4,
    propriedadeIntelectualId: 6,
    status_validacao: "NAO_CONFIRMADA",
    metodo_identificacao: "NOME_INVENTOR",
    metodo_validacao: "VALIDACAO_MANUAL",
    data_identificacao: "2025-12-02",
    data_validacao: "2026-02-14",
    referencia_evidencia: "Parecer do NIT UESB (2026)",
    observacao: "A PI foi registrada por outra unidade.",
  },
  {
    nitId: 2,
    propriedadeIntelectualId: 7,
    status_validacao: "CONFIRMADA",
    metodo_identificacao: "VINCULO_PESQUISADOR",
    metodo_validacao: "RELATORIO_NIT",
    data_identificacao: "2025-11-18",
    data_validacao: "2026-01-30",
    referencia_evidencia: "Relatório do NIT UEFS (2026), p. 5",
    observacao: null,
  },
];

function nitRef(id: number) {
  const nit = nitRefs.find((item) => item.id === id);

  if (!nit) {
    throw new Error(`NIT não encontrado na fixture: ${id}`);
  }

  return nit;
}

function propertyRef(id: number) {
  const property = intellectualPropertyRefs.find((item) => item.id === id);

  if (!property) {
    throw new Error(`Propriedade intelectual não encontrada na fixture: ${id}`);
  }

  return property;
}

export const associationFixtures: PINitAssociation[] = seeds.map((seed) => ({
  nit: nitRef(seed.nitId),
  propriedade_intelectual: propertyRef(seed.propriedadeIntelectualId),
  status_validacao: seed.status_validacao,
  metodo_identificacao: seed.metodo_identificacao,
  metodo_validacao: seed.metodo_validacao,
  data_identificacao: seed.data_identificacao,
  data_validacao: seed.data_validacao,
  referencia_evidencia: seed.referencia_evidencia,
  observacao: seed.observacao,
}));

export function associationKey(association: PINitAssociation) {
  return `${association.nit.id}-${association.propriedade_intelectual.id}`;
}
