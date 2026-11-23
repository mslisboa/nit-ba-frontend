const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatDate(value?: string | null): string {
  if (!value) {
    return "Não informado";
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return "Não informado";
  }

  return dateFormatter.format(date);
}

export function formatCount(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercentage(value: number, total: number): string {
  if (total <= 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

export function formatLocationType(value?: string | null): string {
  switch (value) {
    case "SEDE":
      return "Sede";
    case "CAMPUS":
      return "Campus";
    case "UNIDADE":
      return "Unidade";
    default:
      return value ?? "Não informado";
  }
}

export function formatMetodoIdentificacao(value?: string | null): string {
  switch (value) {
    case "VINCULO_PESQUISADOR":
      return "Vínculo de pesquisador";
    case "NOME_INVENTOR":
      return "Nome do inventor";
    default:
      return value ?? "Não informado";
  }
}

export function formatMetodoValidacao(value?: string | null): string {
  switch (value) {
    case "RELATORIO_NIT":
      return "Relatório do NIT";
    case "VALIDACAO_MANUAL":
      return "Validação manual";
    default:
      return value ?? "Não informado";
  }
}
