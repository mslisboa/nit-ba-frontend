import type { ReactNode } from "react";

import { getValidationTag } from "../../lib/validation-tags";
import type { StatusValidacao } from "@/types/validacao";

type ValidationTagProps = {
  status: StatusValidacao;
  nit?: { nome: string } | null;
  data_validacao?: string | null;
  referencia_evidencia?: string | null;
  children?: ReactNode;
};

export function ValidationTag({
  status,
  nit,
  data_validacao,
  referencia_evidencia,
  children,
}: ValidationTagProps) {
  const tag = getValidationTag(status);

  const details = [
    nit ? `NIT: ${nit.nome}` : null,
    data_validacao ? `Validado em ${data_validacao}` : null,
    referencia_evidencia ? `Evidência: ${referencia_evidencia}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <span
      className={`status-dot ${tag.tone}`}
      title={details || undefined}
      aria-label={details || tag.label}
    >
      {children ?? tag.label}
    </span>
  );
}
