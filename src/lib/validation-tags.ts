import type { PINitAssociation } from "@/types/associacao-nit-pi";
import type {
  StatusValidacao,
  ValidationTag,
  ValidationTone,
} from "@/types/validacao";

export const VALIDATION_STATUS_ORDER: StatusValidacao[] = [
  "CONFIRMADA",
  "PENDENTE",
  "INCONCLUSIVA",
  "NAO_CONFIRMADA",
];

export const VALIDATION_TAG_CONFIG: Record<
  StatusValidacao,
  { label: string; tone: ValidationTone; description: string }
> = {
  CONFIRMADA: {
    label: "Confirmada",
    tone: "success",
    description: "Associação validada pelo NIT com evidência registrada.",
  },
  PENDENTE: {
    label: "Pendente",
    tone: "neutral",
    description: "Associação identificada, aguardando validação do NIT.",
  },
  INCONCLUSIVA: {
    label: "Inconclusiva",
    tone: "warning",
    description: "As evidências disponíveis não permitem confirmar a associação.",
  },
  NAO_CONFIRMADA: {
    label: "Não confirmada",
    tone: "danger",
    description: "A validação indicou que a associação não se aplica.",
  },
};

/**
 * Monta a etiqueta de validação a partir do status retornado pela API.
 *
 * Não há conversão de ausência de associação em status. Se não existir
 * associação, o componente não deve chamar esta função.
 */
export function getValidationTag(
  status: StatusValidacao,
  association?: PINitAssociation | null,
): ValidationTag {
  const config = VALIDATION_TAG_CONFIG[status];

  return {
    status,
    label: config.label,
    tone: config.tone,
    nit: association?.nit ?? null,
    data_validacao: association?.data_validacao ?? null,
    referencia_evidencia: association?.referencia_evidencia ?? null,
  };
}
