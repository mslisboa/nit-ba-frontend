/**
 * Normalização de texto para busca e comparação.
 *
 * A API pode retornar acentos e caixa variados. A normalização é aplicada
 * apenas no frontend para filtros locais; os parâmetros enviados à API
 * continuam sendo os valores originais.
 */
export function normalizeText(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesSearch(
  term: string | null | undefined,
  ...values: Array<string | null | undefined>
): boolean {
  const normalized = normalizeText(term);

  if (!normalized) {
    return true;
  }

  return values.some((value) => normalizeText(value).includes(normalized));
}

export function uniqueBy<T>(items: T[], key: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();

  return items.filter((item) => {
    const itemKey = key(item);

    if (seen.has(itemKey)) {
      return false;
    }

    seen.add(itemKey);
    return true;
  });
}

export function sortByName<T extends { nome: string }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
  );
}
