import { Catalogo } from "@/components/observatorio";
export default async function Page({ searchParams }: {
  searchParams: Promise<{ q?: string | string[]; tipo?: string | string[] }>;
}) {
  const { q, tipo } = await searchParams;
  const consulta = typeof q === "string" ? q.trim().slice(0, 160) : "";
  const referencia = tipo === "UNIDADE" ? "UNIDADE" : "INSTITUIÇÃO";
  return <Catalogo key={JSON.stringify([consulta, referencia])} buscaInicial={consulta} tipoInicial={referencia} />;
}
